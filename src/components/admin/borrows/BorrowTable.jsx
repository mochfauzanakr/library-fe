"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MoreVertical } from "lucide-react";

function formatDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("id-ID");
}

function statusLabel(status) {
  if (!status) return "-";
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export default function BorrowTable({ borrows, meta }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loadingId, setLoadingId] = useState(null);
  const [payFineOpen, setPayFineOpen] = useState(false);
  const [payFineNotes, setPayFineNotes] = useState("");
  const [selectedBorrow, setSelectedBorrow] = useState(null);
  const statusFilter = searchParams.get("status");
  const filterCounts = useMemo(() => {
    const counts = { all: borrows?.length || 0 };
    borrows?.forEach((b) => {
      if (!b?.status) return;
      counts[b.status] = (counts[b.status] || 0) + 1;
    });
    return counts;
  }, [borrows]);
  const showCounts = statusFilter !== "return";

  function setStatusFilter(status) {
    const params = new URLSearchParams(searchParams.toString());
    if (status) params.set("status", status);
    else params.delete("status");
    params.delete("page");
    router.push(`?${params.toString()}`);
  }

  async function updateBorrow(id, action, confirmText, payload = {}) {
    const sure = window.confirm(confirmText);
    if (!sure) return;

    setLoadingId(id);

    const res = await fetch(`/api/borrows/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ action, ...payload }),
    });

    setLoadingId(null);

    if (res.ok) {
      router.refresh();
    } else {
      alert("Failed to update borrow");
    }
  }

  return (
    <div className="space-y-4">
      {/* Status Filter */}
      <div className="flex gap-2">
        <Button
          variant={statusFilter ? "outline" : "default"}
          size="sm"
          onClick={() => setStatusFilter("")}
        >
          All{showCounts && filterCounts.all ? ` (${filterCounts.all})` : ""}
        </Button>
        <Button
          variant={statusFilter === "pending" ? "default" : "outline"}
          size="sm"
          onClick={() => setStatusFilter("pending")}
        >
          Pending{showCounts && filterCounts.pending ? ` (${filterCounts.pending})` : ""}
        </Button>
        <Button
          variant={statusFilter === "approved" ? "default" : "outline"}
          size="sm"
          onClick={() => setStatusFilter("approved")}
        >
          Approved{filterCounts.approved ? ` (${filterCounts.approved})` : ""}
        </Button>
        <Button
          variant={statusFilter === "return" ? "default" : "outline"}
          size="sm"
          onClick={() => setStatusFilter("return")}
        >
          Returned{filterCounts.return ? ` (${filterCounts.return})` : ""}
        </Button>
        <Button
          variant={statusFilter === "late" ? "default" : "outline"}
          size="sm"
          onClick={() => setStatusFilter("late")}
        >
          Late{filterCounts.late ? ` (${filterCounts.late})` : ""}
        </Button>
      </div>

      {/* Borrow Records Table */}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              <th className="p-2 text-left">User</th>
              <th className="p-2 text-left">Book</th>
              <th className="p-2 text-left">Borrowed At</th>
              <th className="p-2 text-left">Due Date</th>
              <th className="p-2 text-left">Returned At</th>
              <th className="p-2 text-left">Fine</th>
              <th className="p-2 text-left">Status</th>
              <th className="p-2 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {borrows?.length ? (
              borrows.map((br) => {
                const isPending = br.status === "pending";
                const isApproved = br.status === "approved";
                const isReturned = br.status === "return";
                const isLate = br.status === "late";
                const fine = br.fine_amount ? Number(br.fine_amount) : 0;
                const fineStatus = br.fine_status || (fine > 0 ? "unpaid" : "none");

                return (
                  <tr key={br.id_borrows} className="border-t">
                    <td className="p-2">{br.username}</td>
                    <td className="p-2">{br.book_title}</td>
                    <td className="p-2">{formatDate(br.borrow_date)}</td>
                    <td className="p-2">{formatDate(br.return_date)}</td>
                    <td className="p-2">{formatDate(br.actual_return)}</td>
                    <td className="p-2">
                      {fine > 0 ? `Rp ${fine.toLocaleString("id-ID")}` : "—"}
                      {fineStatus && fineStatus !== "none" ? (
                        <span className="ml-1 text-xs text-muted-foreground">
                          ({fineStatus})
                        </span>
                      ) : null}
                    </td>
                    <td className="p-2">{statusLabel(br.status)}</td>

                    <td className="p-2 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="p-2 rounded hover:bg-muted disabled:opacity-50" disabled={loadingId === br.id_borrows}>
                          <MoreVertical size={16} />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {isPending && (
                            <DropdownMenuItem
                              onClick={() =>
                                updateBorrow(
                                  br.id_borrows,
                                  "approve",
                                  "Approve this borrow request?"
                                )
                              }
                            >
                              Approve
                            </DropdownMenuItem>
                          )}

                          {isApproved && (
                            <DropdownMenuItem
                              onClick={() =>
                                updateBorrow(
                                  br.id_borrows,
                                  "late",
                                  "Mark this borrow as late with a fine?"
                                )
                              }
                            >
                              Mark Late
                            </DropdownMenuItem>
                          )}

                          {(isApproved || isLate) && fineStatus !== "paid" && (
                            <DropdownMenuItem
                              onClick={() =>
                                updateBorrow(
                                  br.id_borrows,
                                  "return",
                                  "Mark this book as returned?"
                                )
                              }
                            >
                              Mark Returned
                            </DropdownMenuItem>
                          )}

                          {isLate && fineStatus !== "paid" && (
                            <DropdownMenuItem
                              onClick={() => {
                                setSelectedBorrow(br);
                                setPayFineOpen(true);
                                setPayFineNotes("");
                              }}
                            >
                              Mark Fine Paid
                            </DropdownMenuItem>
                          )}

                          {(isReturned || isLate) && (
                            <DropdownMenuItem disabled>
                              No actions available
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="p-4 text-center text-muted-foreground">
                  No borrow records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pay Fine Modal */}
      <Dialog open={payFineOpen} onOpenChange={setPayFineOpen}>
        <DialogContent className="space-y-4">
          <DialogHeader>
            <DialogTitle>Mark Fine as Paid</DialogTitle>
          </DialogHeader>

          <div className="space-y-2">
            <Label htmlFor="fine-notes">Fine Notes (optional)</Label>
            <Textarea
              id="fine-notes"
              placeholder="Add any note about this payment"
              value={payFineNotes}
              onChange={(e) => setPayFineNotes(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setPayFineOpen(false);
                setPayFineNotes("");
                setSelectedBorrow(null);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={async () => {
                if (!selectedBorrow?.id_borrows) return;
                await updateBorrow(
                  selectedBorrow.id_borrows,
                  "pay_fine",
                  "Confirm fine has been paid?",
                  { fine_notes: payFineNotes || null }
                );
                setPayFineOpen(false);
                setPayFineNotes("");
                setSelectedBorrow(null);
              }}
            >
              Confirm Paid
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}
