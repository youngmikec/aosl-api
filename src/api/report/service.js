import aqp from "api-query-params";
import { setLimit } from "../../util/index.js";
import Orders from "../orders/model.js";
import Users from "../users/model.js";

export const fetchService = async (query) => {
    try{ 
        const { filter, population, projection, sort, skip } = aqp(query);

        let { limit } = aqp(query);
        limit = setLimit(10);
        if (!filter.deleted) filter.deleted = 0;
        const totalOrders = await Orders.countDocuments({}).exec();
        const pendingOrders = await Orders.countDocuments({status: 'PENDING', deleted: 0}).exec();
        const declinedOrders = await Orders.countDocuments({status: 'DECLINED', deleted: 0}).exec();
        const completedOrders = await Orders.countDocuments({status: 'COMPLETED', deleted: 0}).exec();
        const recentOrders = await Orders.find({})
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec();

        const users = await Users.countDocuments({}).exec();
        
        const values = await Promise.all([
            totalOrders,
            pendingOrders, 
            declinedOrders,
            completedOrders,
            recentOrders,
            users
        ]);
        
        const result = {
            totalOrders: values[0],
            pendingOrders: values[1],
            declinedOrders: values[2],
            completedOrders: values[3],
            recentOrders: values[4],
            users: values[5]
        }

        const msg = `Reports(s) retrieved successfully!`;
        return { payload: result, total: 1, count: 1, msg, skip, limit, sort };

    }catch(err){
        throw new Error(`${err.message}`);
    }
}

export const fethUserReportService = async (userId) => {
    try{ 
        // const { filter, population, projection, sort, skip } = aqp(query);

        let { limit } = aqp();
        limit = setLimit(10);
        console.log('userId', userId);
        const totalOrders = await Orders.countDocuments({createdBy: userId}).exec();
        const pendingOrders = await Orders.countDocuments({status: 'PROOFED', user: userId, deleted: 0}).exec();
        const declinedOrders = await Orders.countDocuments({status: 'DECLINED', user: userId, deleted: 0}).exec();
        const completedOrders = await Orders.countDocuments({status: 'COMPLETED', user: userId, deleted: 0}).exec();
        const recentOrders = await Orders.find({user: userId})
        .limit(limit)
        .sort({ createdAt: -1 })
        .exec();

        
        const values = await Promise.all([
            totalOrders,
            pendingOrders, 
            declinedOrders,
            completedOrders,
            recentOrders,
        ]);
        
        const result = {
            totalOrders: values[0],
            pendingOrders: values[1],
            declinedOrders: values[2],
            completedOrders: values[3],
            recentOrders: values[4],
        }

        const msg = `Reports(s) retrieved successfully!`;
        return { payload: result, msg, };

    }catch(err){
        throw new Error(`${err.message}`);
    }
}