"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Star,
  Clock,
  CheckCircle2,
  Share2,
  ShieldCheck,
  RefreshCcw,
  MessageCircle,
} from "lucide-react";
import PublicLayout from "@/components/layouts/PublicLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { useChat } from "@/contexts/ChatContext";
import { ReportUserDialog } from "@/components/report/ReportUserDialog";
import { CATEGORY_LABELS } from "@/lib/constants";
import { toast } from "sonner";

// --- Interface Data ---
interface ServiceDetail {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  deliveryTime: number;
  revisions: number;
  images: string[];
  avgRating: number;
  totalReviews: number;
  totalOrders: number;
  isActive: boolean;
  status: string;
  whatsIncluded?: string; // Field baru dari sample data Anda
  requirements?: string;
  faq?: any[];
  seller: {
    id: string;
    fullName: string;
    profilePicture: string | null;
    bio: string | null;
    major: string | null;
    batch: string | null;
    avgRating: number;
    totalReviews: number;
    totalOrdersCompleted: number;
    createdAt: string;
  };
  reviews: Array<{
    id: string;
    rating: number;
    comment: string;
    sellerResponse: string | null;
    createdAt: string;
    author: {
      id: string;
      fullName: string;
      profilePicture: string | null;
      major: string | null;
    };
  }>;
}

