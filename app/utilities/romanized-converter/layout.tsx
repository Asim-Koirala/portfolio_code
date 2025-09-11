import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Romanized Nepali Converter | Asim Koirala",
  description: "Convert romanized Nepali text to proper Devanagari script",
  keywords: ["romanized Nepali", "Devanagari converter", "Nepali text converter", "transliteration"],
  alternates: {
    canonical: "https://www.asimkoirala.com.np/utilities/romanized-converter",
  },
};

export default function RomanizedConverterLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}