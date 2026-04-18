import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import ConvexClientProvider from "./ConvexClientProvider";
import Header from "./_components/Header";

export const metadata: Metadata = {
  title: "TripGenie AI — AI-Powered Travel Planning",
  description:
    "Plan your perfect trip with AI-powered recommendations. Get personalized itineraries, hotel suggestions, and day-by-day travel plans tailored to your style and budget.",
};

const outfit = Outfit({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head>
          <link
            rel="stylesheet"
            href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
            integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
            crossOrigin=""
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  try {
                    var theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                    document.documentElement.classList.toggle('dark', theme === 'dark');
                  } catch(e) {}
                })();
              `,
            }}
          />
        </head>
        <body className={outfit.className}>
          <ConvexClientProvider>
            <Header />
            {children}
          </ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
