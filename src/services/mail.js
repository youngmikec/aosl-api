import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

/**
 * 
 * @param {String} senderEmail 
 * @param {Array of string}  recipientEmail 
 * @param {String} message 
 */

export async function sendMail(senderEmail, recipientEmail, subject, message){
    // generate test account
    let testAccount = await nodemailer.createTestAccount();

    let transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'stmp.gmail.com',
        port: process.env.SMTP_PORT || 465,
        secure: true,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    let info = await transporter.sendMail({
        from: `"Chinos Exchange 👻" <${senderEmail}>`, // sender address
        to: `${recipientEmail}`, // list of receivers
        subject: `${subject}`, // Subject line
        text: "Hello world?", // plain text body
        html: `<b>${message}</b>`, // html body
    });

    
}