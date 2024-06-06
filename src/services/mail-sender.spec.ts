import { MailParameters } from "./types/mail-sender";
import { EMAIL_TEMPLATES } from "./enums/email-templates";
import { sendEmail } from "./mail-sender";

jest.mock("nodemailer", () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn(),
    use: jest.fn(),
  }),
}));

describe("sendEmail", () => {
  const parameters: MailParameters = {
    to: "test@example.com",
    subject: "Test email",
    template: EMAIL_TEMPLATES.SIGNUP,
    context: { name: "Test User" },
  };

  it("should log a message when the email is sent successfully", async () => {
    const logSpy = jest.spyOn(console, "log");

    await sendEmail(parameters);

    expect(logSpy).toHaveBeenCalledTimes(1);
    expect(logSpy).toHaveBeenCalledWith("[nodemailer]: email sent successfully");
  });
});
