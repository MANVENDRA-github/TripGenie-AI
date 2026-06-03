"use client";

import React from "react";
import Link from "next/link";
import { Check } from "lucide-react";

type Tier = {
  name: string;
  blurb: string;
  price: string;
  period: string;
  features: string[];
  cta: string;
  href: string;
  featured?: boolean;
};

const tiers: Tier[] = [
  {
    name: "Free",
    blurb: "For the occasional traveler.",
    price: "₹0",
    period: "/mo",
    features: [
      "Up to 5 AI itineraries",
      "Interactive map view",
      "Arcjet rate limiting",
    ],
    cta: "Start free",
    href: "/create-new-trip",
  },
  {
    name: "Premium",
    blurb: "For people who are always planning the next one.",
    price: "₹440",
    period: "/mo",
    features: [
      "Unlimited AI itineraries",
      "Premium hotel recommendations",
      "Export to PDF & calendar",
      "Arcjet bot protection & shield",
    ],
    cta: "Go Premium",
    href: "/create-new-trip",
    featured: true,
  },
  {
    name: "Agency",
    blurb: "For studios planning on behalf of others.",
    price: "₹800",
    period: "/mo",
    features: [
      "Everything in Premium",
      "White-label itineraries",
      "Priority email support",
    ],
    cta: "Contact sales",
    href: "/contact-us",
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background px-6 pt-32 pb-24 sm:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="max-w-2xl">
          <span className="kicker">Plans</span>
          <h1 className="mt-4 text-4xl sm:text-5xl">
            Simple pricing,{" "}
            <span className="serif-em">no surprises.</span>
          </h1>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground">
            Every plan is protected by Arcjet. Pick the one that fits how often
            you wander — change it whenever you like.
          </p>
        </div>

        {/* Tiers */}
        <div className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-md border border-border bg-border md:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className="flex flex-col bg-card p-8"
            >
              <div className="flex items-baseline justify-between">
                <h2 className="text-2xl">{tier.name}</h2>
                {tier.featured && (
                  <span className="kicker" style={{ fontSize: "0.62rem" }}>
                    Most chosen
                  </span>
                )}
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {tier.blurb}
              </p>

              <div className="mt-7 flex items-baseline gap-1">
                <span className="font-serif text-5xl tracking-tight text-foreground">
                  {tier.price}
                </span>
                <span className="text-sm text-muted-foreground">
                  {tier.period}
                </span>
              </div>

              <div
                className="my-7 h-px w-full"
                style={{ background: "var(--line)" }}
              />

              <ul className="flex-1 space-y-3.5">
                {tier.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-3 text-sm leading-snug text-foreground"
                  >
                    <Check
                      className="mt-0.5 h-4 w-4 shrink-0"
                      style={{ color: "var(--brand)" }}
                    />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={tier.href}
                className={`mt-9 inline-flex items-center justify-center rounded-md px-5 py-3 text-sm font-medium transition-colors ${
                  tier.featured
                    ? "bg-primary text-primary-foreground hover:opacity-90"
                    : "border border-border text-foreground hover:bg-muted"
                }`}
                style={{ textDecoration: "none" }}
              >
                {tier.cta}
              </Link>
            </div>
          ))}
        </div>

        <p className="mt-10 text-sm text-muted-foreground">
          Prices in INR. Taxes calculated at checkout where applicable.
        </p>
      </div>
    </div>
  );
}
