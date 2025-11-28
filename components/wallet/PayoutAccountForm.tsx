"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { TbPlus, TbCreditCard } from "react-icons/tb";

export interface PayoutAccountFormData {
  bankName: string;
  accountName: string;
  accountNumber: string;
}

interface PayoutAccountFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

// Menggunakan Arrow Function
const PayoutAccountForm = ({
  open,
  onOpenChange,
  onSuccess,
}: PayoutAccountFormProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<PayoutAccountFormData>({
    bankName: "",
    accountName: "",
    accountNumber: "",
  });

  const handleChange = (field: keyof PayoutAccountFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.bankName || !formData.accountName || !formData.accountNumber) {
      setError("Semua field wajib diisi");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch("/api/wallet/payout-accounts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        onSuccess();
        onOpenChange(false);
        // Reset form
        setFormData({ bankName: "", accountName: "", accountNumber: "" });
      } else {
        setError(data.error || "Gagal menambahkan rekening");
      }
    } catch (err) {
      setError("Terjadi kesalahan sistem");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[80vh]">
        <DrawerHeader>
          <DrawerTitle className="flex items-center gap-2">
            <TbCreditCard /> Tambah Rekening Bank
          </DrawerTitle>
          <DrawerDescription>
            Rekening ini akan digunakan untuk penarikan dana.
          </DrawerDescription>
        </DrawerHeader>

        <form onSubmit={handleSubmit} className="px-4 overflow-y-auto">
          <div className="space-y-4 pb-6">
            {/* Bank Name */}
            <div className="space-y-2">
              <Label htmlFor="bankName">Nama Bank</Label>
              <Input
                id="bankName"
                value={formData.bankName}
                onChange={(e) => handleChange("bankName", e.target.value)}
                placeholder="Contoh: BNI, Mandiri, Bank Riau Kepri"
                required
              />
            </div>

            {/* Account Name */}
            <div className="space-y-2">
              <Label htmlFor="accountName">Nama Pemilik Rekening</Label>
              <Input
                id="accountName"
                value={formData.accountName}
                onChange={(e) => handleChange("accountName", e.target.value)}
                placeholder="Sesuai nama di buku tabungan"
                required
              />
            </div>

            {/* Account Number */}
            <div className="space-y-2">
              <Label htmlFor="accountNumber">Nomor Rekening</Label>
              <Input
                id="accountNumber"
                type="number"
                value={formData.accountNumber}
                onChange={(e) => handleChange("accountNumber", e.target.value)}
                placeholder="Contoh: 1234567890"
                required
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm">
                {error}
              </div>
            )}
          </div>
        </form>

        <DrawerFooter>
          <Button onClick={handleSubmit} disabled={loading} className="w-full">
            {loading ? "Menyimpan..." : "Simpan Rekening"}
          </Button>
          <DrawerClose asChild>
            <Button variant="outline" className="w-full">
              Batal
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default PayoutAccountForm;