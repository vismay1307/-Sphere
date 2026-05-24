const jwt = require("jsonwebtoken");
const PendingUser = require("../models/PendingUser");
const User = require("../models/User");
const { issueAuthTokens, sanitizeUser } = require("../services/authService");
const { sendOtpEmail } = require("../services/mailService");
const { generateOtp, getOtpExpiryDate, hashOtp } = require("../utils/otp");
const {
  REFRESH_TOKEN_SECRET,
  generateAccessToken,
  generateRefreshToken,
  hashToken,
} = require("../utils/tokens");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

const normalizeEmail = (email) => email.trim().toLowerCase();
const validatePassword = (password) => passwordRegex.test(password);
const buildDevOtpPayload = (otp) =>
  process.env.NODE_ENV === "production" ? {} : { otp };

const requestSignupOtp = async (req, res) => {
  try {
    const { firstName, lastName = "", email, password, confirmPassword } = req.body;

    if (!firstName || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "Required fields are missing" });
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Enter a valid email address" });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters and include uppercase, lowercase, number, and special character",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const normalizedEmail = normalizeEmail(email);
    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const otp = generateOtp();

    await PendingUser.findOneAndUpdate(
      { email: normalizedEmail },
      {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: normalizedEmail,
        password,
        otpHash: hashOtp(otp),
        otpExpiresAt: getOtpExpiryDate(),
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );

    await sendOtpEmail({
      email: normalizedEmail,
      firstName: firstName.trim(),
      otp,
      subject: "MatSphere signup OTP",
      heading: "Verify your MatSphere account",
      text: "Use this OTP to finish your signup and activate your account.",
    });

    res.status(200).json({
      message: "OTP sent to your email",
      email: normalizedEmail,
      ...buildDevOtpPayload(otp),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const verifySignupOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const normalizedEmail = normalizeEmail(email);
    const pendingUser = await PendingUser.findOne({ email: normalizedEmail });

    if (!pendingUser) {
      return res
        .status(404)
        .json({ message: "No signup request found for this email" });
    }

    if (pendingUser.otpExpiresAt < new Date()) {
      await PendingUser.deleteOne({ _id: pendingUser._id });
      return res.status(400).json({ message: "OTP expired. Request a new OTP." });
    }

    if (pendingUser.otpHash !== hashOtp(otp)) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      await PendingUser.deleteOne({ _id: pendingUser._id });
      return res.status(409).json({ message: "User already exists" });
    }

    const user = await User.create({
      firstName: pendingUser.firstName,
      lastName: pendingUser.lastName,
      email: pendingUser.email,
      password: pendingUser.password,
      isEmailVerified: true,
    });

    await PendingUser.deleteOne({ _id: pendingUser._id });

    const authPayload = await issueAuthTokens(user);

    res.status(201).json({
      message: "Signup completed successfully",
      ...authPayload,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { firstName, email, password } = req.body;

    if (!firstName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const normalizedEmail = normalizeEmail(email);
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (user.firstName.toLowerCase() !== firstName.trim().toLowerCase()) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({ message: "Email is not verified" });
    }

    const authPayload = await issueAuthTokens(user);

    res.status(200).json({
      message: "Login successful",
      ...authPayload,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const requestForgotPasswordOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Enter a valid email address" });
    }

    const normalizedEmail = normalizeEmail(email);
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = generateOtp();
    user.passwordResetOtpHash = hashOtp(otp);
    user.passwordResetOtpExpiresAt = getOtpExpiryDate();
    await user.save();

    await sendOtpEmail({
      email: normalizedEmail,
      firstName: user.firstName,
      otp,
      subject: "MatSphere password reset OTP",
      heading: "Reset your MatSphere password",
      text: "Use this OTP to verify your password reset request.",
    });

    res.status(200).json({
      message: "Password reset OTP sent",
      email: normalizedEmail,
      ...buildDevOtpPayload(otp),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword, confirmPassword } = req.body;

    if (!email || !otp || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!validatePassword(newPassword)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters and include uppercase, lowercase, number, and special character",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const normalizedEmail = normalizeEmail(email);
    const user = await User.findOne({ email: normalizedEmail });

    if (!user || !user.passwordResetOtpHash || !user.passwordResetOtpExpiresAt) {
      return res.status(400).json({ message: "No password reset request found" });
    }

    if (user.passwordResetOtpExpiresAt < new Date()) {
      user.passwordResetOtpHash = null;
      user.passwordResetOtpExpiresAt = null;
      await user.save();
      return res.status(400).json({ message: "OTP expired. Request a new OTP." });
    }

    if (user.passwordResetOtpHash !== hashOtp(otp)) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    user.password = newPassword;
    user.passwordResetOtpHash = null;
    user.passwordResetOtpExpiresAt = null;
    user.refreshTokenHash = null;
    await user.save();

    const authPayload = await issueAuthTokens(user);

    res.status(200).json({
      message: "Password reset successful",
      ...authPayload,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const refreshToken = async (req, res) => {
  try {
    const { refreshToken: providedRefreshToken } = req.body;

    if (!providedRefreshToken) {
      return res.status(400).json({ message: "Refresh token is required" });
    }

    const decoded = jwt.verify(providedRefreshToken, REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || !user.refreshTokenHash) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    if (user.refreshTokenHash !== hashToken(providedRefreshToken)) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    const accessToken = generateAccessToken(user._id);
    const nextRefreshToken = generateRefreshToken(user._id);

    user.refreshTokenHash = hashToken(nextRefreshToken);
    await user.save();

    res.status(200).json({
      accessToken,
      refreshToken: nextRefreshToken,
      user: sanitizeUser(user),
    });
  } catch (error) {
    res.status(401).json({ message: "Refresh token expired or invalid" });
  }
};

const logout = async (req, res) => {
  try {
    const { refreshToken: providedRefreshToken } = req.body;

    if (providedRefreshToken) {
      const decoded = jwt.decode(providedRefreshToken);
      if (decoded?.id) {
        await User.findByIdAndUpdate(decoded.id, { refreshTokenHash: null });
      }
    }

    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(sanitizeUser(user));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  requestSignupOtp,
  verifySignupOtp,
  login,
  requestForgotPasswordOtp,
  resetPassword,
  refreshToken,
  logout,
  getMe,
};
