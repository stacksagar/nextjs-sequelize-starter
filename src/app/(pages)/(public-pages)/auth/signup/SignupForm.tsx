"use client";

import AuthContainer from "@/components/common/forms/AuthContainer";
import FormFooter from "@/components/common/forms/FormFooter";
import FormHeader from "@/components/common/forms/FormHeader";
import MCInput from "@/components/common/forms/MCInput";
import MCInputPassword from "@/components/common/forms/MCInputPassword";
import { Button, Radio, RadioGroup } from "@mantine/core";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { z } from "zod";
import { toast } from "react-toastify";

enum UserRole {
  USER = "user",
  MERCHANT = "merchant",
}

const signupSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.nativeEnum(UserRole),
});

export default function SignupForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [role, setRole] = useState<UserRole>(UserRole.USER);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const form = e.target as HTMLFormElement;
    const name = (
      form.elements.namedItem("name") as HTMLInputElement
    )?.value.trim();
    const email = (
      form.elements.namedItem("email") as HTMLInputElement
    )?.value.trim();
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      ?.value;
    const parsed = signupSchema.safeParse({ name, email, password, role });
    if (!parsed.success) {
      setError(parsed.error.errors[0].message);
      setLoading(false);
      return;
    }
    try {
      await axios.post("/api/auth/register", { name, email, password, role });
      location?.replace("/verify-email");
    } catch (err: any) {
      setError(err?.response?.data?.error || "Registration failed");
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
          title="Hello, Welcome 👋"
          description={
            <>
              <p> Today is a new day. It's your day. You shape it. </p>
              <p> Sign up to start enjoying massive deals.</p>
            </>
          }
        />

        <div className="space-y-6">
          <RadioGroup
            value={role}
            onChange={(value: string) => setRole(value as UserRole)}
            label=""
            description="Sign up as"
            required
          >
            <div className="flex items-center gap-x-6 pt-1.5">
              <Radio value={UserRole.USER} label="User" />
              <Radio value={UserRole.MERCHANT} label="Merchant" />
            </div>
          </RadioGroup>

          {/* Conditional message for Merchant role */}
          {role === UserRole.MERCHANT && (
            <div className="text-sm text-gray-600 bg-gray-100 p-3 rounded-md">
              Please note: Merchant accounts require verification of business
              details by our administration team after signup. You will be
              guided through this process.
            </div>
          )}

          <MCInput size="lg" id="name" placeholder="Write your name" required />
          <MCInput
            size="lg"
            id="email"
            type="email"
            placeholder="Your e-mail address"
            required
          />
          <MCInputPassword
            size="lg"
            id="password"
            type="password"
            placeholder="At least 8 characters"
            required
          />
          {error && (
            <div className="text-red-600 text-sm font-medium">{error}</div>
          )}
          <Button
            type="submit"
            size="lg"
            className="!bg-[#060acd] !w-full"
            loading={loading}
          >
            Sign Up
          </Button>

          <div className="w-full flex items-center gap-x-1 justify-center md:justify-end">
            <span>Already have an account?</span>
            <Link
              href="/auth/login"
              className="text-right text-base font-medium text-[#060acd] hover:underline"
            >
              Sign in
            </Link>
          </div>
        </div>

        <FormFooter
          divider
          // signWithGoogle="Signup with Google"
          // signWithFacebook="Signup with Facebook"
        />
      </AuthContainer>
        
    </form>
  );
}
