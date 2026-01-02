"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Import useRouter
import PublicLayout from "@/components/layouts/PublicLayout";
import ServiceCard from "@/components/services/ServiceCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TbTrophy, TbStar, TbArrowRight, TbLoader } from "react-icons/tb";
import { SERVICE_CATEGORIES } from "@/lib/constants"; // Import kategori
import CategoryShowcase from "@/components/home/CategoryShowcase";
import Hero from "@/components/Hero";

function HomePageContent() {
  const router = useRouter(); // Init router
  const [featuredServices, setFeaturedServices] = useState([]);
  const [topSellers, setTopSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch secara paralel agar lebih cepat
        const [servicesRes, sellersRes] = await Promise.all([
          fetch("/api/services/featured"),
          fetch("/api/users/top-sellers"),
        ]);

        const servicesData = await servicesRes.json();
        const sellersData = await sellersRes.json();

        if (servicesData.success) setFeaturedServices(servicesData.data);
        if (sellersData.success) setTopSellers(sellersData.data);
      } catch (error) {
        console.error("Failed to fetch home data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Structured Data untuk SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Bantuin",
    alternateName: "Bantuin Campus",
    url: "https://bantuin-campus.me",
    description:
      "Marketplace jasa mahasiswa UIN Suska Riau yang menghubungkan freelancer kampus dengan proyek akademik, tugas, desain, dan pekerjaan digital.",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://bantuin-campus.me/services?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <PublicLayout>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <Hero />

      <div className="container mx-auto px-4  py-12">
        <CategoryShowcase services={featuredServices} />
      </div>
    </PublicLayout>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      }
    >
      <HomePageContent />
    </Suspense>
  );
}
