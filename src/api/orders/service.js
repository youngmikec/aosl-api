import aqp from "api-query-params";
import { uploadImage } from "../../services/upload.js";
import { sendMail } from "../../services/index.js";
import { generateModelCode, setLimit } from "../../util/index.js";
import Users from "../users/model.js";
import Orders, {
  validateCreate,
  validateUpdate,
  validatePublicUpdate,
} from "./model.js";

const module = "Orders";

export const fetchService = async (query) => {
  try {
    const { filter, population, sort, skip, projection } = aqp(query);

    const searchQuery = (filter.q = 0 ? filter.q : false);
    if (searchQuery) {
      const escaped = searchString.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
      filter.$or = [
        //   { name: { $regex: new RegExp(searchString, "i") } },
        //   { shortName: { $regex: new RegExp(searchString, "i") } },
        { $text: { $search: escaped, $caseSensitive: false } },
      ];
    }
    delete filter.q;

    let { limit } = aqp(query);
    limit = setLimit(limit);
    if (!filter.deleted) filter.deleted = 0;

    console.log({ filter });

    const total = await Orders.countDocuments(filter).exec();
    const result = await Orders.find(filter)
      .populate(population)
      .sort(sort)
      .limit(limit)
      .skip(skip)
      .select(projection)
      .exec();

    if (!result) {
      throw new Error(`${module} record not found`);
    }
    const count = result.length;
    const msg = `${count} ${module} record(s) retrieved successfully!`;
    return { payload: result, total, count, msg, skip, limit, sort };
  } catch (err) {
    throw new Error(`Error ${module} ${err.message}`);
  }
};


const sendMailService = async (userEmail, subject, message) => {
  try {
    const result = await sendMail(
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
  const session = await Orders.startSession();
  session.startTransaction({
    readConcern: { level: "snapshot" },
    writeConcern: { w: 1 },
  });
  try {
    const { error } = validateCreate.validate(data);
    if (error) throw new Error(`Invalid request. ${error.message}`);

    const senderObj = await Users.findById(data.createdBy).exec();
    if (!senderObj)
      throw new Error(`Cannot perform transaction, this user does not exist.`);

    data.orderCode = await generateModelCode(Orders);
    data.user = senderObj.id;

    const { proofImage } = data;
    if (proofImage) {
      const uploadResult = await uploadImage(proofImage);
      data.proofImage = uploadResult.url;
      data.status = "PROOFED";
    } else {
      console.log("no transaction proof image found");
    }

    const newOrder = new Orders(data);
    const result = await newOrder.save();

    if (!result) throw new Error(`${module} record not found.`);

    //send mail to user upon successful order creation
    const mailResponse = await sendMailService(
      senderObj.email,
      "Order Confirmation Mail",
      `
        <p>
          Dear customer, your order has been created successfully with the order code is <b> ${
            result.code
          } </b>
          
          <br>
          Your order will be processed as soon as possible. Click on the link below to chat with our admin in case of any issue.
          <br/>
          <br/>
          <a href="https://wa.me/2347031625759" target="_blank">Chat with Admin</a>
          <br>
          Thank you for trusting us.
        </p>
        `
    )
    .then((res) => {
      console.log("mail sent successfully");
    })
    .catch((err) => {
      console.log(err);
    });

    //send mail to user upon successful order creation
    const adminMailResponse = await sendMailService(
      ["Chukwudeme0@gmail.com", "admin@chinosexchange.com"],
      "Order Confirmation Mail",
      `
        <p>
          Dear Chino, An order has been created successfully with the order code is <b> ${
            result.code
          } </b>
          
          <br>
          Pls kindly fulfill this order. Click on the link below to chat with the user in case of any issue.
          <br/>
          <br/>
          <a href="https://wa.me/+234${senderObj.phone}" target="_blank">Chat with User</a>
          <br>
          Thank you for trusting us.
        </p>
        `
    )
    .then((res) => {
      console.log("mail sent successfully");
    })
    .catch((err) => {
      console.log(err);
    });

    session.commitTransaction();
    session.endSession();
    return result;
  } catch (err) {
    session.abortTransaction();
    session.endSession();
    throw new Error(`Error creating ${module} record. ${err.message}`);
  }
}

export async function updateService(recordId, data, user) {
  try {
    const { error } = validateUpdate.validate(data);
    if (error) {
      throw new Error(`Invalid request. ${error.message}`);
    }

    const returnedRecord = await Orders.findById(recordId).exec();
    if (!returnedRecord) throw new Error(`${module} record not found.`);

    let { proofImage } = data;
    if (proofImage) {
      const uploadResult = await uploadImage(proofImage);
      if (!uploadResult) throw new Error("Error in upload service");
      data.proofImage = uploadResult.url;
    } else {
      console.log("no giftcard image found");
    }

    const result = await Orders.findOneAndUpdate({ _id: recordId }, data, {
      new: true,
    }).exec();
    if (!result) {
      throw new Error(`${module} record not found.`);
    }
    return result;
  } catch (err) {
    throw new Error(`Error updating ${module} record. ${err.message}`);
  }
}

export async function updatePublicService(recordId, data, user) {
  try {
    const { error } = validatePublicUpdate.validate(data);
    if (error) {
      throw new Error(`Invalid request. ${error.message}`);
    }

    const returnedRecord = await Orders.findById(recordId).exec();
    if (!returnedRecord) throw new Error(`${module} record not found.`);
    if (`${returnedRecord.createdBy}` !== user.id) {
      throw new Error(
        `user ${user.email} does not have the permission to update`
      );
    }
    let { proofImage } = data;
    if (proofImage) {
      const uploadResult = await uploadImage(proofImage);
      if (!uploadResult) throw new Error("Error in upload service");
      data.proofImage = uploadResult.url;
    } else {
      console.log("no proof image found");
    }

    const result = await Orders.findOneAndUpdate({ _id: recordId }, data, {
      new: true,
    }).exec();
    if (!result) {
      throw new Error(`${module} record not found.`);
    }
    return result;
  } catch (err) {
    throw new Error(`Error updating ${module} record. ${err.message}`);
  }
}

export async function deleteService(recordId) {
  try {
    const result = await Orders.findOneAndRemove({ _id: recordId });
    if (!result) {
      throw new Error(`Order record not found.`);
    }
    return result;
  } catch (err) {
    throw new Error(`Error deleting Order record. ${err.message}`);
  }
}
