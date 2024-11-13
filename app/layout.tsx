import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Blog",
  description:
    "'LatestHub' is a fresh, dynamic blog dedicated to delivering the latest updates, trends, and insights in the world of technology. Covering a wide range of topics from emerging tech, AI innovations, and software developments to gadgets and cybersecurity, LatestHub is a go-to source for tech enthusiasts, professionals, and anyone curious about the digital world. With easy-to-digest articles, expert opinions, and practical guides, LatestHub aims to keep its readers informed and ahead of the curve in our ever-evolving tech landscape.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0,user-scalable=0"
        />
      </head>
      <body className={`min-h-screen   ${inter.className}`}>{children}</body>
    </html>
  );
}
