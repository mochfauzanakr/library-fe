"use client";

import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function DeleteStaffConfirm({ open, setOpen, staff }) {
  const router = useRouter();

  async function remove() {
    if (!staff?.id_user) {
      console.error("Delete staff: missing id_user on staff object", staff);
      return;
    }

    try {
      const url = `/api/admin/staff/${staff.id_user}`;
      console.log("DELETE", url, { staff });

      const res = await fetch(url, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        console.error("Delete staff failed", res.status, data);
        return;
      }

      setOpen(false);
      router.refresh();
    } catch (err) {
      console.error("Delete staff request error", err);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="space-y-4">
        <DialogHeader>
          <DialogTitle className="text-red-600">Delete Staff</DialogTitle>
        </DialogHeader>

        <p>
          Are you sure you want to delete <b>{staff.username}</b>?
        </p>

        <button
          onClick={() => {
            console.log("REMOVE CLICKED");
            remove();
          }}
          className="px-4 py-2 w-full bg-red-600 text-white rounded"
        >
          Delete
        </button>
      </DialogContent>
    </Dialog>
  );
}
