"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";

export default function EditStaffModal({ open, setOpen, staff }) {
  const router = useRouter();

  const [form, setForm] = useState({
    username: staff.username,
    email: staff.email,
  });

  const [errors, setErrors] = useState({});

  async function submit() {
    const res = await fetch(`/api/admin/staff/${staff.id_user}`, {
      method: "PUT",
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      setErrors({ api: data.error });
      return;
    }

    setOpen(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="space-y-4">
        <DialogHeader>
          <DialogTitle>Edit Staff</DialogTitle>
        </DialogHeader>

        {errors.api && <p className="text-red-600 text-sm">{errors.api}</p>}

        <Input
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />

        <Input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <button
          onClick={submit}
          className="px-4 py-2 w-full bg-primary text-white rounded"
        >
          Save Changes
        </button>
      </DialogContent>
    </Dialog>
  );
}
