import paypal from 'paypal-rest-sdk';
import dotenv from 'dotenv';
import { PAYPAL } from '../constant';

dotenv.config();

PAYPAL_MODE = 'sandbox'
// PAYPAL_MODE = 'live'

paypal.configure({
  mode: process.env.PAYPAL_MODE, //sandbox or live
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_CLIENT_SECRET,

  openid_client_id: process.env.PAYPAL_CLIENT_ID,
  openid_secret: process.env.PAYPAL_CLIENT_SECRET,

    // Your OpenID redirect URI must be the same value as your app's return URL. It is configured in the PayPal Developer Dashboard ( https://developer.paypal.com/developer/applications/ ).
  openid_redirect_uri: PAYPAL.REDIRECT_URLS.RETURN_URL
});

export default paypal;