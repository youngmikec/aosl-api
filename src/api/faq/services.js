import aqp from "api-query-params";
import Faqs, { validateCreate, validateUpdate } from "./model.js";
import { generateModelCode, setLimit } from "../../util/index.js";

const module = "Faqs";

const search = (filter) => {
  if (!filter.q) return;
  const pattern = new RegExp(`${filter.q}`.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"), "i");
  filter.$or = [{ question: { $regex: pattern } }, { answer: { $regex: pattern } }, { category: { $regex: pattern } }];
  delete filter.q;
};

const list = async (query, extraFilter = {}) => {
  const { filter, skip, population, sort, projection } = aqp(query);
  search(filter);
  Object.assign(filter, extraFilter);
  if (!filter.deleted) filter.deleted = false;
  const limit = setLimit(aqp(query).limit);

  const total = await Faqs.countDocuments(filter).exec();
  const result = await Faqs.find(filter)
    .populate(population)
    .sort(sort && Object.keys(sort).length ? sort : { category: 1, order: 1, createdAt: 1 })
    .limit(limit)
    .skip(skip)
    .select(projection)
    .exec();
  const count = result.length;
  return { payload: result, total, count, msg: `${count} ${module} record(s) retrieved successfully!`, skip, limit, sort };
};

export const fetchService = async (query) => {
  try {
    return await list(query);
  } catch (err) {
    throw new Error(`Error retrieving ${module} record ${err.message}`);
  }
};

// Public site: published questions only.
export const fetchPublicService = async (query) => {
  try {
    return await list(query, { isPublished: true });
  } catch (err) {
    throw new Error(`Error retrieving ${module} record ${err.message}`);
  }
};

export const createService = async (data) => {
  try {
    const { error } = validateCreate.validate(data);
    if (error) throw new Error(`${error.message}`);
    data.code = await generateModelCode(Faqs);
    return await new Faqs(data).save();
  } catch (err) {
    throw new Error(`Error creating ${module} record. ${err.message}`);
  }
};

export const updateService = async (recordId, data) => {
  try {
    const { error } = validateUpdate.validate(data);
    if (error) throw new Error(`${error.message}`);
    const result = await Faqs.findOneAndUpdate({ _id: recordId }, data, { new: true }).exec();
    if (!result) throw new Error(`${module} record not found.`);
    return result;
  } catch (err) {
    throw new Error(`Error updating ${module} record. ${err.message}`);
  }
};

export const deleteService = async (recordId) => {
  try {
    const result = await Faqs.findOneAndRemove({ _id: recordId });
    if (!result) throw new Error(`${module} record not found.`);
    return result;
  } catch (err) {
    throw new Error(`Error deleting ${module} record. ${err.message}`);
  }
};
