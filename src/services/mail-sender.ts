import nodemailer, { Transporter } from "nodemailer";
import hbs, { NodemailerExpressHandlebarsOptions } from "nodemailer-express-handlebars";
import { MailParameters } from "./types/mail-sender.js";

const transporter: Transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const setMailOptions = (parameters: MailParameters) => ({
  from: `antpos-todo <process.env.MAIL_USER>`,
  to: parameters.to,
  subject: parameters.subject,
  template: parameters.template,
  context: {
    ...parameters.context,
    app_url: process.env.NODE_ENV === "development" ? "http://localhost:3000" : "https://www.1stweb3.dev",
  },
});

const handlebarOptions: NodemailerExpressHandlebarsOptions = {
  viewEngine: {
    extname: ".html",
    layoutsDir: "src/views/email-templates",
    defaultLayout: "",
  },
  viewPath: "src/views/email-templates",
  extName: ".html",
};

export const sendEmail = async (parameters: MailParameters): Promise<void> => {
  transporter.use("compile", hbs(handlebarOptions));

  const options = setMailOptions(parameters);

  try {
    await transporter.sendMail(options);
    console.log("[nodemailer]: email sent successfully");
  } catch (error) {
    console.log("[nodemailer]: failed to send email", error);
    throw error;
  }
};
