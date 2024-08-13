import { 
    fetchService,
    createOrderService,
    updateService,
    deleteService,
    createIvoiceService,
    createPaymentService,
    updatePublicService
} from "./service.js";
import { fail, response, success } from "../../util/response.js"


export const fetchHandler = async (req, res) => {
    try {  
        const result = await fetchService(req.query);
        return response(res, 200, result);
    }catch (err) {
        return fail(res, 400, `${err.message}`);
    }
}

export const createOrderHandler = async (req, res) => {
    try {
        const result = await createOrderService(req.body);
        return success(res, 201, result);
    } catch ( err ) {
        return fail(res, 400, `${err.message}`);
    }
}

export const createInvoiceHandler = async (req, res) => {
    try {
        const result = await createIvoiceService(req.body);
        return success(res, 201, result);
    } catch ( err ) {
        return fail(res, 400,  `${err.message}`);
    }
}

export const createPaymentHandler = async (req, res) => {
    try {
        const result = await createPaymentService(req.body);
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

export const updatePublicHandler = async (req, res) => {
    try {
        const { recordId } = req.params;
        const result = await updatePublicService(recordId, req.body, req.user);
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