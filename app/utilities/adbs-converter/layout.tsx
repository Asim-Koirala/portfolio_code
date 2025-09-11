import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AD to BS Date Converter - Free Nepali Calendar Tool | Asim Koirala",
  description: "Convert dates between Gregorian (AD) and Bikram Sambat (BS) calendar systems. Free online tool with accurate conversion and interactive calendar view for Nepal dates.",
  keywords: [
    "AD to BS converter", "BS to AD converter", "Nepali date converter", "Bikram Sambat converter",
    "Nepal calendar", "Gregorian to Bikram Sambat", "date conversion tool", "Nepali calendar converter",
    "free date converter", "online calendar tool", "Nepal date conversion", "BS calendar",
    "AD calendar", "calendar conversion", "Nepali date tool", "Bikram Sambat calendar"
  ],
  authors: [{ name: "Asim Koirala", url: "https://asimkoirala.com.np" }],
  robots: "index, follow",
  openGraph: {
    title: "AD to BS Date Converter - Free Nepali Calendar Tool",
    description: "Convert dates between Gregorian (AD) and Bikram Sambat (BS) calendar systems. Free online tool with accurate conversion.",
    type: "website",
    url: "https://www.asimkoirala.com.np/utilities/adbs-converter",
  },
  twitter: {
    card: "summary",
    title: "AD to BS Date Converter - Free Nepali Calendar Tool",
    description: "Convert dates between Gregorian (AD) and Bikram Sambat (BS) calendar systems. Free online tool with accurate conversion.",
  },
  alternates: {
    canonical: "https://www.asimkoirala.com.np/utilities/adbs-converter",
  },
  category: "utility",
  classification: "date converter tool",
};

export default function ADBSConverterLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}