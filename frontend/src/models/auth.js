export const signupDefaultValues = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export const loginDefaultValues = {
  firstName: "",
  email: "",
  password: "",
};

export const forgotPasswordDefaultValues = {
  email: "",
  otp: "",
  newPassword: "",
  confirmPassword: "",
};

export const emailValidation = {
  required: "Email is required",
  pattern: {
    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Enter a valid email address",
  },
};

export const passwordValidation = {
  required: "Password is required",
  minLength: {
    value: 8,
    message: "Password must be at least 8 characters",
  },
  pattern: {
    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/,
    message:
      "Use uppercase, lowercase, number, and one special character",
  },
};
