"use client";

import { useSession } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export default function BorrowButton({ bookId, stock }) {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [duration, setDuration] = useState("7"); // default 7 hari
  const [open, setOpen] = useState(false);

  const userId = session?.user?.id;

  if (status === "loading") {
    return <button disabled className="w-full py-2 bg-gray-300 text-white rounded-md">Checking session...</button>;
  }

  if (status === "unauthenticated") {
    return <button disabled className="w-full py-2 bg-gray-400 text-white rounded-md">Login to Borrow</button>;
  }

  const disabled = loading || stock <= 0;

  const handleConfirmBorrow = async () => {
    setLoading(true);

    const days = Number(duration);
    const now = new Date();
    const returnDate = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

    const payload = {
      user_id: userId,
      book_id: bookId,
      return_date: returnDate.toISOString(),
      duration_days: days
    };

    console.log("CLIENT WILL SEND:", payload);

    try {
      const res = await fetch("/api/borrows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("CLIENT RECEIVED:", data);

      if (!res.ok) toast.error(data.error || "Failed to borrow");
      else toast.success("Book borrowed!");

    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }

    setLoading(false);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Button utama */}
      <DialogTrigger asChild>
        <button
          disabled={disabled}
          className={`w-full py-2 rounded-md text-white transition
            ${disabled ? "bg-gray-400 cursor-not-allowed" : "bg-primary hover:bg-primary/80"}
          `}
        >
          Borrow Book
        </button>
      </DialogTrigger>

      {/* Popup */}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Borrow Duration</DialogTitle>
        </DialogHeader>

        <RadioGroup value={duration} onValueChange={setDuration} className="space-y-3">

          <div className="flex items-center space-x-2">
            <RadioGroupItem value="7" id="d7" />
            <Label htmlFor="d7">7 Days</Label>
          </div>

          <div className="flex items-center space-x-2">
            <RadioGroupItem value="14" id="d14" />
            <Label htmlFor="d14">14 Days</Label>
          </div>

          <div className="flex items-center space-x-2">
            <RadioGroupItem value="30" id="d30" />
            <Label htmlFor="d30">30 Days</Label>
          </div>

        </RadioGroup>

        <DialogFooter>
          <button
            onClick={handleConfirmBorrow}
            disabled={loading}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/80"
          >
            {loading ? "Processing..." : "Confirm Borrow"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
