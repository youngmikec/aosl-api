import aqp from "api-query-params";
import dotenv from "dotenv";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import Users, {
  validateCreate,
  validateAdminUpdate,
  validateUserUpdate,
  validateLogin,
  validateVerifyEmail,
  validateForgortPassword,
  validateVerifyResetCode,
} from "./model.js";
// import Otp from "../otp/model";
import {
  generateCode,
  hash,
  safeGet,
  setLimit,
  generateOtp,
} from "../../util/helpers.js";
import { JWT, USER_TYPE } from "../../constant/index.js";
import { nodeMailerService } from "../../services/node-mailer-service.js";
import { uploadImage } from "../../services/upload.js";
import { resetPasswordEmail, verificationEmail } from '../../constant/email-templates.js'

dotenv.config();
const module = "Users";
//@ts-check
export const fetchService = async (query) => {
  try {
    let { filter, skip, population, sort, projection } = aqp(query);
    const searchString = filter.q ? filter.q : false;
    if (searchString) {
      const escaped = searchString.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
      filter.$or = [
        { email: { $regex: new RegExp(searchString, "i") } },
        { phone: { $regex: new RegExp(searchString, "i") } },
        { surname: { $regex: new RegExp(searchString, "i") } },
        { $text: { $search: escaped, $caseSensitive: false } },
      ];
      delete filter.q;
    }
    let { limit } = aqp(query);
    limit = setLimit(limit);
    if (!filter.deleted) filter.deleted = 0;

    const total = await Users.countDocuments(filter).exec();

    const result = await Users.find(filter)
      .populate(population)
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .select(projection)
      .exec();

    if (!result) {
      throw new Error(`${module} record not found`);
    }
    const count = result.length;
    const msg = `${count} ${module} record(s) retrieved successfully!`;
    return { payload: result, total, count, msg, skip, limit, sort };
  } catch (error) {
    throw new Error(`Error retrieving ${module} record ${error.message}`);
  }
};

export const loginService = async (loginPayload) => {
  try {
    const { error } = validateLogin.validate(loginPayload);
    if (error)
      throw new Error(`Invalid ${module} login data. ${error.message}`);
    const { email, password, userType } = loginPayload;
    //   const filter = { deleted: 0 };
    const filter = {};
    let usersType = "";
    if (userType === USER_TYPE.ADMIN) {
      // filter.userType = USER_TYPE.ADMIN;
      usersType = USER_TYPE.ADMIN;
      filter.email = email;
      // filter.password = password;
    }

    if (userType === USER_TYPE.USER) {
      usersType = USER_TYPE.USER;
      filter.email = email;
      // filter.userType = USER_TYPE.USER;
      // filter.password = password;
    }

    const user = await Users.findOne(filter).select("+password").exec();
    if (!user) {
      throw new Error("User not found. Check your details and try again.");
    }

    if (user.userType != usersType) {
      throw new Error("Error Login! User type mistach.");
    }

    if (
      password !== user.password &&
      !bcryptjs.compareSync(password, `${user.password}`)
    ) {
      throw new Error("Wrong password.");
    }

    if(!user.isVerified){
      throw new Error("Account not verifed!");
    }

    const update = {
      otpAccess: false,
      currentLogin: Date.now(),
      currentIp: loginPayload.currentIp,
      lastLogin: user.currentLogin,
      lastIp: user.currentIp,
    };
    await Users.findOneAndUpdate({ _id: user._id }, update, {
      new: true,
    }).exec();
    user.password = null;
    user.otp = null;
    delete user.password;
    delete user.otp;
    const payload = {
      id: `${user.id}`,
      time: new Date(),
      userType: user.userType,
    };
    const token = jwt.sign(payload, JWT.jwtSecret, {
      expiresIn: userType === USER_TYPE.ADMIN ? JWT.adminTokenExpirationTime : JWT.tokenExpireTime,
    });
    return { token, user };
  } catch (err) {
    throw new Error(`${err.message}`);
  }
};

