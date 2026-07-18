import type { Metadata } from "next";
import { Inter, DM_Serif_Display, Mukta, Rajdhani, Yatra_One } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const dmSerif = DM_Serif_Display({
  variable: "--font-dm-serif",
  weight: "400",
  subsets: ["latin"],
});

const mukta = Mukta({
  variable: "--font-mukta",
  weight: ["400", "500", "600", "700"],
  subsets: ["devanagari", "latin"],
});

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  weight: ["500", "600", "700"],
  subsets: ["latin"],
});

const yatraOne = Yatra_One({
  variable: "--font-yatra-one",
  weight: "400",
  subsets: ["devanagari", "latin"],
});

export const metadata: Metadata = {
  title: "श्री गुरु गोरखनाथ मठ, निमनवाड़ा",
  description: "नाथ संप्रदाय की सिद्ध परंपरा — तप, त्याग और भक्ति का पावन स्थल",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hi">
      <body className={`${inter.variable} ${dmSerif.variable} ${mukta.variable} ${rajdhani.variable} ${yatraOne.variable} antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
