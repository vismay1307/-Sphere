const crypto = require("crypto");

const OTP_LENGTH = 6;
const OTP_EXPIRY_MINUTES = Number(process.env.OTP_EXPIRY_MINUTES || 10);

const generateOtp = () => {
  const min = 10 ** (OTP_LENGTH - 1);
  const max = 10 ** OTP_LENGTH - 1;

  return String(Math.floor(Math.random() * (max - min + 1)) + min);
};

const hashOtp = (otp) =>
  crypto.createHash("sha256").update(String(otp)).digest("hex");

const getOtpExpiryDate = () =>
  new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

module.exports = {
  OTP_EXPIRY_MINUTES,
  generateOtp,
  getOtpExpiryDate,
  hashOtp,
};
