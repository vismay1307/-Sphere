const AuthInput = ({
  label,
  name,
  type = "text",
  register,
  errors,
  placeholder,
  disabled = false,
}) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-neutral-200" htmlFor={name}>
      {label}
    </label>
    <input
      id={name}
      type={type}
      placeholder={placeholder}
      disabled={disabled}
      {...register}
      className={`w-full rounded-2xl border px-4 py-3 text-sm outline-none transition ${
        errors?.[name]
          ? "border-red-500 bg-red-500/5 text-white placeholder:text-red-200/70"
          : "border-neutral-700 bg-neutral-950 text-white placeholder:text-neutral-500 focus:border-blue-500"
      } ${disabled ? "cursor-not-allowed opacity-70" : ""}`}
    />
    {errors?.[name] ? (
      <p className="text-sm text-red-400">{errors[name].message}</p>
    ) : null}
  </div>
);

export default AuthInput;
