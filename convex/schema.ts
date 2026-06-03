import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    UserTable: defineTable({
        name: v.string(),
        imageUrl: v.string(),
        email: v.string(),
        subscription: v.optional(v.string()),
    }).index("by_email", ["email"]),
    TripsTable: defineTable({
        userId: v.string(),
        tripData: v.string(),
        destination: v.string(),
        origin: v.string(),
        days: v.number(),
        budget: v.string(),
        groupSize: v.string(),
        createdAt: v.number(),
    }).index("by_userId", ["userId"]),
})
