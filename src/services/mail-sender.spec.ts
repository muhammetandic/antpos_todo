import nodemailer from "nodemailer";
import { sendEmail } from "./mail-sender.js";
import { EMAIL_TEMPLATES } from "./enums/email-templates.js";

jest.mock("nodemailer");

describe("sendEmail", () => {
  const to = "a@a.com";
  const subject = "test";

  it("should send an email with correct parameters", async () => {
    const template = EMAIL_TEMPLATES.FORGOTTEN_PASSWORD;
    const context = {
      name: "test",
      email: "a@a.com",
      code: "123456",
      token: "987456321",
    };

    const mockedTransporter = {
      sendMail: jest.fn(),
      use: jest.fn(), // Mock the use method
    };

    const transport = jest.fn().mockReturnValue(mockedTransporter);

    await sendEmail({ to, subject, template, context });

    expect(nodemailer.createTransport).toHaveBeenCalledWith({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    expect(mockedTransporter.use).toHaveBeenCalled(); // Ensure use method is called
    expect(mockedTransporter.sendMail).toHaveBeenCalledWith({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html: expect.any(String), // Assuming you're sending HTML content
    });
  });
});
