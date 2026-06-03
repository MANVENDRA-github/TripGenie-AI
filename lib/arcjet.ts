import arcjet, { tokenBucket } from "@arcjet/next";

const key = process.env.ARCJET_KEY;

// Arcjet is optional. If no key is configured (e.g. local dev without a key),
// `ajConfigured` is false and callers should skip `aj.protect()` rather than
// failing the request.
export const ajConfigured = Boolean(key);

// Per-user token-bucket limiter, keyed by an authenticated `userId`.
// Capacity 20 with a 10/min refill comfortably covers a full planning session
// (~8-10 calls) while stopping runaway loops that would burn the OpenRouter budget.
export const aj = arcjet({
  key: key ?? "ajkey_disabled",
  rules: [
    tokenBucket({
      mode: "LIVE",
      characteristics: ["userId"],
      refillRate: 10, // tokens added per interval
      interval: 60, // seconds
      capacity: 20, // burst capacity
    }),
  ],
});
