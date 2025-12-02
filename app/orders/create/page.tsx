"use client";

import { useState, Suspense, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import PublicLayout from "@/components/layouts/PublicLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { TbLoader, TbAlertCircle, TbX } from "react-icons/tb";
import { uploadBuyerOrderPhoto } from "@/lib/upload";

const CreateOrderContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceId = searchParams.get("serviceId");
  const { isAuthenticated, loading: authLoading, user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [requirements, setRequirements] = useState("");
  const [attachments, setAttachments] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (authLoading) return <div className="p-8 text-center">Loading...</div>;
  if (!isAuthenticated) {
    router.push("/auth/login");
    return null;
  }
  if (!serviceId) {
    router.push("/services");
    return null;
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !user) return;

    setUploading(true);
    setError("");

    try {
      const orderName = `order-${Date.now()}`;
      const uploadPromises = Array.from(files).map((file) => uploadBuyerOrderPhoto(file, user.fullName, orderName, user.nim));

      const results = await Promise.all(uploadPromises);
      const newUrls = results.map((result) => result.data.url);
      setAttachments((prev) => [...prev, ...newUrls]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengupload file");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          serviceId,
          requirements,
          attachments,
        }),
      });

      const data = await res.json();

      if (data.success) {
        // Redirect ke halaman detail order untuk pembayaran
        router.push(`/orders/${data.data.id}`);
      } else {
        setError(data.error || "Gagal membuat pesanan");
      }
    } catch (err) {
      setError("Terjadi kesalahan sistem");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-display text-primary">Detail Pesanan</CardTitle>
            <p className="text-muted-foreground">Jelaskan kebutuhan Anda kepada penyedia jasa secara detail.</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="requirements">
                  Kebutuhan Pekerjaan <span className="text-destructive">*</span>
                </Label>
                <Textarea id="requirements" placeholder="Contoh: Saya butuh desain logo yang minimalis dengan warna biru..." value={requirements} onChange={(e) => setRequirements(e.target.value)} className="min-h-[150px]" required />
                <p className="text-xs text-muted-foreground">Minimal 20 karakter. Semakin detail semakin baik.</p>
              </div>

              <div className="space-y-2">
                <Label>Lampiran Pendukung (Opsional)</Label>
                <div className="flex gap-2">
                  <Input ref={fileInputRef} type="file" multiple accept="image/*,.pdf,.doc,.docx" onChange={handleFileSelect} disabled={uploading} className="flex-1" />
                  {uploading && (
                    <div className="flex items-center text-sm text-muted-foreground">
                      <TbLoader className="animate-spin mr-2" />
                      Mengupload...
                    </div>
                  )}
                </div>
                {attachments.length > 0 && (
                  <div className="space-y-2 mt-2">
                    {attachments.map((url, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm p-2 bg-muted/50 rounded">
                        <span className="truncate flex-1">{url}</span>
                        <Button type="button" size="icon-sm" variant="ghost" onClick={() => handleRemoveAttachment(idx)} className="h-6 w-6">
                          <TbX className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-xs text-muted-foreground">Upload file pendukung untuk membantu penyedia jasa memahami kebutuhan Anda</p>
              </div>

              {error && (
                <div className="bg-destructive/10 text-destructive p-3 rounded-md flex items-center gap-2 text-sm">
                  <TbAlertCircle /> {error}
                </div>
              )}

              <Button type="submit" className="w-full" size="lg" disabled={loading || requirements.length < 20}>
                {loading ? (
                  <>
                    <TbLoader className="animate-spin mr-2" /> Memproses...
                  </>
                ) : (
                  "Buat Pesanan & Lanjut Pembayaran"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </PublicLayout>
  );
};

export default function CreateOrderPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateOrderContent />
    </Suspense>
  );
}
