import AuthForm from "@/components/auth-form";
import ParticleBackground from "@/components/particle-background";

export default function SignupPage() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_bottom,#0ea5e92b_0%,transparent_30%),#020617] px-4">
      <ParticleBackground />
      <div className="relative grid w-full max-w-5xl gap-8 lg:grid-cols-2 lg:items-center">
        <div className="hidden lg:flex lg:min-h-[520px] lg:flex-col lg:justify-center">
          <p className="panel-heading mb-3">Start Your AI Journey</p>
          <h1 className="text-4xl font-bold leading-tight xl:text-5xl">
            Build your personalized gym <span className="text-violet-400">intelligence</span> system.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-slate-300">
            Create your account and let the agent optimize your meals, workouts, and recovery.
          </p>
        </div>
        <AuthForm mode="signup" />
      </div>
    </section>
  );
}
