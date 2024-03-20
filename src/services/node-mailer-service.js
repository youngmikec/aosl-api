import nodemailer from 'nodemailer';

// Set up the Nodemailer transporter
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
}
});


export const nodeMailerService = async (senderEmail, recipientEmail, subject, message) => {
    const mailOptions = {
        from: `"All Occupation Services Ltd" <${senderEmail}>`, // sender address
        to: `${recipientEmail}`, // list of receivers
        subject: `${subject}`, // Subject line
        // text: "Hello world?", // plain text body
        html: `<b>${message}</b>`, // html body
    };
    
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error occurred: ', error.message);
            return error.message;
        }
        console.log('Email sent: ' + info.response);
        return info.response;
    })
}
