import aqp from "api-query-params";
import Users from "../users/model.js";
import { generateModelCode, setLimit } from "../../util/index.js";
import Comment, { validateLikePost, validatePostComment, validateUpdateComment } from "./model.js";
import Blog from "../blog/model.js";

const module = 'Commnet';

export const fetchAllService = async (query) => {
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

        const total = await Comment.countDocuments(filter).exec();

        const result = await Comment.find(filter)
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


export const fetchByBlogIdService = async (blogId, query) => {
    try {
        let { filter, skip, population, sort, projection } = aqp(query);
        let { limit } = aqp(query);
        limit = setLimit(limit);
        if (!filter.deleted) filter.deleted = 0;

        const result = await Comment.find({ blog: blogId })
            .populate(population)
            .sort(sort)
            .limit(limit)
            .skip(skip)
            .select(projection)
            .exec();
        
        if(!result){
            throw new Error(`${module} record not found`);
        }
        const msg = `comment retrieved successfully!`;
        return { payload: result, total: 1, count: 1, msg, skip, limit, sort };

    }catch ( err ) {
        throw new Error(`Error retrieving ${module} record ${err.message}`);
    }
};

export const postCommentService = async (data) => {
    try {
        const { error } = validatePostComment.validate(data);
        if(error) throw new Error(`${error.message}`);

        let { isGuest, user } = data;

        if(!isGuest && user){
            const returnedUser = await Users.findById(user).exec();
            if(!returnedUser) throw new Error('User not found');
            data.commenterName = `${returnedUser.firstName} ${returnedUser.lastName}`;
            data.commenterEmail = returnedUser.email;
        };

        data.code = await generateModelCode(Comment);

        const newRecord = new Comment(data);
        const result = await newRecord.save();
        if(!result) throw new Error(`${module} record not found`);



        return result;

    }catch (err) {
        throw new Error(`Error creating ${module} record. ${err.message}`);
    }
}

export const createCommentService = async (data) => {
    try {
        const { error } = validatePostComment.validate(data);
        if(error) throw new Error(`${error.message}`);

        let { isGuest, user, blog } = data;

        const blogPost = await Blog.findById(blog).exec();
        if(!blogPost){
            throw new Error(`Blog post does not exist`);
        }

        if(!isGuest && user){
            const returnedUser = await Users.findById(user).exec();
            if(!returnedUser) throw new Error('User not found');
            data.commenterName = `${returnedUser.firstName} ${returnedUser.lastName}`;
            data.commenterEmail = returnedUser.email;
        };

        data.code = await generateModelCode(Comment);

        const newRecord = new Comment(data);
        const result = await newRecord.save();
        if(!result) throw new Error(`${module} record not found`);

        if(blogPost.enableComments){
            const comments = blogPost.comments;
    
            // Update blog post with comments.
            const updatedBlog = await Blog.findOneAndUpdate(
                {_id: blog },
                { comments: [...comments, result.id]},
                { new: true }
            ).exec();
    
            if(!updatedBlog) console.log('failed to update blog post comments')
        }

        return result;

    }catch (err) {
        throw new Error(`Error creating ${module} record. ${err.message}`);
    }
}

export async function likeCommentService(data) {
    try {
        const { error } = validateLikePost.validate(data);
        if (error) {
            throw new Error(`Invalid request. ${error.message}`);
        }

        let { like, type, commentId } = data;

        const returnedComment = await Comment.findById(commentId).exec();
        if (!returnedComment) throw new Error(`${module} record not found.`);
        
      
        const result = await Comment.findOneAndUpdate(
            { _id: commentId },
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
        const { error } = validateUpdateComment.validate(data);
        if (error) {
            throw new Error(`Invalid request. ${error.message}`);
        }

        const returnedComment = await Comment.findById(recordId).exec();
        if (!returnedComment) throw new Error(`${module} record not found.`);
        if (`${returnedComment.createdBy}` !== user.id || (user.userType !== 'ADMIN')) {
            throw new Error(`user ${user.email} does not have the permission to update`);
        }
      
        const result = await Comment.findOneAndUpdate({ _id: recordId }, data, {
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
        const result = await Comment.findOneAndRemove({ _id: recordId });
        if (!result) {
            throw new Error(`Comment record not found.`);
        }
        return result;
    } catch (err) {
        throw new Error(`Error deleting Comment record. ${err.message}`);
    }
}