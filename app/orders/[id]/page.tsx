"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useChat } from "@/contexts/ChatContext";
import PublicLayout from "@/components/layouts/PublicLayout";
import PaymentButton from "@/components/orders/PaymentButton";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  TbFileDescription,
  TbCoin,
  TbCalendar,
  TbUser,
  TbAlertCircle,
  TbArrowLeft,
  TbCheck,
  TbMessageCircle,
  TbStar,
  TbClock,
  TbRefresh,
  TbFileZip,
  TbPhoto,
} from "react-icons/tb";
import { Badge } from "@/components/ui/badge";

interface OrderDetail {
  id: string;
  status: string;
  title: string;
  price: number;
  requirements: string;
  attachments?: string[];
  dueDate: string;
  isPaid: boolean;
  service: {
    id: string;
    title: string;
    description: string;
    deliveryTime: number;
    revisions: number;
    images: string[];
    seller: {
      id: string; // Ensure ID is here
      avgRating: number;
      fullName: string;
      profilePicture: string;
      major: string;
      totalReviews: number;
    };
  };
  buyer: {
    id: string;
    fullName: string;
  };
}

const OrderDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { openChatWith } = useChat();

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPolling, setIsPolling] = useState(false);

  const fetchOrder = useCallback(async () => {
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`/api/orders/${params.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        setOrder(data.data);

        if (
          isPolling &&
          (data.data.status === "PAID_ESCROW" ||
            data.data.status === "IN_PROGRESS")
        ) {
          setIsPolling(false);
        }
      }
    } catch (error) {
      console.error("Error fetching order:", error);
    } finally {
      setLoading(false);
    }
  }, [params.id, isPolling]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isPolling) {
      intervalId = setInterval(() => {
        console.log("Polling order status...");
        fetchOrder();
      }, 2000);

      setTimeout(() => setIsPolling(false), 10000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isPolling, fetchOrder]);

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push("/auth/login");
      } else {
        fetchOrder();
      }
    }
  }, [params.id, authLoading, isAuthenticated, router, fetchOrder]);

  const handlePaymentSuccess = () => {
    setLoading(true);
    setIsPolling(true);
    fetchOrder();
  };

  const handleContactProvider = () => {
    if (!order?.service.seller) return;
    openChatWith({
      id: order.service.seller.id,
      fullName: order.service.seller.fullName,
      profilePicture: order.service.seller.profilePicture,
      major: order.service.seller.major,
    });
  };

  if (loading || authLoading) {
    return (
      <PublicLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </PublicLayout>
    );
  }

  if (!order) {
    return (
      <PublicLayout>
        <div className="container mx-auto py-12 text-center">
          <p className="text-xl">Pesanan tidak ditemukan</p>
        </div>
      </PublicLayout>
    );
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      DRAFT: "bg-gray-200 text-gray-700",
      WAITING_PAYMENT: "bg-yellow-100 text-yellow-700 border-yellow-200",
      PAID_ESCROW: "bg-blue-100 text-blue-700 border-blue-200",
      IN_PROGRESS: "bg-purple-100 text-purple-700 border-purple-200",
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

  const showPayment =
    order.status === "DRAFT" || order.status === "WAITING_PAYMENT";

  const getOrderProgress = () => {
    const statuses = [
      { key: "DRAFT", label: "Draf" },
      { key: "WAITING_PAYMENT", label: "Menunggu" },
      { key: "PAID_ESCROW", label: "Dibayar" },
      { key: "IN_PROGRESS", label: "Dalam Proses" },
      { key: "DELIVERED", label: "Diserahkan" },
      { key: "COMPLETED", label: "Selesai" },
    ];

    const currentIndex = statuses.findIndex((s) => s.key === order.status);
    return { statuses, currentIndex };
  };

  const { statuses, currentIndex } = getOrderProgress();

  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground leading-tight font-display">
              Rincian Pesanan #{order.id.substring(0, 8)}
            </h1>
            {getStatusBadge(order.status)}
          </div>
        </div>

        {/* Order Tracking */}
        <div className="mb-8 bg-card border border-primary py-6 px-10">
          <h1 className="text-2xl font-display font-extrabold mb-4">
            Status Pesanan
          </h1>
          <div className="flex items-center justify-between">
            {statuses.map((status, index) => (
              <div
                key={status.key}
                className="flex flex-col items-center flex-1"
              >
                <div className="flex items-center gap-2 w-full mb-2">
                  {index < statuses.length - 1 && (
                    <>
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                          index <= currentIndex
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {index < currentIndex ? (
                          <TbCheck className="w-4 h-4" />
                        ) : (
                          index + 1
                        )}
                      </div>
                      <div
                        className={`flex-1 h-1 ${
                          index < currentIndex ? "bg-primary" : "bg-muted"
                        }`}
                      />
                    </>
                  )}
                  {index === statuses.length - 1 && (
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                        index <= currentIndex
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {index < currentIndex ? (
                        <TbCheck className="w-4 h-4" />
                      ) : (
                        index + 1
                      )}
                    </div>
                  )}
                </div>
                <p
                  className={`text-xs font-bold text-center ${
                    index <= currentIndex
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {status.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
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
            {/* Requirements Section */}
            <div>
              <h3 className="text-2xl font-display font-extrabold">
                Permintaan Anda
              </h3>
              <span className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                {order.requirements}
              </span>
            </div>
            <div>
              <h3 className="text-2xl font-display font-extrabold mb-2">
                Lampiran
              </h3>
              {order.attachments && order.attachments.length > 0 && (
                <div>
                  <div className="flex flex-wrap gap-3">
                    {order.attachments.map((url, idx) => {
                      const fileName =
                        url.split("/").pop() || `File ${idx + 1}`;
                      const isImage = /\.(jpg|jpeg|png|webp)$/i.test(url);

                      return (
                        <a
                          key={idx}
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-3 border border-slate-200 bg-white px-3 py-2 transition-all hover:bg-slate-50 hover:border-primary/50 group"
                        >
                          {isImage ? (
                            <TbPhoto className="h-5 w-5 text-blue-500 group-hover:scale-110 transition-transform" />
                          ) : (
                            <TbFileDescription className="h-5 w-5 text-red-500 group-hover:scale-110 transition-transform" />
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
                </div>
              )}
            </div>

            {/* Payment Summary */}
            <div className="border border-primary px-10 py-6 bg-card">
              <h1 className="text-2xl font-display font-extrabold mb-4 flex gap-2 items-center">
                <TbCoin className="w-6 h-6 text-amber-500" /> Pembayaran
              </h1>
              <div className="flex gap-2 items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <TbUser className="w-3.5 h-3.5" />
                  <span className="text-secondary-foreground text-xs md:text-sm">
                    {order.buyer.fullName}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <TbCalendar className="w-3.5 h-3.5" />
                  <span className="text-secondary-foreground text-xs md:text-sm">
                    Tenggat{" "}
                    {new Date(order.dueDate).toLocaleDateString("id-ID", {
                      dateStyle: "long",
                    })}
                  </span>
                </div>
              </div>

              {showPayment ? (
                <div className="space-y-3 pt-4">
                  <div className="bg-amber-200 p-3 rounded-md border border-amber-900 text-xs text-amber-900 flex gap-2">
                    <TbAlertCircle className="shrink-0 w-4 h-4 mt-0.5" />
                    <p>
                      Dana Anda akan disimpan dengan aman dalam rekening escrow
                      dan akan dilepaskan kepada penyedia setelah penyelesaian.
                    </p>
                  </div>
                  <PaymentButton
                    orderId={order.id}
                    onSuccess={fetchOrder}
                    price={order.price}
                  />
                </div>
              ) : (
                <div className="pt-4">
                  <div className="bg-green-100 border border-green-700 rounded-sm p-2 text-center">
                    <p className="font-semibold text-green-900 text-sm">
                      {order.isPaid
                        ? "✓ Berhasil Dibayar"
                        : "Status: " + order.status}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            {/* Provider Details */}
            <div className="px-10 py-6 space-y-4 border border-primary bg-card">
              <h1 className="text-2xl font-display font-extrabold">
                Penyedia Jasa
              </h1>
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  {order.service.seller ? (
                    <img
                      src={order.service.seller.profilePicture}
                      alt={order.service.seller.fullName}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <TbUser className="w-6 h-6 text-primary" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-foreground truncate">
                    {order.service.seller.fullName}
                  </h4>
                  {order.service.seller.avgRating >= 0 && (
                    <div className="flex items-center gap-1 mt-1">
                      <TbStar className="w-4 h-4 text-amber-500 fill-amber-500" />
                      {order.service.seller.totalReviews >= 0 && (
                        <span className="text-xs text-muted-foreground">
                          ({order.service.seller.totalReviews} ulasan)
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              <Button
                className="w-full gap-2"
                variant="outline"
                onClick={handleContactProvider}
              >
                <TbMessageCircle className="w-4 h-4" />
                Hubungi Penyedia
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default OrderDetailPage;
