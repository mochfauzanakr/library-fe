"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { AddStaffSchema } from "@/lib/validation/auth/AddStaffSchema";

export default function AddStaffModal() {
  const router = useRouter();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState({});

  async function submit() {
    // ZOD VALIDATION
    const result = AddStaffSchema.safeParse(form);

    if (!result.success) {
      setErrors(result.error.flatten().fieldErrors);
      return;
    }

    // POST DATA
    const res = await fetch("/api/admin/staff", {
      method: "POST",
      body: JSON.stringify(form),
    });

    const data = await res.json();

    // API error handler (duplicate email, etc)
    if (!res.ok) {
      setErrors({ api: data.error });
      return;
    }

    // SUCCESS CASE
    router.refresh();
    setForm({ username: "", email: "", password: "" });
    setErrors({});
  }

  return (
    <Dialog>
      <DialogTrigger className="px-4 py-2 bg-primary text-white rounded">
        Add Staff
      </DialogTrigger>

      <DialogContent className="space-y-4">
        <DialogHeader>
          <DialogTitle>Add New Staff</DialogTitle>
        </DialogHeader>

        {/* API ERROR */}
        {errors.api && (
          <p className="text-red-600 text-sm">{errors.api}</p>
        )}

        {/* USERNAME */}
        <Input
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
        {errors.username && (
          <p className="text-red-600 text-sm">{errors.username}</p>
        )}

        {/* EMAIL */}
        <Input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        {errors.email && (
          <p className="text-red-600 text-sm">{errors.email}</p>
        )}

        {/* PASSWORD */}
        <div className="relative">
          <Input
            type={showPw ? "text" : "password"}
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <button
            type="button"
            onClick={() => setShowPw(!showPw)}
            className="absolute right-3 top-2 text-gray-600"
          >
            {showPw ? <EyeSlashIcon className="w-5" /> : <EyeIcon className="w-5" />}
          </button>
        </div>
        {errors.password && (
          <p className="text-red-600 text-sm">{errors.password}</p>
        )}

        <button
          onClick={submit}
          className="px-4 py-2 w-full bg-primary text-white rounded"
        >
          Save
        </button>
      </DialogContent>
    </Dialog>
  );
}
