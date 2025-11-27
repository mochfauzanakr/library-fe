"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { registerSchema } from "@/lib/validation/auth";
import { formatZodErrors } from "@/lib/validation/utils/zodErrorFormatter";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";

export default function RegisterForm() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirm: "",
  });

  const [showPw, setShowPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [errors, setErrors] = useState({});

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors({});

    // FE VALIDATION
    const parsed = registerSchema.safeParse(form);
    if (!parsed.success) {
      setErrors(formatZodErrors(parsed.error.errors));
      return;
    }

    // BACKEND REGISTER CALL
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      setErrors(data.errors || {});
      return;
    }

    // SUCCESS → redirect ke login
    window.location.href = "/login";
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="gap-2 justify-center flex flex-col w-3/4"
    >
      <h1 className="font-bold text-4xl mb-2">Create An Account</h1>

      <h2 className="mb-8">
        Already have an account?{" "}
        <Link href="/login" className="text-blue-600">
          Login
        </Link>
      </h2>

      {/* USERNAME */}
      <div>
        <Input
          placeholder="Username"
          className="h-12 mb-1"
          value={form.username}
          onChange={(e) =>
            setForm({ ...form, username: e.target.value })
          }
        />
        {errors.username && (
          <p className="text-red-500 text-sm">{errors.username}</p>
        )}
      </div>

      {/* EMAIL */}
      <div>
        <Input
          type="email"
          placeholder="Email"
          className="h-12 mb-1"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{errors.email}</p>
        )}
      </div>

      {/* PASSWORD */}
      <div className="relative">
        <Input
          type={showPw ? "text" : "password"}
          placeholder="Password"
          className="h-12 mb-1 pr-10"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />
        <button
          type="button"
          onClick={() => setShowPw((prev) => !prev)}
          className="absolute right-4 top-3 text-gray-600"
        >
          {showPw ? <EyeSlashIcon className="w-5" /> : <EyeIcon className="w-5" />}
        </button>

        {errors.password && (
          <p className="text-red-500 text-sm">{errors.password}</p>
        )}
      </div>

      {/* CONFIRM PASSWORD */}
      <div className="relative">
        <Input
          type={showConfirmPw ? "text" : "password"}
          placeholder="Confirm Password"
          className="h-12 mb-1 pr-10"
          value={form.confirm}
          onChange={(e) =>
            setForm({ ...form, confirm: e.target.value })
          }
        />
        <button
          type="button"
          onClick={() => setShowConfirmPw((prev) => !prev)}
          className="absolute right-4 top-3 text-gray-600"
        >
          {showConfirmPw ? <EyeSlashIcon className="w-5" /> : <EyeIcon className="w-5" />}
        </button>

        {errors.confirm && (
          <p className="text-red-500 text-sm">{errors.confirm}</p>
        )}
      </div>

      {/* TERMS */}
      <div className="mb-8 flex items-center gap-2">
        <Checkbox id="terms" />
        <label htmlFor="terms" className="text-sm">
          I agree to the{" "}
          <Link className="text-blue-600" href="/">
            terms and conditions
          </Link>
        </label>
      </div>

      <Button type="submit" className="w-full">
        Register
      </Button>
    </form>
  );
}
