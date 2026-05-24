const express = require("express");
const router = express.Router();
const {
  requestSignupOtp,
  verifySignupOtp,
  login,
  requestForgotPasswordOtp,
  resetPassword,
  refreshToken,
  logout,
  getMe,
} = require("../controller/authController");
const { protect } = require("../middleware/authMiddleware");

router.post("/register/request-otp", requestSignupOtp);
router.post("/register/verify-otp", verifySignupOtp);
router.post("/login", login);
router.post("/forgot-password/request-otp", requestForgotPasswordOtp);
router.post("/forgot-password/reset", resetPassword);
router.post("/refresh", refreshToken);
router.post("/logout", logout);
router.get("/me", protect, getMe);

module.exports = router;
