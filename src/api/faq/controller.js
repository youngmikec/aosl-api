import { fetchService, fetchPublicService, createService, updateService, deleteService } from "./services.js";
import { fail, response, success } from "../../util/response.js";

export const fetchHandler = async (req, res) => {
  try {
    return response(res, 200, await fetchService(req.query));
  } catch (err) {
    return fail(res, 400, `${err.message}`);
  }
};

export const fetchPublicHandler = async (req, res) => {
  try {
    return response(res, 200, await fetchPublicService(req.query));
  } catch (err) {
    return fail(res, 400, `${err.message}`);
  }
};

export const createHandler = async (req, res) => {
  try {
    return success(res, 201, await createService(req.body));
  } catch (err) {
    return fail(res, 400, `${err.message}`);
  }
};

export const updateHandler = async (req, res) => {
  try {
    return success(res, 200, await updateService(req.params.recordId, req.body));
  } catch (err) {
    return fail(res, 400, `${err.message}`);
  }
};

export const deleteHandler = async (req, res) => {
  try {
    return success(res, 200, await deleteService(req.params.recordId));
  } catch (err) {
    return fail(res, 400, `${err.message}`);
  }
};
