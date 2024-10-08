import aqp from "api-query-params";
import Mails, { validateCreate, validateUpdate } from "./model.js";
import { generateModelCode, setLimit } from "../../util/index.js";
import { nodeMailerService } from "../../services/node-mailer-service.js";
import { ContactAdminEmailTemplate } from "../../constant/email-templates.js";

const module = "Mails";

export const SendMailService = async (userEmail, subject, message) => {
  try {
    const result = await nodeMailerService(
      "admin@aosl-online.com",
      userEmail,
      subject,
      message
    );
  } catch (err) {
    console.error(err);
  }
};

export const fetchService = async (query) => {
  try {
    let { filter, skip, population, sort, projection } = aqp(query);
    const searchQuery = filter.q ? filter.q : false;
    if (searchQuery) {
      const escaped = searchString.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
      filter.$or = [
        { name: { $regex: new RegExp(searchString, "i") } },
        { shortName: { $regex: new RegExp(searchString, "i") } },
        { $text: { $search: escaped, $caseSensitive: false } },
      ];
      delete filter.q;
    }
    let { limit } = aqp(query);
    limit = setLimit(limit);
    if (!filter.deleted) filter.deleted = 0;

    const total = await Mails.countDocuments(filter).exec();

    const result = await Mails.find(filter)
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
    throw new Error(`Error retrieving ${module} record ${err.message}`);
  }
};

export const createService = async (data) => {
  try {
    const { error } = validateCreate.validate(data);
    if (error) throw new Error(`${error.message}`);

    data.code = await generateModelCode(Mails);
    const { email, subject, message, fullName, phone } = data;

    // send mail to user upon successful account creation
    // await SendMailService(email, subject, message);
    const adminMailPayload = {fullName, phone, email, message}

    // Send mail to admin.
    await SendMailService(
      ['info@aosl-online.com', 'admin@aosl-online.com'],
      subject,
      ContactAdminEmailTemplate(adminMailPayload)
    );

    const newRecord = new Mails(data);
    const result = await newRecord.save();
    if (!result) throw new Error(`${module} record not found`);

    return result;
  } catch (err) {
    throw new Error(`Error creating Mails record. ${err.message}`);
  }
};

export async function updateService(recordId, data, user) {
  try {
    const { error } = validateUpdate.validate(data);
    if (error) {
      throw new Error(`Invalid request. ${error.message}`);
    }

    const returnedMails = await Mails.findById(recordId).exec();
    if (!returnedMails) throw new Error(`${module} record not found.`);
    if (
      `${returnedMails.createdBy}` !== user.id &&
      (user.userType !== "ADMIN" || "EDITOR")
    ) {
      throw new Error(
        `user ${user.email} does not have the permission to update`
      );
    }

    const result = await Mails.findOneAndUpdate({ _id: recordId }, data, {
      new: true,
    }).exec();
    if (!result) {
      throw new Error(`${module} record not found.`);
    }

    //send mail to user upon successful account creation
    SendMailService(result.email, result.subject, result.message)
      .then((res) => {
        console.log("mail sent successfully");
      })
      .catch((err) => {
        console.log(err);
      });

    return result;
  } catch (err) {
    throw new Error(`Error updating ${module} record. ${err.message}`);
  }
}

export async function deleteService(recordId) {
  try {
    const result = await Mails.findOneAndRemove({ _id: recordId });
    if (!result) {
      throw new Error(`Mails record not found.`);
    }
    return result;
  } catch (err) {
    throw new Error(`Error deleting Mails record. ${err.message}`);
  }
}
