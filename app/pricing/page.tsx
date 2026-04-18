"use client";

import React from "react";
import { Check } from "lucide-react";

export default function PricingPage() {
  return (
    <div className="min-h-screen pt-28 pb-12 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 text-foreground">Simple, Transparent Pricing</h1>
          <p className="text-xl text-muted-foreground">
            Protected by Arcjet. Choose the plan that fits your travel needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
          {/* Free Tier */}
          <div className="bg-card border border-border rounded-2xl p-8 flex flex-col shadow-sm">
            <h3 className="text-2xl font-bold mb-2 text-foreground">Free</h3>
            <p className="text-muted-foreground mb-6">For casual travelers</p>
            <div className="text-4xl font-bold mb-6 text-foreground">
              ₹0<span className="text-xl font-normal text-muted-foreground">/mo</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-3 text-muted-foreground">
                <Check className="w-5 h-5 text-blue-500" />
                <span>Up to 5 AI Trip Itineraries</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <Check className="w-5 h-5 text-blue-500" />
                <span>Basic Map Interactive View</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <Check className="w-5 h-5 text-blue-500" />
                <span>Arcjet Rate Limiting</span>
              </li>
            </ul>
            <button className="w-full py-3 px-4 rounded-xl font-medium border border-border text-foreground hover:bg-muted transition-colors">
              Get Started Free
            </button>
          </div>

          {/* Pro Tier */}
          <div className="bg-card border-2 border-blue-500 rounded-2xl p-8 flex flex-col shadow-lg relative transform md:-translate-y-4">
            <div className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 rounded-bl-lg rounded-tr-xl text-sm font-medium">
              Most Popular
            </div>
            <h3 className="text-2xl font-bold mb-2 text-foreground">Arcjet Premium</h3>
            <p className="text-muted-foreground mb-6">For travel enthusiasts</p>
            <div className="text-4xl font-bold mb-6 text-foreground">
              ₹1200<span className="text-xl font-normal text-muted-foreground">/mo</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-3 text-foreground">
                <Check className="w-5 h-5 text-blue-500" />
                <span>Unlimited AI Trip Itineraries</span>
              </li>
              <li className="flex items-center gap-3 text-foreground">
                <Check className="w-5 h-5 text-blue-500" />
                <span>Premium Hotel Recommendations</span>
              </li>
              <li className="flex items-center gap-3 text-foreground">
                <Check className="w-5 h-5 text-blue-500" />
                <span>Export to PDF/Calendar</span>
              </li>
              <li className="flex items-center gap-3 text-foreground">
                <Check className="w-5 h-5 text-blue-500" />
                <span>Arcjet Bot Protection & Shield</span>
              </li>
            </ul>
            <button className="w-full py-3 px-4 rounded-xl font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors shadow-sm shadow-blue-500/20">
              Upgrade to Premium
            </button>
          </div>

          {/* Enterprise Tier */}
          <div className="bg-card border border-border rounded-2xl p-8 flex flex-col shadow-sm">
            <h3 className="text-2xl font-bold mb-2 text-foreground">Agency</h3>
            <p className="text-muted-foreground mb-6">For travel businesses</p>
            <div className="text-4xl font-bold mb-6 text-foreground">
              ₹4000<span className="text-xl font-normal text-muted-foreground">/mo</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              <li className="flex items-center gap-3 text-muted-foreground">
                <Check className="w-5 h-5 text-blue-500" />
                <span>Everything in Premium</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <Check className="w-5 h-5 text-blue-500" />
                <span>White-label Itineraries</span>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <Check className="w-5 h-5 text-blue-500" />
                <span>Priority Email Support</span>
              </li>
            </ul>
            <button className="w-full py-3 px-4 rounded-xl font-medium border border-border text-foreground hover:bg-muted transition-colors">
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
