import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AD to BS Converter | Asim Koirala",
  description: "Convert dates between AD (Gregorian) and BS (Bikram Sambat) calendar systems",
  keywords: ["AD to BS converter", "date converter", "Bikram Sambat", "Gregorian calendar", "Nepal calendar"],
};

export default function ADBSConverterLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}