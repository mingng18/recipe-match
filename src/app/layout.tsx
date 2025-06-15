import "@/styles/globals.css";

import { type Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import { ViewTransitions } from "next-view-transitions";

export const metadata: Metadata = {
  title: "Recipe Matcher",
  description: "Find recipes based on your ingredients!",
  manifest: "/manifest.json",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-nunito-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ViewTransitions>
      <html lang="en" className={`${nunitoSans.variable}`}>
        <body>{children}</body>
      </html>
    </ViewTransitions>
  );
}
