import aqp from "api-query-params";
import Users from "../users/model.js";
import Newsletter, { validateCreate, validateUpdate } from "./model.js";
import { generateModelCode, setLimit } from "../../util/index.js";
import { uploadImage } from "../../services/upload.js";
import Subscribers from "../subscribers/model.js";
import { sendMail } from "../../services/mail.js";

const module = "Newsletter";

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

    const total = await Newsletter.countDocuments(filter).exec();

    const result = await Newsletter.find(filter)
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
    throw new Error(`Error retrieving ${module} record ${error.message}`);
  }
};

export const fetchPublicService = async (query) => {
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

    const total = await Newsletter.countDocuments(filter).exec();

    const result = await Newsletter.find(filter)
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
    throw new Error(`Error retrieving ${module} record ${error.message}`);
  }
};

const sendMailService = async (subscribers, subject, message) => {
  try {
    console.log({ emails: `${subscribers}` });
    const result = await sendMail(
      "admin@chinosexchange.com",
      `${subscribers}`,
      subject,
      message
    );
  } catch (err) {
    console.error(err);
  }
};

export const createService = async (data) => {
  try {
    const { error } = validateCreate.validate(data);
    if (error) throw new Error(`${error.message}`);

    const existingRecord = await Newsletter.findOne({
      title: data.title,
    }).exec();
    if (existingRecord) throw new Error(`Record already exist`);

    const subscribers = await Subscribers.find({}).exec();
    if (subscribers.length < 1) {
      throw new Error(`Subscribers not found`);
    }
    const mappedSubscirbers = subscribers.map((item) => item.subscriberEmail);
    data.subscribers = mappedSubscirbers;

    //send mail to subscribers
    const mailResponse = await sendMailService(
      mappedSubscirbers.toString(),
      data.subject,
      data.message
    )
      .then((res) => {
        console.log("mail sent successfully");
      })
      .catch((err) => {
        console.log(err);
      });

    data.code = await generateModelCode(Newsletter);
    const creator = await Users.findById(data.createdBy).exec();
    if (!creator) throw new Error(`User ${data.createdBy} not found`);
    data.createdBy = creator.id;

    const newRecord = new Newsletter(data);
    const result = await newRecord.save();
    if (!result) throw new Error(`${module} record not found`);

    return result;
  } catch (err) {
    throw new Error(`Error creating Newsletter record. ${err.message}`);
  }
};

export async function updateService(recordId, data, user) {
  try {
    const { error } = validateUpdate.validate(data);
    if (error) {
      throw new Error(`Invalid request. ${error.message}`);
    }

    const returnedNewsletter = await Newsletter.findById(recordId).exec();
    if (!returnedNewsletter) throw new Error(`${module} record not found.`);
    if (
      `${returnedNewsletter.createdBy}` !== user.id &&
      (user.userType !== "ADMIN" || "EDITOR")
    ) {
      throw new Error(
        `user ${user.email} does not have the permission to update`
      );
    }
    const { networkImage } = data;
    if (networkImage) {
      const uploadResult = await uploadImage(networkImage);
      data.networkImage = uploadResult.url;
    } else {
      console.log("no network image found");
    }

    const result = await Newsletter.findOneAndUpdate({ _id: recordId }, data, {
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
    const result = await Newsletter.findOneAndRemove({ _id: recordId });
    if (!result) {
      throw new Error(`Newsletter record not found.`);
    }
    return result;
  } catch (err) {
    throw new Error(`Error deleting Newsletter record. ${err.message}`);
  }
}
