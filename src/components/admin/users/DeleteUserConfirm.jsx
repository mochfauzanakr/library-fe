"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function DeleteUserConfirm({ open, setOpen, user }) {
  const router = useRouter();

  if (!user) return null;

  async function remove() {
    const res = await fetch(`/api/admin/users/${user.id_user}`, {
      method: "DELETE",
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
          <DialogTitle className="text-red-600">
            Delete User
          </DialogTitle>
        </DialogHeader>

        <p>
          Are you sure you want to delete user <b>{user.username}</b>?
        </p>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={remove}>
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
