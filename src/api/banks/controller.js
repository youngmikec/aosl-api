import { fetchService } from "./service.js";
import { fail, response } from "../../util/response.js";

export const fetchHandler = async (req, res) => {
  try {
    const entity = await fetchService(req.query);
    return response(res, 200, entity);
  } catch (err) {
    //   loging(module, req, err);
    return fail(res, 400, `${err.message}`);
  }
};
