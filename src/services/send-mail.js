import { nodeMailerService } from "./node-mailer-service.js";

export const sendMailService = async (userEmail, subject, message) => {
    try {
      const result = await nodeMailerService(
        "admin@aosl-online.com",
        userEmail,
        subject,
        message
      );
    } catch (err) {
      console.error(err);
    }
};