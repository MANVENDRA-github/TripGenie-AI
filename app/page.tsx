"use client";

import React from "react";
import Waves from "@/components/ui/waves";
import { PopularCityList } from "./_components/PopularCityList";
import { motion } from "motion/react";

export default function Home() {
  return (
    <div className="landing-page flex flex-col min-h-screen">
      {/* Hero Section with Waves Background */}
      <div className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Waves
            lineColor="#2563EB"
            backgroundColor="transparent"
            waveSpeedX={0.02}
            waveSpeedY={0.01}
            waveAmpX={40}
            waveAmpY={20}
            friction={0.9}
            tension={0.01}
            maxCursorMove={120}
            xGap={12}
            yGap={36}
          />
        </div>

        {/* Hero Content positioned above the Waves */}
        <div className="relative z-10 cinematic-content pt-20">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hero-title"
          >
            Plan Your Perfect Trip with{" "}
            <span className="hero-gradient-text drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">TripGenie AI</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="hero-subtitle text-slate-700 dark:text-white bg-white/60 dark:bg-black/60 rounded-xl p-4 backdrop-blur-md border border-black/5 dark:border-white/10 shadow-sm"
          >
            Get personalized day-by-day itineraries, curated hotel picks, and
            budget-optimized plans — all powered by AI.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="hero-cta-group"
          >
            <a href="/create-new-trip" className="cta-primary">
              <span>Start Planning</span>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
            <a href="#destinations" className="cta-secondary bg-black/40 backdrop-blur-md">
              Explore Destinations
            </a>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-8 z-10 flex flex-col items-center opacity-60 animate-bounce cursor-pointer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 1.5, duration: 1 }}
          onClick={() => document.getElementById("destinations")?.scrollIntoView({ behavior: "smooth" })}
        >
          <span className="text-sm text-white mb-2 font-medium">Scroll to explore</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </motion.div>
      </div>

      {/* Apple Cards Carousel Section */}
      <div id="destinations" className="relative z-20 bg-background/95 backdrop-blur-sm border-t border-border">
        <PopularCityList />
      </div>

      {/* Footer */}
      <footer className="landing-footer flex-shrink-0 relative z-20">
        <div className="footer-inner">
          <p>© 2025 TripGenie AI. All rights reserved.</p>
          <div className="footer-links">
            <a href="/pricing">Pricing</a>
            <a href="/contact-us">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
