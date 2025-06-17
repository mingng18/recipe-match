import "@/styles/globals.css";

import { type Metadata } from "next";
import { Nunito_Sans } from "next/font/google";
import { ViewTransitions } from "next-view-transitions";
import Icon from "@/favicon.ico";
import { NuqsAdapter } from 'nuqs/adapters/next/app'

export const metadata: Metadata = {
  title: {
    template: "%s - Recipisu",
    default: "Recipisu",
  },
  description: "Find recipes based on your ingredients!",
  manifest: "/manifest.json",
  icons: [{ rel: "icon", url: Icon.src }],
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
        <body>
          <NuqsAdapter>{children}</NuqsAdapter>
        </body>
      </html>
    </ViewTransitions>
  );
}
