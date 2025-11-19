"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Script from "next/script";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { TbArrowLeft, TbLock } from "react-icons/tb";
import { Label } from "@/components/ui/label";

interface OrderDetail {
  id: string;
  title: string;
  price: number;
  requirements: string;
  attachments: string[];
  status: string;
}

const ConfirmOrderClient = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, loading: authLoading } = useAuth();

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [snapReady, setSnapReady] = useState(false);

  const orderId = searchParams.get("orderId");
  const MIDTRANS_CLIENT_KEY = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY!;

  // Validate environment
  useEffect(() => {
    if (!MIDTRANS_CLIENT_KEY) {
      console.error("⚠️ MIDTRANS_CLIENT_KEY tidak ditemukan di environment!");
      setError("Konfigurasi pembayaran tidak lengkap");
    } else {
      console.log("✅ Midtrans Client Key loaded");
    }
  }, [MIDTRANS_CLIENT_KEY]);

  // Check authentication
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/");
    }
  }, [authLoading, isAuthenticated, router]);

  // Fetch order detail
  useEffect(() => {
    if (orderId && !authLoading && isAuthenticated) {
      const fetchOrder = async () => {
        setLoading(true);
        try {
          const token = localStorage.getItem("access_token");
          const response = await fetch(`/api/orders/${orderId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await response.json();

          if (data.success) {
            if (data.data.status !== "DRAFT") {
              setError("Pesanan ini tidak valid atau sudah diproses.");
            } else {
              setOrder(data.data);
            }
          } else {
            setError(data.message || "Gagal memuat detail pesanan.");
          }
        } catch (err) {
          console.error("Fetch order error:", err);
          setError("Terjadi kesalahan jaringan.");
        } finally {
          setLoading(false);
        }
      };
      fetchOrder();
    }
  }, [orderId, authLoading, isAuthenticated]);

  // Check if Snap is ready
  useEffect(() => {
    const checkSnap = () => {
      if (typeof window !== "undefined" && (window as any).snap) {
        console.log("✅ Midtrans Snap is ready");
        setSnapReady(true);
        return true;
      }
      return false;
    };

    // Check immediately
    if (checkSnap()) return;

    // Poll every 500ms for max 10 seconds
    let attempts = 0;
    const maxAttempts = 20;

    const interval = setInterval(() => {
      attempts++;
      if (checkSnap() || attempts >= maxAttempts) {
        clearInterval(interval);
        if (attempts >= maxAttempts && !checkSnap()) {
          console.error("❌ Midtrans Snap failed to load after 10 seconds");
          setError(
            "Gagal memuat sistem pembayaran. Refresh halaman dan coba lagi."
          );
        }
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const handleConfirmAndPay = async () => {
    if (!order) return;

    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(`/api/orders/${order.id}/confirm`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await response.json();

      console.log("💳 Payment Response:", {
        success: data.success,
        hasToken: !!data.paymentToken,
        hasRedirectUrl: !!data.paymentRedirectUrl,
        snapLoaded: snapReady,
        windowSnap: typeof window !== "undefined" && !!(window as any).snap,
      });

      if (!data.success) {
        throw new Error(data.message || "Gagal mendapatkan token pembayaran");
      }

      if (!data.paymentToken) {
        throw new Error("Token pembayaran tidak ditemukan");
      }

      // Check if Snap is available
      const snapScript = (window as any).snap;

      if (!snapScript || !snapReady) {
        // FALLBACK: Use redirect mode
        console.log("⚠️ Snap not ready, using redirect mode");
        if (data.paymentRedirectUrl) {
          window.location.href = data.paymentRedirectUrl;
          return;
        }
        throw new Error("Sistem pembayaran tidak tersedia");
      }

      // Use Snap popup mode
      console.log(
        "🚀 Calling snap.pay with token:",
        data.paymentToken.substring(0, 20) + "..."
      );

      snapScript.pay(data.paymentToken, {
        onSuccess: (result: any) => {
          console.log("✅ Payment Success:", result);
          alert("Pembayaran berhasil!");
          router.push(`/buyer/orders/${order.id}`);
        },
        onPending: (result: any) => {
          console.log("⏳ Payment Pending:", result);
          alert("Menunggu konfirmasi pembayaran...");
          router.push(`/buyer/orders/${order.id}`);
        },
        onError: (error: any) => {
          console.error("❌ Payment Error:", error);
          setError(
            "Gagal memproses pembayaran: " + (error.message || "Unknown error")
          );
          setLoading(false);
        },
        onClose: () => {
          console.log("🔒 Payment popup ditutup");
          setLoading(false);
        },
      });
    } catch (err: any) {
      console.error("❌ Payment Error:", err);
      setError(err.message || "Terjadi kesalahan. Silakan coba lagi.");
      setLoading(false);
    }
  };

  // Loading state
  if (authLoading || (loading && !order)) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Error state
  if (error && !order) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle>Terjadi Kesalahan</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">{error}</p>
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="mt-4"
          >
            <TbArrowLeft className="mr-2" />
            Kembali
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!order) return null;

  return (
    <>
      {/* Load Midtrans Script */}
      <Script
        src="https://app.sandbox.midtrans.com/snap/snap.js"
        data-client-key={MIDTRANS_CLIENT_KEY}
        strategy="afterInteractive"
        onLoad={() => {
          console.log("📦 Midtrans Snap script loaded successfully");
          setSnapReady(true);
        }}
        onError={(e) => {
          console.error("❌ Failed to load Midtrans Snap:", e);
          setError("Gagal memuat sistem pembayaran. Refresh halaman.");
        }}
      />

      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <TbArrowLeft className="mr-2" />
        Kembali
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Konfirmasi Pesanan</CardTitle>
          <CardDescription>
            Satu langkah lagi. Periksa kembali pesanan Anda sebelum melakukan
            pembayaran.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Snap Loading Indicator */}
          {!snapReady && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span>Memuat sistem pembayaran...</span>
              </div>
            </div>
          )}

          <div>
            <Label>Jasa</Label>
            <p className="font-medium">{order.title}</p>
          </div>

          <div>
            <Label>Kebutuhan Anda</Label>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap p-3 bg-gray-50 rounded-md">
              {order.requirements}
            </p>
          </div>

          {order.attachments.length > 0 && (
            <div>
              <Label>Lampiran</Label>
              <ul className="list-disc list-inside text-sm text-muted-foreground">
                {order.attachments.map((file, i) => (
                  <li key={i} className="truncate">
                    {file}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-800">
              {error}
            </div>
          )}
        </CardContent>

        <CardFooter className="flex-col items-stretch gap-4">
          <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg">
            <span className="text-base font-medium">Total Pembayaran</span>
            <span className="text-2xl font-bold text-primary">
              Rp {Number(order.price).toLocaleString("id-ID")}
            </span>
          </div>

          <Button
            size="lg"
            className="w-full"
            onClick={handleConfirmAndPay}
            disabled={loading || !snapReady}
          >
            <TbLock className="mr-2" />
            {loading
              ? "Memproses..."
              : !snapReady
              ? "Memuat..."
              : "Konfirmasi & Bayar"}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Pembayaran aman diproses oleh Midtrans.
          </p>
        </CardFooter>
      </Card>
    </>
  );
};

export default ConfirmOrderClient;
