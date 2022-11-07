import aqp from "api-query-params";
import Users from "../users/model";
import Airtime, { validateCreate, validateUpdate } from "./model";
import { generateModelCode, setLimit } from "../../util";
import { uploadImage } from "../../services/upload";

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
        let { networkImage } = data;
        if(networkImage){
            const uploadResult = await uploadImage(networkImage);
            data.networkImage = uploadResult.url;
        }else {
            console.log('no network image found');
        }
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

export async function updateService(recordId, data, user) {
    try {
        const { error } = validateUpdate.validate(data);
        if (error) {
            throw new Error(`Invalid request. ${error.message}`);
        }

        const returnedAirtime = await Airtime.findById(recordId).exec();
        if (!returnedAirtime) throw new Error(`${module} record not found.`);
        if (`${returnedAirtime.createdBy}` !== user.id && (user.userType !== 'ADMIN' || 'EDITOR')) {
            throw new Error(`user ${user.email} does not have the permission to update`);
        }
        const { networkImage } = data;
        if(networkImage){
            const uploadResult = await uploadImage(networkImage);
            data.networkImage = uploadResult.url;
        }else {
            console.log('no network image found');
        }
      
      const result = await Airtime.findOneAndUpdate({ _id: recordId }, data, {
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
        const result = await Airtime.findOneAndRemove({ _id: recordId });
        if (!result) {
            throw new Error(`Airtime record not found.`);
        }
        return result;
    } catch (err) {
        throw new Error(`Error deleting Airtime record. ${err.message}`);
    }
}