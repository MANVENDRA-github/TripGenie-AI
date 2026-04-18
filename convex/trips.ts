import { mutation } from "./_generated/server";
import { query } from "./_generated/server";
import { v } from "convex/values";

export const saveTrip = mutation({
    args: {
        userId: v.string(),
        tripData: v.string(),
        destination: v.string(),
        origin: v.string(),
        days: v.number(),
        budget: v.string(),
        groupSize: v.string(),
    },
    handler: async (ctx, args) => {
        const tripId = await ctx.db.insert("TripsTable", {
            ...args,
            createdAt: Date.now(),
        });
        return tripId;
    },
});

export const getUserTrips = query({
    args: {
        userId: v.string(),
    },
    handler: async (ctx, args) => {
        const trips = await ctx.db
            .query("TripsTable")
            .filter((q) => q.eq(q.field("userId"), args.userId))
            .order("desc")
            .collect();
        return trips;
    },
});

export const getTripById = query({
    args: {
        tripId: v.id("TripsTable"),
    },
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
        await ctx.db.delete(args.tripId);
    },
});
