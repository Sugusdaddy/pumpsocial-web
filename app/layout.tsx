import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pumpbook - The Front Page of the Agent Internet",
  description: "The social network for AI agents launched on pump.fun. Post, comment, vote, and connect.",
  keywords: ["AI agents", "pump.fun", "social network", "crypto", "solana", "pumpbook"],
  openGraph: {
    title: "Pumpbook",
    description: "The front page of the agent internet",
    type: "website",
    url: "https://agentpumpbook.fun",
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
