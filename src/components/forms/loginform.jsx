"use client"

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "../ui/checkbox"
import Link from "next/link"

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    console.log(res); // buat lihat respon

    if (res.ok) {
      const session = await fetch("/api/auth/session").then(r => r.json());

      if (session?.user?.role === "staff") {
        window.location.href = "/dashboard";
      }

      if (session?.user?.role === "admin") {
        window.location.href = "/dashboard";
      }

      if (session?.user?.role === "user") {
        window.location.href = "/";
      }
    }
  }


  return (
    <form onSubmit={handleSubmit} className="gap-2 justify-center flex flex-col w-3/4">
      <h1 className="font-bold text-4xl mb-2">Log-in to Your Account</h1>
      <h2 className="mb-8"> Dont have an account? <Link href='/register' className="text-blue-600">register</Link></h2>
      <Input type="email"
        placeholder="Email"
        className="mb-2 h-12"
        value={email}
        onChange={(e) => setEmail(e.target.value)} />
      <Input type="password"
        placeholder="Password"
        className="mb-2 h-12"
        value={password}
        onChange={(e) => setPassword(e.target.value)} />
      <div className="mb-8">
        <Checkbox id='terms' />
        <label htmlFor="terms" className="text-sm ml-2">I agree to the <Link className="text-blue-600" href='/'>terms and conditions</Link></label>
      </div>
      <Button type="submit" className="w-full">Log In</Button>
    </form>
  );
}