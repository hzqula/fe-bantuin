"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import BuyerLayout from "@/components/layouts/BuyerLayout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  TbSearch,
  TbEye,
  TbPackage,
  TbClock,
  TbCheck,
  TbLoader,
} from "react-icons/tb";

interface Order {
  id: string;
  title: string;
  status: string;
  price: number;
  dueDate: string;
  createdAt: string;
  isPaid: boolean;
  service: {
    id: string;
    title: string;
    category: string;
    images: string[];
    seller: {
      fullName: string;
      email: string;
    };
  };
}

const BuyerOrdersPage = () => {
  const { loading: authLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push("/auth/login");
      } else {
        fetchOrders();
      }
    }
  }, [authLoading, isAuthenticated, router]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch("/api/orders?role=buyer&limit=100", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (data.success) {
        setOrders(data.data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<
      string,
      {
        label: string;
        variant: "secondary" | "default" | "destructive" | "outline";
        className?: string;
        icon?: any;
      }
    > = {
      DRAFT: { label: "Draft", variant: "secondary", icon: TbClock },
      WAITING_PAYMENT: {
        label: "Menunggu Pembayaran",
        variant: "secondary",
        className: "bg-yellow-100 text-yellow-700 border-yellow-200",
        icon: TbClock,
      },
      PAID_ESCROW: {
        label: "Menunggu Pengerjaan",
        variant: "default",
        className: "bg-blue-600 text-white border-blue-600",
        icon: TbPackage,
      },
      IN_PROGRESS: {
        label: "Sedang Dikerjakan",
        variant: "default",
        className: "bg-primary text-primary-foreground",
        icon: TbLoader,
      },
      DELIVERED: {
        label: "Menunggu Review Anda",
        variant: "secondary",
        className: "bg-purple-100 text-purple-700 border-purple-200",
        icon: TbEye,
      },
      REVISION: {
        label: "Sedang Direvisi",
        variant: "destructive",
        className: "bg-orange-100 text-orange-700 border-orange-200",
        icon: TbLoader,
      },
      COMPLETED: {
        label: "Selesai",
        variant: "default",
        className: "bg-green-600 text-white border-green-600",
        icon: TbCheck,
      },
      CANCELLED: {
        label: "Dibatalkan",
        variant: "destructive",
        icon: TbCheck,
      },
    };

    const config = statusConfig[status] || statusConfig["DRAFT"];
    const Icon = config.icon;

    return (
      <Badge
        variant={config.variant}
        className={`gap-1 whitespace-nowrap ${config.className}`}
      >
        {Icon && <Icon className="h-3 w-3" />}
        {config.label}
      </Badge>
    );
  };

  // Filter logic
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.service.seller?.fullName
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "ACTIVE" &&
        ["PAID_ESCROW", "IN_PROGRESS", "REVISION", "DELIVERED"].includes(
          order.status
        )) ||
      (statusFilter === "COMPLETED" && order.status === "COMPLETED") ||
      (statusFilter === "CANCELLED" && order.status === "CANCELLED");

    return matchesSearch && matchesStatus;
  });

  if (authLoading || loading) {
    return (
      <BuyerLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </BuyerLayout>
    );
  }

  return (
    <BuyerLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground mb-1">
              Pesanan Saya
            </h1>
            <p className="text-muted-foreground text-sm">
              Pantau status pesanan dan riwayat transaksi Anda
            </p>
          </div>
        </div>

        {/* Filters & Content */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex flex-col md:flex-row gap-4 justify-between">
              {/* Search */}
              <div className="relative w-full md:w-96">
                <TbSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari layanan atau penyedia..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Filter Buttons */}
              <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                <Button
                  variant={statusFilter === "ALL" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("ALL")}
                  className={
                    statusFilter === "ALL" ? "bg-primary text-white" : ""
                  }
                >
                  Semua
                </Button>
                <Button
                  variant={statusFilter === "ACTIVE" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("ACTIVE")}
                  className={
                    statusFilter === "ACTIVE" ? "bg-blue-600 text-white" : ""
                  }
                >
                  Berjalan
                </Button>
                <Button
                  variant={statusFilter === "COMPLETED" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("COMPLETED")}
                  className={
                    statusFilter === "COMPLETED"
                      ? "bg-green-600 text-white"
                      : ""
                  }
                >
                  Selesai
                </Button>
                <Button
                  variant={statusFilter === "CANCELLED" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("CANCELLED")}
                  className={
                    statusFilter === "CANCELLED" ? "bg-red-600 text-white" : ""
                  }
                >
                  Dibatalkan
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {filteredOrders.length === 0 ? (
              <div className="text-center py-12">
                <TbPackage className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
                <h3 className="text-lg font-medium text-foreground">
                  Belum ada pesanan
                </h3>
                <p className="text-muted-foreground">
                  Jelajahi layanan dan mulai buat pesanan pertamamu.
                </p>
                <Link href="/services">
                  <Button className="mt-4">Cari Jasa</Button>
                </Link>
              </div>
            ) : (
              <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead className="[&_tr]:border-b">
                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground w-[300px]">
                        Layanan
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                        Penyedia
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                        Deadline
                      </th>
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                        Status
                      </th>
                      <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                        Total
                      </th>
                      <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="[&_tr:last-child]:border-0">
                    {filteredOrders.map((order) => (
                      <tr
                        key={order.id}
                        className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                      >
                        <td className="p-4 align-middle">
                          <div className="flex items-center gap-3">
                            <div className="relative h-12 w-12 overflow-hidden rounded-md border bg-muted">
                              {order.service.images[0] ? (
                                <Image
                                  src={order.service.images[0]}
                                  alt={order.service.title}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                                  No IMG
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col">
                              <span className="font-medium line-clamp-1 text-foreground">
                                {order.service.title}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {order.service.category}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 align-middle">
                          <div className="flex flex-col">
                            <span className="text-foreground font-medium">
                              {order.service.seller?.fullName || "Unknown"}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {order.service.seller?.email}
                            </span>
                          </div>
                        </td>
                        <td className="p-4 align-middle">
                          <span className="text-foreground">
                            {new Date(order.dueDate).toLocaleDateString(
                              "id-ID",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </span>
                        </td>
                        <td className="p-4 align-middle">
                          {getStatusBadge(order.status)}
                        </td>
                        <td className="p-4 align-middle text-right font-medium text-primary">
                          {formatPrice(order.price)}
                        </td>
                        <td className="p-4 align-middle text-right">
                          <Link href={`/buyer/orders/${order.id}`}>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-primary/20 hover:bg-primary/5 hover:text-primary"
                            >
                              Detail
                            </Button>
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </BuyerLayout>
  );
};

export default BuyerOrdersPage;
