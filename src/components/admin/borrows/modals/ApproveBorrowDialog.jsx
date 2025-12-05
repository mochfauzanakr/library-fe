"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ApproveBorrowDialog({ open, setOpen, borrow }) {
  const router = useRouter();

  if (!borrow) return null;

  async function approve() {
    const res = await fetch(`/api/borrows/${borrow.id_borrows}`, {
      method: "PATCH",
      body: JSON.stringify({ action: "approve" }),
    });

    if (res.ok) {
      setOpen(false);
      router.refresh();
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="space-y-4">
        <DialogHeader>
          <DialogTitle className="text-blue-600">
            Approve Borrow Request
          </DialogTitle>
        </DialogHeader>

        <p>
          Approve borrow request for <b>{borrow.book_title}</b> by{" "}
          <b>{borrow.username}</b>?
        </p>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={approve}>
            Approve
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
