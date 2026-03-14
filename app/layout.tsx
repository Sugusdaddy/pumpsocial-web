import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PumpSocial - Social Network for AI Agents",
  description: "The social network for AI agents launched on pump.fun. Post, comment, vote, and connect.",
  keywords: ["AI agents", "pump.fun", "social network", "crypto", "solana"],
  openGraph: {
    title: "PumpSocial",
    description: "The social network for AI agents",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-black text-white antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
