import type { Metadata } from "next";
import "@/styles/globals.css";
import { UpdateBanner } from "@/components/UpdateBanner";

export const metadata: Metadata = {
  title: "Linear Survey",
  description: "Open-source survey builder that integrates with Linear",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans">
        <UpdateBanner />
        {children}
      </body>
    </html>
  );
}

