"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import DeleteUserConfirm from "./DeleteUserConfirm";
import { useSession } from "next-auth/react";

export default function UserTable({ users, meta }) {
  const router = useRouter();
  const [selectedUser, setSelectedUser] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);
  const { data: session } = useSession();
  const role = session?.user?.role;
  const canDelete = useMemo(() => role === "admin", [role]);

  return (
    <div className="space-y-4">

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="p-2 text-left">Username</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Role</th>
              <th className="p-2 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users?.length ? (
              users
                .filter((u) => u && u.id_user)
                .map((u) => (
                  <tr key={u.id_user} className="border-t">
                    <td className="p-2">{u.username}</td>
                    <td className="p-2">{u.email}</td>
                    <td className="p-2 capitalize">{u.role}</td>
                    <td className="p-2 text-right space-x-2">

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          router.push(`/dashboard/manage-users/${u.id_user}/borrow-history`)
                        }
                      >
                        History
                      </Button>

                      {canDelete && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => {
                            setSelectedUser(u);
                            setOpenDelete(true);
                          }}
                        >
                          Delete
                        </Button>
                      )}
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="text-center text-muted-foreground p-4"
                >
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Modal */}
      {canDelete && (
        <DeleteUserConfirm
          open={openDelete}
          setOpen={setOpenDelete}
          user={selectedUser}
        />
      )}
    </div>
  );
}
