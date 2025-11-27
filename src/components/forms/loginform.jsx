"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

import Link from "next/link";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res.ok) {
      const session = await fetch("/api/auth/session").then((r) => r.json());

      if (["admin", "staff"].includes(session?.user?.role)) {
        window.location.href = "/dashboard";
      }
      if (session?.user?.role === "user") {
        window.location.href = "/user/home";
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="gap-2 justify-center flex flex-col w-3/4">
      <h1 className="font-bold text-4xl mb-2">Log-in to Your Account</h1>

      <h2 className="mb-8">
        Dont have an account?
        <Link href="/register" className="text-blue-600 ml-1">
          register
        </Link>
      </h2>

      <Input
        type="email"
        placeholder="Email"
        className="mb-2 h-12"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <div className="relative">
        <Input
          type={showPw ? "text" : "password"}
          placeholder="Password"
          className="mb-2 h-12"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="button"
          onClick={() => setShowPw((prev) => !prev)}
          className="absolute right-4 top-3 text-gray-600"
        >
          {showPw ? <EyeSlashIcon className="w-5" /> : <EyeIcon className="w-5" />}
        </button>
      </div>

      <div className="mb-8 flex items-center gap-2">
        <Checkbox id="terms" />
        <label htmlFor="terms" className="text-sm">
          I agree to the{" "}
          <Link href="/" className="text-blue-600">
            terms and conditions
          </Link>
        </label>
      </div>

      <Button type="submit" className="w-full">
        Log In
      </Button>
    </form>
  );
}
