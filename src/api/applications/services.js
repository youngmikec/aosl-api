import aqp from "api-query-params";
import Users from "../users/model.js";
import Applications, { validateCreate, validateUpdate, validateUserUpdate } from "./model.js";
import { generateModelCode, setLimit } from "../../util/index.js";
import { uploadImage } from "../../services/upload.js";
import { AdminApplicationEmailTemplate, APPLICATION, ApplicationEmailTemplate } from "../../constant/index.js";
import { sendMailService } from "../../services/send-mail.js";

const module = 'Applications';

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

        const total = await Applications.countDocuments(filter).exec();

        const result = await Applications.find(filter)
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

        const total = await Applications.countDocuments(filter).exec();

        const result = await Applications.find(filter)
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

        let { resume } = data;
        data.status = APPLICATION.STATUS.APPLIED;
        if(resume){
          const uploadResult = await uploadImage(resume);
          data.resume = uploadResult.url;
        }else {
          console.log('no resume image found');
        }

        data.code = await generateModelCode(Applications);
        if(data.createdBy){
          const creator = await Users.findById(data.createdBy).exec();
          if (!creator) throw new Error(`User ${data.createdBy} not found`);
          data.createdBy = creator.id;
        }

        const newRecord = new Applications(data);
        const result = await newRecord.save();
        if(!result) throw new Error(`${module} record not found`);

        await sendMailService(
            result.email,
            `Application Received`,
            ApplicationEmailTemplate(result)
        );

        await sendMailService(
            ['info@aosl-online.com', 'admin@aosl-online.com'],
            `Application Submitted for ${result.role}`,
            AdminApplicationEmailTemplate(result)
        );

        return result;

    }catch (err) {
        throw new Error(`Error creating Applications record. ${err.message}`);
    }
}

export async function updateService(recordId, data, user) {
    try {
        const { error } = validateUpdate.validate(data);
        if (error) {
            throw new Error(`Invalid request. ${error.message}`);
        }

        const returnedApplications = await Applications.findById(recordId).exec();
        if (!returnedApplications) throw new Error(`${module} record not found.`);
        if (`${returnedApplications.createdBy}` !== user.id && (user.userType !== 'ADMIN')) {
            throw new Error(`user ${user.email} does not have the permission to update`);
        }
        const { resume } = data;
        if(resume){
            const uploadResult = await uploadImage(resume);
            data.resume = uploadResult.url;
        }else {
            console.log('no resume image found');
        }
      
      const result = await Applications.findOneAndUpdate({ _id: recordId }, data, {
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

export async function updateUserService(recordId, data, user) {
    try {
        const { error } = validateUserUpdate.validate(data);
        if (error) {
            throw new Error(`Invalid request. ${error.message}`);
        }

        const returnedApplications = await Applications.findById(recordId).exec();
        if (!returnedApplications) throw new Error(`${module} record not found.`);
        
        const { resume } = data;
        if(resume){
            const uploadResult = await uploadImage(resume);
            data.resume = uploadResult.url;
        }else {
            console.log('no resume image found');
        }
      
      const result = await Applications.findOneAndUpdate({ _id: recordId }, data, {
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
        const result = await Applications.findOneAndRemove({ _id: recordId });
        if (!result) {
            throw new Error(`Applications record not found.`);
        }
        return result;
    } catch (err) {
        throw new Error(`Error deleting Applications record. ${err.message}`);
    }
}