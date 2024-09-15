import { fail, success, response } from "../../util/response.js"
import {
    publicFetchService,
    adminFetchService,
    likeBlogPostService,
    createService,
    updateService,
    publishService,
    deleteService
} from './services.js';

export const publicFetchHandler = async (req, res) => {
    try{
        const result = await publicFetchService(req.query);
        return response(res, 200, result);
    } catch ( err ) {
        return fail(res, 400, `${err.message}`);
    }
}
export const adminFetchHandler = async (req, res) => {
    try{
        const result = await adminFetchService(req.query);
        return response(res, 200, result);
    } catch ( err ) {
        return fail(res, 400, `${err.message}`);
    }
}

export const likeBlogPostHandler = async (req, res) => {
    try {
        const result = await likeBlogPostService(req.body);
        return success(res, 201, result);
    } catch ( err ) {
        return fail(res, 400, `${err.message}`);
    }
}

export const createHandler = async (req, res) => {
    try {
        const result = await createService(req.body);
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