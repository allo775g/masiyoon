import { Inter } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "مَصيون | Masiyoon",
  description: "المنصة الذكية الرائدة لخدمات الصيانة والتوثيق الحيوي",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body className={inter.className}>
        <AppProvider>
          {children}
          <Analytics />
          <SpeedInsights />
        </AppProvider>
      </body>
    </html>
  );
}
