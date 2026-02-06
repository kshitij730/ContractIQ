import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ContractIQ - AI Discrepancy Detector",
  description: "Detect contract risks and negotiate with confidence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
