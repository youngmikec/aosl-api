import { 
    fetchService,
    createService,
} from "./service";
import { fail, response, success } from "../../util/response";



export const fetchHandler = async (req, res) => {
    try{
        const result = await fetchService(req.query);
        return response(res, 200, result);
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