const {
  generateAccessToken,
  generateRefreshToken,
  hashToken,
} = require("../utils/tokens");

const sanitizeUser = (user) => ({
  _id: user._id,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  isEmailVerified: user.isEmailVerified,
  name: [user.firstName, user.lastName].filter(Boolean).join(" "),
});

const issueAuthTokens = async (user) => {
  const accessToken = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  user.refreshTokenHash = hashToken(refreshToken);
  await user.save();

  return {
    user: sanitizeUser(user),
    accessToken,
    refreshToken,
  };
};

module.exports = {
  issueAuthTokens,
  sanitizeUser,
};
