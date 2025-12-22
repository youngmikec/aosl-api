import { HttpStatusCode } from 'axios';
import nodemailer from 'nodemailer';

// Set up the Nodemailer transporter
let transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
}
});


export const nodeMailerService = async (senderEmail, recipientEmails, subject, message, attachments) => {
    // const joinedRecipients = recipientEmails.length > 1 ? recipientEmails.join(',') : recipientEmails[0];
    // const mailOptions = {
    //     from: `"All Occupation Services Ltd" <${senderEmail}>`, // sender address
    //     to: `${joinedRecipients}`, // list of receivers
    //     subject: `${subject}`, // Subject line
    //     // text: "Hello world?", // plain text body
    //     html: `<b>${message}</b>`, // html body
    // };
    
    // transporter.sendMail(mailOptions, (error, info) => {
    //     if (error) {
    //         console.log('Error occurred: ', error.message);
    //         return error.message;
    //     }
    //     console.log('Email sent: ' + info.response);
    //     return info.response;
    // })

  const joinedRecipientEmails = recipientEmails.length > 1 ? recipientEmails.join(',') : recipientEmails[0];
  const serverHost = 'smtp.gmail.com';
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || serverHost,
    port: process.env.SMTP_PORT || 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: `"All Occupation Services Ltd" ${process.env.SMTP_USER}`,
    to: joinedRecipientEmails,
    subject,
    html: message,
  };

  if (attachments?.length > 0) {
    mailOptions.attachments = attachments;
  }
  try {
    const response = await new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          reject(error);
        }
        resolve(info);
      });
    });
    if (response?.messageId) {
      return {
        message: `Nodemailer sent message: ${response.messageId}`,
        code: HttpStatusCode.Ok,
        success: true,
      };
    }
  } catch (ex) {
    return {
      success: false,
      message: 'Email not sent',
      code: HttpStatusCode.BadGateway,
    };
  }
}