export default function ServiceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { openChatWith } = useChat();

  const [service, setService] = useState<ServiceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  // --- Fetch Data ---
  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await fetch(`/api/services/${params.id}`);
        const data = await response.json();

        if (data.success) {
          const serviceData: ServiceDetail = data.data;
          const isOwner = user?.id === serviceData.seller.id;
          const isPubliclyActive =
            serviceData.status === "ACTIVE" && serviceData.isActive;

          if (isPubliclyActive || isOwner) {
            setService(serviceData);
          } else {
            router.push("/services");
          }
        } else {
          router.push("/services");
        }
      } catch (error) {
        console.error("Error fetching service:", error);
        router.push("/services");
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) fetchService();
  }, [params.id, router, user, authLoading]);

  // --- Handlers ---
  const handleOrder = () => {
    if (!isAuthenticated) return router.push("/auth/login");
    router.push(`/orders/create?serviceId=${params.id}`);
  };

  const handleChatSeller = () => {
    if (!isAuthenticated) return router.push("/auth/login");
    if (service) {
      openChatWith(
        {
          id: service.seller.id,
          fullName: service.seller.fullName,
          profilePicture: service.seller.profilePicture,
        },
        undefined,
        {
          id: service.id,
          title: service.title,
          price: service.price,
          image: service.images[0] || "",
          sellerId: service.seller.id,
        }
      );
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link berhasil disalin!");
  };

  // --- Formatters ---
  const formatPrice = (amount: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  // Calculate Rating Distribution
  const getRatingDistribution = (reviews: ServiceDetail["reviews"]) => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    if (reviews.length === 0) return distribution;

    reviews.forEach((r) => {
      const rating = Math.floor(r.rating) as 1 | 2 | 3 | 4 | 5;
      if (rating >= 1 && rating <= 5) {
        distribution[rating] += 1;
      }
    });
    return distribution;
  };

  // Parse What's Included (splitting by + or newlines for demo purposes if not array)
  const getIncludedItems = (text?: string) => {
    if (!text) return [];
    return text
      .split(/[\+\n,]+/)
      .map((item) => item.trim())
      .filter(Boolean);
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

  if (!service) return null;

  const isOwner = isAuthenticated && user?.id === service.seller.id;
  const ratingDist = getRatingDistribution(service.reviews);
  const includedItems = getIncludedItems(service.whatsIncluded);

  return (
    <PublicLayout>
      {/* Main Content Layout */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* --- LEFT COLUMN: Content --- */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            {/* 1. Breadcrumbs & Title */}
            <div>
              <nav className="flex items-center gap-2 text-xs font-medium text-muted-foreground mb-4">
                <Link href="/" className="hover:text-primary hover:underline">
                  Beranda
                </Link>
                <span>/</span>
                <Link
                  href="/services"
                  className="hover:text-primary hover:underline"
                >
                  Jasa
                </Link>
                <span>/</span>
                <span className="text-foreground">{service.title}</span>
              </nav>

              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground leading-tight font-display">
                {service.title}
              </h1>

              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Avatar className="size-8">
                    <AvatarImage src={service.seller.profilePicture || ""} />
                    <AvatarFallback>
                      {getInitials(service.seller.fullName)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <Link
                      href={`/profile/${service.seller.id}`}
                      className="font-bold text-foreground hover:underline"
                    >
                      {service.seller.fullName}
                    </Link>
                    <div>
                      <h2 className="text-[12px] text-secondary">
                        {service.seller.major || "Mahasiswa UIN Suska"}{" "}
                        {service.seller.batch && `• ${service.seller.batch}`}
                      </h2>
                    </div>
                  </div>
                </div>

                <Separator orientation="vertical" className="h-4" />
                <div className="flex gap-2">
                  <span>{service.seller.totalOrdersCompleted} Pesanan</span>
                </div>
              </div>
            </div>

            {/* 2. Gallery */}
            <div className="flex flex-col gap-4">
              <div className="group relative aspect-video w-full overflow-hidden rounded-xl bg-slate-100 border border-border">
                {/* Main Image */}
                <img
                  src={service.images[activeImageIndex] || "/placeholder.svg"}
                  alt={service.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              {/* Thumbnails */}
              {service.images.length > 1 && (
                <div className="grid grid-cols-5 gap-3 md:gap-4">
                  {service.images.map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`aspect-video cursor-pointer overflow-hidden rounded-lg bg-slate-100 border-2 transition-all ${
                        activeImageIndex === idx
                          ? "border-primary ring-2 ring-primary/20"
                          : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={img}
                        className="h-full w-full object-cover"
                        alt="thumbnail"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 3. About This Service */}
            <div className="">
              <h2 className="text-xl font-display font-bold text-foreground ">
                Tentang Jasa Ini
              </h2>
              <div className="prose prose-slate max-w-none text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {service.description}
              </div>
            </div>

            {/* 4. What's Included */}
            {includedItems.length > 0 && (
              <div className="rounded-2xl border bg-card p-6 md:p-8">
                <h2 className="text-xl font-bold text-foreground mb-6">
                  Yang Anda Dapatkan
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {includedItems.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle2 className="text-green-500 mt-0.5 size-5 shrink-0" />
                      <div>
                        <h3 className="font-medium text-foreground">{item}</h3>
                        <p className="text-sm text-muted-foreground">
                          Termasuk dalam paket
                        </p>
                      </div>
                    </div>
                  ))}
                  {/* Default Includes based on metadata */}
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="text-green-500 mt-0.5 size-5 shrink-0" />
                    <div>
                      <h3 className="font-medium text-foreground">
                        {service.revisions}x Revisi
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Jaminan kepuasan
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 6. Reviews */}
            <div>
              <h2 className="text-xl font-display font-bold text-foreground mb-6">
                Ulasan Klien
              </h2>

              {/* Rating Summary */}
              <div className="bg-card p-6 border border-primary">
                <div className="flex flex-col md:flex-row gap-8 items-center">
                  <div className="flex flex-col items-center gap-1 min-w-[140px]">
                    <span className="text-5xl font-black text-foreground tracking-tighter">
                      {Number(service.avgRating).toFixed(1)}
                    </span>
                    <div className="flex text-amber-500 gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`size-4 ${
                            star <= Math.round(service.avgRating)
                              ? "fill-current"
                              : "text-slate-200 fill-slate-200"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground font-medium mt-1">
                      {service.totalReviews} Ulasan
                    </span>
                  </div>

                  <div className="flex-1 w-full grid gap-2">
                    {[5, 4, 3, 2, 1].map((star) => {
                      // @ts-ignore
                      const count = ratingDist[star] || 0;
                      const percentage =
                        service.totalReviews > 0
                          ? (count / service.totalReviews) * 100
                          : 0;
                      return (
                        <div
                          key={star}
                          className="flex items-center gap-3 text-sm"
                        >
                          <span className="font-medium w-3 text-foreground">
                            {star}
                          </span>
                          <Progress value={percentage} className="h-2 flex-1" />
                          <span className="text-muted-foreground w-8 text-right">
                            {Math.round(percentage)}%
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Individual Review */}
              <div className="space-y-6">
                {service.reviews.length > 0 ? (
                  service.reviews.map((review) => (
                    <div
                      key={review.id}
                      className="border-b pb-6 last:border-0"
                    >
                      <div className="flex items-start gap-3 mb-2">
                        <Avatar className="size-10">
                          <AvatarImage
                            src={review.author.profilePicture || ""}
                          />
                          <AvatarFallback>
                            {getInitials(review.author.fullName)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold text-sm text-foreground">
                            {review.author.fullName}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <div className="flex text-amber-500">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`size-3 ${
                                    i < review.rating
                                      ? "fill-current"
                                      : "text-slate-200 fill-slate-200"
                                  }`}
                                />
                              ))}
                            </div>
                            <span>
                              •{" "}
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className="text-foreground/80 text-sm leading-relaxed pl-14">
                        "{review.comment}"
                      </p>
                      {review.sellerResponse && (
                        <div className="mt-3 ml-14 pl-4 border-l-2 border-primary bg-secondary/20 p-3 rounded-r-md">
                          <p className="text-xs font-semibold text-primary mb-1">
                            Respon Penjual:
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {review.sellerResponse}
                          </p>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    Belum ada ulasan untuk jasa ini.
                  </p>
                )}
              </div>
            </div>

            {/* 7. FAQ (Optional / Mock if empty) */}
            {service.faq && service.faq.length > 0 && (
              <div className="mb-12">
                <h2 className="text-xl font-bold text-foreground mb-6">
                  Pertanyaan Umum
                </h2>
                {/* FAQ rendering logic here if data exists */}
              </div>
            )}
          </div>

          {/* --- RIGHT COLUMN: Sticky Booking Card --- */}
          <div className="lg:col-span-4">
            <div className="sticky top-36 space-y-4">
              <div className="border border-primary overflow-hidden">
                {/* Header */}
                <div className="p-6 bg-teal-900">
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-3xl font-bold text-primary-foreground">
                      {formatPrice(service.price)}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-6 bg-card">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-muted-foreground text-xs font-semibold uppercase">
                        <Clock className="size-4" />
                        Pengerjaan
                      </div>
                      <span className="font-medium text-foreground">
                        {service.deliveryTime} Hari
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-muted-foreground text-xs font-semibold uppercase">
                        <RefreshCcw className="size-4" />
                        Revisi
                      </div>
                      <span className="font-medium text-foreground">
                        {service.revisions === -1
                          ? "Unlimited"
                          : `${service.revisions}x`}
                      </span>
                    </div>
                  </div>

                  {/* Features List */}

                  <Button
                    onClick={handleOrder}
                    disabled={isOwner || !service.isActive}
                    size="lg"
                    className="w-full font-bold"
                  >
                    {isOwner ? "Kelola Jasa" : "Pesan Sekarang"}
                  </Button>

                  {!isOwner && (
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={handleChatSeller}
                      className="w-full mt-3 "
                    >
                      <MessageCircle className="mr-2 size-4" />
                      Chat Penjual
                    </Button>
                  )}
                </div>

                {/* Trust Signals */}
                <div className="bg-teal-900 p-4 flex items-center justify-center gap-4 text-xs text-primary-foreground">
                  <div className="flex items-center gap-1">
                    <ShieldCheck className="size-4" />
                    Pembayaran Aman
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="size-4" />
                    Sistem Rekber
                  </div>
                </div>
              </div>

              {/* Share Button (Mobile friendly place or extra option) */}
              <div className="flex justify-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleShare}
                  className="text-muted-foreground"
                >
                  <Share2 className="mr-2 size-4" /> Bagikan Jasa Ini
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </PublicLayout>
  );
}
