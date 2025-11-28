"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { TbAlertTriangle, TbLoader } from "react-icons/tb";

interface RejectPayoutFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payoutId: string | null;
  onSuccess: () => void;
}

// Menggunakan Arrow Function
const RejectPayoutForm = ({
  open,
  onOpenChange,
  payoutId,
  onSuccess,
}: RejectPayoutFormProps) => {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!payoutId) return;
    if (reason.length < 10) {
      setError("Alasan penolakan minimal 10 karakter.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("access_token");
      // Memanggil Next.js API Proxy untuk Reject
      const response = await fetch(`/api/admin/payouts/${payoutId}/reject`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason }),
      });

      const data = await response.json();

      if (data.success) {
        onSuccess();
        onOpenChange(false);
        setReason("");
        alert(data.message || "Penarikan berhasil ditolak.");
      } else {
        setError(data.error || "Gagal menolak penarikan.");
      }
    } catch (err) {
      setError("Terjadi kesalahan sistem.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[80vh]">
        <DrawerHeader>
          <DrawerTitle className="flex items-center gap-2 text-destructive">
            <TbAlertTriangle /> Tolak Permintaan Penarikan
          </DrawerTitle>
          <DrawerDescription>
            Dana akan dikembalikan ke saldo user. Harap berikan alasan yang jelas.
          </DrawerDescription>
        </DrawerHeader>

        <form onSubmit={handleSubmit} className="px-4 overflow-y-auto">
          <div className="space-y-4 pb-6">
            <div className="space-y-2">
              <Label htmlFor="reason">
                Alasan Penolakan <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="reason"
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  setError("");
                }}
                placeholder="Contoh: Nomor rekening tidak valid, atau batas penarikan belum terpenuhi."
                required
                rows={4}
              />
              <p className="text-xs text-muted-foreground">
                {reason.length}/10 karakter minimal.
              </p>
            </div>

            {error && (
              <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">
                {error}
              </div>
            )}
          </div>
        </form>

        <DrawerFooter>
          <Button
            onClick={handleSubmit}
            disabled={loading || reason.length < 10}
            variant="destructive"
            className="w-full"
          >
            {loading ? (
                <>
                    <TbLoader className="animate-spin mr-2" /> Memproses...
                </>
            ) : "Konfirmasi Penolakan"}
          </Button>
          <DrawerClose asChild>
            <Button variant="outline" className="w-full" disabled={loading}>
              Batal
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default RejectPayoutForm;