import { fail, success, response } from "../../util/response.js"
import {
  fetchService,
  createService,
  deleteService,
  fetchPublicService,
  createOrderService,
  updateClientDetailService,
} from './services.js';


export const fetchHandler = async (req, res) => {
  try{
      const result = await fetchService(req.query);
      return response(res, 200, result);
  } catch ( err ) {
      return fail(res, 400, `${err.message}`);
  }
}

export const fetchPublicHandler = async (req, res) => {
  try{
      const result = await fetchPublicService(req.query);
      return response(res, 200, result);
  } catch ( err ) {
      return fail(res, 400, `${err.message}`);
  }
}

export const createHandler = async (req, res) => {
  try {
    const result = await createService(req.body);
    return success(res, 201, result);

  } catch (err) {
    return fail(res, 400, `${err.message}`)
  }
}

export const createOrderHandler = async (req, res) => {
  try {
    const result = await createOrderService(req);
    return success(res, 201, result);
  } catch (err) {
    return fail(res, 400, `${err.message}`)
  }
}

export const clientDetailsHandler = async (req, res) => {
  try {
    const { recordId } = req.params;
    const result = await updateClientDetailService(recordId, req.body);
    return success(res, 200, result);

  } catch (err) {
    return fail(res, 400, `${err.message}`) 
  }
}

export const deleteHandler = async (req, res) => {
  try {
    const { recordId } = req.params;
    const result = await deleteService(recordId);
    return success(res, 200, result);
  } catch (err) {
    return fail(res, 400, `${err.message}`);
  }
}