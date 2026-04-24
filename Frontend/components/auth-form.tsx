"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import { login, signup } from "@/store/slices/authSlice";
import { Button, Card, Input } from "@heroui/react";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const signupSchema = loginSchema.extend({
  name: z.string().min(2),
});

type Mode = "login" | "signup";

export default function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);
  const schema = mode === "signup" ? signupSchema : loginSchema;
  type FormData = z.infer<typeof schema>;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });
  const unsafeErrors = errors as Record<string, { message?: string }>;

  const onSubmit = async (data: FormData) => {
    const action = mode === "signup" ? signup(data as z.infer<typeof signupSchema>) : login(data);
    const result = await dispatch(action);
    if (result.meta.requestStatus === "fulfilled") {
      router.push("/dashboard");
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mx-auto w-full max-w-md">
      <Card className="rounded-3xl border border-[var(--border)] bg-[var(--surface)]/95 shadow-2xl shadow-violet-900/20">
        <Card.Content className="space-y-4">
          <div>
            <p className="panel-heading">Gym AI Access</p>
            <h1 className="text-2xl font-semibold">{mode === "signup" ? "Create your command account" : "Welcome back"}</h1>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
            {mode === "signup" && (
              <div className="w-full">
                <p className="mb-1 text-sm text-slate-300">Name</p>
                <Input fullWidth className="w-full bg-[var(--surface-soft)]" placeholder="Talha" {...register("name" as never)} />
                {"name" in unsafeErrors && <p className="text-xs text-red-500">{unsafeErrors.name?.message}</p>}
              </div>
            )}
            <div className="w-full">
              <p className="mb-1 text-sm text-slate-300">Email</p>
              <Input fullWidth className="w-full bg-[var(--surface-soft)]" placeholder="you@example.com" {...register("email")} />
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>
            <div className="w-full">
              <p className="mb-1 text-sm text-slate-300">Password</p>
              <Input fullWidth type="password" className="w-full bg-[var(--surface-soft)]" placeholder="********" {...register("password")} />
              {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" isDisabled={loading} className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 text-white">
              {loading ? "Please wait..." : mode === "signup" ? "Create account" : "Login"}
            </Button>
          </form>
          <p className="text-sm text-slate-400">
            {mode === "signup" ? "Already have an account?" : "Need an account?"}{" "}
            <Link href={mode === "signup" ? "/auth/login" : "/auth/signup"} className="text-violet-300 underline">
              {mode === "signup" ? "Login" : "Sign up"}
            </Link>
          </p>
        </Card.Content>
      </Card>
    </motion.div>
  );
}
