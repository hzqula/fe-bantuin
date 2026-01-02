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
  title: "Bantuin: Marketplace Jasa Mahasiswa UIN Suska Riau",
  description:
    "Wadah bagi mahasiswa UIN Suska Riau untuk menawarkan dan mencari jasa tanpa harus ribet lewat media sosial",
  manifest: "/manifest.json",
  icons: {
    icon: "/logo.svg",
  },
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
