"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import SellerLayout from "@/components/layouts/SellerLayout";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Package,
  ShoppingBag,
  Star,
  CheckCircle2,
  TrendingUp,
  Plus,
  BarChart3,
  Calendar,
  ArrowUpRight,
  Clock,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Dummy Data untuk Chart (Nilai 0 sesuai request tampilan awal)
const CHART_DATA = [
  { name: "Mei", revenue: 0 },
  { name: "Jun", revenue: 0 },
  { name: "Jul", revenue: 0 },
  { name: "Ags", revenue: 0 },
  { name: "Sep", revenue: 0 },
  { name: "Okt", revenue: 0 },
];

export default function SellerDashboardPage() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    setCurrentDate(
      new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    );

    if (!loading) {
      if (!isAuthenticated) router.push("/");
      else if (!user?.isSeller) router.push("/seller/activate");
    }
  }, [loading, isAuthenticated, user, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user?.isSeller) return null;

  return (
    <SellerLayout>
      <div className="mx-auto flex flex-col gap-8 pb-10">
        {/* --- PAGE HEADING --- */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-foreground mb-2">
              Assalamu'alaikum, {user.fullName}!
            </h1>
            <p className="text-slate-500 text-base">
              Ringkasan performa dan aktivitas terbaru mu.
            </p>
          </div>
          <div className="flex gap-3 items-center">
            <Calendar className="w-4 h-4 text-slate-400" />
            {currentDate}
          </div>
        </div>

        {/* --- KPI STATS GRID --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          <StatCard title="Total Jasa" value="0" icon={Package} color="blue" />
          <StatCard
            title="Pesanan Aktif"
            value="0"
            icon={ShoppingBag}
            color="orange"
          />
          <StatCard
            title="Rating Rata-rata"
            value={Number(user.avgRating || 0).toFixed(1)}
            icon={Star}
            color="yellow"
            subtext={`${user.totalReviews || 0} Ulasan`}
          />
          <StatCard
            title="Pesanan Selesai"
            value={user.totalOrdersCompleted || 0}
            icon={CheckCircle2}
            color="purple"
            subtext="Lifetime"
          />
        </div>

        {/* --- CHARTS & ACTIONS ROW --- */}
        <div className="flex flex-col xl:flex-row gap-6">
          {/* Chart Section using Recharts */}
          <div className="flex-1 flex flex-col">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-xl font-display font-bold text-slate-900">
                  Performa Penjualan
                </h3>
                <p className="text-sm text-slate-500">
                  Estimasi pendapatan 6 bulan terakhir
                </p>
              </div>
            </div>

            <div className="w-full h-[250px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={CHART_DATA}
                  margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="colorRevenue"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e2e8f0"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                    dy={10}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </SellerLayout>
  );
}

// --- SUB-COMPONENTS ---

function StatCard({
  title,
  value,
  icon: Icon,
  color,
  trend,
  badge,
  subtext,
}: any) {
  const colors: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600",
    orange: "bg-orange-50 text-orange-600",
    yellow: "bg-yellow-50 text-yellow-600",
    purple: "bg-purple-50 text-purple-600",
    green: "bg-green-50 text-green-600",
  };

  const badgeColors: Record<string, string> = {
    blue: "bg-blue-100 text-blue-700",
    orange: "bg-orange-100 text-orange-700",
    green: "bg-green-100 text-green-700",
  };

  return (
    <div className="bg-white p-6 shadow-sm border border-primary flex flex-col gap-4 hover:border-primary/30 transition-all group">
      <div className="flex items-start justify-between">
        <div className={cn("p-3 rounded-xl transition-colors", colors[color])}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-1 rounded-md flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> {trend}
          </span>
        )}
        {badge && (
          <span
            className={cn(
              "text-xs font-semibold px-2 py-1 rounded-md",
              badgeColors[color]
            )}
          >
            {badge}
          </span>
        )}
        {subtext && (
          <span className="text-xs font-medium text-slate-500 px-2 py-1">
            {subtext}
          </span>
        )}
      </div>
      <div>
        <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
      </div>
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-slate-100 shadow-lg rounded-xl text-sm">
        <p className="font-semibold text-slate-900 mb-1">{label}</p>
        <p className="text-primary font-medium">
          Rp {payload[0].value.toLocaleString("id-ID")}
        </p>
      </div>
    );
  }
  return null;
};