export async function fetchSelfService(query, user) {
  try {
    const { projection, population } = aqp(query);
    const filter = { _id: safeGet(user, "id"), deleted: 0 };
    const total = await Users.countDocuments(filter).exec();
    const result = await Users.findOne(filter)
      .populate(population)
      .select(projection)
      .exec();
    if (!result) {
      throw new Error(`${module} record not found.`);
    }
    const count = result.length;
    const msg = `User record retrieved successfully!`;
    const entity = {
      payload: result,
      total,
      count,
      msg,
      skip: 0,
      limit: 0,
      sort: 1,
    };
    return entity;
  } catch (err) {
    throw new Error(`Error retrieving ${module} record. ${err.message}`);
  }
}

export async function fetchAnyService(param) {
  try {
    const { filter } = aqp(
      `filter={"$or":[{"email":"${param}"},{"phone":"${param}"},{"wallet":"${param}"}]}`
    );
    const total = await User.countDocuments(filter).exec();
    const payload = await User.findOne(filter)
      .select("wallet businessName type email phone ratings")
      .exec();
    if (!payload) {
      throw new Error(`${module} record not found.`);
    }
    const count = payload.length;
    const msg = `User record retrieved successfully!`;
    const entity = {
      payload,
      total,
      count,
      msg,
      skip: 0,
      limit: 0,
      sort: 1,
    };
    return entity;
  } catch (err) {
    throw new Error(`Error retrieving ${module} record. ${err.message}`);
  }
}

const generateWallet = async () => {
  let code = generateCode(10);
  let duplicate = await User.findOne({ wallet: code }).exec();
  if (duplicate) {
    code = generateCode(10);
    duplicate = await User.findOne({ wallet: code }).exec();
    if (duplicate) {
      throw new Error(`Error! Record already exist for Wallet ${code}`);
    }
  }
  return code;
};

const minsAgo = (mins) => {
  const time = new Date();
  return time.setMinutes(time.getMinutes() - Number(mins));
};

const sendMailService = async (userEmail, subject, message) => {
  try {
    const result = await nodeMailerService(
      "admin@chinosexchange.com",
      userEmail,
      subject,
      message
    );
  } catch (err) {
    console.error(err);
  }
};

export async function createService(data) {
  try {
    const { error } = validateCreate.validate(data);
    if (error) throw new Error(`Error validating User data. ${error.message}`);
    const { email, phone } = data;

    const duplicatePhone = await Users.findOne({ phone }).exec();
    if (duplicatePhone) {
      throw new Error(`Error! Record already exist for phone ${phone}`);
    }
    const duplicateEmail = await Users.findOne({ email }).exec();
    if (duplicateEmail) {
      throw new Error(`Error! Record already exist for email ${email}`);
    }
    if (safeGet(data, "password")) data.password = hash(data.password);
    data.code = generateCode(10).slice(0, 5);
    const newRecord = new Users(data);
    const result = await newRecord.save();

    if (!result) {
      throw new Error(`User record not found.`);
    }

    //send mail to user upon successful account creation
    const mailResponse = await sendMailService(
      result.email,
      "Account Verification mail",
      verificationEmail(result)
    )


    delete result.transactionPin;
    delete result.code;

    return result;
  } catch (err) {
    throw new Error(`Error creating User record. ${err.message}`);
  }
}

export const verifyEmailService = async (data) => {
  try {
    const { error } = validateVerifyEmail.validate(data);
    if (error) throw new Error(`Error verifying email. ${error.message}`);

    const { id, code } = data;
    const user = await Users.findOne({ code }).exec();
    if (!user) throw new Error(`User does not exist`);
    if (code !== user.code)
      throw new Error(`Error verifying email. Verification code mismatch`);

    const payload = { isVerified: true };
    const result = await Users.findOneAndUpdate(
      { code },
      { ...payload },
      { new: true }
    ).exec();
    if (!result) throw new Error(`Error verifying Email`);

    return result;
  } catch (err) {
    throw new Error(`Error verifying email. ${err.message}`);
  }
};

