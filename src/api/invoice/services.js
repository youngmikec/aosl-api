import aqp from "api-query-params";
import { generateCode, generateModelCode, setLimit } from "../../util/index.js";
import Invoice, { validateClientDetails, validateCreate, validateCreateOrder } from './model.js';
import { capturePaypalOrder, checkPaypalOrderStatus, createPaypalOrder } from "../../services/paypal-service.js";
import { PAYPAL, INVOICE } from "../../constant/app-constants.js";
import { createOrderService } from "../orders/service.js";
import Orders from "../orders/model.js";
import { configurePaypalResponseMessage } from "../../util/response.js";
import { UserInvoiceEmailTemplate } from "../../constant/email-templates.js";
import { sendMailService } from "../../services/send-mail.js";


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
    const { clientEmail, clientName, clientPhone } = data;

    const code = await generateModelCode(Invoice);
    if(!code){
      throw new Error(`Error generating code`);
    }
    data.invoiceCode = `AOSL-INV-${code}`;
    data.invoiceUrl = `https://aosl-online.com/invoice/${data.invoiceCode}`;

    const newInvoice = new Invoice(data);
    const result = await newInvoice.save();
    if (!result) throw new Error(`${module} record not found`);


    // send mail to user.
    await sendMailService(
      result.clientEmail,
      `AOSL Service Request Invoice`,
      UserInvoiceEmailTemplate(result, 'user')
    );

    // Send mail to admin.
    await sendMailService(
      ['info@aosl-online.com', 'admin@aosl-online.com'],
      `Invoice For ${result.clientName} Service Request`,
      UserInvoiceEmailTemplate(result, 'admin')
    );

    return result;

  } catch (err) {
    throw new Error(`Error creating Invoice. ${err.message}`);
  }
}

export const createInvoiceOrderService = async (req) => {
  try {
    const data = req.body;
    const { paypalAuthToken, accessToken } = req.headers;

    const { error } = validateCreateOrder.validate(data);
    if(error) throw new Error(`${error.message}`);

    const { purchaseItems, totalAmount, currency_code, invoiceCode, clientEmail } = data;

    // Get the invoice record and check if the due date has expired.
    // If the due has passed throw an error to notify the user to contact admin for a new invoice.
    // Send mail to the user to contact admin to generate a new invoice.
  

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
    };
    
    // Update invoice status with 
    const updatedInvoice = await Invoice.findOneAndUpdate({ invoiceCode }, { status: INVOICE.STATUS.PAID }).exec();
    if(!updatedInvoice){
      console.log('Error occured while updating invoice record');
    }
    
    const payload = orderResponse.data; 

    const saveOrderPayload = {
      userDetails: {
        email: updatedInvoice.clientEmail,
        name: updatedInvoice.clientName,
        phoneNumber: updatedInvoice.clientPhone,
        address: updatedInvoice.clientAddress
      },
      amount: totalAmount,
      invoiceUrl: data.invoiceUrl,
      status: payload.status,
      orderId: payload.id,
      checkoutUrls: payload.links,
      invoice: updatedInvoice._id,
      // orderCode: generateModelCode(Orders)
    };

    const saveOrderResponse = await createOrderService(saveOrderPayload);
    if(!saveOrderResponse){
      console.log('Failed to save order to Db');
    }

    // Update invoice with order Id 
    const savedResponse = await Invoice.findOneAndUpdate({ invoiceCode }, { paymentOrder: saveOrderResponse._id }).exec();
    if(!savedResponse){
      console.log('Error occured while updating invoice record with order Id');
    }


    return {
      accessToken,
      ...orderResponse.data
    };

  } catch (err) {
    throw new Error(`Error occurred while creating order`)
  }
}

export const confirmAndCaptureOrderService = async (req) => {
  try {
    const { paypalAuthToken } = req.headers;
    const { orderId } = req.query;
    
    const orderStatusResponse = await checkPaypalOrderStatus(orderId, paypalAuthToken);
    let confirmOrderResponse;
    if(orderStatusResponse){
      const { status } = orderStatusResponse.data;
      if(status === 'APPROVED'){
        confirmOrderResponse = await capturePaypalOrder(orderId, paypalAuthToken);
        // update order in local db with the paypal status.
        const payload = { 
          status: 'APPROVED',
          payer: confirmOrderResponse.payer
        };
        const savedResponse = await Orders.findOneAndUpdate({ orderId }, {...payload}).exec();
        if(!savedResponse){
          console.log('Error occured while updating order status')
        }
      }
      if(status === 'COMPLETED'){
        // update order and return the response.
        const savedResponse = await Orders.findOneAndUpdate({ orderId }, { status: 'COMPLETED'}).exec();
        if(!savedResponse){
          console.log('Error occured while updating order status')
        }
      }
    }
    if(confirmOrderResponse){
      const { id, status, payer } = confirmOrderResponse;
      return {
        paypalOrderId: id,
        orderStatus: status,
        payer: payer,
        message: configurePaypalResponseMessage(status, payer)
      };
    }else {
      const { id, status, payer } = orderStatusResponse.data;
      return {
        id,
        status,
        payer,
        message: configurePaypalResponseMessage(status, payer)
      };
    }
  }catch(err) {
    throw new Error(`Error updating Invoice. ${err.message}`);
  }
};



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
};



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
};