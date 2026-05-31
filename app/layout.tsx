import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import ConvexClientProvider from "./ConvexClientProvider";
import Header from "./_components/Header";

export const metadata: Metadata = {
  title: "TripGenie AI — AI-Powered Travel Planning",
  description:
    "Plan your perfect trip with AI-powered recommendations. Get personalized itineraries, hotel suggestions, and day-by-day travel plans tailored to your style and budget.",
};

// Editorial pairing: Fraunces for display headlines (with italic), Inter for body/UI.
const display = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});
const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

// Editorial Clerk theme — paper + ink, hairline card, serif title.
// Applies to the dedicated /sign-in & /sign-up pages and the header's modal.
const clerkAppearance = {
  variables: {
    colorPrimary: "#16201f",
    colorText: "#16201f",
    colorTextSecondary: "rgba(22, 32, 31, 0.55)",
    colorBackground: "#f4f2ea",
    colorInputBackground: "#f4f2ea",
    colorInputText: "#16201f",
    colorDanger: "#b23a2e",
    borderRadius: "0.375rem",
    fontFamily: "var(--font-body), system-ui, sans-serif",
  },
  elements: {
    card: {
      boxShadow: "none",
      border: "1px solid rgba(22, 32, 31, 0.14)",
      backgroundColor: "#f4f2ea",
    },
    headerTitle: {
      fontFamily: "var(--font-display), Georgia, serif",
      fontWeight: 600,
      letterSpacing: "-0.02em",
    },
    formButtonPrimary: {
      textTransform: "none" as const,
      fontWeight: 500,
      boxShadow: "none",
    },
    socialButtonsBlockButton: {
      border: "1px solid rgba(22, 32, 31, 0.14)",
      boxShadow: "none",
    },
    footerActionLink: {
      color: "#1f6e6a",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider appearance={clerkAppearance}>
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
        <body className={`${body.variable} ${display.variable}`}>
          <ConvexClientProvider>
            <Header />
            {children}
          </ConvexClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
