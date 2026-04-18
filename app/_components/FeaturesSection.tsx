"use client";

import React from "react";
import { motion } from "motion/react";
import { Globe2, Map, Sparkles, Wallet } from "lucide-react";

const features = [
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: "AI-Powered Itineraries",
    desc: "Our AI crafts personalized day-by-day travel plans based on your preferences, budget, and travel style.",
    gradient: "from-purple-500 to-indigo-500",
  },
  {
    icon: <Map className="w-6 h-6" />,
    title: "Interactive Maps",
    desc: "Visualize your entire trip on an interactive map with hotels, attractions, and daily routes.",
    gradient: "from-cyan-500 to-blue-500",
  },
  {
    icon: <Globe2 className="w-6 h-6" />,
    title: "150+ Destinations",
    desc: "From Tokyo to Tuscany — get intelligent recommendations for any destination worldwide.",
    gradient: "from-emerald-500 to-teal-500",
  },
  {
    icon: <Wallet className="w-6 h-6" />,
    title: "Budget Optimized",
    desc: "Whether luxury or budget travel, get plans that maximize experiences within your spending range.",
    gradient: "from-orange-500 to-pink-500",
  },
];

function FeaturesSection() {
  return (
    <section id="features" className="features-section">
      <div className="features-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="features-header"
        >
          <h2 className="features-title">
            Everything you need to plan the{" "}
            <span className="hero-gradient-text">perfect trip</span>
          </h2>
          <p className="features-subtitle">
            Powered by advanced AI, TripGenie handles the complexity of travel
            planning so you can focus on the adventure.
          </p>
        </motion.div>

        <div className="features-grid">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="feature-card"
            >
              <div className={`feature-icon bg-gradient-to-br ${feature.gradient}`}>
                {feature.icon}
              </div>
              <h3 className="feature-card-title">{feature.title}</h3>
              <p className="feature-card-desc">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;
