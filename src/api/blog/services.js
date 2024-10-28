import aqp from "api-query-params";
import Users from "../users/model.js";
import { uploadImage } from "../../services/upload.js";
import { generateModelCode, setLimit, slugifyText } from "../../util/index.js";
import Blog, { validateCreateBlog, validateUpdateBlog, validatePublishData, validateLikePost } from "./model.js";


const module = 'Blog';

export const adminFetchService = async (query) => {
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

        const total = await Blog.countDocuments(filter).exec();

        const result = await Blog.find(filter)
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


export const publicFetchService = async (query) => {
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

        const total = await Blog.countDocuments(filter).exec();

        const result = await Blog.find(filter)
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


// Create blog post.
export const createService = async (data) => {
    try {
        const { error } = validateCreateBlog.validate(data);
        if(error) throw new Error(`${error.message}`);

        let { coverImage, title } = data;
        
        // Run the create media service to create blog post media.
        if(coverImage){
          const uploadResult = await uploadImage(coverImage);
          data.coverImage = uploadResult.url;
        }else {
          console.log('no coverImage image found');
        }
        data.slug = slugifyText(title);

        const returnedBlog = await Blog.findOne({slug: data.slug}).exec();
        if(returnedBlog){
            if(data.tags.length > 0){
                data.slug = data.slug + `-${data.tags[0]}`
            }else {
                data.slug = data.slug + `-${Date.now()}`
            }
        }

        data.code = await generateModelCode(Blog);
        if(data.createdBy){
          const creator = await Users.findById(data.createdBy).exec();
          if (!creator) throw new Error(`User ${data.createdBy} not found`);
          data.createdBy = creator.id;
        }

        const newRecord = new Blog(data);
        const result = await newRecord.save();
        if(!result) throw new Error(`${module} record not found`);

        return result;

    }catch (err) {
        throw new Error(`Error creating Blog record. ${err.message}`);
    }
}

export async function likeBlogPostService(data) {
    try {
        const { error } = validateLikePost.validate(data);
        if (error) {
            throw new Error(`Invalid request. ${error.message}`);
        }

        let { like, type, blogId } = data;

        const returnedBlog = await Blog.findById(blogId).exec();
        if (!returnedBlog) throw new Error(`${module} record not found.`);
        
      
        const result = await Blog.findOneAndUpdate(
            { _id: blogId },
            { $inc: { 
                    likes: type === 'increase' ? like : - like 
                }
            },
            { new: true }
        ).exec();

        if (!result) {
            throw new Error(`${module} record not found.`);
        }

        return result;
    } catch (err) {
        throw new Error(`Error updating ${module} record. ${err.message}`);
    }
}

export async function updateService(recordId, data, user) {
    try {
        const { error } = validateUpdateBlog.validate(data);
        if (error) {
            throw new Error(`Invalid request. ${error.message}`);
        }

        let { coverImage } = data;

        const returnedBlog = await Blog.findById(recordId).exec();
        if (!returnedBlog) throw new Error(`${module} record not found.`);
        if (`${returnedBlog.createdBy}` !== user.id || (user.userType !== 'ADMIN')) {
            throw new Error(`user ${user.email} does not have the permission to update`);
        }

        if(returnedBlog.title !== data.title){
            data.slug = slugifyText(data.title);
        }

        // Run the create media service to create blog post media.
        if(coverImage && !coverImage.includes('cloudinary.com')){
            const uploadResult = await uploadImage(coverImage);
            data.coverImage = uploadResult.url;
        }else {
            console.log('no coverImage image found');
        }

        // const { media } = data;
        // if( media ){
        //     const uploadResult = await uploadImage(resume);
        //     data.resume = uploadResult.url;
        // }else {
        //     console.log('no resume image found');
        // }
      
        const result = await Blog.findOneAndUpdate({ _id: recordId }, data, {
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

export async function publishService(recordId, data, user) {
    try {
        const { error } = validatePublishData.validate(data);
        if (error) {
            throw new Error(`Invalid request. ${error.message}`);
        }

        const returnedBlog = await Blog.findById(recordId).exec();
        if (!returnedBlog) throw new Error(`${module} record not found.`);
        if (`${returnedBlog.createdBy}` !== user.id || (user.userType !== 'ADMIN')) {
            throw new Error(`user ${user.email} does not have the permission to update`);
        }

        const result = await Blog.findOneAndUpdate({ _id: recordId }, data, {
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