"use client";

import React, { useState } from "react";
import { Mail, Send, Check } from "lucide-react";

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <div className="min-h-screen bg-background px-6 pt-32 pb-24 sm:px-8">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div>
          <span className="kicker">Contact</span>
          <h1 className="mt-4 text-4xl sm:text-5xl">
            Say <span className="serif-em">hello.</span>
          </h1>
          <p className="mt-5 text-base leading-relaxed text-muted-foreground">
            Questions about TripGenie AI, feedback, or a partnership idea? Write
            to us — a real person reads every message.
          </p>
        </div>

        {/* Email line */}
        <div className="mt-12 flex items-center gap-4 border-y border-border py-6">
          <span
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-border"
            style={{ color: "var(--brand)" }}
          >
            <Mail className="h-5 w-5" />
          </span>
          <div>
            <p className="text-sm text-muted-foreground">Email us directly</p>
            <a
              href="mailto:mksingh5904@gmail.com"
              className="text-base font-medium text-foreground underline-offset-4 hover:underline"
            >
              mksingh5904@gmail.com
            </a>
          </div>
        </div>

        {/* Form */}
        <div className="mt-12">
          <h2 className="text-2xl">Send a message</h2>

          {sent ? (
            <div className="mt-6 flex items-center gap-3 rounded-md border border-border bg-muted p-5">
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                style={{ background: "var(--brand)", color: "var(--paper)" }}
              >
                <Check className="h-4 w-4" />
              </span>
              <p className="text-sm leading-relaxed text-foreground">
                Thanks for reaching out — your message is in. We&apos;ll get back
                to you within a day.
              </p>
            </div>
          ) : (
            <form
              className="mt-6 space-y-5"
              onSubmit={(e) => {
                e.preventDefault();
                setSent(true);
              }}
            >
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">
                    Name
                  </label>
                  <input
                    required
                    placeholder="Your name"
                    className="w-full rounded-md border border-border bg-background px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-foreground">
                    Email
                  </label>
                  <input
                    required
                    type="email"
                    placeholder="you@example.com"
                    className="w-full rounded-md border border-border bg-background px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-foreground">
                  Message
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="How can we help?"
                  className="w-full resize-none rounded-md border border-border bg-background px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground"
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                <Send className="h-4 w-4" />
                Send message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
