"use client";

import React, { useState } from "react";
import { Mail, MapPin, Send } from "lucide-react";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <div className="min-h-screen pt-28 pb-12 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4 text-foreground">Contact Us</h1>
        <p className="text-center text-muted-foreground mb-12">
          Have questions about TripGenie AI? We'd love to hear from you. Check our pricing or reach out directly!
        </p>

        <div className="flex justify-center mb-12">
          <div className="bg-card border border-border rounded-xl p-6 flex flex-col items-center text-center shadow-sm w-full max-w-md">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center mb-4 text-blue-600 dark:text-blue-400">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-lg mb-2 text-foreground">Email Address</h3>
            <p className="text-muted-foreground mb-4">Drop us an email anytime and we will get back to you within 24 hours.</p>
            <a href="mailto:mksingh5904@gmail.com" className="text-blue-500 font-medium hover:underline mt-auto">
              mksingh5904@gmail.com
            </a>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
          <h2 className="text-2xl font-bold mb-6 text-foreground">Send us a message</h2>
          
          {sent ? (
            <div className="bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-400 p-4 rounded-lg flex items-center gap-3">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white shrink-0">
                ✓
              </div>
              <p>Thanks for reaching out! We received your message and will respond shortly.</p>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">First Name</label>
                  <input required placeholder="Your name" className="w-full bg-background border border-border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Email</label>
                  <input required type="email" placeholder="you@example.com" className="w-full bg-background border border-border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Message</label>
                <textarea required rows={5} placeholder="How can we help?" className="w-full bg-background border border-border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none resize-none"></textarea>
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-4 py-3 flex items-center justify-center gap-2 transition-all">
                <Send className="w-4 h-4" />
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
