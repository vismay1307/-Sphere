const AuthLayout = ({ title, subtitle, children }) => (
  <div className="min-h-screen bg-neutral-950 text-white">
    <div className="mx-auto flex min-h-screen w-full max-w-6xl items-center justify-center px-5 py-12">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[28px] border border-neutral-800 bg-neutral-900 shadow-2xl shadow-black/30 md:grid-cols-[1.05fr_0.95fr]">
        <div className="flex flex-col justify-between bg-white px-8 py-10 text-neutral-950 md:px-10 md:py-12">
          <div>
            <p className="mb-4 inline-flex rounded-full border border-neutral-300 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-neutral-600">
              MatSphere
            </p>
            <h1 className="max-w-sm text-4xl font-semibold leading-tight md:text-5xl">
              {title}
            </h1>
            <p className="mt-4 max-w-md text-sm leading-7 text-neutral-600 md:text-base">
              {subtitle}
            </p>
          </div>
          <div className="mt-10 grid gap-3 text-sm text-neutral-600">
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3">
              Clean auth flow with OTP verification.
            </div>
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3">
              Colors kept to black, white, grey, and blue.
            </div>
          </div>
        </div>
        <div className="px-6 py-8 md:px-8 md:py-10">{children}</div>
      </div>
    </div>
  </div>
);

export default AuthLayout;
