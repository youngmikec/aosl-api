import aqp from "api-query-params";
import Bank from "./model.js";
import { setLimit } from "../../util/helpers.js";

const module = "Bank";

export const fetchService = async (query) => {
  try {
    let { filter, skip, population, sort, projection } = aqp(query);
    const searchQuery = filter.q ? filter.q : false;
    if (searchQuery) {
      const escaped = searchString.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
      filter.$or = [
        // { name: { $regex: new RegExp(searchString, "i") } },
        // { $text: { $search: escaped, $caseSensitive: false } },
      ];
      delete filter.q;
    }
    let { limit } = aqp(query);
    limit = setLimit(limit);
    if (!filter.deleted) filter.deleted = 0;

    const total = await Bank.countDocuments(filter).exec();

    const result = await Bank.find()
      .populate(population)
      .sort(sort)
      .limit(limit)
      .skip(skip)
      .select(projection)
      .exec();

    if (!result) {
      throw new Error(`${module} record not found`);
    }
    console.log({ result });
    const count = result.length;
    const msg = `${count} ${module} record(s) retrieved successfully!`;
    return { payload: result, total, count, msg, skip, limit, sort };
  } catch (err) {
    throw new Error(`Error retrieving ${module} record ${err.message}`);
  }
};
