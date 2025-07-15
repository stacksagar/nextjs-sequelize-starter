"use client";

import AuthContainer from "@/components/common/forms/AuthContainer";
import FormFooter from "@/components/common/forms/FormFooter";
import FormHeader from "@/components/common/forms/FormHeader";
import MCInput from "@/components/common/forms/MCInput";
import MCInputPassword from "@/components/common/forms/MCInputPassword";
import { Button, Checkbox } from "@mantine/core";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import useResendVerification from "@/hooks/useResendVerification";
import User from "@/models/User";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export default function LoginForm() {
  const { handleResend } = useResendVerification();

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const form = e.target as HTMLFormElement;
    const email = (
      form.elements.namedItem("email") as HTMLInputElement
    )?.value.trim();
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      ?.value;
    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      setError(parsed.error.errors[0].message);
      setLoading(false);
      return;
    }
    try {
      const { data } = await axios.post("/api/auth/login", { email, password });
      toast.success("Login successful!");
      const user = data.user as User;

      if (user?.isVerified) {
        if (user?.role === "admin") {
          location?.replace("/admin");
        } else if (user?.role === "merchant") {
          location?.replace("/merchant");
        } else if (user?.role === "user") {
          location?.replace("/");
        }
      } else {
        location?.replace("/verify-email");
        handleResend();
      }
    } catch (err: any) {
      setError(err?.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  return (
    <form onSubmit={submit}>
      <AuthContainer>
        <FormHeader
          title="Login"
          description={
            <>
              <p>Today is a new day. It's your day. You shape it.</p>
              <p>Sign in to start enjoying massive deals.</p>
            </>
          }
        />

        <div className="space-y-6">
          <MCInput
            size="lg"
            id="email"
            type="email"
            placeholder="You e-mail address"
            required
          />
          <MCInputPassword
            size="lg"
            id="password"
            type="password"
            placeholder="Your Password"
            required
          />
          <div className="flex items-center justify-between">
            <Checkbox defaultChecked label="Remember for 30 days" />
            <Link
              href="/auth/forgot-password"
              className="text-right block text-base font-medium text-[#060acd] hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
          <Button
            type="submit"
            size="lg"
            className="!bg-[#060acd] !w-full"
            loading={loading}
          >
            Sign in
          </Button>
        </div>

        <FormFooter
          // divider
          // signWithGoogle
          // signWithFacebook
          text="Don't you have an account?"
          linkText="Sign up"
          link="/auth/signup"
        />
      </AuthContainer>
    </form>
  );
}
