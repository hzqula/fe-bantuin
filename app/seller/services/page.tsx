"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import SellerLayout from "@/components/layouts/SellerLayout";
import ServiceForm, {
  ServiceFormData,
} from "@/components/services/ServiceForm";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import {
  TbPlus,
  TbDots,
  TbEdit,
  TbTrash,
  TbEye,
  TbEyeOff,
  TbClock,
  TbShoppingCart,
} from "react-icons/tb";
import { Star } from "lucide-react";

// Interface Data
interface Service {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  deliveryTime: number;
  revisions: number;
  images: string[];
  totalOrders: number;
  avgRating: number;
  totalReviews: number;
  isActive: boolean;
  status: string;
  createdAt: string;
  // Seller info needed for the card avatar logic
  seller?: {
    fullName: string;
    profilePicture: string | null;
  };
}

const categoryNames: Record<string, string> = {
  DESIGN: "Desain",
  DATA: "Data",
  CODING: "Coding",
  WRITING: "Penulisan",
  EVENT: "Event",
  TUTOR: "Tutor",
  TECHNICAL: "Teknis",
  OTHER: "Lainnya",
};

const SellerServicesPage = () => {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  // --- Fetching Data ---
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push("/auth/login");
      } else if (!user?.isSeller) {
        router.push("/seller/activate");
      } else {
        fetchServices();
      }
    }
  }, [authLoading, isAuthenticated, user, router]);

  const fetchServices = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch("/api/services/seller/my-services", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setServices(data.data);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  // --- Handlers (CRUD) ---
  const handleCreateService = async (formData: ServiceFormData) => {
    try {
      const token = localStorage.getItem("access_token");
      const payload = { ...formData, status: "PENDING", isActive: false };
      const response = await fetch("/api/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (data.success) {
        await fetchServices();
        setFormOpen(false);
        if (data.data?.status === "PENDING") {
          toast.success("Jasa berhasil dibuat dan menunggu persetujuan admin.");
        } else {
          toast.success("Jasa berhasil dibuat.");
        }
      } else {
        toast.error(data.error || "Gagal membuat jasa");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan sistem");
    }
  };

  const handleUpdateService = async (formData: ServiceFormData) => {
    if (!editingService) return;
    try {
      const token = localStorage.getItem("access_token");
      // Jika status REJECTED, reset ke PENDING saat update
      const payload =
        editingService.status === "REJECTED"
          ? { ...formData, status: "PENDING", isActive: false }
          : formData;

      const response = await fetch(`/api/services/${editingService.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (data.success) {
        await fetchServices();
        setEditingService(null);
        setFormOpen(false);
        if (data.data?.status === "PENDING") {
          toast.info("Jasa dikirim ulang untuk peninjauan.");
        } else {
          toast.success("Perubahan berhasil disimpan");
        }
      } else {
        toast.error(data.error || "Gagal update jasa");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan sistem");
    }
  };

  const handleToggleActive = async (serviceId: string) => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(`/api/services/${serviceId}/toggle`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        await fetchServices();
        toast.success("Status jasa diperbarui");
      } else {
        toast.error(data.error || "Gagal mengubah status");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan");
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    if (!confirm("Hapus jasa ini secara permanen?")) return;
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(`/api/services/${serviceId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        await fetchServices();
        toast.success("Jasa dihapus");
      } else {
        toast.error(data.error || "Gagal menghapus");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan");
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setFormOpen(true);
  };

  // --- Formatters ---
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  if (authLoading || loading) {
    return (
      <SellerLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </SellerLayout>
    );
  }

  if (!user?.isSeller) return null;

  return (
    <SellerLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-foreground mb-2">
              Jasa Saya
            </h1>
            <p className="text-muted-foreground">
              Kelola portofolio layanan Anda
            </p>
          </div>
          <Button onClick={() => setFormOpen(true)}>
            <TbPlus className="mr-2" /> Tambah Jasa
          </Button>
        </div>

        {/* Services Grid */}
        {services.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed rounded-xl bg-gray-50">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-xl font-semibold mb-2">Belum ada jasa</h3>
            <p className="text-muted-foreground mb-6">
              Mulai tawarkan keahlianmu sekarang.
            </p>
            <Button onClick={() => setFormOpen(true)}>
              <TbPlus className="mr-2" /> Buat Jasa Pertama
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-x-6 gap-y-8">
            {services.map((service) => (
              <div
                key={service.id}
                className="group flex flex-col h-full bg-white rounded-2xl"
              >
                {/* Image Section - Aspect Ratio 4/3 */}
                <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl mb-4 bg-gray-100 border border-gray-200">
                  {service.images && service.images.length > 0 ? (
                    <Image
                      src={service.images[0]}
                      alt={service.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                      No Image
                    </div>
                  )}

                  {/* OVERLAY: Status Badges (Top Left) */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    <div className="flex gap-2">
                      <Badge
                        variant="secondary"
                        className={`bg-white/90 backdrop-blur shadow-sm text-xs ${
                          service.isActive ? "text-green-700" : "text-gray-500"
                        }`}
                      >
                        {service.isActive ? "Aktif" : "Nonaktif"}
                      </Badge>
                      {service.status !== "ACTIVE" && (
                        <Badge
                          variant="outline"
                          className={`bg-white/90 backdrop-blur shadow-sm border-0 text-xs ${
                            service.status === "REJECTED"
                              ? "text-red-600 bg-red-50"
                              : "text-yellow-600 bg-yellow-50"
                          }`}
                        >
                          {service.status === "PENDING"
                            ? "Menunggu"
                            : "Ditolak"}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* OVERLAY: Action Menu (Top Right) */}
                  <div className="absolute top-2 right-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size="icon"
                          variant="secondary"
                          className="h-8 w-8 rounded-full bg-white/90 hover:bg-white shadow-sm"
                        >
                          <TbDots className="h-4 w-4 text-gray-700" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(service)}>
                          <TbEdit className="mr-2 h-4 w-4" /> Edit
                        </DropdownMenuItem>
                        {service.status === "PENDING" ? (
                          <DropdownMenuItem disabled>
                            <TbClock className="mr-2 h-4 w-4" /> Reviewing
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            onClick={() => handleToggleActive(service.id)}
                          >
                            {service.isActive ? (
                              <>
                                <TbEyeOff className="mr-2 h-4 w-4" />{" "}
                                Sembunyikan
                              </>
                            ) : (
                              <>
                                <TbEye className="mr-2 h-4 w-4" /> Tampilkan
                              </>
                            )}
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDeleteService(service.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <TbTrash className="mr-2 h-4 w-4" /> Hapus
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Content Section */}
                <div className="flex flex-col flex-1 space-y-1">
                  {/* Seller Avatar (Self) & Category */}
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <Avatar className="size-6">
                        <AvatarImage
                          src={user.profilePicture || ""}
                          alt={user.fullName}
                        />
                        <AvatarFallback className="text-[10px] bg-secondary text-secondary-foreground">
                          {getInitials(user.fullName)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-muted-foreground truncate max-w-[100px]">
                        {user.fullName}
                      </span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 font-medium">
                      {categoryNames[service.category] || service.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    className="font-bold text-foreground leading-snug hover:text-primary transition-colors line-clamp-2"
                    title={service.title}
                  >
                    {service.title}
                  </h3>

                  {/* Footer: Rating & Price */}
                  <div className="flex items-center justify-between mt-auto pt-2">
                    <div className="flex items-center gap-1">
                      <Star className="size-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">
                        {Number(service.avgRating).toFixed(1)}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        ({service.totalReviews})
                      </span>
                      <div className="ml-2 flex items-center gap-1 text-xs text-muted-foreground bg-gray-50 px-1.5 py-0.5 rounded">
                        <TbShoppingCart className="h-3 w-3" />
                        {service.totalOrders}
                      </div>
                    </div>

                    <p className="text-sm font-bold text-primary">
                      {formatPrice(service.price)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Service Form Drawer/Dialog */}
        <ServiceForm
          open={formOpen}
          onOpenChange={(val) => {
            setFormOpen(val);
            if (!val) setEditingService(null);
          }}
          onSubmit={editingService ? handleUpdateService : handleCreateService}
          initialData={editingService || undefined}
          mode={editingService ? "edit" : "create"}
        />
      </div>
    </SellerLayout>
  );
};

export default SellerServicesPage;
