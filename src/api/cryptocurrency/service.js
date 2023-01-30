import aqp from "api-query-params";
import Users from "../users/model.js";
import Cryptocurrency, { validateCreate, validateUpdate } from "./model.js";
import { generateModelCode, generateCode, setLimit } from "../../util/index.js";
import { uploadImage } from "../../services/upload.js";

const module = "Cryptocurrency";

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

    const total = await Cryptocurrency.countDocuments(filter).exec();

    const result = await Cryptocurrency.find(filter)
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

export const createService = async (data) => {
  try {
    const { error } = validateCreate.validate(data);
    if (error) throw new Error(`${error.message}`);

    const { name } = data;
    let { cryptoImage, barcode, networks } = data;
    if (cryptoImage) {
      const uploadResult = await uploadImage(cryptoImage);
      data.cryptoImage = uploadResult.url;
    } else {
      console.log("no crypto image found");
    }
    if (barcode) {
      const uploadResult = await uploadImage(barcode);
      data.barcode = uploadResult.url;
    } else {
      console.log("no barcode image found");
    }

    // if(networks) {
    //     const transformedItems = networks.map((item) => ({ networkName: item.name, networkId: generateCode(4)}))
    //     if(transformedItems.length > 0) {
    //         data.networks = transformedItems
    //     }
    // }
    if (networks) {
      const transformedItems = networks.map((item) => ({
        networkName: item.name,
      }));
      if (transformedItems.length > 0) {
        data.networks = transformedItems;
      }
    }

    const existingRecord = await Cryptocurrency.findOne({ name: name }).exec();
    if (existingRecord) throw new Error(`Record already exist`);

    data.code = await generateModelCode(Cryptocurrency);
    const creator = await Users.findById(data.createdBy).exec();
    if (!creator) throw new Error(`User ${data.createdBy} not found`);
    data.createdBy = creator.id;

    const newRecord = new Cryptocurrency(data);
    const result = await newRecord.save();
    if (!result) throw new Error(`${module} record not found`);

    return result;
  } catch (err) {
    throw new Error(`Error creating Cryptocurrency record. ${err.message}`);
  }
};

export async function updateService(recordId, data, user) {
  try {
    const { error } = validateUpdate.validate(data);
    if (error) {
      throw new Error(`Invalid request. ${error.message}`);
    }

    const returnedRecord = await Cryptocurrency.findById(recordId).exec();
    if (!returnedRecord) throw new Error(`${module} record not found.`);
    if (
      `${returnedRecord.createdBy}` !== user.id &&
      (user.userType !== "ADMIN" || "EDITOR")
    ) {
      throw new Error(
        `user ${user.email} does not have the permission to update`
      );
    }

    let { cryptoImage, barcode } = data;
    if (cryptoImage) {
      const uploadResult = await uploadImage(cryptoImage);
      data.cryptoImage = uploadResult.url;
    } else {
      console.log("no crypto image found");
    }
    if (barcode) {
      const uploadResult = await uploadImage(barcode);
      data.barcode = uploadResult.url;
    } else {
      console.log("no barcode image found");
    }

    const result = await Cryptocurrency.findOneAndUpdate(
      { _id: recordId },
      data,
      {
        new: true,
      }
    ).exec();
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
    const result = await Cryptocurrency.findOneAndRemove({ _id: recordId });
    if (!result) {
      throw new Error(`Cryptocurrency record not found.`);
    }
    return result;
  } catch (err) {
    throw new Error(`Error deleting Cryptocurrency record. ${err.message}`);
  }
}
