import aqp from "api-query-params";
import { generateCode, generateModelCode, setLimit } from "../../util/index.js";
import Invoice, { validateClientDetails, validateCreate, validateCreateOrder } from './model.js';
import { createPaypalOrder } from "../../services/paypal-service.js";
import { PAYPAL } from "../../constant/app-constants.js";


const module = 'Invoice';

export const fetchService = async (query) => {
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

      const total = await Invoice.countDocuments(filter).exec();

      const result = await Invoice.find(filter)
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
      throw new Error(`Error retrieving ${module} record ${err.message}`);
  }
}


export const fetchPublicService = async (query) => {
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

      const total = await Invoice.countDocuments(filter).exec();

      const result = await Invoice.find(filter)
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
      throw new Error(`Error retrieving ${module} record ${err.message}`);
  }
}

export const createService = async (data) => {
  try {
    const { error } = validateCreate.validate(data);
    if (error) throw new Error(`${error.message}`);
    const code = await generateModelCode(Invoice);
    if(!code){
      throw new Error(`Error generating code`);
    }
    data.invoiceCode = `AOSL-INV-${code}`;
    data.invoiceUrl = `https://aosl-online.com/invoice/${data.invoiceCode}`;

    const newInvoice = new Invoice(data);
    const result = await newInvoice.save();
    if (!result) throw new Error(`${module} record not found`);
    return result;


  } catch (err) {
    throw new Error(`Error creating Invoice. ${err.message}`);
  }
}

export const createOrderService = async (req) => {
  try {
    const data = req.body;
    const { paypalAuthToken } = req.headers;

    const { error } = validateCreateOrder.validate(data);
    if(error) throw new Error(`${error.message}`);

    const { purchaseItems, totalAmount, currency_code } = data;

    const orderCode = generateCode(5);
    const orderPayload = {
      intent: 'CAPTURE',
      purchase_units: [
        {
          items: purchaseItems.map(item => (
            {
              name: item.name, 
              description: item.description, 
              quantity: item.quantity, 
              unit_amount: {
                value: item.unit_amount,
                currency_code: currency_code
              }
            }
        )),
          amount: {
            currency_code,
            value: `${totalAmount}`,
            breakdown: {
              item_total: {
                currency_code,
                value: `${totalAmount}`
              }
            }
          }
        }
      ],
      application_context: {
        "return_url": PAYPAL.REDIRECT_URLS.RETURN_URL, //"https://example.com/return",
        "cancel_url": PAYPAL.REDIRECT_URLS.RETURN_URL, //"https://example.com/cancel",
        "brand_name": "All Occupation Service Limited",
        "landing_page": "BILLING",
        "user_action": "PAY_NOW"
      }
    }

    const orderResponse = await createPaypalOrder(orderPayload, paypalAuthToken);

    if(!orderResponse){
      throw new Error(`Cannot create order`);
    }

    return {
      ...orderResponse.data
    };

  } catch (err) {
    throw new Error(`Error occurred while creating order`)
  }
}


export const updateClientDetailService = async (recordId, data) => {
  try {
    const { error } = validateClientDetails.validate(data);
    if (error) throw new Error(`Error validating Client Details. ${error.message}`);

    const previousRecord = await Invoice.findOneAndUpdate({ _id: recordId }, data, { new: true }).exec();
    if (!previousRecord) throw new Error(`Invoice record not found.`);
    
    const result = await Invoice.findOneAndUpdate({ _id: recordId }, data, { new: true }).exec();
    return result;

  } catch (err) {
    throw new Error(`Error updating Invoice. ${err.message}`);
  }
}



export async function deleteService(recordId) {
  try {
      const result = await Invoice.findOneAndRemove({ _id: recordId });
      if (!result) {
          throw new Error(`Invoice record not found.`);
      }
      return result;
  } catch (err) {
      throw new Error(`Error deleting Invoice record. ${err.message}`);
  }
}