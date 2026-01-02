"use client";

import Link from "next/link";
import PublicLayout from "@/components/layouts/PublicLayout";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SERVICE_CATEGORIES } from "@/lib/constants"; // Import Single Source of Truth
import { cn } from "@/lib/utils";
import {
  Search,
  CreditCard,
  MessageSquare,
  Star,
  UserCheck,
  PackagePlus,
  Clock,
  Wallet,
  ShieldCheck,
  Users,
  BarChart3,
  Bell,
  ArrowRight,
  CheckCircle2,
} from "lucide-react"; // Menggunakan Lucide agar konsisten

export default function HowItWorksPage() {
  return (
    <PublicLayout>
      <div className="min-h-screen bg-slate-50/50">
        {/* --- HERO SECTION --- */}
        <section className="relative overflow-hidden bg-primary text-primary-foreground py-24 md:py-32">
          {/* Background Decoration */}
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10"></div>
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-secondary/30 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-accent/30 rounded-full blur-3xl"></div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <Badge
                variant="outline"
                className="mb-6 border-white/30 text-white bg-white/10 backdrop-blur-md px-4 py-1.5 text-sm rounded-full"
              >
                Platform Jasa Mahasiswa #1
              </Badge>

              <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold font-display mb-6 tracking-tight">
                Cara Kerja <span className="text-secondary">Bantuin</span>
              </h1>

              <p className="text-lg md:text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto leading-relaxed">
                Platform marketplace yang menghubungkan mahasiswa dengan
                penyedia jasa profesional. Mudah, aman, dan terpercaya.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/services">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold h-12 px-8 rounded-full text-base"
                  >
                    Cari Jasa
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/seller/activate">
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto border-white/20 bg-white/5 text-white hover:bg-white/10 backdrop-blur-sm h-12 px-8 rounded-full text-base"
                  >
                    Jadi Penyedia
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* --- BUYER FLOW --- */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <Badge variant="secondary" className="mb-4 px-4 py-1">
                  Untuk Pembeli
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold font-display text-slate-900 mb-4">
                  Cara Memesan Jasa
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Proses pemesanan yang mudah dan aman dengan sistem escrow
                  untuk melindungi dana Anda
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                {/* Step 1 */}
                <StepCard
                  number="1"
                  icon={Search}
                  title="Cari & Pilih Jasa"
                  description="Gunakan fitur pencarian dan filter berdasarkan kategori, harga, dan rating. Lihat profil lengkap penyedia, portofolio, dan review."
                  tags={["Filter Kategori", "Lihat Rating", "Baca Review"]}
                />

                {/* Step 2 */}
                <StepCard
                  number="2"
                  icon={CreditCard}
                  title="Pesan & Bayar Aman"
                  description="Buat pesanan dengan detail jelas. Dana Anda ditahan aman di sistem (Escrow), hanya diteruskan setelah pekerjaan selesai."
                  tags={["Escrow System", "Pembayaran Aman"]}
                />

                {/* Step 3 */}
                <StepCard
                  number="3"
                  icon={MessageSquare}
                  title="Pantau Progress"
                  description="Komunikasi langsung dengan penyedia jasa melalui chat. Pantau progress pekerjaan dengan update berkala."
                  tags={["Chat Real-time", "Notifikasi"]}
                />

                {/* Step 4 */}
                <StepCard
                  number="4"
                  icon={Star}
                  title="Konfirmasi & Review"
                  description="Setelah pekerjaan selesai, konfirmasi penyelesaian dan berikan rating. Dana akan diteruskan ke penyedia."
                  tags={["Rating & Review", "Dana Diteruskan"]}
                />
              </div>
            </div>
          </div>
        </section>

        {/* --- SELLER FLOW --- */}
        <section className="py-24 bg-white relative overflow-hidden">
          {/* Decor */}
          <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-slate-200 to-transparent"></div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <Badge className="mb-4 bg-orange-100 text-orange-700 hover:bg-orange-200 border-orange-200 px-4 py-1">
                  Untuk Penyedia Jasa
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold font-display text-slate-900 mb-4">
                  Cara Menjadi Penyedia
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Mulai hasilkan uang dengan menawarkan keahlian Anda kepada
                  ribuan mahasiswa
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <StepCard
                  theme="orange"
                  number="1"
                  icon={UserCheck}
                  title="Daftar & Verifikasi"
                  description="Login dengan akun Google kampus. Lengkapi profil jurusan & angkatan. Aktifkan mode penyedia jasa."
                  tags={["Login Google", "Verifikasi Kampus"]}
                />
                <StepCard
                  theme="orange"
                  number="2"
                  icon={PackagePlus}
                  title="Buat Jasa"
                  description="Buat listing jasa dengan deskripsi detail, harga kompetitif. Upload portofolio untuk menarik pembeli."
                  tags={["Upload Portofolio", "Set Harga"]}
                />
                <StepCard
                  theme="orange"
                  number="3"
                  icon={Clock}
                  title="Terima & Kerjakan"
                  description="Terima pesanan masuk. Kerjakan dengan profesional dan update progress secara berkala via chat."
                  tags={["Kelola Pesanan", "Update Progress"]}
                />
                <StepCard
                  theme="orange"
                  number="4"
                  icon={Wallet}
                  title="Terima Pembayaran"
                  description="Setelah pembeli konfirmasi, dana langsung masuk ke saldo Anda. Cairkan ke rekening kapan saja."
                  tags={["Terima Dana", "Build Reputasi"]}
                />
              </div>
            </div>
          </div>
        </section>

        {/* --- KEY FEATURES --- */}
        <section className="py-24 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold font-display text-slate-900 mb-4">
                  Kenapa Pilih Bantuin?
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Platform terlengkap dengan fitur-fitur yang memudahkan
                  transaksi jasa
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <FeatureCard
                  icon={ShieldCheck}
                  title="Sistem Escrow"
                  desc="Dana aman, pembayaran diteruskan setelah pekerjaan selesai."
                />
                <FeatureCard
                  icon={Users}
                  title="Komunitas Terpercaya"
                  desc="Pengguna terverifikasi email kampus. Review transparan."
                />
                <FeatureCard
                  icon={MessageSquare}
                  title="Chat Real-time"
                  desc="Komunikasi langsung & cepat dalam satu platform."
                />
                <FeatureCard
                  icon={BarChart3}
                  title="Dashboard Analytics"
                  desc="Pantau performa jasa & pendapatan dengan statistik lengkap."
                />
                <FeatureCard
                  icon={Bell}
                  title="Notifikasi Real-time"
                  desc="Update instan untuk pesanan & chat via WA/Email."
                />
                <FeatureCard
                  icon={Star}
                  title="Rating & Review"
                  desc="Membangun reputasi & kepercayaan antar mahasiswa."
                />
              </div>
            </div>
          </div>
        </section>

        {/* --- CATEGORIES (Dynamic Source) --- */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold font-display text-slate-900 mb-4">
                  Berbagai Kategori Tersedia
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Apapun kebutuhanmu, temukan ahlinya di sini
                </p>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {SERVICE_CATEGORIES.map((category) => {
                  const Icon = category.icon;
                  return (
                    <Link
                      href={`/services?category=${category.id}`}
                      key={category.id}
                    >
                      <Card className="h-full border hover:border-primary/50 transition-all hover:shadow-lg hover:-translate-y-1 duration-300 group rounded-2xl overflow-hidden">
                        <CardContent className="p-6 flex flex-col items-center text-center h-full">
                          <div
                            className={cn(
                              "w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110",
                              category.bg,
                              category.color
                            )}
                          >
                            <Icon className="w-7 h-7" />
                          </div>
                          <h3 className="font-semibold text-slate-900 group-hover:text-primary transition-colors">
                            {category.label}
                          </h3>
                          <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                            {category.description}
                          </p>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </PublicLayout>
  );
}

// --- Sub-Components for Clean Code ---

function StepCard({
  number,
  icon: Icon,
  title,
  description,
  tags,
  theme = "blue",
}: any) {
  const isOrange = theme === "orange";

  return (
    <Card className="border-none shadow-sm hover:shadow-md transition-all duration-300 bg-white rounded-3xl overflow-hidden group">
      <CardContent className="p-8">
        <div className="flex items-start gap-6">
          <div
            className={cn(
              "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-xl font-bold transition-colors",
              isOrange
                ? "bg-orange-100 text-orange-600 group-hover:bg-orange-600 group-hover:text-white"
                : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white"
            )}
          >
            {number}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <Icon
                className={cn(
                  "h-6 w-6",
                  isOrange ? "text-orange-500" : "text-primary"
                )}
              />
              <h3 className="text-xl font-bold font-display text-slate-900">
                {title}
              </h3>
            </div>
            <p className="text-slate-600 mb-6 leading-relaxed">{description}</p>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag: string, i: number) => (
                <Badge
                  key={i}
                  variant="outline"
                  className={cn(
                    "font-normal",
                    isOrange
                      ? "text-orange-600 border-orange-200 bg-orange-50"
                      : "text-primary border-primary/20 bg-primary/5"
                  )}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function FeatureCard({ icon: Icon, title, desc }: any) {
  return (
    <Card className="border shadow-sm hover:shadow-md transition-all duration-300 rounded-3xl group hover:border-primary/30 bg-white">
      <CardContent className="p-8 text-center flex flex-col items-center h-full">
        <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-colors">
          <Icon className="h-8 w-8 text-slate-600 group-hover:text-primary transition-colors" />
        </div>
        <h3 className="text-lg font-bold font-display text-slate-900 mb-3">
          {title}
        </h3>
        <p className="text-sm text-slate-600 leading-relaxed">{desc}</p>
      </CardContent>
    </Card>
  );
}
