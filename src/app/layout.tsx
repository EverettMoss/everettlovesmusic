import type { Metadata } from "next";
import { Schibsted_Grotesk } from "next/font/google";
import "@/styles/globals.css";

const font = Schibsted_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "On Repeat",
  description: "A weekly music journal — the songs I couldn't stop playing, with a line or two on why.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={font.className}>
      <body>{children}</body>
    </html>
  );
}
