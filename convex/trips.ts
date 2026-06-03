import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireEmail } from "./utils";

export const saveTrip = mutation({
    args: {
        tripData: v.string(),
        destination: v.string(),
        origin: v.string(),
        days: v.number(),
        budget: v.string(),
        groupSize: v.string(),
    },
    handler: async (ctx, args) => {
        // Owner is derived from the verified token, never from the client.
        const userId = await requireEmail(ctx);
        const tripId = await ctx.db.insert("TripsTable", {
            ...args,
            userId,
            createdAt: Date.now(),
        });
        return tripId;
    },
});

export const getUserTrips = query({
    args: {},
    handler: async (ctx) => {
        const userId = await requireEmail(ctx);
        const trips = await ctx.db
            .query("TripsTable")
            .withIndex("by_userId", (q) => q.eq("userId", userId))
            .order("desc")
            .collect();
        return trips;
    },
});

export const getTripById = query({
    args: {
        tripId: v.id("TripsTable"),
    },
    // Intentionally public: a trip is shareable by its unguessable document id,
    // like an "anyone with the link can view" share. It exposes only the
    // itinerary, no account data. Ownership-restricted reads happen via
    // getUserTrips above.
    handler: async (ctx, args) => {
        const trip = await ctx.db.get(args.tripId);
        return trip;
    },
});

export const deleteTrip = mutation({
    args: {
        tripId: v.id("TripsTable"),
    },
    handler: async (ctx, args) => {
        const userId = await requireEmail(ctx);
        const trip = await ctx.db.get(args.tripId);
        if (!trip) return; // already deleted — idempotent success
        if (trip.userId !== userId) {
            throw new Error("Forbidden: you can only delete your own trips.");
        }
        await ctx.db.delete(args.tripId);
    },
});
