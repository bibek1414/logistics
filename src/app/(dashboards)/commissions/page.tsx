"use client";

import { useEffect, useState } from "react";
import { useAuth, Role } from "@/context/AuthContext";
import { RoleGuard } from "@/components/role-guard/role-guard";
import { usePathname } from "next/navigation";
import {
  useRiderCommissionRates,
  useRiderCommissionRateMutations,
} from "@/hooks/use-rider-commission-rate";
import { RiderCommissionRate } from "@/types/rider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import {
  Percent,
  Plus,
  AlertCircle,
  RefreshCw,
  Infinity,
  Edit,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

// ─── Form state ────────────────────────────────────────────────────────────────

interface FormState {
  order_min_amount: string;
  order_max_amount: string;
  commission_amount: string;
}

const emptyForm: FormState = {
  order_min_amount: "",
  order_max_amount: "",
  commission_amount: "",
};

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function CommissionsPage() {
  const pathname = usePathname();
  const { user, isLoading: isAuthLoading, requireAuth } = useAuth();

  useEffect(() => {
    requireAuth(pathname);
  }, [user, isAuthLoading, pathname]);

  const {
    data: rates = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useRiderCommissionRates();

  // ── Dialog state ────────────────────────────────────────────────────────────
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRate, setEditingRate] = useState<RiderCommissionRate | null>(
    null,
  );
  const [form, setForm] = useState<FormState>(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);

  // ── Delete dialog ────────────────────────────────────────────────────────────
  const [deleteTarget, setDeleteTarget] = useState<RiderCommissionRate | null>(
    null,
  );

  const { createMutation, updateMutation, deleteMutation } =
    useRiderCommissionRateMutations({
      onSuccess: () => {
        setDialogOpen(false);
        setDeleteTarget(null);
        setForm(emptyForm);
        setEditingRate(null);
      },
      onError: (err) => {
        toast.error(err.message || "Something went wrong");
      },
    });

  const isPending =
    createMutation.isPending ||
    updateMutation.isPending ||
    deleteMutation.isPending;

  // ── Open create dialog ───────────────────────────────────────────────────────
  function openCreate() {
    setEditingRate(null);
    setForm(emptyForm);
    setFormError(null);
    setDialogOpen(true);
  }

  // ── Open edit dialog ─────────────────────────────────────────────────────────
  function openEdit(rate: RiderCommissionRate) {
    setEditingRate(rate);
    setForm({
      order_min_amount: rate.order_min_amount,
      order_max_amount: rate.order_max_amount ?? "",
      commission_amount: rate.commission_amount,
    });
    setFormError(null);
    setDialogOpen(true);
  }

  // ── Validate ─────────────────────────────────────────────────────────────────
  function validate(): boolean {
    if (
      !form.order_min_amount ||
      isNaN(Number(form.order_min_amount)) ||
      Number(form.order_min_amount) < 0
    ) {
      setFormError("Min Orders is required and must be a valid number.");
      return false;
    }
    if (form.order_max_amount && isNaN(Number(form.order_max_amount))) {
      setFormError("Max Orders must be a valid number.");
      return false;
    }
    if (
      form.order_max_amount &&
      Number(form.order_max_amount) <= Number(form.order_min_amount)
    ) {
      setFormError("Max Orders must be greater than Min Orders.");
      return false;
    }
    if (
      !form.commission_amount ||
      isNaN(Number(form.commission_amount)) ||
      Number(form.commission_amount) < 0
    ) {
      setFormError("Commission Amount is required and must be ≥ 0.");
      return false;
    }
    setFormError(null);
    return true;
  }

  // ── Submit ───────────────────────────────────────────────────────────────────
  function handleSubmit() {
    if (!validate()) return;

    const payload = {
      order_min_amount: form.order_min_amount,
      order_max_amount: form.order_max_amount || null,
      commission_amount: form.commission_amount,
    };

    if (editingRate) {
      updateMutation.mutate({ id: editingRate.id, payload });
    } else {
      createMutation.mutate(payload as Omit<RiderCommissionRate, "id">);
    }
  }

  // ── Auth skeleton ────────────────────────────────────────────────────────────
  if (isAuthLoading) {
    return (
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
        <div className="rounded-md border p-6 space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <RoleGuard allowedRoles={[Role.YDM_Logistics, Role.YDM_Operator]}>
      <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-6">
        {/* ── Page header ───────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
              Commission Rates
            </h1>
            <p className="text-gray-500 mt-1 text-sm">
              Define commission slabs applied to rider payouts based on number
              of orders delivered.
            </p>
          </div>
          <Button
            id="add-commission-rate-btn"
            onClick={openCreate}
            className="w-fit self-start sm:self-auto"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Rate
          </Button>
        </div>

        {/* ── Table / States ────────────────────────────────────────────────── */}
        <div className="border-t">
          {isLoading ? (
            <div className="p-8 space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <AlertCircle className="h-10 w-10 text-destructive" />
              <p className="text-sm font-medium text-gray-700">
                Failed to load commission rates
              </p>
              <p className="text-xs text-gray-400">
                {error?.message || "Unknown error"}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                className="mt-2"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          ) : rates.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
              <Percent className="h-12 w-12 text-gray-300" />
              <p className="text-sm font-semibold text-gray-600">
                No commission rates configured
              </p>
              <p className="text-xs text-gray-400">
                Click &quot;Add Rate&quot; to create your first slab.
              </p>
            </div>
          ) : (
            <>
              {/* Desktop */}
              <div className="hidden md:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 hover:bg-gray-50">
                      <TableHead className="w-12 font-semibold">S.N.</TableHead>
                      <TableHead className="font-semibold">
                        Min Orders
                      </TableHead>
                      <TableHead className="font-semibold">
                        Max Orders
                      </TableHead>
                      <TableHead className="font-semibold">
                        Commission (Rs.)
                      </TableHead>
                      <TableHead className="font-semibold text-right">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rates.map((rate, idx) => (
                      <TableRow
                        key={rate.id}
                        className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                        onClick={() => openEdit(rate)}
                      >
                        <TableCell className="text-gray-400 text-sm">
                          {idx + 1}
                        </TableCell>
                        <TableCell className="font-medium">
                          {Number(rate.order_min_amount).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {rate.order_max_amount ? (
                            <span>
                              {Number(rate.order_max_amount).toLocaleString()}
                            </span>
                          ) : (
                            <Badge
                              variant="secondary"
                              className="flex items-center gap-1 w-fit"
                            >
                              <Infinity className="h-3 w-3" />
                              No limit
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <span className="font-semibold text-primary">
                            Rs.{" "}
                            {Number(rate.commission_amount).toLocaleString()}
                          </span>
                        </TableCell>
                        <TableCell
                          className="text-right"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              id={`edit-rate-${rate.id}`}
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                openEdit(rate);
                              }}
                              className="cursor-pointer h-8 w-8 p-0 text-muted-foreground hover:text-primary"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              id={`delete-rate-${rate.id}`}
                              variant="ghost"
                              size="sm"
                              className="cursor-pointer h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteTarget(rate);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile */}
              <div className="md:hidden divide-y">
                {rates.map((rate, idx) => (
                  <div
                    key={rate.id}
                    className="p-4 space-y-2 hover:bg-gray-50/50 cursor-pointer"
                    onClick={() => openEdit(rate)}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400">#{idx + 1}</span>
                      <div
                        className="flex gap-1"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            openEdit(rate);
                          }}
                          className="cursor-pointer h-8 w-8 p-0 text-muted-foreground hover:text-primary"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="cursor-pointer h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteTarget(rate);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <p className="text-xs text-gray-400">Min Orders</p>
                        <p className="font-medium">
                          {Number(rate.order_min_amount).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Max Orders</p>
                        {rate.order_max_amount ? (
                          <p className="font-medium">
                            {Number(rate.order_max_amount).toLocaleString()}
                          </p>
                        ) : (
                          <Badge
                            variant="secondary"
                            className="flex items-center gap-1 w-fit text-xs"
                          >
                            <Infinity className="h-3 w-3" />
                            No limit
                          </Badge>
                        )}
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Commission</p>
                        <p className="font-semibold text-primary">
                          Rs. {Number(rate.commission_amount).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Create / Edit Dialog ───────────────────────────────────────────────── */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingRate ? "Edit Commission Rate" : "Add Commission Rate"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Min Orders */}
            <div className="space-y-1.5">
              <Label htmlFor="order_min_amount">
                Min Orders <span className="text-destructive">*</span>
              </Label>
              <Input
                id="order_min_amount"
                type="number"
                min={0}
                step="1"
                placeholder="e.g. 1"
                value={form.order_min_amount}
                onChange={(e) =>
                  setForm((f) => ({ ...f, order_min_amount: e.target.value }))
                }
              />
            </div>

            {/* Max Orders */}
            <div className="space-y-1.5">
              <Label htmlFor="order_max_amount">
                Max Orders{" "}
                <span className="text-muted-foreground text-xs">
                  (leave blank = no upper limit)
                </span>
              </Label>
              <Input
                id="order_max_amount"
                type="number"
                min={0}
                step="1"
                placeholder="e.g. 50"
                value={form.order_max_amount}
                onChange={(e) =>
                  setForm((f) => ({ ...f, order_max_amount: e.target.value }))
                }
              />
            </div>

            {/* Commission Amount */}
            <div className="space-y-1.5">
              <Label htmlFor="commission_amount">
                Commission Amount (Rs.){" "}
                <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  Rs.
                </span>
                <Input
                  id="commission_amount"
                  type="number"
                  min={0}
                  step="0.01"
                  className="pl-9"
                  placeholder="0.00"
                  value={form.commission_amount}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      commission_amount: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            {/* Form error */}
            {formError && (
              <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                {formError}
              </div>
            )}
          </div>

          <DialogFooter className="gap-2">
            <DialogClose asChild>
              <Button variant="outline" disabled={isPending}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              id="submit-commission-rate"
              onClick={handleSubmit}
              disabled={isPending}
            >
              {isPending
                ? "Saving..."
                : editingRate
                  ? "Save Changes"
                  : "Create Rate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Delete confirmation ─────────────────────────────────────────────────── */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Commission Rate?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the slab{" "}
              <strong>
                {deleteTarget
                  ? Number(deleteTarget.order_min_amount).toLocaleString()
                  : ""}
                {" orders — "}
                {deleteTarget?.order_max_amount
                  ? `${Number(deleteTarget.order_max_amount).toLocaleString()} orders`
                  : "No limit"}
              </strong>
              . This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              id="confirm-delete-commission-rate"
              onClick={() =>
                deleteTarget && deleteMutation.mutate(deleteTarget.id)
              }
              disabled={isPending}
              className="bg-destructive hover:bg-destructive/90"
            >
              {deleteMutation.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </RoleGuard>
  );
}
