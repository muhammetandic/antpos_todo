import nodemailer, { Transporter } from "nodemailer";
import hbs, { NodemailerExpressHandlebarsOptions } from "nodemailer-express-handlebars";

const transport: Transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const setMailOptions = (to: string, subject: string, template: string, context?: object) => ({
  from: process.env.MAIL_USER,
  to,
  subject,
  template: template,
  context: {
    ...context,
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

export async function sendEmail(to: string, subject: string, template: string, context: object) {
  transport.use("compile", hbs(handlebarOptions));

  const options = setMailOptions(to, subject, template, context);

  await transport.sendMail(options);

  console.log("[nodemailer]: email sent successfully");
}
