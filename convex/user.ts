import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireEmail } from "./utils";

export const CreateNewUser = mutation({
    args: {
        name: v.string(),
        imageUrl: v.string(),
    },
    handler: async (ctx, args) => {
        // Email (the identity key) comes from the verified Clerk token, so a
        // caller can only ever create/fetch their own user row.
        const email = await requireEmail(ctx);

        const existing = await ctx.db
            .query("UserTable")
            .withIndex("by_email", (q) => q.eq("email", email))
            .first();

        if (existing) {
            return existing;
        }

        const id = await ctx.db.insert("UserTable", {
            name: args.name,
            email,
            imageUrl: args.imageUrl,
        });
        return await ctx.db.get(id);
    },
});
