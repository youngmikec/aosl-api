import aqp from "api-query-params";
import Users from "../users/model.js";
import Jobs, { validateCreate, validateUpdate } from "./model.js";
import { generateModelCode, setLimit } from "../../util/index.js";
import { uploadImage } from "../../services/upload.js";

const module = 'Jobs';

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

        const total = await Jobs.countDocuments(filter).exec();

        const result = await Jobs.find(filter)
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


export const fetchPublicService = async (query) => {
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

        const total = await Jobs.countDocuments(filter).exec();

        const result = await Jobs.find(filter)
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

        const { title } = data;
        let { jobImage } = data;
        if(jobImage){
            const uploadResult = await uploadImage(jobImage);
            data.jobImage = uploadResult.url;
        }else {
            console.log('no network image found');
        }
        const existingRecord = await Jobs.findOne({ title }).exec();
        if(existingRecord) throw new Error(`Record already exist`);

        data.code = await generateModelCode(Jobs);
        const creator = await Users.findById(data.createdBy).exec();
        if (!creator) throw new Error(`User ${data.createdBy} not found`);
        data.createdBy = creator.id;

        const newRecord = new Jobs(data);
        const result = await newRecord.save();
        if(!result) throw new Error(`${module} record not found`);

        return result;

    }catch (err) {
        throw new Error(`Error creating Jobs record. ${err.message}`);
    }
}

export async function updateService(recordId, data, user) {
    try {
        const { error } = validateUpdate.validate(data);
        if (error) {
            throw new Error(`Invalid request. ${error.message}`);
        }

        const returnedJobs = await Jobs.findById(recordId).exec();
        if (!returnedJobs) throw new Error(`${module} record not found.`);
        if (`${returnedJobs.createdBy}` !== user.id && (user.userType !== 'ADMIN')) {
            throw new Error(`user ${user.email} does not have the permission to update`);
        }
        const { networkImage } = data;
        if(networkImage){
            const uploadResult = await uploadImage(networkImage);
            data.networkImage = uploadResult.url;
        }else {
            console.log('no network image found');
        }
      
      const result = await Jobs.findOneAndUpdate({ _id: recordId }, data, {
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
        const result = await Jobs.findOneAndRemove({ _id: recordId });
        if (!result) {
            throw new Error(`Jobs record not found.`);
        }
        return result;
    } catch (err) {
        throw new Error(`Error deleting Jobs record. ${err.message}`);
    }
}