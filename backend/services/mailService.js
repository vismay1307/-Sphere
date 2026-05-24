const nodemailer = require("nodemailer");

let transporter;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
  }

  return transporter;
};

const ensureMailConfig = () => {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    throw new Error(
      "Missing Gmail mail configuration. Set GMAIL_USER and GMAIL_APP_PASSWORD."
    );
  }
};

const sendOtpEmail = async ({ email, firstName, otp, subject, heading, text }) => {
  ensureMailConfig();

  await getTransporter().sendMail({
    from: `"MatSphere" <${process.env.GMAIL_USER}>`,
    to: email,
    subject,
    html: `
      <div style="font-family: Arial, sans-serif; background: #f5f5f5; padding: 24px;">
        <div style="max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 16px; padding: 32px; border: 1px solid #e5e7eb;">
          <p style="margin: 0 0 12px; color: #111827; font-size: 16px;">Hi ${firstName || "there"},</p>
          <h1 style="margin: 0 0 16px; color: #111827; font-size: 24px;">${heading}</h1>
          <p style="margin: 0 0 24px; color: #4b5563; font-size: 15px; line-height: 1.6;">${text}</p>
          <div style="margin: 0 0 24px; background: #111827; color: #ffffff; font-size: 28px; letter-spacing: 10px; text-align: center; padding: 18px; border-radius: 12px; font-weight: 700;">
            ${otp}
          </div>
          <p style="margin: 0; color: #6b7280; font-size: 13px;">This OTP expires in ${process.env.OTP_EXPIRY_MINUTES || 10} minutes.</p>
        </div>
      </div>
    `,
  });
};

module.exports = { sendOtpEmail };
