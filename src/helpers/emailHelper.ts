import nodemailer from "nodemailer";
import config from "../config";
import logger from "../config/logger";

interface ISendEmail {
  to: string;
  subject: string;
  html: string;
}

const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: Number(config.email.port),
  secure: false,
  auth: {
    user: config.email.username,
    pass: config.email.password,
  },
});

const sendEmail = async (values: ISendEmail) => {
  try {
    const info = await transporter.sendMail({
      from: `"Servi" ${config.email.from}`,
      to: values.to,
      subject: values.subject,
      html: values.html,
    });

    logger.info("Mail send successfully", info.accepted);
  } catch (error) {
    logger.error("Email", error);
  }
};

export const emailHelper = {
  sendEmail,
};
