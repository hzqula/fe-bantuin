"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Layers,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ServiceCard from "@/components/services/ServiceCard";
import { SERVICE_CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Badge } from "../ui/badge";

interface CategoryShowcaseProps {
  services: any[]; // Data services dari parent (featuredServices)
}

export default function CategoryShowcase({ services }: CategoryShowcaseProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const activeCategory = SERVICE_CATEGORIES[activeIndex];

  // Logic: Filter service yang sesuai kategori ini
  // Kita ambil 2 service teratas (slice 0,2)
  const categoryServices = services
    .filter((s) => s.category === activeCategory.id)
    .slice(0, 2);

  // Fallback: Jika tidak ada service di kategori ini, ambil 2 dari featured global (supaya tidak kosong melompong saat demo)
  // HAPUS logic fallback ini nanti jika data production sudah lengkap.
  const displayServices =
    categoryServices.length > 0 ? categoryServices : services.slice(0, 2);

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % SERVICE_CATEGORIES.length);
  };

  const prevSlide = () => {
    setActiveIndex((prev) =>
      prev === 0 ? SERVICE_CATEGORIES.length - 1 : prev - 1
    );
  };

  const Icon = activeCategory.icon;

  return (
    <section className="mb-16">
      <div className="flex flex-col md:flex-row justify-between md:items-end mb-8 gap-4">
        <div>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-foreground">
            Jelajahi Kategori
          </h2>
          <p className="text-muted-foreground mt-2">
            Pilihan jasa terbaik dari berbagai bidang keahlian
          </p>
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={nextSlide}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* LEFT SIDE: Category Info Card */}
        <div className=" lg:col-span-2">
          <div
            className={cn(
              `p-6 flex flex-col transition-colors duration-500 relative border`,
              activeCategory.bg,
              activeCategory.border
            )}
          >
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <div className="flex gap-2 items-center">
                <div className={cn(activeCategory.color)}>
                  <Icon className="w-6 h-6" />
                </div>

                <h3
                  className={cn(
                    "text-2xl font-extrabold font-display  text-slate-900"
                  )}
                >
                  Butuh jasa {activeCategory.label}?
                </h3>
              </div>
              <p className="text-secondary-foreground font-medium leading-relaxed">
                {activeCategory.description}
              </p>
              <div className="flex flex-wrap gap-2 mt-4">
                {activeCategory.tags?.map((tag, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className={cn(
                      // Layout & Glass Effect
                      "px-3 py-1 text-sm backdrop-blur-md transition-all hover:bg-white/60",

                      // Dynamic Colors
                      // 1. Ambil warna text dari kategori (misal: text-purple-600)
                      activeCategory.color,

                      // 2. Gunakan 'border-current' agar warna border otomatis sama dengan warna text
                      "border-current",

                      // 3. Background putih transparan (Glassy) agar cocok di atas background berwarna
                      "bg-white/25"
                    )}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="relative z-10 mt-8">
              <Link href={`/services?category=${activeCategory.id}`}>
                <Button size="lg" className="w-full">
                  Lihat Semua jasa {activeCategory.label}
                  <ArrowUpRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Services Preview */}
        <div className="lg:col-span-2">
          {/* Menggunakan key untuk mentrigger animasi re-render saat kategori berubah */}
          <div
            key={activeCategory.id}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full animate-in fade-in slide-in-from-right-4 duration-500"
          >
            {displayServices.length > 0 ? (
              displayServices.map((service) => (
                <div key={service.id} className="h-full">
                  <ServiceCard service={service} />
                </div>
              ))
            ) : (
              // Empty State jika benar-benar tidak ada data
              <div className="col-span-2 h-full border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center text-muted-foreground bg-gray-50/50">
                <Layers className="w-12 h-12 mb-4 opacity-20" />
                <p>Belum ada layanan unggulan di kategori ini.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
