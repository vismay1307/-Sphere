import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AuthInput from "../../components/auth/AuthInput";
import AuthLayout from "../../components/auth/AuthLayout";
import { emailValidation, loginDefaultValues } from "../../models/auth";
import { useAuth } from "../../context/AuthContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: loginDefaultValues,
    mode: "onTouched",
  });

  const onSubmit = async (values) => {
    try {
      await login(values);
      toast.success("Login successful");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <AuthLayout
      title="Sign in to continue"
      subtitle="Login requires first name, email, and password. If the credentials match MongoDB, access and refresh tokens are generated."
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
          placeholder="Enter password"
          register={register("password", {
            required: "Password is required",
          })}
          errors={errors}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>

      <div className="mt-6 flex items-center justify-between text-sm text-neutral-400">
        <Link className="text-blue-400 hover:text-blue-300" to="/forgot-password">
          Forgot password?
        </Link>
        <Link className="text-blue-400 hover:text-blue-300" to="/sign-up">
          Create account
        </Link>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
