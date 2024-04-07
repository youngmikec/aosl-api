import paypal from '../config/paypal.js';
import { PAYPAL } from '../constant/index.js';


export const createPaypalPayment = async (transactionPayload) => {
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
