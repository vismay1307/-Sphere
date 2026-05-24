import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AuthInput from "../../components/auth/AuthInput";
import AuthLayout from "../../components/auth/AuthLayout";
import OtpModal from "../../components/auth/OtpModal";
import {
  emailValidation,
  passwordValidation,
  signupDefaultValues,
} from "../../models/auth";
import { useAuth } from "../../context/AuthContext";

const SignUpPage = () => {
  const navigate = useNavigate();
  const { requestSignupOtp, verifySignupOtp } = useAuth();
  const [otpState, setOtpState] = useState({
    open: false,
    email: "",
    devOtp: "",
  });
  const [isSubmittingOtp, setIsSubmittingOtp] = useState(false);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: signupDefaultValues,
    mode: "onTouched",
  });

  const onSubmit = async (values) => {
    try {
      const response = await requestSignupOtp(values);
      setOtpState({
        open: true,
        email: response.email,
        devOtp: response.otp || "",
      });
      toast.success("OTP sent to your email");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to send OTP");
    }
  };

  const handleOtpVerification = async (otp) => {
    setIsSubmittingOtp(true);
    try {
      await verifySignupOtp({ email: otpState.email, otp });
      toast.success("Signup complete");
      setOtpState({ open: false, email: "", devOtp: "" });
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP verification failed");
    } finally {
      setIsSubmittingOtp(false);
    }
  };

  return (
    <>
      <AuthLayout
        title="Create your account"
        subtitle="Sign up with email verification. Once the OTP is confirmed, your account is stored in MongoDB and you are moved to the dashboard."
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <AuthInput
            label="First name *"
            name="firstName"
            placeholder="Enter first name"
            register={register("firstName", {
              required: "First name is required",
            })}
            errors={errors}
          />
          <AuthInput
            label="Last name"
            name="lastName"
            placeholder="Enter last name"
            register={register("lastName")}
            errors={errors}
          />
          <AuthInput
            label="Email *"
            name="email"
            type="email"
            placeholder="Enter email"
            register={register("email", emailValidation)}
            errors={errors}
          />
          <AuthInput
            label="Password *"
            name="password"
            type="password"
            placeholder="Create password"
            register={register("password", passwordValidation)}
            errors={errors}
          />
          <AuthInput
            label="Confirm password *"
            name="confirmPassword"
            type="password"
            placeholder="Confirm password"
            register={register("confirmPassword", {
              required: "Confirm password is required",
              validate: (value) =>
                value === getValues("password") || "Passwords do not match",
            })}
            errors={errors}
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Sending OTP..." : "Sign Up"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-neutral-400">
          Already have an account?{" "}
          <Link className="font-medium text-blue-400 hover:text-blue-300" to="/login">
            Login
          </Link>
        </p>
      </AuthLayout>

      <OtpModal
        isOpen={otpState.open}
        email={otpState.email}
        devOtp={otpState.devOtp}
        isSubmitting={isSubmittingOtp}
        onClose={() => setOtpState((current) => ({ ...current, open: false }))}
        onVerify={handleOtpVerification}
      />
    </>
  );
};

export default SignUpPage;
