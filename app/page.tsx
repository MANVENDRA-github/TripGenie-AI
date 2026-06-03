"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

const destinations = [
  {
    city: "Paris",
    country: "France",
    tag: "The city of light, on your schedule.",
    src: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1400&auto=format&fit=crop",
  },
  {
    city: "Tokyo",
    country: "Japan",
    tag: "Neon avenues and quiet temples.",
    src: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?q=80&w=1400&auto=format&fit=crop",
  },
  {
    city: "Rome",
    country: "Italy",
    tag: "Walk three thousand years in a day.",
    src: "https://images.unsplash.com/photo-1529260830199-42c24126f198?q=80&w=1400&auto=format&fit=crop",
  },
  {
    city: "New York",
    country: "United States",
    tag: "Five boroughs, one tight plan.",
    src: "https://images.unsplash.com/photo-1518391846015-55a9cc003b25?q=80&w=1400&auto=format&fit=crop",
  },
  {
    city: "Dubai",
    country: "UAE",
    tag: "Desert mornings, skyline nights.",
    src: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1400&auto=format&fit=crop",
  },
  {
    city: "Agra",
    country: "India",
    tag: "Marble, memory and the Taj at dawn.",
    src: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=1400&auto=format&fit=crop",
  },
];

const steps = [
  {
    n: "01",
    title: "Tell us the basics",
    desc: "Where from, where to, who's coming, your budget and how long. A short conversation — no forms.",
  },
  {
    n: "02",
    title: "We plan the days",
    desc: "A day-by-day itinerary with hotel picks, activities, ticket prices and the best times to visit each spot.",
  },
  {
    n: "03",
    title: "See it on the map",
    desc: "Every hotel and stop plotted together, so the whole trip makes sense at a glance before you go.",
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

export default function Home() {
  return (
    <div className="landing-page">
      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="lp-hero">
        <div className="lp-hero-inner">
          <div className="lp-hero-copy">
            <motion.div
              className="lp-eyebrow"
              {...fadeUp}
              transition={{ duration: 0.6 }}
            >
              <span className="lp-eyebrow-rule" />
              <span className="kicker">AI Travel Planning</span>
            </motion.div>

            <motion.h1
              className="lp-hero-title"
              {...fadeUp}
              transition={{ duration: 0.7, delay: 0.08 }}
            >
              Where to <span className="lp-em">next?</span>
            </motion.h1>

            <motion.p
              className="lp-hero-lead"
              {...fadeUp}
              transition={{ duration: 0.7, delay: 0.16 }}
            >
              A complete day-by-day itinerary — hotels, routes and timings —
              composed from a single conversation. No tabs, no spreadsheets.
            </motion.p>

            <motion.div
              className="lp-hero-actions"
              {...fadeUp}
              transition={{ duration: 0.7, delay: 0.24 }}
            >
              <Link href="/create-new-trip" className="lp-btn lp-btn-primary">
                <span>Start planning</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="#destinations" className="lp-btn lp-btn-ghost">
                Browse destinations
              </a>
            </motion.div>
          </div>

          <motion.div
            className="lp-hero-gallery"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <figure className="lp-photo lp-photo--tall">
              <img src={destinations[1].src} alt="Tokyo, Japan" />
              <figcaption className="lp-photo-cap">Tokyo</figcaption>
            </figure>
            <figure className="lp-photo lp-photo--tall lp-photo--top">
              <img src={destinations[2].src} alt="Rome, Italy" />
              <figcaption className="lp-photo-cap">Rome</figcaption>
            </figure>
          </motion.div>
        </div>
      </section>

      {/* ── Destinations ───────────────────────────────────────── */}
      <section id="destinations" className="lp-section lp-dest">
        <div className="lp-section-head">
          <span className="kicker">Where people go</span>
          <h2 className="lp-section-title">
            Anywhere on earth, planned in minutes.
          </h2>
        </div>

        <div className="lp-dest-grid">
          {destinations.map((d, i) => (
            <motion.div
              key={d.city}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
            >
              <Link href="/create-new-trip" className="lp-dest-card">
                <div className="lp-dest-media">
                  <span className="lp-dest-index">{String(i + 1).padStart(2, "0")}</span>
                  <img src={d.src} alt={`${d.city}, ${d.country}`} loading="lazy" />
                </div>
                <span className="lp-dest-cat">{d.country}</span>
                <h3 className="lp-dest-title">{d.city}</h3>
                <p className="lp-step-desc" style={{ marginTop: "0.35rem" }}>
                  {d.tag}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── How it works ───────────────────────────────────────── */}
      <section className="lp-steps-section">
        <div className="lp-section">
          <div className="lp-section-head">
            <span className="kicker">How it works</span>
            <h2 className="lp-section-title">Three questions. One itinerary.</h2>
          </div>

          <div className="lp-steps">
            {steps.map((s) => (
              <div key={s.n} className="lp-step">
                <span className="lp-step-num">{s.n}</span>
                <h3 className="lp-step-title">{s.title}</h3>
                <p className="lp-step-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer className="landing-footer">
        <div className="footer-inner">
          <div className="footer-top">
            <p className="footer-brand">
              Plan less. <em>Travel more.</em>
            </p>
            <div className="footer-links">
              <div className="footer-col">
                <span className="footer-col-title">Product</span>
                <Link href="/create-new-trip">Plan a trip</Link>
                <Link href="/my-trips">My trips</Link>
                <Link href="/pricing">Pricing</Link>
              </div>
              <div className="footer-col">
                <span className="footer-col-title">Company</span>
                <Link href="/contact-us">Contact</Link>
                <a href="#destinations">Destinations</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2025 TripGenie AI</span>
            <span>Made for people who'd rather be packing.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
