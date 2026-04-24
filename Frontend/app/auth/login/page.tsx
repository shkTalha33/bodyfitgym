import AuthForm from "@/components/auth-form";
import ParticleBackground from "@/components/particle-background";

export default function LoginPage() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top,#7c3aed2e_0%,transparent_34%),#020617] px-4">
      <ParticleBackground />
      <div className="relative grid w-full max-w-5xl gap-8 lg:grid-cols-2 lg:items-center">
        <div className="hidden lg:flex lg:min-h-[520px] lg:flex-col lg:justify-center">
          <p className="panel-heading mb-3">Agentic Gym Platform</p>
          <h1 className="text-4xl font-bold leading-tight xl:text-5xl">
            Train with an autonomous <span className="text-violet-400">performance</span> copilot.
          </h1>
          <p className="mt-5 max-w-xl text-lg text-slate-300">
            AI-guided nutrition, workouts, and progress tracking in one premium dashboard.
          </p>
        </div>
        <AuthForm mode="login" />
      </div>
    </section>
  );
}
