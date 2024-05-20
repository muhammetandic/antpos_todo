import { EMAIL_TEMPLATES } from "../enums/email-templates.js";

export type MailParameters = {
  to: string;
  subject: string;
  template: EMAIL_TEMPLATES;
  context?: object;
};
