import Brevo from '@getbrevo/brevo';
let defaultClient = Brevo.ApiClient.instance;

// Configure API key authorization: api-key
let apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = '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';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
// apiKey.apiKeyPrefix = 'Token';

// Configure API key authorization: partner-key
// let partnerKey = defaultClient.authentications['partner-key'];
// partnerKey.apiKey = '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';
// Uncomment the following line to set a prefix for the API key, e.g. "Token" (defaults to null)
// partnerKey.apiKeyPrefix = 'Token';

let apiInstance = new Brevo.TransactionalEmailsApi();

export const sendBrevoMail = () => {
    let sendSmtpEmail = new Brevo.SendSmtpEmail({
    
         "sender":{ "email":"michaelozor15@gmail.com", "name":"Michael"},
         "subject":"This is my default subject line",
         "htmlContent":"<!DOCTYPE html><html><body><h1>My First Heading</h1><p>My first paragraph.</p></body></html>",
         "params":{
            "greeting":"This is the default greeting",
            "headline":"This is the default headline"
         },
       "messageVersions":[
         //Definition for Message Version 1 
        {
            "sender":{ "email":"michaelozor15@gmail.com", "name":"Michael"},
            "to":[
                {
                    "email":"michaelozor15@gmail.com",
                    "name":"Michael"
                },
                {
                    "email":"youngmikec15@gmail.com",
                    "name":"Michael"
                }
            ],
            "htmlContent":"<!DOCTYPE html><html><body><h1>Modified header!</h1><p>This is still a paragraph</p></body></html>",
            "subject":"We are happy to be working with you"
        },
         
        //  // Definition for Message Version 2
        //   {
        //      "to":[
        //         {
        //             "email":"michaelozor15@gmail.com",
        //             "name":"Michael"
        //         },
        //         {
        //         "email":"youngmikec15@gmail.com",
        //         "name":"Michael"
        //         }
        //      ]
        //   }
       ]
    
    }); // SendSmtpEmail | Values to send a transactional email
    
    apiInstance.sendTransacEmail(sendSmtpEmail).then(function(data) {
      console.log('API called successfully. Returned data: ' + data);
    }, function(error) {
      console.error('error', error);
    });
}

