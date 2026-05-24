import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AuthInput from "../../components/auth/AuthInput";
import AuthLayout from "../../components/auth/AuthLayout";
import {
  emailValidation,
  forgotPasswordDefaultValues,
  passwordValidation,
} from "../../models/auth";
import { useAuth } from "../../context/AuthContext";

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const { requestForgotPasswordOtp, resetPassword } = useAuth();
  const [otpRequested, setOtpRequested] = useState(false);
  const [devOtp, setDevOtp] = useState("");

  const {
    register,
    handleSubmit,
    getValues,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: forgotPasswordDefaultValues,
    mode: "onTouched",
  });

  const handleRequestOtp = async () => {
    const valid = await trigger("email");
    if (!valid) {
      return;
    }

    try {
      const response = await requestForgotPasswordOtp({ email: getValues("email") });
      setOtpRequested(true);
      setDevOtp(response.otp || "");
      toast.success("OTP sent for password reset");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to send OTP");
    }
  };

  const onSubmit = async (values) => {
    try {
      await resetPassword(values);
      toast.success("Password reset successful");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Password reset failed");
    }
  };

  return (
    <AuthLayout
      title="Reset your password"
      subtitle="Enter the registered email, verify the OTP, then set a new password. The old password is replaced and fresh tokens are issued."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <AuthInput
          label="Email *"
          name="email"
          type="email"
          placeholder="Enter registered email"
          register={register("email", emailValidation)}
          errors={errors}
        />

        <button
          type="button"
          onClick={handleRequestOtp}
          className="w-full rounded-2xl border border-neutral-700 px-4 py-3 text-sm font-semibold text-white transition hover:border-blue-500 hover:text-blue-300"
        >
          Send OTP
        </button>

        {devOtp ? (
          <div className="rounded-2xl border border-blue-500/30 bg-blue-500/10 px-4 py-3 text-sm text-blue-200">
            Dev OTP: <span className="font-semibold tracking-[0.3em]">{devOtp}</span>
          </div>
        ) : null}

        <AuthInput
          label="OTP *"
          name="otp"
          placeholder="Enter OTP"
          disabled={!otpRequested}
          register={register("otp", {
            required: otpRequested ? "OTP is required" : false,
            pattern: {
              value: /^\d{6}$/,
              message: "Enter a valid 6 digit OTP",
            },
          })}
          errors={errors}
        />
        <AuthInput
          label="New password *"
          name="newPassword"
          type="password"
          placeholder="Enter new password"
          disabled={!otpRequested}
          register={register("newPassword", otpRequested ? passwordValidation : {})}
          errors={errors}
        />
        <AuthInput
          label="Confirm new password *"
          name="confirmPassword"
          type="password"
          placeholder="Confirm new password"
          disabled={!otpRequested}
          register={register("confirmPassword", {
            required: otpRequested ? "Confirm password is required" : false,
            validate: (value) =>
              !otpRequested ||
              value === getValues("newPassword") ||
              "Passwords do not match",
          })}
          errors={errors}
        />

        <button
          type="submit"
          disabled={!otpRequested || isSubmitting}
          className="w-full rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Updating..." : "Update Password"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-neutral-400">
        Back to{" "}
        <Link className="font-medium text-blue-400 hover:text-blue-300" to="/login">
          login
        </Link>
      </p>
    </AuthLayout>
  );
};

export default ForgotPasswordPage;
