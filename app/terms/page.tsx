import React from "react";
import Link from "next/link";
import { ArrowLeft, Mail, MapPin, Phone } from "lucide-react";

export const metadata = {
  title: "Syarat & Ketentuan - Bantuin",
  description: "Syarat dan ketentuan penggunaan layanan Bantuin.",
};

export default function TermsPage() {
  const lastUpdated = new Date().toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header Section */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-slate-500 hover:text-primary mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Beranda
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
            Syarat & Ketentuan
          </h1>
          <p className="text-slate-500">
            Terakhir diperbarui: {lastUpdated}
          </p>
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-slate-200 text-slate-700 leading-relaxed space-y-8">
          
          {/* 1. Conditions of Use */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">1. Ketentuan Penggunaan</h2>
            <p>
              Layanan Bantuin ditawarkan kepada Anda, pengguna, dengan syarat penerimaan Anda terhadap syarat, ketentuan, dan pemberitahuan yang terkandung atau disertakan melalui referensi di sini serta syarat dan ketentuan tambahan, perjanjian, dan pemberitahuan yang mungkin berlaku untuk halaman atau bagian mana pun dari Situs ini.
            </p>
          </section>

          {/* 2. Overview */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">2. Ikhtisar</h2>
            <p className="mb-3">
              Penggunaan Anda atas Situs ini merupakan persetujuan Anda terhadap semua syarat, ketentuan, dan pemberitahuan. Silakan baca dengan saksama. Dengan menggunakan Situs ini, Anda menyetujui Syarat dan Ketentuan ini, serta syarat, pedoman, atau aturan lain apa pun yang berlaku untuk bagian mana pun dari Situs ini, tanpa batasan atau kualifikasi.
            </p>
            <p className="bg-amber-50 border-l-4 border-amber-500 p-4 text-amber-900 text-sm">
              Jika Anda tidak menyetujui Syarat dan Ketentuan ini, Anda harus segera keluar dari Situs dan menghentikan penggunaan informasi atau produk dari Situs ini.
            </p>
          </section>

          {/* 3. Modification */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">3. Modifikasi Situs dan Syarat & Ketentuan</h2>
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
            <h2 className="text-xl font-bold text-slate-900 mb-3">4. Hak Cipta</h2>
            <p className="mb-3">
              Situs ini dimiliki dan dioperasikan oleh Bantuin. Kecuali ditentukan lain, semua materi di Situs ini, merek dagang, merek layanan, logo adalah milik Bantuin dan dilindungi oleh undang-undang hak cipta Indonesia dan hukum hak cipta yang berlaku di seluruh dunia.
            </p>
            <p>
              Tidak ada materi yang dipublikasikan oleh Bantuin di Situs ini, secara keseluruhan atau sebagian, yang boleh disalin, direproduksi, dimodifikasi, dipublikasikan ulang, diunggah, diposting, dikirimkan, atau didistribusikan dalam bentuk apa pun atau dengan cara apa pun tanpa izin tertulis sebelumnya dari Bantuin.
            </p>
          </section>

          {/* 5. Sign Up */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">5. Pendaftaran (Sign Up)</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Anda perlu mendaftar di Situs ini untuk memesan layanan dengan memasukkan nama pengguna dan kata sandi Anda.</li>
              <li>Anda akan mendapatkan keuntungan seperti buletin (newsletter), pembaruan, dan penawaran khusus dengan mendaftar.</li>
              <li>Anda akan diminta untuk memberikan informasi yang akurat dan terkini pada semua formulir pendaftaran di Situs ini.</li>
              <li>Anda bertanggung jawab penuh untuk menjaga kerahasiaan nama pengguna dan kata sandi yang Anda pilih atau yang dipilih oleh administrator web Anda atas nama Anda, untuk mengakses Situs ini serta setiap aktivitas yang terjadi di bawah nama pengguna/kata sandi Anda.</li>
              <li>Anda tidak akan menyalahgunakan atau membagikan nama pengguna atau kata sandi Anda, menyalahartikan identitas Anda atau afiliasi Anda dengan suatu entitas, meniru orang atau entitas mana pun, atau menyalahartikan asal Materi apa pun yang Anda temui melalui Situs ini.</li>
            </ul>
          </section>

          {/* 6. Electronic Communications */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">6. Komunikasi Elektronik</h2>
            <p className="mb-3">
              Anda setuju bahwa Bantuin dapat mengirimkan surat elektronik (email) kepada Anda untuk tujuan memberi tahu Anda tentang perubahan atau penambahan pada Situs ini, tentang produk atau layanan Bantuin, atau untuk tujuan lain yang kami anggap sesuai.
            </p>
        
          </section>

          {/* 7. Services Descriptions */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">7. Deskripsi Layanan</h2>
            <p className="mb-3">
              Kami selalu berusaha sebaik mungkin untuk menampilkan informasi dan warna dari layanan/produk yang muncul di Situs seakurat mungkin.
            </p>
            <p>
              Namun, kami tidak dapat menjamin bahwa tampilan warna apa pun pada monitor Anda akan akurat karena warna asli yang Anda lihat bergantung pada kualitas monitor Anda.
            </p>
          </section>

          {/* 8. Privacy Policy */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">8. Kebijakan Privasi</h2>
            <p className="mb-3">
              Informasi Anda aman bersama kami. Bantuin memahami bahwa masalah privasi sangat penting bagi pelanggan kami.
            </p>
            <p className="mb-3">
              Anda dapat yakin bahwa informasi apa pun yang Anda kirimkan kepada kami tidak akan disalahgunakan, disalahartikan, atau dijual kepada pihak lain mana pun. Kami hanya menggunakan informasi pribadi Anda untuk menyelesaikan pesanan Anda.
            </p>
          </section>

          {/* 9. Indemnity */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">9. Ganti Rugi (Indemnity)</h2>
            <p>
              Anda setuju untuk mengganti rugi, membela, dan membebaskan Bantuin dari dan terhadap setiap dan semua klaim pihak ketiga, kewajiban, kerusakan, kerugian, atau biaya (termasuk biaya pengacara yang wajar dan biaya-biaya lainnya) yang timbul dari, berdasarkan, atau sehubungan dengan akses dan/atau penggunaan Anda atas Situs ini.
            </p>
          </section>

          {/* 10. Disclaimer */}
          <section>
            <h2 className="text-xl font-bold text-slate-900 mb-3">10. Penafian (Disclaimer)</h2>
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
            <h2 className="text-xl font-bold text-slate-900 mb-3">11. Hukum yang Berlaku</h2>
            <p>
              Syarat dan Ketentuan ini diatur oleh hukum yang berlaku di Indonesia.
            </p>
          </section>

          {/* 12. Questions and Feedback */}
          <section className="bg-slate-50 rounded-xl p-6 border border-slate-100 mt-8">
            <h2 className="text-xl font-bold text-slate-900 mb-4">12. Pertanyaan dan Umpan Balik</h2>
            <p className="mb-4">
              Kami menyambut pertanyaan, komentar, dan kekhawatiran Anda tentang privasi atau informasi apa pun yang dikumpulkan dari Anda atau tentang Anda. Silakan kirimkan semua umpan balik yang berkaitan dengan privasi atau masalah lainnya kepada kami.
            </p>
            
            <div className="space-y-4 mt-6">
              <div className="flex items-center gap-3 text-slate-700">
                <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Email Support</p>
                  <a href="mailto:support@bantuin.id" className="font-medium hover:text-primary transition-colors">support@bantuin.id</a>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-slate-700">
                <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Telepon / WhatsApp</p>
                  <span className="font-medium">0859106807105</span>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-slate-700">
                <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Lokasi</p>
                  <span className="font-medium">UIN Suska Riau, Pekanbaru</span>
                </div>
              </div>
            </div>
          </section>

          {/* Legal Footer */}
          <div className="pt-8 border-t border-slate-200 text-center text-sm text-slate-400">
            <p className="mb-1">Legal Notice: Bantuin adalah merek layanan platform mahasiswa.</p>
            <p>Copyright © {new Date().getFullYear()} Bantuin. All Rights Reserved.</p>
          </div>

        </div>
      </div>
    </div>
  );
}