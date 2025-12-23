import {
  Mail,
  Phone,
  MapPin,
  Instagram,
  Youtube,
} from "lucide-react";
import Image from "next/image";
import Logo from "@/public/logo.svg";
import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-primary text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-2">
                <Image
                  src={Logo}
                  alt="logo"
                  width={36}
                  height={36}
                  className="md:w-10 md:h-10 lg:w-12 lg:h-12"
                />
                <h1 className="font-display text-white text-xl md:text-2xl lg:text-3xl">
                  <Link href="/">
                    Bant<span className="text-foreground">uin</span>
                  </Link>
                </h1>
              </div>
            </div>
            <p className="text-sm mb-4">
              Platform marketplace jasa mahasiswa terpercaya. 
              Temukan bantuan untuk tugas, proyek, dan kebutuhan harianmu dengan mudah.
            </p>
            {/* Social Media */}
            <div className="flex gap-3">
              <a
                href="https://www.instagram.com/sobat.bantuin?utm_source=qr&igsh=bHRxczdkcHRpNW1t"
                className="h-8 w-8 rounded-full bg-gray-800 hover:bg-secondary flex items-center justify-center transition-colors"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://www.tiktok.com/@sobat.bantuin?is_from_webapp=1&sender_device=pc"
                className="h-8 w-8 rounded-full bg-gray-800 hover:bg-secondary flex items-center justify-center transition-colors"
              >
                <svg role="img" className="h-4 w-4 fill-border"viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>TikTok</title><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
              </a>
              <a
                href="#"
                className="h-8 w-8 rounded-full bg-gray-800 hover:bg-secondary flex items-center justify-center transition-colors"
              >
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Link Cepat */}
          <div>
            <h3 className="text-white mb-4">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/services" className="hover:text-secondary transition-colors">
                  Jelajahi Jasa
                </a>
              </li>
              <li>
                <a href="/how" className="hover:text-secondary transition-colors">
                  Cara Kerja
                </a>
              </li>
            </ul>
          </div>

          {/* Layanan */}
          <div>
            <h3 className="text-white mb-4">Kategori Populer</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-secondary transition-colors">
                  Desain & Kreatif
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-secondary transition-colors">
                  Penulisan
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-secondary transition-colors">
                  Programming
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-secondary transition-colors">
                  Marketing
                </a>
              </li>
            </ul>
          </div>

          {/* Bantuan */}
          <div>
            <h3 className="text-white mb-4">Pusat Bantuan</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2 pt-2">
                <Mail href="#" className="h-4 w-4 text-secondary"/>
                  support@bantuin.id
              </li>
              <li className="flex items-center gap-2 pt-2">
                <Phone href="#" className="h-4 w-4 text-secondary"/>
                  0859106807105
              </li>
              <li className="flex items-center gap-2 pt-2">
                <MapPin className="h-4 w-4 text-secondary"/>
                <span>UIN Suska Riau, Pekanbaru</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200 text-center md:text-left flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm">
            &copy; {currentYear} Bantuin. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-6 text-sm">
            <Link
              href="/terms"
              className="hover:text-secondary transition-colors"
            >
              Terms & Conditions
            </Link>
            
            <Link
              href="/faq"
              className="hover:text-secondary transition-colors"
            >
              FAQ
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
