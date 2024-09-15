import { fail, success, response } from "../../util/response.js";
import {
    fetchAllService,
    fetchByBlogIdService,
    postCommentService,
    createCommentService,
    likeCommentService,
    updateService,
    deleteService
} from './services.js';


export const fetchByBlogIdHandler = async (req, res) => {
    try{
        const { recordId } = req.params;
        const result = await fetchByBlogIdService(recordId, req.query);
        return response(res, 200, result);
    } catch ( err ) {
        return fail(res, 400, `${err.message}`);
    }
}
export const fetchAllHandler = async (req, res) => {
    try{
        const result = await fetchAllService(req.query);
        return response(res, 200, result);
    } catch ( err ) {
        return fail(res, 400, `${err.message}`);
    }
}
export const createCommentHandler = async (req, res) => {
    try {
        const result = await createCommentService(req.body);
        return success(res, 201, result);
    } catch ( err ) {
        return fail(res, 400, `${err.message}`);
    }
}

export const likeCommentHandler = async (req, res) => {
    try {
        const result = await likeCommentService(req.body);
        return success(res, 201, result);
    } catch ( err ) {
        return fail(res, 400, `${err.message}`);
    }
}

export const postCommentHandler = async (req, res) => {
    try {
        console.log('post comment')
        const result = await postCommentService(req.body);
        return success(res, 201, result);
    } catch ( err ) {
        return fail(res, 400, `${err.message}`);
    }
}
export const updateHandler = async (req, res) => {
    try {
        const { recordId } = req.params;
        const result = await updateService(recordId, req.body, req.user);
        return success(res, 200, result);
    } catch (err) {
    //   loging(module, req, err);
        return fail(res, 400, `${err.message}`);
    }
}
export const publishHandler = async (req, res) => {
    try {
        const { recordId } = req.params;
        const result = await publishService(recordId, req.body, req.user);
        return success(res, 200, result);
    } catch (err) {
    //   loging(module, req, err);
        return fail(res, 400, `${err.message}`);
    }
}

export const deleteHandler = async (req, res) => {
    try {
        const result = await deleteService(req.params.recordId);
        return success(res, 200, result);
    } catch (err) {
        return fail(res, 400, `${err.message}`);
    }
}