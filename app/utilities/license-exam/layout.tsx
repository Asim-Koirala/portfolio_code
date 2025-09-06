import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nepal Driving License Exam Practice - Free Online Test 2025",
  description: "Free Nepal driving license exam practice with 500+ questions for Category B (Car/Jeep) and K (Motorcycle). Mock tests, flashcards, and instant results. Pass your trial exam on first attempt!",
  keywords: [
    "Nepal driving license exam",
    "Nepal license trial test",
    "driving license practice Nepal",
    "Category B license exam",
    "Category K motorcycle license",
    "Nepal DOT license test",
    "free driving test Nepal",
    "license exam questions Nepal",
    "driving license preparation",
    "Nepal traffic rules exam",
    "online driving test Nepal",
    "license exam simulator",
    "Nepal driving theory test"
  ],
  openGraph: {
    title: "Nepal Driving License Exam Practice - Free Online Test 2025",
    description: "Free Nepal driving license exam practice with 500+ questions for Category B (Car/Jeep) and K (Motorcycle). Mock tests, flashcards, and instant results.",
    type: "website",
    locale: "en_US",
    siteName: "Nepal License Exam Practice"
  },
  twitter: {
    card: "summary_large_image",
    title: "Nepal Driving License Exam Practice - Free Online Test 2025",
    description: "Free Nepal driving license exam practice with 500+ questions for Category B (Car/Jeep) and K (Motorcycle). Mock tests, flashcards, and instant results."
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  }
};

export default function LicenseExamLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}