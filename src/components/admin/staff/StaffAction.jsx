"use client";

import { useState } from "react";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import EditStaffModal from "./modals/EditStaffModal";
import DeleteStaffConfirm from "./modals/DeleteStaffConfirm";

export default function StaffActions({ staff }) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  console.log("STAFF IN MODAL:", staff);


  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="p-2 rounded hover:bg-muted">
          <MoreVertical size={18} />
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setEditOpen(true)}>
            Edit
          </DropdownMenuItem>

          <DropdownMenuItem
            className="text-red-600"
            onClick={() => setDeleteOpen(true)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Modal Edit */}
      <EditStaffModal open={editOpen} setOpen={setEditOpen} staff={staff} />

      {/* Modal Delete */}
      <DeleteStaffConfirm open={deleteOpen} setOpen={setDeleteOpen} staff={staff} />
    </>
  );
}
