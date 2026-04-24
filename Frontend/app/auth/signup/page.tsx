import Link from "next/link";
import AuthForm from "@/components/auth-form";

export default function SignupPage() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-16">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_80%_100%,rgba(244,30,30,0.14),transparent)]"
        aria-hidden
      />
      <Link
        href="/"
        className="absolute left-4 top-4 text-sm font-bold text-white/75 transition-colors hover:text-[#F41E1E] lg:hidden"
      >
        ← Home
      </Link>
      <div className="relative grid w-full max-w-5xl gap-10 lg:grid-cols-2 lg:items-center">
        <div className="hidden lg:flex lg:min-h-[480px] lg:flex-col lg:justify-center">
          <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.22em] text-[#F41E1E]">
            Join Body Fit
          </p>
          <h1 className="text-4xl font-extrabold italic leading-tight tracking-tight text-white xl:text-5xl">
            Create your <span className="text-[#F41E1E]">account</span> — start strong.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/70">
            Same secure signup as before — name, email, and password. Your data stays with our API.
          </p>
          <Link
            href="/"
            className="mt-10 inline-flex w-fit items-center text-sm font-bold text-white/75 transition-colors hover:text-[#F41E1E]"
          >
            ← Back to home
          </Link>
        </div>
        <AuthForm mode="signup" />
      </div>
    </section>
  );
}