export const resetCodeVerificationService = async (data) => {
  try {
    const { error } = validateVerifyResetCode.validate(data);
    if (error) throw new Error(`${error.message}`);

    const { id, resetCode } = data;
    const user = await Users.findOne({ _id: id }).exec();
    if (!user) throw new Error(`User does not exist`);
    if (resetCode !== user.resetCode)
      throw new Error(`Forgot password code mismatch`);

    const payload = { canResetPassword: true };
    const result = await Users.findOneAndUpdate(
      { _id: id },
      { ...payload },
      { new: true }
    ).exec();
    if (!result) throw new Error(`${module} Error trying to reset password`);

    return result;
  } catch (err) {
    throw new Error(`Error resetting password. ${err.message}`);
  }
};

export const forgotPasswordService = async (data) => {
  try {
    const { error } = validateForgortPassword.validate(data);
    if (error) throw new Error(`${error.message}`);

    const { email, password } = data;
    const user = await Users.findOne({ email: email }).exec();
    if (!user) throw new Error(`User does not exist`);
    if (!!user.canResetPassword && user.canResetPassword === false) {
      throw new Error(`Pls verify your forgot password code`);
    }

    const payload = {
      password: hash(password),
      canResetPassword: false,
    };
    const result = await Users.findOneAndUpdate(
      { email: email },
      { ...payload },
      { new: true }
    ).exec();
    if (!result) throw new Error(`${module} Error trying to reset password`);

    return result;
  } catch (err) {
    throw new Error(`Error resetting password. ${err.message}`);
  }
};

export const passwordResetCodeService = async (email) => {
  try {
    if (!email) throw new Error(`No email found!`);

    const user = await Users.findOne({ email: email }).exec();
    if (!user) throw new Error(`No user found for email`);

    const resetCode = generateCode(5);

    const result = await Users.findOneAndUpdate(
      { email: email },
      { resetCode: resetCode },
      { new: true }
    ).exec();
    if (!result) throw new Error(`${module} Unable to send reset password`);

    // send password reset code to user
    const mailResponse = await sendMailService(
      email,
      "Chinos Password Reset Code",
      resetPasswordEmail(user, resetCode)
    )
      .then((res) => {
        console.log("mail sent successfully");
      })
      .catch((err) => {
        console.log(err);
      });
    delete result.resetCode;
    delete result.code;
    return result;
  } catch (err) {
    throw new Error(`Error sending password rest code. ${err.message}`);
  }
};

export async function updateByUserService(recordId, data) {
  try {
    const { error } = validateUserUpdate.validate(data);
    if (error) throw new Error(`Error validating User data. ${error.message}`);
    if (safeGet(data, "password")) data.password = hash(data.password);
    const { profileImage } = data;
    if (profileImage) {
      const uploadResult = await uploadImage(profileImage);
      data.profileImage = uploadResult.url;
    } else {
      console.log("no profileImage image found");
    }

    const user = await Users.findOneAndUpdate({ _id: recordId }, data, {
      new: true,
    }).exec();
    if (!user) {
      throw new Error(`User record not found.`);
    }

    let result = user;
    return result;
  } catch (err) {
    throw new Error(`Error updating User record. ${err.message}`);
  }
}

export async function updateByAdminService(recordId, data) {
  try {
    const { error } = validateAdminUpdate.validate(data);
    if (error) throw new Error(`Error validating User data. ${error.message}`);
    if (safeGet(data, "password")) data.password = hash(data.password);
    const result = await Users.findOneAndUpdate({ _id: recordId }, data, {
      new: true,
    }).exec();
    if (!result) {
      throw new Error(`User record not found.`);
    }
    return result;
    //! Notify User
  } catch (err) {
    throw new Error(`Error updating User record. ${err.message}`);
  }
}

export async function patchService(recordId, data) {
  try {
    const result = await User.findOneAndUpdate({ _id: recordId }, data, {
      new: true,
    }).exec();
    if (!result) {
      throw new Error(`User record not found.`);
    }
    return result;
  } catch (err) {
    throw new Error(`Error patching User record. ${err.message}`);
  }
}

