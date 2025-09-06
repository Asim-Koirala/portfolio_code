import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Unicode Converter | Asim Koirala",
  description: "Convert text between different Unicode formats and encodings",
  keywords: ["Unicode converter", "text encoding", "character encoding", "UTF-8", "text converter"],
};

export default function UnicodeConverterLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}