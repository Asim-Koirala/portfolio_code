import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "License Exam Practice | Asim Koirala",
  description: "Practice for your driving license exam with our comprehensive question bank and exam simulator",
  keywords: ["license exam", "driving test", "practice questions", "exam simulator", "Nepal driving license"],
};

export default function LicenseExamLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}