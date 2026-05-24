import { useForm } from "react-hook-form";

const OtpModal = ({
  isOpen,
  email,
  onClose,
  onVerify,
  isSubmitting,
  devOtp,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { otp: "" },
  });

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
      <div className="w-full max-w-md rounded-[24px] border border-neutral-800 bg-neutral-900 p-6 text-white shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold">Verify OTP</h2>
            <p className="mt-2 text-sm text-neutral-400">
              Enter the OTP sent to {email}.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-neutral-700 px-3 py-1 text-sm text-neutral-300 transition hover:border-neutral-500"
          >
            Close
          </button>
        </div>

        {devOtp ? (
          <div className="mt-4 rounded-2xl border border-blue-500/30 bg-blue-500/10 px-4 py-3 text-sm text-blue-200">
            Dev OTP: <span className="font-semibold tracking-[0.3em]">{devOtp}</span>
          </div>
        ) : null}

        <form
          onSubmit={handleSubmit(({ otp }) => onVerify(otp))}
          className="mt-6 space-y-5"
        >
          <div className="space-y-2">
            <label htmlFor="otp" className="block text-sm font-medium text-neutral-200">
              OTP
            </label>
            <input
              id="otp"
              type="text"
              maxLength={6}
              placeholder="Enter 6 digit OTP"
              {...register("otp", {
                required: "OTP is required",
                pattern: {
                  value: /^\d{6}$/,
                  message: "Enter a valid 6 digit OTP",
                },
              })}
              className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none transition ${
                errors.otp
                  ? "border-red-500 bg-red-500/5 text-white"
                  : "border-neutral-700 bg-neutral-950 text-white placeholder:text-neutral-500 focus:border-blue-500"
              }`}
            />
            {errors.otp ? (
              <p className="text-sm text-red-400">{errors.otp.message}</p>
            ) : null}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Verifying..." : "Confirm OTP"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OtpModal;
