"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Import useRouter
import PublicLayout from "@/components/layouts/PublicLayout";
import Hero from "@/components/Hero";
import ServiceCard from "@/components/services/ServiceCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TbTrophy, TbStar, TbArrowRight, TbLoader } from "react-icons/tb";
import { SERVICE_CATEGORIES } from "@/lib/constants"; // Import kategori
import CategoryShowcase from "@/components/home/CategoryShowcase";

function HomePageContent() {
  const router = useRouter(); // Init router
  const [featuredServices, setFeaturedServices] = useState([]);
  const [topSellers, setTopSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
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

  return (
    <PublicLayout>
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
