import type { Metadata } from "next";
import { Theme } from "@radix-ui/themes";
import { Analytics } from "@vercel/analytics/react";
import "@radix-ui/themes/styles.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Antoine Pirard - Design Leader",
  description: "Design leader scaling startups from nothing to millions in ARR",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Theme
          appearance="light"
          accentColor="blue"
          grayColor="gray"
          radius="medium"
          scaling="100%"
        >
          {children}
          <Analytics />
        </Theme>
      </body>
    </html>
  );
}
