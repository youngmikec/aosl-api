import { PaypalAuthorizationService } from "../services/paypal-service.js";

export const AuthorizePaypal = async (req, res, next) => {
    try {
        const authResponse = await PaypalAuthorizationService();
        if(authResponse){
            const { access_token, token_type } = authResponse.data;
            // return the authorization type and token;
            const authString = `${token_type} ${access_token}`;
            req.headers['paypalAuthToken'] = `${authResponse.data.token_type} ${authResponse.data.access_token}`
            next();
        }else {
            next();
        }
    }catch (err) {
        next();
    }
}