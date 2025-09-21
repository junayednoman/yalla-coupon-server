import fs from "fs";
import { AppError } from "../../classes/appError";
import axios from "axios";
import config from "../../config";
import User from "../user/user.model";
import { TContact } from "./feedback.interface";

const sendFeedback = async (payload: TContact, email: string) => {
  const user = await User.findOne({ email })
  // send email
  const subject = `New contact message - Yalla Coupon`;
  const year = new Date().getFullYear().toString();
  const emailTemplatePath = "./src/app/emailTemplates/contact.html";
  fs.readFile(emailTemplatePath, "utf8", async (err, data) => {
    if (err) throw new AppError(500, err.message || "Something went wrong");
    const emailContent = data
      .replace('{{name}}', user?.name || 'N/A')
      .replace('{{email}}', payload.email)
      .replace('{{subject}}', payload.subject || 'N/A')
      .replace('{{message}}', payload.message)
      .replace('{{year}}', year);

    const emailData = {
      to: config.admin_email,
      subject,
      html: emailContent,
    }

    await axios.post(
      config.send_email_url as string,
      emailData,
    )
  })
};

export const feedbackServices = {
  sendFeedback,
};