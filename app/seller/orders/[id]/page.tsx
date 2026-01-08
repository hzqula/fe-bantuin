"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { useChat } from "@/contexts/ChatContext";
import SellerLayout from "@/components/layouts/SellerLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { addDays } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  TbPackage,
  TbShield,
  TbSparkles,
  TbFileDescription,
  TbStar,
  TbRefresh,
  TbDownload,
  TbSend,
  TbArrowLeft,
  TbBriefcase,
  TbPlus,
  TbLoader,
  TbX,
  TbMessageCircle,
  TbClock,
  TbUser,
  TbCalendar,
  TbCheck,
  TbAlertCircle,
  TbPhoto,
  TbFileText,
  TbCreditCard,
  TbTool,
  TbCircleCheck,
} from "react-icons/tb";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { uploadSellerOrderPhoto } from "@/lib/upload";
import { toast } from "sonner";

const SellerOrderDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, loading: authLoading, user } = useAuth();
  const { openChatWith } = useChat();

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [showProgressDialog, setShowProgressDialog] = useState(false);
  const [showDeliverDialog, setShowDeliverDialog] = useState(false);

  // Rejection State
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectLoading, setRejectLoading] = useState(false);

  const [progressTitle, setProgressTitle] = useState("");
  const [progressDesc, setProgressDesc] = useState("");
  const [progressFiles, setProgressFiles] = useState<string[]>([]);
  const [progressUploading, setProgressUploading] = useState(false);
  const progressFileInputRef = useRef<HTMLInputElement>(null);

  const [deliveryNote, setDeliveryNote] = useState("");
  const [deliveryFiles, setDeliveryFiles] = useState<string[]>([]);
  const [deliveryUploading, setDeliveryUploading] = useState(false);
  const deliveryFileInputRef = useRef<HTMLInputElement>(null);

  const fetchOrder = useCallback(async () => {
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`/api/orders/${params.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setOrder(data.data);
    } catch (error) {
      console.error("Error fetching order:", error);
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push("/auth/login");
      } else {
        fetchOrder();
      }
    }
  }, [authLoading, isAuthenticated, fetchOrder, router]);

  const handleStartWork = async () => {
    try {
      const token = localStorage.getItem("access_token");
      await fetch(`/api/orders/${order?.id}/start`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Pekerjaan dimulai! Semangat 💪");
      fetchOrder();
    } catch (e) {
      toast.error("Gagal memulai pekerjaan");
    }
  };

  const handleRejectOrder = async () => {
    if (rejectReason.length < 10) {
      toast.error("Alasan penolakan minimal 10 karakter");
      return;
    }
    setRejectLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`/api/orders/${order?.id}/cancel/seller`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason: rejectReason }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Pesanan ditolak. Dana akan dikembalikan ke Buyer.");
        setShowRejectDialog(false);
        fetchOrder();
      } else {
        toast.error(data.error || "Gagal menolak pesanan");
      }
    } catch (e) {
      toast.error("Terjadi kesalahan sistem");
    } finally {
      setRejectLoading(false);
    }
  };

  const handleProgressFileSelect = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !user) return;

    setProgressUploading(true);

    try {
      const orderName = `order-${order?.id || Date.now()}`;
      const uploadPromises = Array.from(files).map((file) =>
        uploadSellerOrderPhoto(file, user.fullName, orderName, user.nim)
      );

      const results = await Promise.all(uploadPromises);
      const newUrls = results.map((result) => result.data.url);
      setProgressFiles((prev) => [...prev, ...newUrls]);
    } catch (err: any) {
      alert(err.message || "Gagal mengupload file");
    } finally {
      setProgressUploading(false);
      if (progressFileInputRef.current) {
        progressFileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveProgressFile = (index: number) => {
    setProgressFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmitProgress = async () => {
    try {
      const token = localStorage.getItem("access_token");
      await fetch(`/api/orders/${order?.id}/progress`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: progressTitle,
          description: progressDesc,
          images: progressFiles,
        }),
      });
      toast.success("Progress berhasil diupdate");
      setShowProgressDialog(false);
      setProgressTitle("");
      setProgressDesc("");
      setProgressFiles([]);
      fetchOrder();
    } catch (e) {
      toast.error("Gagal update progress");
    }
  };

  const handleDeliveryFileSelect = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !user) return;

    setDeliveryUploading(true);

    try {
      const orderName = `order-${order?.id || Date.now()}`;
      const uploadPromises = Array.from(files).map((file) =>
        uploadSellerOrderPhoto(file, user.fullName, orderName, user.nim)
      );

      const results = await Promise.all(uploadPromises);
      const newUrls = results.map((result) => result.data.url);
      setDeliveryFiles((prev) => [...prev, ...newUrls]);
    } catch (err: any) {
      alert(err.message || "Gagal mengupload file");
    } finally {
      setDeliveryUploading(false);
      if (deliveryFileInputRef.current) {
        deliveryFileInputRef.current.value = "";
      }
    }
  };

  const handleRemoveDeliveryFile = (index: number) => {
    setDeliveryFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmitDeliver = async () => {
    try {
      const token = localStorage.getItem("access_token");
      await fetch(`/api/orders/${order?.id}/deliver`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          deliveryNote,
          deliveryFiles: deliveryFiles,
        }),
      });
      setShowDeliverDialog(false);
      setDeliveryNote("");
      setDeliveryFiles([]);
      fetchOrder();
    } catch (e) {
      alert("Gagal mengirim hasil");
    }
  };

  const isValidImageUrl = (url: string) => {
    return (
      url?.startsWith("http://") ||
      url?.startsWith("https://") ||
      url?.startsWith("/")
    );
  };

  if (loading || authLoading)
    return (
      <SellerLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </SellerLayout>
    );

  if (!order)
    return (
      <SellerLayout>
        <div className="container mx-auto py-12 text-center">
          <p className="text-xl">Pesanan tidak ditemukan</p>
        </div>
      </SellerLayout>
    );

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      DRAFT: "bg-gray-200 text-gray-700",
      WAITING_PAYMENT: "bg-yellow-100 text-yellow-700 border-yellow-200",
      PAID_ESCROW: "bg-blue-100 text-blue-700 border-blue-200",
      IN_PROGRESS: "bg-purple-100 text-purple-700 border-purple-200",
      REVISION: "bg-orange-100 text-orange-700 border-orange-200",
      DELIVERED: "bg-orange-100 text-orange-700 border-orange-200",
      COMPLETED: "bg-green-100 text-green-700 border-green-200",
      CANCELLED: "bg-red-100 text-red-700 border-red-200",
    };
    return (
      <Badge
        variant="outline"
        className={`${styles[status] || "bg-gray-100"} px-3 py-1`}
      >
        {status.replace("_", " ")}
      </Badge>
    );
  };

  const getOrderProgress = () => {
    const statuses = [
      { key: "DRAFT", label: "Draf", icon: TbFileText },
      { key: "WAITING_PAYMENT", label: "Menunggu", icon: TbClock },
      { key: "PAID_ESCROW", label: "Dibayar", icon: TbCreditCard },
      { key: "IN_PROGRESS", label: "Proses", icon: TbTool },
      { key: "DELIVERED", label: "Diserahkan", icon: TbPackage },
      { key: "COMPLETED", label: "Selesai", icon: TbCircleCheck },
    ];
    const currentIndex = statuses.findIndex((s) => s.key === order.status);
    return { statuses, currentIndex };
  };

  const { statuses, currentIndex } = getOrderProgress();

  // --- LOGIC KALENDER ---
  const paymentDate = new Date(order.dueDate);
  const deliveryDays = order.service.deliveryTime;
  const completionDate = addDays(paymentDate, deliveryDays);

  const dateRange = {
    from: paymentDate,
    to: completionDate,
  };

  return (
    <SellerLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button
            variant="ghost"
            className="pl-0 mb-2 hover:bg-transparent hover:text-primary text-muted-foreground"
            onClick={() => router.push("/seller/orders")}
          >
            <TbArrowLeft className="mr-2 h-4 w-4" /> Kembali
          </Button>
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground leading-tight font-display">
              Pesanan #{order.id.substring(0, 8)}
            </h1>
            {getStatusBadge(order.status)}
          </div>
        </div>

        {/* Grid Container */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-6">
            {/* TRACKING SECTION */}
            <div className="w-full mx-auto mb-8 bg-card border border-primary">
              <div className="bg-teal-700 px-6 py-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  Status Pesanan
                </h2>
              </div>

              {/* Desktop View Tracking */}
              <div className="hidden md:block p-8">
                <div className="flex items-center justify-between">
                  {statuses.map((status, index) => {
                    const isActive = index <= currentIndex;
                    const isCurrent = index === currentIndex;
                    const Icon = status.icon;

                    return (
                      <div
                        key={status.key}
                        className="flex items-center flex-1"
                      >
                        <div className="flex flex-col items-center w-full">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                              isActive
                                ? "bg-primary text-white"
                                : "bg-gray-200 text-gray-400"
                            }`}
                          >
                            {index < currentIndex ? (
                              <TbCheck className="w-5 h-5" />
                            ) : (
                              <Icon className="w-5 h-5" />
                            )}
                          </div>
                          <p
                            className={`text-xs font-medium mt-2 text-center ${
                              isActive ? "text-gray-800" : "text-gray-400"
                            }`}
                          >
                            {status.label}
                          </p>
                          {isCurrent && (
                            <span className="text-[10px] text-teal-600 font-medium mt-0.5">
                              Saat ini
                            </span>
                          )}
                        </div>
                        {index < statuses.length - 1 && (
                          <div className="flex-1 h-1 mx-2 -mt-6">
                            <div
                              className={`h-full ${
                                index < currentIndex
                                  ? "bg-teal-600"
                                  : "bg-gray-200"
                              }`}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Mobile View Tracking */}
              <div className="md:hidden p-6 space-y-3">
                {statuses.map((status, index) => {
                  const isActive = index <= currentIndex;
                  const isCurrent = index === currentIndex;
                  const Icon = status.icon;

                  return (
                    <div key={status.key} className="flex items-start gap-3">
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            isActive
                              ? "bg-primary text-white"
                              : "bg-gray-200 text-gray-400"
                          }`}
                        >
                          {index < currentIndex ? (
                            <TbCheck className="w-4 h-4" />
                          ) : (
                            <Icon className="w-4 h-4" />
                          )}
                        </div>
                        {index < statuses.length - 1 && (
                          <div
                            className={`w-0.5 h-8 mt-1 ${
                              index < currentIndex
                                ? "bg-teal-600"
                                : "bg-gray-200"
                            }`}
                          />
                        )}
                      </div>
                      <div className="pt-1">
                        <p
                          className={`text-sm font-medium ${
                            isActive ? "text-gray-800" : "text-gray-400"
                          }`}
                        >
                          {status.label}
                        </p>
                        {isCurrent && (
                          <span className="text-xs text-teal-600 font-medium">
                            Sedang berlangsung
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* SERVICE INFO SECTION */}
            <section>
              <div className="flex flex-col gap-6 sm:flex-row">
                <img
                  src={order.service.images[0] || "/placeholder.svg"}
                  alt={order.service.title}
                  className="h-32 w-full sm:w-48 overflow-hidden rounded-lg bg-slate-100 border border-slate-200 object-cover"
                />
                <div className="flex flex-1 flex-col gap-2">
                  <div>
                    <h3 className="text-2xl font-display font-extrabold">
                      {order.service.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-secondary line-clamp-2">
                      {order.service.description}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                    <Badge className="pr-4 bg-teal-900">
                      <TbClock className="h-4 w-4" />
                      <span>{order.service.deliveryTime} Hari Kerja</span>
                    </Badge>
                    <Badge className="pr-4 bg-teal-900">
                      <TbRefresh className="h-4 w-4" />
                      <span>{order.service.revisions} Revisi</span>
                    </Badge>
                  </div>
                </div>
              </div>
            </section>

            {/* REQUIREMENTS SECTION */}
            <div>
              <h3 className="text-2xl font-display font-extrabold">
                Permintaan Pembeli
              </h3>
              <span className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                {order.requirements}
              </span>
            </div>

            {/* FILES & ATTACHMENTS (Using Tabs style) */}
            <div>
              <h3 className="text-2xl font-display font-extrabold mb-4">
                File & Lampiran
              </h3>
              <Tabs defaultValue="buyer-files" className="w-full">
                <TabsList className="w-full grid grid-cols-2 mb-4">
                  <TabsTrigger value="buyer-files">Dari Pembeli</TabsTrigger>
                  <TabsTrigger value="seller-files">
                    Hasil Kerja Anda
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="buyer-files">
                  {order.attachments?.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                      {order.attachments.map((url: string, idx: number) => {
                        const fileName =
                          url.split("/").pop() || `File ${idx + 1}`;
                        const isImage = /\.(jpg|jpeg|png|webp)$/i.test(url);
                        return (
                          <a
                            key={idx}
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-3 border border-slate-200 bg-white px-3 py-2 transition-all hover:bg-slate-50 hover:border-primary/50 group rounded-lg"
                          >
                            {isImage ? (
                              <TbPhoto className="h-5 w-5 text-blue-500" />
                            ) : (
                              <TbFileDescription className="h-5 w-5 text-red-500" />
                            )}
                            <div className="flex flex-col">
                              <span className="text-xs font-medium text-slate-700 truncate max-w-[150px]">
                                {fileName}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                Klik untuk unduh
                              </span>
                            </div>
                          </a>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      Tidak ada lampiran dari pembeli.
                    </p>
                  )}
                </TabsContent>

                <TabsContent value="seller-files">
                  {order.deliveryFiles?.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                      {order.deliveryFiles.map((url: string, idx: number) => {
                        const fileName =
                          url.split("/").pop() || `Hasil ${idx + 1}`;
                        return (
                          <a
                            key={idx}
                            href={url}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-3 border border-slate-200 bg-white px-3 py-2 transition-all hover:bg-slate-50 hover:border-primary/50 group rounded-lg"
                          >
                            <TbCheck className="h-5 w-5 text-green-500" />
                            <div className="flex flex-col">
                              <span className="text-xs font-medium text-slate-700 truncate max-w-[150px]">
                                {fileName}
                              </span>
                              <span className="text-[10px] text-slate-400">
                                Hasil kerja Anda
                              </span>
                            </div>
                          </a>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      Anda belum mengunggah hasil kerja.
                    </p>
                  )}
                </TabsContent>
              </Tabs>
            </div>

            {/* PROGRESS LOGS & REVISION NOTES */}
            {(order.progressLogs?.length > 0 ||
              (order.revisionNotes && order.revisionNotes.length > 0)) && (
              <div className="space-y-6 pt-6 border-t">
                {/* Revision Notes */}
                {order.revisionNotes?.length > 0 && (
                  <div className="border-2 border-orange-400 rounded-xl overflow-hidden">
                    <div className="bg-orange-50 px-6 py-4 border-b border-orange-200">
                      <h3 className="flex items-center gap-2 text-lg font-bold text-orange-800">
                        <TbRefresh className="h-5 w-5" /> Catatan Revisi
                      </h3>
                    </div>
                    <div className="p-6 space-y-4 bg-white">
                      {order.revisionNotes.map(
                        (note: string, index: number) => (
                          <div
                            key={index}
                            className="p-4 rounded-lg bg-orange-50 border border-orange-100"
                          >
                            <h4 className="font-bold text-xs uppercase text-orange-700 mb-2">
                              Revisi #{index + 1}
                            </h4>
                            <p className="text-sm text-foreground">{note}</p>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* Progress Logs */}
                {order.progressLogs?.length > 0 && (
                  <div>
                    <h3 className="text-xl font-display font-extrabold mb-4">
                      Riwayat Update
                    </h3>
                    <div className="space-y-4">
                      {order.progressLogs.map((log: any) => (
                        <div
                          key={log.id}
                          className="bg-card border p-4 rounded-lg"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-sm">{log.title}</h4>
                            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                              {new Date(log.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {log.description}
                          </p>
                          {log.images?.length > 0 && (
                            <div className="flex gap-2 mt-2">
                              {log.images.map((img: string, i: number) => (
                                <a
                                  key={i}
                                  href={img}
                                  target="_blank"
                                  className="relative h-12 w-12 rounded border overflow-hidden hover:opacity-80 transition-opacity"
                                >
                                  <Image
                                    src={img}
                                    alt="Progress"
                                    fill
                                    className="object-cover"
                                  />
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-1 flex flex-col">
            {/* ACTIONS CARD (Replaces Payment Summary) */}
            <div className="border border-primary px-8 py-6 bg-card mb-4 rounded-none md:rounded-lg">
              <h2 className="text-2xl font-display font-extrabold mb-4 flex gap-2 items-center">
                <TbBriefcase className="w-6 h-6 text-primary" /> Aksi Pesanan
              </h2>

              <div className="space-y-3">
                {order.status === "PAID_ESCROW" ? (
                  <>
                    <div className="bg-amber-50 p-3 rounded-md border border-amber-200 text-xs text-amber-800 flex gap-2">
                      <TbAlertCircle className="shrink-0 w-4 h-4" />
                      <p>
                        Buyer telah membayar. Mulai pekerjaan untuk mengubah
                        status menjadi 'Dalam Pengerjaan'.
                      </p>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button className="w-full font-bold" size="lg">
                          <TbBriefcase className="mr-2 h-4 w-4" /> Mulai
                          Kerjakan
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Mulai Pengerjaan?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Status pesanan akan berubah menjadi "Dikerjakan".
                            Pastikan Anda sudah siap memulai.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Batal</AlertDialogCancel>
                          <AlertDialogAction onClick={handleStartWork}>
                            Ya, Mulai
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    <Button
                      variant="destructive"
                      onClick={() => setShowRejectDialog(true)}
                      className="w-full bg-white text-red-600 border border-red-200 hover:bg-red-50"
                    >
                      <TbX className="mr-2 h-4 w-4" /> Tolak Pesanan
                    </Button>
                  </>
                ) : order.status === "IN_PROGRESS" ||
                  order.status === "REVISION" ? (
                  <>
                    <div className="bg-blue-50 p-3 rounded-md border border-blue-200 text-xs text-blue-800 flex gap-2">
                      <TbSparkles className="shrink-0 w-4 h-4" />
                      <p>
                        Pesanan sedang aktif. Update progress secara berkala
                        agar pembeli tenang.
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setShowProgressDialog(true)}
                      className="w-full border-primary/30 hover:border-primary text-primary hover:bg-primary/5"
                    >
                      <TbPlus className="mr-2 h-4 w-4" /> Update Progress
                    </Button>
                    <Button
                      onClick={() => setShowDeliverDialog(true)}
                      className="w-full font-bold"
                      size="lg"
                    >
                      <TbSend className="mr-2 h-4 w-4" /> Kirim Hasil Akhir
                    </Button>
                  </>
                ) : (
                  <div className="text-center p-4 bg-muted/30 rounded-lg border border-dashed">
                    <p className="text-sm font-medium text-muted-foreground">
                      Tidak ada aksi yang diperlukan saat ini.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* BUYER PROFILE CARD (Replaces Provider Details) */}
            <div className="px-10 py-6 space-y-4 border border-primary bg-card mb-4 shrink-0">
              <h1 className="text-2xl font-display font-extrabold">
                Informasi Pembeli
              </h1>
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Avatar className="w-full h-full">
                    <AvatarImage src={order.buyer.profilePicture} />
                    <AvatarFallback>{order.buyer.fullName[0]}</AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-foreground truncate">
                    {order.buyer.fullName}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Customer
                  </p>
                </div>
              </div>

              <Separator />

              <Button
                className="w-full gap-2"
                variant="outline"
                onClick={() => {
                  if (order?.buyer) {
                    openChatWith({
                      id: order.buyer.id,
                      fullName: order.buyer.fullName,
                      profilePicture: order.buyer.profilePicture || "",
                      major: order.buyer.major || "",
                    });
                  }
                }}
              >
                <TbMessageCircle className="w-4 h-4" />
                Hubungi Pembeli
              </Button>
            </div>

            {/* CALENDAR SECTION */}
            <div className="px-6 py-6 space-y-4 border border-primary bg-card flex-1">
              <h1 className="text-xl font-display font-extrabold flex items-center gap-2">
                <TbCalendar className="w-5 h-5 text-primary" /> Kalender
                Pengerjaan
              </h1>

              <Calendar
                mode="range"
                selected={dateRange}
                className="w-full"
                classNames={{
                  months: "w-full flex flex-col space-y-4",
                  month: "w-full space-y-4",
                  table: "w-full border-collapse space-y-1",
                  head_row: "flex w-full",
                  head_cell:
                    "text-muted-foreground rounded-md w-full font-normal text-[0.8rem]",
                  row: "flex w-full mt-2",
                  cell: "text-center text-sm p-0 relative w-full focus-within:relative focus-within:z-20",
                  day: "h-9 w-full p-0 font-normal aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground aspect-auto rounded-md",
                }}
                locale={idLocale}
                modifiers={{
                  payment: paymentDate,
                  completion: completionDate,
                }}
                modifiersStyles={{
                  payment: {
                    fontWeight: "bold",
                    textDecoration: "underline",
                    color: "#dc2626",
                  },
                  completion: {
                    fontWeight: "bold",
                    color: "#16a34a",
                  },
                }}
              />

              <div className="space-y-2 text-xs border-t pt-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">
                    Jatuh Tempo Bayar:
                  </span>
                  <Badge
                    variant="outline"
                    className="text-red-600 border-red-200 bg-red-50"
                  >
                    {paymentDate.toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                    })}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">
                    Estimasi Selesai:
                  </span>
                  <Badge
                    variant="outline"
                    className="text-green-600 border-green-200 bg-green-50"
                  >
                    {completionDate.toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                    })}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Durasi:</span>
                  <span className="font-medium">{deliveryDays} Hari Kerja</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- DIALOGS (Hidden Logic) --- */}

        {/* Update Progress Dialog */}
        <Dialog open={showProgressDialog} onOpenChange={setShowProgressDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Progress</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>Judul</Label>
                <Input
                  placeholder="Contoh: Sketsa selesai"
                  value={progressTitle}
                  onChange={(e) => setProgressTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Deskripsi</Label>
                <Textarea
                  placeholder="Keterangan..."
                  value={progressDesc}
                  onChange={(e) => setProgressDesc(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Lampiran</Label>
                <Input
                  ref={progressFileInputRef}
                  type="file"
                  multiple
                  accept="image/*,.pdf,.doc,.docx"
                  onChange={handleProgressFileSelect}
                  disabled={progressUploading}
                />
                {progressUploading && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <TbLoader className="animate-spin mr-2 h-4 w-4" />
                    Mengupload...
                  </div>
                )}
                {progressFiles.length > 0 && (
                  <div className="space-y-1 mt-2">
                    {progressFiles.map((url, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between text-sm p-2 bg-muted/50 rounded"
                      >
                        <span className="truncate flex-1">{url}</span>
                        <Button
                          type="button"
                          size="icon-sm"
                          variant="ghost"
                          onClick={() => handleRemoveProgressFile(index)}
                          className="h-6 w-6"
                        >
                          <TbX className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowProgressDialog(false)}
              >
                Batal
              </Button>
              <Button onClick={handleSubmitProgress}>Simpan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Deliver Dialog */}
        <Dialog open={showDeliverDialog} onOpenChange={setShowDeliverDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Kirim Hasil Akhir
                {order.status === "REVISION" && (
                  <span className="text-orange-600"> (Revisi)</span>
                )}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>Catatan</Label>
                <Textarea
                  placeholder="Pesan untuk pembeli..."
                  value={deliveryNote}
                  onChange={(e) => setDeliveryNote(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>File Hasil</Label>
                <Input
                  ref={deliveryFileInputRef}
                  type="file"
                  multiple
                  accept="image/*,.pdf,.doc,.docx,.zip,.rar"
                  onChange={handleDeliveryFileSelect}
                  disabled={deliveryUploading}
                />
                {deliveryUploading && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <TbLoader className="animate-spin mr-2 h-4 w-4" />
                    Mengupload...
                  </div>
                )}
                {deliveryFiles.length > 0 && (
                  <div className="space-y-1 mt-2">
                    {deliveryFiles.map((url, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between text-sm p-2 bg-muted/50 rounded"
                      >
                        <span className="truncate flex-1">{url}</span>
                        <Button
                          type="button"
                          size="icon-sm"
                          variant="ghost"
                          onClick={() => handleRemoveDeliveryFile(index)}
                          className="h-6 w-6"
                        >
                          <TbX className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowDeliverDialog(false)}
              >
                Batal
              </Button>
              <Button onClick={handleSubmitDeliver}>Kirim</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Reject Dialog */}
        <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-destructive">
                Tolak Pesanan
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <p className="text-sm text-muted-foreground">
                Menolak pesanan akan membatalkan transaksi dan mengembalikan
                dana sepenuhnya ke Pembeli. Tindakan ini tidak dapat dibatalkan.
              </p>
              <div className="space-y-2">
                <Label>Alasan Penolakan</Label>
                <Textarea
                  placeholder="Contoh: Saya sedang overload, deskripsi kurang jelas..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows={3}
                />
                <p className="text-xs text-muted-foreground">
                  Minimal 10 karakter.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowRejectDialog(false)}
              >
                Batal
              </Button>
              <Button
                variant="destructive"
                onClick={handleRejectOrder}
                disabled={rejectLoading || rejectReason.length < 10}
              >
                {rejectLoading ? "Memproses..." : "Tolak Pesanan"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </SellerLayout>
  );
};

export default SellerOrderDetailPage;
