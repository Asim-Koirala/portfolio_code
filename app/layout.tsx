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
    icon: "/assets/profile_circle.png",
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
      </head>
      <body
        className={`${poppins.variable} ${montserrat.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