export async function deleteService(recordId) {
  try {
    const result = await Users.findOneAndRemove({ _id: recordId });
    if (!result) {
      throw new Error(`User record not found.`);
    }
    return result;
  } catch (err) {
    throw new Error(`Error deleting User record. ${err.message}`);
  }
}

export async function sendOTPService(data) {
  try {
    const { error } = schemaLogin.validate(data);
    if (error) {
      throw new Error("Require Email or Phone for OTP");
    }
    const { phone, email } = data;
    const date1 = new Date();
    const date2 = new Date(date1);
    date2.setMinutes(date1.getMinutes() + 10);
    const otp = generateOtp();
    const update = {
      otp: hash(otp.toString()),
      $inc: { otpCount: 1 },
      otpAccess: true,
      otpTimeout: date2,
    };
    const q = { $or: [{ email }, { phone }] };
    const result = await User.findOneAndUpdate(q, update, { new: true }).exec();
    if (!result) {
      throw new Error(`User not found with phone ${phone} or email ${email}`);
    }
    const smsData = {
      subject: "FreexitNow Login OTP",
      recipient: result.phone,
      message: `Login to the App using this phone number and the OTP ${otp} -FREEXIT`,
    };
    if (result.phone) {
      Smses.createService(smsData)
        .then()
        .catch((err) => console.log(err.message));
    }
    // const mailData = {
    //   recipientEmail: result.email,
    //   subject: "Chinosexchange Login OTP",
    //   body: `Use this one-time password to login to your seafood.com account - OTP: ${otp} -CHINOSEXCHANGE`,
    // };
    //Uncomment this field as soon as you have integrated mail sending functionality.
    // if (result.email) {
    //   Mails.createService(mailData)
    //     .then()
    //     .catch((err) => console.log(err.message));
    // }
    return true;
  } catch (err) {
    throw new Error(`Error sending User record. ${err.message}`);
  }
}

/**
 * function securityService() validate an user before transaction
 * @param {*} wallet Wallet for UserFrom
 * @param {*} pin pass code
 * @param {*} user Authorized bearer
 */
// eslint-disable-next-line complexity
export async function securityService(wallet, pin, user) {
  try {
    const UserFrom = await User.findOne({ wallet }).select("+pin").exec();
    if (!UserFrom) throw new Error(`Wallet with address ${wallet} not found.`);
    if (user.id.toString() !== UserFrom.id.toString()) {
      throw new Error(`Unauthorized user bearer ${user.email}`);
    }
    if (pin !== UserFrom.pin) {
      const acc = await User.findOneAndUpdate(
        { _id: UserFrom.id },
        { $inc: { wrongPin: 1 } },
        { new: true }
      );
      const trials = 4 - acc.wrongPin;
      if (trials === 0) {
        acc.accessLevel = 1;
        acc.remark = "Account block as a result of repeated wrong PIN access";
        await acc.save();
        throw new Error(`Your user is blocked! ${trials} more attempts!`);
      }
      throw new Error(
        `Wrong pin! Your user will be blocked after ${trials} more attempts!`
      );
    }
    UserFrom.wrongPin = 0;
    await UserFrom.save();

    return UserFrom;
  } catch (err) {
    throw new Error(`Security Service. ${err.message}`);
  }
}

export async function updatePinService(wallet, data, user) {
  try {
    const { error } = validatePinUpdate.validate(data);
    if (error) throw new Error(`Invalid payload. ${error.message}`);
    const { pin, newPin, updatedBy } = data;
    const AccountFrom = await securityService(wallet, pin, user);
    const update = {
      pin: hash(newPin),
      pinUpdate: Date.now(),
      isPinDefault: false,
      updatedBy,
    };
    const result = await User.findOneAndUpdate(
      { _id: AccountFrom.id },
      update,
      { new: true }
    );
    if (!result) {
      throw new Error(`${module} record not found.`);
    }
    //! Notify User
    return result;
  } catch (err) {
    throw new Error(`Pin update service: ${err.message}`);
  }
}
