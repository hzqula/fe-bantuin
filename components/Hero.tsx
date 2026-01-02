"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
// - Menggunakan Button UI
import { Button } from "./ui/button";
// - Menggunakan helper Cloudinary (asumsi dari konteks sebelumnya)
import { getCloudinaryUrl } from "@/lib/cloudinary";
// - Menggunakan Badge UI
import { Badge } from "./ui/badge";
// - Mengambil kategori service
import { SERVICE_CATEGORIES } from "@/lib/constants";
import { cn } from "@/lib/utils";

const videoSrc = getCloudinaryUrl("v1765990209/bg_x0rahs.mp4", "video");
const imageSrc = getCloudinaryUrl("v1765990224/service_1_itxze3.jpg", "image");

const Hero = () => {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  return (
    <section className="relative w-full h-[75vh] overflow-hidden">
      {/* Image Placeholder - Only show while video is loading */}
      {!isVideoLoaded && (
        <Image
          src={imageSrc}
          alt="Bantuin background placeholder"
          fill
          priority
          sizes="100vw"
          unoptimized
          className="object-cover"
        />
      )}

      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        onLoadedData={() => setIsVideoLoaded(true)}
        className="absolute top-0 left-0 w-full h-full object-cover"
      >
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Dark Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/70"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full container mx-auto px-4">
        <Badge
          variant="outline"
          className="text-sky-300 border-sky-300 mb-4 px-3 py-1 text-sm bg-sky-900/30 backdrop-blur shadow-[0_0_15px_rgba(56,189,248,0.8)]"
        >
          Marketplace Jasa Mahasiswa
        </Badge>
        <h1 className="font-display font-bold text-2xl sm:text-4xl md:text-5xl lg:text-5xl text-white mb-6">
          Butuh Jasa? <span className="text-sky-700">Sini Tempatnya</span>
        </h1>

        <p className="text-white/90 text-base sm:text-lg md:text-xl max-w-3xl text-center mb-10">
          Wadah bagi mahasiswa UIN Suska Riau untuk menawarkan dan mencari jasa
          tanpa harus ribet lewat media sosial.
        </p>

        {/* Kategori Jasa List */}
        <div className="flex flex-wrap justify-center gap-3 animate-in slide-in-from-bottom-4 fade-in duration-700 delay-200">
          {SERVICE_CATEGORIES.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.id}
                href={`/services?category=${category.id}`}
              >
                <Badge
                  variant="outline"
                  className={cn(
                    "cursor-pointer transition-all duration-300 px-3 py-1.5 text-xs md:text-sm gap-2",

                    // 1. Glass Effect & Background
                    "backdrop-blur-md bg-black/50 hover:bg-black/70",

                    // 2. Dynamic Color from Constant
                    category.color,

                    // 3. MAGIC SAUCE: Brightness & Saturate filters
                    // Ini memaksa warna text-xxxx-600 menjadi lebih terang (mirip shade 300/400)
                    // dan lebih "neon" (saturate tinggi)
                    "brightness-150 saturate-200 hover:brightness-200",

                    // 4. Glow Effect (Shadow)
                    "border-current shadow-[0_0_15px_currentColor] hover:shadow-[0_0_25px_currentColor] hover:scale-105"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {category.label}
                </Badge>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Hero;
