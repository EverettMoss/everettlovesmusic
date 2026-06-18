import type { Metadata } from "next";
import { Schibsted_Grotesk } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "@/styles/globals.css";

const font = Schibsted_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Everett Loves Music",
  description: "the songs are forcing me to write about them",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={font.className}>
      <body>{children}</body>
      {process.env.NEXT_PUBLIC_GA_ID && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
      )}
    </html>
  );
}
