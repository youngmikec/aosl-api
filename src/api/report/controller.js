import { fetchService } from './service.js';
import { fail, response, success } from "../../util/response.js";


export const fetchHandler = async (req, res) => {
    try {
        const result = await fetchService(req.query);
        // return { message: 'success', success: true, payload: result};
        return response(res, 200, result)
    }catch (err) {
        return fail(res, 400, `${err.message}`)
    }
}