import type { Metadata } from "next";
import { Poppins, Montserrat } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  weight: ['400', '500', '700'],
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Asim Koirala | Portfolio",
  description: "Personal portfolio website of Asim Koirala - Developer, Designer, Student",
  keywords: ["portfolio", "developer", "designer", "student", "web development"],
  icons: {
    icon: "/favicon.ico",
    apple: "/assets/profile_circle.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3715894505703211" crossOrigin="anonymous"></script>
        <meta name="google-adsense-account" content="ca-pub-3715894505703211"></meta>
      </head>
      <body
        className={`${poppins.variable} ${montserrat.variable} antialiased bg-white text-gray-900`}
      >
        {children}
      </body>
    </html>
  );
}
