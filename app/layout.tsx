import type { Metadata, Viewport } from "next";
import { Andika, Raleway } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ChatProvider } from "@/contexts/ChatContext";
import { ChatFloatingWindow } from "@/components/chat/ChatFloatingWindow";
import localFont from "next/font/local";
import { Toaster } from "@/components/ui/sonner";
import { TermsModal } from "@/components/auth/TermsModal";
import { ServiceWorkerRegister } from "@/app/components/ServiceWorkerRegister";
import { PWAInstallPrompt } from "@/components/pwa/PWAInstallPrompt";

// const mattone = localFont({
//   src: [
//     {
//       path: "../public/fonts/mattone/Mattone-Regular.woff2",
//       weight: "400",
//       style: "normal",
//     },
//     {
//       path: "../public/fonts/mattone/Mattone-Bold.woff2",
//       weight: "700",
//       style: "normal",
//     },
//     {
//       path: "../public/fonts/mattone/Mattone-Black.woff2",
//       weight: "900",
//       style: "normal",
//     },
//   ],
//   variable: "--font-mattone",
// });

const mattone = Raleway({
  subsets: ["latin"],
  variable: "--font-mattone",
  display: "swap",
});

const outfit = Andika({
  variable: "--font-outfit",
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://bantuin-campus.me"),

  title: {
    default: "Bantuin - Marketplace Jasa Mahasiswa UIN Suska Riau",
    template: "%s | Bantuin",
  },

  description:
    "Bantuin adalah marketplace jasa mahasiswa UIN Suska Riau yang menghubungkan freelancer kampus dengan proyek akademik, tugas, desain, dan pekerjaan digital.",

  keywords: [
    "bantuin",
    "bantuin campus",
    "marketplace jasa mahasiswa",
    "jasa mahasiswa UIN Suska",
    "freelance mahasiswa",
    "joki tugas mahasiswa",
  ],

  manifest: "/manifest.json",

  icons: {
    icon: "/logo.svg",
  },

  // Google Search Console Verification
  verification: {
    google: "f1bd0c7bd2c8e140",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },

  openGraph: {
    title: "Bantuin - Marketplace Jasa Mahasiswa UIN Suska Riau",
    description:
      "Platform marketplace jasa mahasiswa UIN Suska Riau untuk freelance, proyek akademik, dan pekerjaan digital.",
    url: "https://bantuin-campus.me",
    siteName: "Bantuin",
    locale: "id_ID",
    type: "website",
    images: [
      {
        url: "https://bantuin-campus.me/og-image.png",
        width: 1200,
        height: 630,
        alt: "Bantuin - Marketplace Jasa Mahasiswa",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Bantuin - Marketplace Jasa Mahasiswa UIN Suska Riau",
    description:
      "Platform marketplace jasa mahasiswa UIN Suska Riau untuk freelance, proyek akademik, dan pekerjaan digital.",
    images: ["https://bantuin-campus.me/og-image.png"],
  },

  alternates: {
    canonical: "https://bantuin-campus.me",
  },

  authors: [{ name: "Bantuin Team" }],
  creator: "Bantuin",
  publisher: "Bantuin",
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${mattone.variable} ${outfit.variable} antialiased`}>
        <AuthProvider>
          <ChatProvider>
            {children}
            <ChatFloatingWindow />
            <PWAInstallPrompt />
            <TermsModal />
            <Toaster position="top-right" />
            <ServiceWorkerRegister />
          </ChatProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
