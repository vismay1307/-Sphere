const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const ACCESS_TOKEN_SECRET =
  process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET;
const REFRESH_TOKEN_SECRET =
  process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET;

const generateAccessToken = (userId) =>
  jwt.sign({ id: userId, type: "access" }, ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
  });

const generateRefreshToken = (userId) =>
  jwt.sign({ id: userId, type: "refresh" }, REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  });

const hashToken = (value) =>
  crypto.createHash("sha256").update(value).digest("hex");

module.exports = {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  generateAccessToken,
  generateRefreshToken,
  hashToken,
};
