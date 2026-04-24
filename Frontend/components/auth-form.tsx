"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import Image from "next/image";
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
      <Card className="rounded-2xl border border-white/10 bg-black/55 shadow-2xl shadow-black/40 backdrop-blur-md">
        <Card.Content className="space-y-5 p-6 sm:p-8">
          <Link href="/" className="mx-auto mb-2 flex justify-center outline-none focus-visible:ring-2 focus-visible:ring-[#F41E1E]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-black/40">
            <Image
              src="/images/logo/bodyfitlogo.png"
              alt="Body Fit"
              width={200}
              height={64}
              className="h-14 w-auto max-w-[min(100%,220px)] object-contain"
              priority
            />
          </Link>
          <div>
            <p className="mb-2 text-[0.65rem] font-extrabold uppercase tracking-[0.2em] text-[#F41E1E]">
              {mode === "signup" ? "Sign up" : "Sign in"}
            </p>
            <h1 className="text-2xl font-extrabold italic text-white sm:text-3xl">
              {mode === "signup" ? "Create your account" : "Welcome back"}
            </h1>
            <p className="mt-2 text-sm text-white/60">
              {mode === "signup"
                ? "Use the same fields as the API: name, email, password (8+ characters)."
                : "Email and password — same as the backend login endpoint."}
            </p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {mode === "signup" && (
              <div className="w-full">
                <p className="mb-1.5 text-sm font-semibold text-white/90">Name</p>
                <Input
                  fullWidth
                  className="w-full border-white/15 bg-white/5 text-white placeholder:text-white/35"
                  placeholder="Your name"
                  {...register("name" as never)}
                />
                {"name" in unsafeErrors && <p className="mt-1 text-xs text-[#F41E1E]">{unsafeErrors.name?.message}</p>}
              </div>
            )}
            <div className="w-full">
              <p className="mb-1.5 text-sm font-semibold text-white/90">Email</p>
              <Input
                fullWidth
                className="w-full border-white/15 bg-white/5 text-white placeholder:text-white/35"
                placeholder="you@example.com"
                {...register("email")}
              />
              {errors.email && <p className="mt-1 text-xs text-[#F41E1E]">{errors.email.message}</p>}
            </div>
            <div className="w-full">
              <p className="mb-1.5 text-sm font-semibold text-white/90">Password</p>
              <Input
                fullWidth
                type="password"
                className="w-full border-white/15 bg-white/5 text-white placeholder:text-white/35"
                placeholder="At least 8 characters"
                {...register("password")}
              />
              {errors.password && <p className="mt-1 text-xs text-[#F41E1E]">{errors.password.message}</p>}
            </div>
            {error && <p className="text-sm text-[#F41E1E]">{error}</p>}
            <Button
              type="submit"
              isDisabled={loading}
              className="w-full rounded-lg bg-[#F41E1E] font-extrabold uppercase tracking-wide text-white shadow-lg shadow-[#F41E1E]/25 hover:bg-[#d91818]"
            >
              {loading ? "Please wait..." : mode === "signup" ? "Create account" : "Log in"}
            </Button>
          </form>
          <p className="text-center text-sm text-white/55">
            {mode === "signup" ? "Already have an account?" : "Need an account?"}{" "}
            <Link
              href={mode === "signup" ? "/auth/login" : "/auth/signup"}
              className="font-bold text-[#F41E1E] underline-offset-4 hover:underline"
            >
              {mode === "signup" ? "Log in" : "Sign up"}
            </Link>
          </p>
        </Card.Content>
      </Card>
    </motion.div>
  );
}
