import aqp from "api-query-params";
import { setLimit } from "../../util";
import Cryptocurrency from "./model";

const module = 'Cryptocurrency';

export const fetchService = async (query) => {
    try {
        const { filter, skip, population, projection, sort } = aqp(query);
        const searchQuery = filter.q ? filter.q : false;
        if(searchQuery) {
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

        if(!result){
            throw new Error(`${module} record not found`);
        }
        const count = result.length;
        const msg = `${count} ${module} record(s) retrieved successfully!`;
        return { payload: result, total, count, msg, skip, limit, sort };

    }catch (err) {
        throw new Error(`Error ${module} ${err.message}`);
    }
}