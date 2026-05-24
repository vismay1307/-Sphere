import { Link } from "react-router-dom";

const Home = () => (
  <div className="min-h-screen bg-neutral-950 px-5 py-10 text-white">
    <div className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-6xl items-center">
      <div className="grid w-full gap-10 rounded-[32px] border border-neutral-800 bg-neutral-900 p-8 shadow-2xl shadow-black/30 md:grid-cols-[1.1fr_0.9fr] md:p-12">
        <div className="flex flex-col justify-between">
          <div>
            <p className="inline-flex rounded-full border border-neutral-700 px-3 py-1 text-xs font-semibold uppercase tracking-[0.26em] text-neutral-400">
              MatSphere
            </p>
            <h1 className="mt-6 max-w-xl text-5xl font-semibold tracking-tight text-white md:text-6xl">
              Simple auth flow, clean UI, OTP email verification.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-neutral-400">
              Start from a minimal home page and move into signup or login. The
              interface uses black, white, grey, and blue only.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              to="/sign-up"
              className="rounded-2xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
            >
              Sign Up
            </Link>
            <Link
              to="/login"
              className="rounded-2xl border border-neutral-700 px-6 py-3 text-sm font-semibold text-white transition hover:border-neutral-500"
            >
              Login
            </Link>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="rounded-[28px] border border-neutral-800 bg-neutral-950 p-6">
            <p className="text-sm uppercase tracking-[0.22em] text-neutral-500">
              What’s included
            </p>
            <div className="mt-6 space-y-4 text-sm leading-7 text-neutral-300">
              <p>Signup with OTP confirmation.</p>
              <p>Login with MongoDB credential validation.</p>
              <p>Forgot password with OTP and JWT token issue.</p>
            </div>
          </div>
          <div className="rounded-[28px] border border-neutral-200 bg-white p-6 text-neutral-950">
            <p className="text-sm uppercase tracking-[0.22em] text-neutral-500">
              Stack
            </p>
            <div className="mt-6 space-y-3 text-sm leading-7 text-neutral-700">
              <p>React + React Hook Form</p>
              <p>Express + MongoDB</p>
              <p>Nodemailer + Gmail for free OTP mails</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Home;
