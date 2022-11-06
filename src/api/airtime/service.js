import aqp from "api-query-params";

import Users from "../users/model";
import Airtime, { validateCreate } from "./model";
import { generateModelCode, setLimit } from "../../util";

const module = 'Airtime';

export const fetchService = async (query) => {
    try {
        let { filter, skip, population, sort, projection } = aqp(query);
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

        const total = await Airtime.countDocuments(filter).exec();

        const result = await Airtime.find(filter)
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

    }catch ( err ) {
        throw new Error(`Error retrieving ${module} record ${error.message}`);
    }
}

export const createService = async (data) => {
    try {
        const { error } = validateCreate.validate(data);
        if(error) throw new Error(`${error.message}`);

        const { name } = data;
        const existingRecord = await Airtime.findOne({name: name}).exec();
        if(existingRecord) throw new Error(`Record already exist`);

        data.code = await generateModelCode(Airtime);
        const creator = await Users.findById(data.createdBy).exec();
        if (!creator) throw new Error(`Sender ${data.createdBy} not found`);
        data.createdBy = creator.id;

        const newRecord = new Airtime(data);
        const result = await newRecord.save();
        if(!result) throw new Error(`${module} record not found`);

        return result;

    }catch (err) {
        throw new Error(`Error creating Airtime record. ${err.message}`);
    }
}