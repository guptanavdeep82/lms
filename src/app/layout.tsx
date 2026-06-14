import type { Metadata } from "next";
import { Bebas_Neue, Montserrat, Poppins, Rajdhani, Sora } from "next/font/google";
import "./globals.css";
import "@/components/public-header.css";
import "@/components/public-footer.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas",
  subsets: ["latin"],
  weight: "400",
});

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Kaneesh Reena Logics LMS",
  description:
    "Public LMS website for competitive exam courses, mock tests, notes, live classes, forums, and student subscriptions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${montserrat.variable} ${sora.variable} ${bebasNeue.variable} ${rajdhani.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground font-[family-name:var(--font-poppins)]">
        {children}
      </body>
    </html>
  );
}
