import axios from 'axios';
import dotenv from 'dotenv';
import qs from 'qs';
import paypal from '../config/paypal.js';
import { PAYPAL } from '../constant/index.js';

dotenv.config();

const PAYPAL_BASE_URL_V1 = process.env.PAYPAL_BASE_URL + '/v1';
const PAYPAL_BASE_URL_V2 = process.env.PAYPAL_BASE_URL + '/v2';

export const createPaypalPayment = async (transactionPayload, authToken) => {
  const payload = {
    intent: "sale",
    payer: {
      payment_method: "paypal"
    },
    redirect_urls: {
      return_url: PAYPAL.REDIRECT_URLS.RETURN_URL,
      cancel_url: PAYPAL.REDIRECT_URLS.CANCLE_URL
    },
    transactions: transactionPayload
  };

  try {
    let response;
    paypal.payment.create(payload, (error, payment) => {
      if (error) {
        throw error;
      }else {
        response = payment;
        console.log('Payment successful');
        console.log(payment);
        return response;
      }
    })
  } catch (error) {
    throw new Error(error.message);
  }
};

export const createPaypalOrder = async (data, authorization) => {
  try {
    const url = `${PAYPAL_BASE_URL_V2}/checkout/orders`;
    const response = await axios.post(url, data, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `${authorization}`
      }
    });
    if(!response){
      throw new Error('Error occured while placing an order');
    }
    return response;
  }catch(err){
    console.log('Error Paypal Response Error', err.message);
  }
};

export const PaypalAuthorizationService = async () => {
  try {
    const url = `${PAYPAL_BASE_URL_V1}/oauth2/token`;
    const postData = qs.stringify({
      grant_type: process.env.PAYPAL_AUTH_GRANT_TYPE,
      ignoreCache: true,
    });

    const authHeader = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString('base64');

    const response = await axios.post(url, postData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${authHeader}`
      }
    });

    if(!response) {
      throw new Error('Error occured while authorizing Paypal');
    }
    return response;

  } catch(err){
    console.error('Error making POST request:', err.message);
  }
}

export const checkPaypalOrderStatus = async (orderId, authorization) => {
  try {
    // Step 1: Check the order status
    const getOrderUrl = `${PAYPAL_BASE_URL_V2}/checkout/orders/${orderId}`;
    const getOrderResponse = await axios.get(getOrderUrl, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authorization,
      }
    });
    
    return getOrderResponse;

  } catch (err) {
    throw new Error('Error checking and capturing PayPal order:', err.message);
  }
};

export const capturePaypalOrder = async (orderId, authorization) => {
  try{
    const captureUrl = `${PAYPAL_BASE_URL_V2}/checkout/orders/${orderId}/capture`;
      const captureResponse = await axios.post(captureUrl, {}, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authorization,
        }
      });
      
      return captureResponse.data;
  }catch(err){
    throw new Error(err.message);
  }
}
