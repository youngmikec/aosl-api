import aqp from "api-query-params";
import { generateModelCode, setLimit } from "../../util/index.js";
import Invoice, { validateClientDetails, validateCreate } from './model.js';


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