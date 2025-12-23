"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { Mail, MapPin, Phone } from "lucide-react";

export function TermsModal() {
  const { user, refreshUser, loading } = useAuth(); 
  const [isOpen, setIsOpen] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      
      const hasAcceptedDB = (user as any).termsAcceptedAt;

      // Jika di DB masih kosong/null, tampilkan modal
      if (!hasAcceptedDB) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    }
  }, [user, loading]);

  const handleAgree = async () => {
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("Sesi tidak valid");

      // 1. Simpan ke Database
      const response = await fetch("/api/users/update-profile", {
        method: "PATCH",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({
          termsAcceptedAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error("Gagal menyimpan ke server");
      }

      if (refreshUser) {
        await refreshUser();
      }

      setIsOpen(false);
      toast.success("Terima kasih telah menyetujui Syarat & Ketentuan");
      
    } catch (error) {
      console.error(error);
      toast.error("Gagal memproses persetujuan. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return null;

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent
        className="max-w-2xl"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle>Syarat & Ketentuan Penggunaan</DialogTitle>
          <DialogDescription>
            Selamat datang di Bantuin! Harap baca dan setujui ketentuan di bawah ini untuk melanjutkan.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[60vh] w-full rounded-md border p-4 text-sm text-slate-600 bg-slate-50">
          <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-slate-200 text-slate-700 leading-relaxed space-y-8">
            
            {/* 1. Conditions of Use */}
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-3">1. Ketentuan Penggunaan</h2>
              <p>
                Layanan Bantuin ditawarkan kepada Anda, pengguna, dengan syarat penerimaan Anda terhadap syarat, ketentuan, dan pemberitahuan yang terkandung atau disertakan melalui referensi di sini serta syarat dan ketentuan tambahan, perjanjian, dan pemberitahuan yang mungkin berlaku untuk halaman atau bagian mana pun dari Situs ini.
              </p>
            </section>

            {/* 2. Overview */}
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-3">2. Ikhtisar</h2>
              <p className="mb-3">
                Penggunaan Anda atas Situs ini merupakan persetujuan Anda terhadap semua syarat, ketentuan, dan pemberitahuan. Silakan baca dengan saksama. Dengan menggunakan Situs ini, Anda menyetujui Syarat dan Ketentuan ini, serta syarat, pedoman, atau aturan lain apa pun yang berlaku untuk bagian mana pun dari Situs ini, tanpa batasan atau kualifikasi.
              </p>
              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 text-amber-900 text-xs md:text-sm">
                Jika Anda tidak menyetujui Syarat dan Ketentuan ini, Anda harus segera keluar dari Situs dan menghentikan penggunaan informasi atau produk dari Situs ini.
              </div>
            </section>

            {/* 3. Modification */}
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-3">3. Modifikasi Situs dan Syarat & Ketentuan</h2>
              <p className="mb-3">
                Bantuin berhak untuk mengubah, memodifikasi, mengubah, memperbarui, atau menghentikan syarat, ketentuan, dan pemberitahuan di mana Situs ini ditawarkan serta tautan, konten, informasi, harga, dan materi lainnya yang ditawarkan melalui Situs ini kapan saja dan dari waktu ke waktu tanpa pemberitahuan atau kewajiban lebih lanjut kepada Anda kecuali sebagaimana ditentukan di dalamnya.
              </p>
              <p className="mb-3">
                Kami berhak untuk menyesuaikan harga dari waktu ke waktu. Jika karena alasan tertentu terjadi kesalahan harga, Bantuin berhak menolak pesanan.
              </p>
              <p>
                Dengan terus menggunakan Situs setelah modifikasi, perubahan, atau pembaruan tersebut, Anda setuju untuk terikat oleh modifikasi, perubahan, atau pembaruan tersebut.
              </p>
            </section>

            {/* 4. Copyrights */}
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-3">4. Hak Cipta</h2>
              <p className="mb-3">
                Situs ini dimiliki dan dioperasikan oleh Bantuin. Kecuali ditentukan lain, semua materi di Situs ini, merek dagang, merek layanan, logo adalah milik Bantuin dan dilindungi oleh undang-undang hak cipta Indonesia dan hukum hak cipta yang berlaku di seluruh dunia.
              </p>
              <p>
                Tidak ada materi yang dipublikasikan oleh Bantuin di Situs ini, secara keseluruhan atau sebagian, yang boleh disalin, direproduksi, dimodifikasi, dipublikasikan ulang, diunggah, diposting, dikirimkan, atau didistribusikan dalam bentuk apa pun atau dengan cara apa pun tanpa izin tertulis sebelumnya dari Bantuin.
              </p>
            </section>

            {/* 5. Sign Up */}
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-3">5. Pendaftaran (Sign Up)</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Anda perlu mendaftar di Situs ini untuk memesan layanan dengan memasukkan nama pengguna dan kata sandi Anda.</li>
                <li>Anda akan mendapatkan keuntungan seperti buletin (newsletter), pembaruan, dan penawaran khusus dengan mendaftar.</li>
                <li>Anda akan diminta untuk memberikan informasi yang akurat dan terkini pada semua formulir pendaftaran di Situs ini.</li>
                <li>Anda bertanggung jawab penuh untuk menjaga kerahasiaan nama pengguna dan kata sandi yang Anda pilih atau yang dipilih oleh administrator web Anda atas nama Anda.</li>
                <li>Anda tidak akan menyalahgunakan atau membagikan nama pengguna atau kata sandi Anda, menyalahartikan identitas Anda atau afiliasi Anda dengan suatu entitas.</li>
              </ul>
            </section>

            {/* 6. Electronic Communications */}
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-3">6. Komunikasi Elektronik</h2>
              <p className="mb-3">
                Anda setuju bahwa Bantuin dapat mengirimkan surat elektronik (email) kepada Anda untuk tujuan memberi tahu Anda tentang perubahan atau penambahan pada Situs ini, tentang produk atau layanan Bantuin, atau untuk tujuan lain yang kami anggap sesuai.
              </p>
            </section>

            {/* 7. Services Descriptions */}
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-3">7. Deskripsi Layanan</h2>
              <p className="mb-3">
                Kami selalu berusaha sebaik mungkin untuk menampilkan informasi dan warna dari layanan/produk yang muncul di Situs seakurat mungkin.
              </p>
              <p>
                Namun, kami tidak dapat menjamin bahwa tampilan warna apa pun pada monitor Anda akan akurat karena warna asli yang Anda lihat bergantung pada kualitas monitor Anda.
              </p>
            </section>

            {/* 8. Privacy Policy */}
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-3">8. Kebijakan Privasi</h2>
              <p className="mb-3">
                Informasi Anda aman bersama kami. Bantuin memahami bahwa masalah privasi sangat penting bagi pelanggan kami.
              </p>
              <p className="mb-3">
                Anda dapat yakin bahwa informasi apa pun yang Anda kirimkan kepada kami tidak akan disalahgunakan, disalahartikan, atau dijual kepada pihak lain mana pun. Kami hanya menggunakan informasi pribadi Anda untuk menyelesaikan pesanan Anda.
              </p>
            </section>

            {/* 9. Indemnity */}
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-3">9. Ganti Rugi (Indemnity)</h2>
              <p>
                Anda setuju untuk mengganti rugi, membela, dan membebaskan Bantuin dari dan terhadap setiap dan semua klaim pihak ketiga, kewajiban, kerusakan, kerugian, atau biaya (termasuk biaya pengacara yang wajar dan biaya-biaya lainnya) yang timbul dari, berdasarkan, atau sehubungan dengan akses dan/atau penggunaan Anda atas Situs ini.
              </p>
            </section>

            {/* 10. Disclaimer */}
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-3">10. Penafian (Disclaimer)</h2>
              <p className="mb-3">
                Bantuin tidak bertanggung jawab atas keakuratan, kebenaran, ketepatan waktu, atau konten dari Materi yang disediakan di Situs ini.
              </p>
              <p className="mb-3">
                Anda tidak boleh berasumsi bahwa Materi di Situs ini diperbarui terus-menerus atau mengandung informasi terkini.
              </p>
              <p>
                Bantuin tidak bertanggung jawab untuk menyediakan konten atau materi dari Situs yang telah kedaluwarsa atau telah dihapus.
              </p>
            </section>

            {/* 11. Applicable Laws */}
            <section>
              <h2 className="text-lg font-bold text-slate-900 mb-3">11. Hukum yang Berlaku</h2>
              <p>
                Syarat dan Ketentuan ini diatur oleh hukum yang berlaku di Indonesia.
              </p>
            </section>

            {/* 12. Questions and Feedback */}
            <section className="bg-slate-50 rounded-xl p-6 border border-slate-100 mt-8">
              <h2 className="text-lg font-bold text-slate-900 mb-4">12. Pertanyaan dan Umpan Balik</h2>
              <p className="mb-4">
                Kami menyambut pertanyaan, komentar, dan kekhawatiran Anda tentang privasi atau informasi apa pun yang dikumpulkan dari Anda atau tentang Anda.
              </p>
              
              <div className="space-y-4 mt-6">
                <div className="flex items-center gap-3 text-slate-700">
                  <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Email Support</span>
                    <a href="mailto:support@bantuin.id" className="font-medium hover:text-primary transition-colors">support@bantuin.id</a>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 text-slate-700">
                  <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Telepon / WhatsApp</span>
                    <span className="font-medium">0859106807105</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 text-slate-700">
                  <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">Lokasi</span>
                    <span className="font-medium">UIN Suska Riau, Pekanbaru</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Legal Footer */}
            <div className="pt-8 border-t border-slate-200 text-center text-xs text-slate-400">
              <p className="mb-1">Legal Notice: Bantuin adalah merek layanan platform mahasiswa.</p>
              <p>Copyright © {new Date().getFullYear()} Bantuin. All Rights Reserved.</p>
            </div>

          </div>
        </ScrollArea>

        <DialogFooter className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="terms"
              checked={agreed}
              onCheckedChange={(c) => setAgreed(c as boolean)}
            />
            <label
              htmlFor="terms"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              Saya menyetujui Syarat & Ketentuan
            </label>
          </div>
          <Button 
            onClick={handleAgree} 
            disabled={!agreed || isSubmitting}
            className="w-full sm:w-auto"
          >
            {isSubmitting ? "Menyimpan..." : "Lanjutkan ke Aplikasi"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}