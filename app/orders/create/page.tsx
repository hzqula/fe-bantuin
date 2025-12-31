"use client";

import { useState, Suspense, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import PublicLayout from "@/components/layouts/PublicLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  TbLoader,
  TbAlertCircle,
  TbFileUpload,
  TbTrash,
  TbFileDescription, // Icon baru untuk file
} from "react-icons/tb";
import { uploadBuyerOrderPhoto, deleteFile } from "@/lib/upload";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import Cropper from "react-easy-crop";
import getCroppedImg from "@/lib/cropImage";

const CreateOrderContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceId = searchParams.get("serviceId");
  const { isAuthenticated, loading: authLoading, user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [requirements, setRequirements] = useState("");
  const [attachments, setAttachments] = useState<
    Array<{ url: string; path: string }>
  >([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Crop State
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);
  const [isCropping, setIsCropping] = useState(false);
  const [selectedFileForUpload, setSelectedFileForUpload] =
    useState<File | null>(null);

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

    const file = files[0];

    // If image, open cropper
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImageSrc(reader.result as string);
        setIsCropping(true);
        setSelectedFileForUpload(file);
      });
      reader.readAsDataURL(file);
      e.target.value = "";
    } else {
      await processFileUpload(file);
      e.target.value = "";
    }
  };

  const processFileUpload = async (file: File) => {
    setUploading(true);
    setError("");
    try {
      const orderName = `order-${Date.now()}`;
      const result = await uploadBuyerOrderPhoto(
        file,
        user!.fullName,
        orderName,
        user!.nim
      );

      setAttachments((prev) => [
        ...prev,
        {
          url: result.data.url,
          path: result.data.path,
        },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengupload file");
    } finally {
      setUploading(false);
    }
  };

  const onCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleCropConfirm = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    try {
      setUploading(true);
      const croppedBlob = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        rotation
      );

      if (croppedBlob) {
        const file = new File(
          [croppedBlob],
          selectedFileForUpload?.name || "image.jpg",
          { type: "image/jpeg" }
        );
        await processFileUpload(file);
      }
      setIsCropping(false);
      setImageSrc(null);
    } catch (e) {
      console.error(e);
      setError("Gagal memproses gambar");
      setUploading(false);
    }
  };

  const handleRemoveAttachment = async (index: number) => {
    const attachment = attachments[index];
    if (!attachment) return;

    try {
      await deleteFile(attachment.path);
      setAttachments((prev) => prev.filter((_, i) => i !== index));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal menghapus file");
      setAttachments((prev) => prev.filter((_, i) => i !== index));
    }
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
          attachments: attachments.map((att) => att.url),
        }),
      });

      const data = await res.json();

      if (data.success) {
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

  // Helper untuk mengambil nama file dari URL
  const getFileName = (url: string) => {
    try {
      const decodedUrl = decodeURIComponent(url);
      return decodedUrl.split("/").pop() || "File Attachment";
    } catch (e) {
      return "File Attachment";
    }
  };

  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground leading-tight font-display">
            Detail Pesanan
          </h1>
          <p className="text-muted-foreground text-sm">
            Lengkapi formulir di bawah ini agar penyedia jasa dapat memahami
            kebutuhan Anda dengan baik.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Main Grid Layout: 2 Columns on Desktop, 1 on Mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* COLUMN 1: REQUIREMENTS */}
            <div className="space-y-4 h-full flex flex-col">
              <Label htmlFor="requirements" className="text-base font-semibold">
                Kebutuhan Pekerjaan <span className="text-destructive">*</span>
              </Label>
              <div className="flex-1 flex flex-col gap-2">
                <Textarea
                  id="requirements"
                  placeholder="Jelaskan secara detail apa yang Anda butuhkan. Contoh: Warna preferensi, gaya desain, referensi, atau instruksi khusus lainnya..."
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  className="flex-1 min-h-[300px] bg-background resize-none p-4 leading-relaxed placeholder:text-xs md:placeholder:text-sm  border-primary"
                  required
                />
                <p className="text-xs text-muted-foreground text-right">
                  Minimal ({requirements.length} / 20 karakter)
                </p>
              </div>
            </div>

            {/* COLUMN 2: ATTACHMENTS */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">
                Lampiran File (Opsional)
              </Label>

              {/* Upload Area */}
              <div
                onClick={() => !uploading && fileInputRef.current?.click()}
                className={`
                  relative border-2 bg-background border-dashed border-primary p-8
                  flex flex-col items-center justify-center text-center cursor-pointer transition-all
                  hover:bg-muted/50
                  ${
                    uploading
                      ? "border-muted-foreground/20 opacity-50 cursor-not-allowed"
                      : "border-muted-foreground/30 hover:border-primary"
                  }
                `}
              >
                {uploading ? (
                  <div className="flex flex-col items-center text-muted-foreground">
                    <TbLoader className="h-8 w-8 animate-spin mb-3 text-primary" />
                    <span className="text-sm font-medium">Mengupload...</span>
                  </div>
                ) : (
                  <>
                    <div className="bg-background p-3 rounded-full border border-primary mb-3">
                      <TbFileUpload className="h-6 w-6 text-primary" />
                    </div>
                    <p className="text-sm font-medium text-foreground mb-1">
                      Klik untuk upload file
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Gambar (JPG, PNG) atau Dokumen (PDF, DOCX)
                    </p>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={handleFileSelect}
                  className="hidden"
                  disabled={uploading}
                />
              </div>

              {/* Attachments List (Preview Names Only) */}
              {attachments.length > 0 && (
                <div className="space-y-3 mt-4">
                  <Label className="text-sm text-secondary">
                    File Terlampir ({attachments.length})
                  </Label>
                  <div className="space-y-2">
                    {attachments.map((attachment, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 bg-card border border-border"
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center shrink-0">
                            <TbFileDescription className="h-5 w-5 text-primary" />
                          </div>
                          <span className="text-sm text-foreground truncate font-medium max-w-[200px] sm:max-w-[250px]">
                            {getFileName(attachment.url)}
                          </span>
                        </div>
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          onClick={() => handleRemoveAttachment(idx)}
                          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        >
                          <TbTrash className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Section (Full Width) */}
          <div className="space-y-6 pt-6 border-t border-primary">
            {error && (
              <div className="bg-destructive/10 text-destructive p-4 rounded-lg flex items-center gap-3 text-sm">
                <TbAlertCircle className="h-5 w-5 shrink-0" /> {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={loading || requirements.length < 20}
            >
              {loading ? (
                <>
                  <TbLoader className="animate-spin mr-2" /> Memproses...
                </>
              ) : (
                "Lanjutkan ke Pembayaran"
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* Cropper Modal */}
      <Dialog open={isCropping} onOpenChange={setIsCropping}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Sesuaikan Gambar</DialogTitle>
            <DialogDescription>
              Sesuaikan area gambar sebelum mengupload.
            </DialogDescription>
          </DialogHeader>

          <div className="relative h-64 w-full bg-slate-900 rounded-md overflow-hidden mt-4">
            {imageSrc && (
              <Cropper
                image={imageSrc || undefined}
                crop={crop}
                zoom={zoom}
                rotation={rotation}
                aspect={1}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            )}
          </div>

          <div className="py-4 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground w-12">Zoom</span>
              <Slider
                value={[zoom]}
                min={1}
                max={3}
                step={0.1}
                onValueChange={(value) => setZoom(value[0])}
                className="flex-1"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground w-12">Rotasi</span>
              <Slider
                value={[rotation]}
                min={0}
                max={360}
                step={1}
                onValueChange={(value) => setRotation(value[0])}
                className="flex-1"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCropping(false)}
              disabled={uploading}
            >
              Batal
            </Button>
            <Button onClick={handleCropConfirm} disabled={uploading}>
              {uploading ? "Mengupload..." : "Simpan & Upload"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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
