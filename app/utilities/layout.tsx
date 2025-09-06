import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Utilities | Asim Koirala",
  description: "Useful utilities like AD to BS converter, Nepali Unicode converter, and more",
  keywords: ["utilities", "AD to BS converter", "Nepali Unicode converter", "Romanized Nepali"],
};

export default function UtilitiesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}