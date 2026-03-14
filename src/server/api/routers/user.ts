import { eq } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { users } from "~/server/db/schema";

export const userRouter = createTRPCRouter({
  syncFromClerk: publicProcedure
    .input(z.object({ clerkId: z.string().min(1), orgId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .insert(users)
        .values({ clerkID: input.clerkId, orgID: input.orgId });
    }),

  getCurrent: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.query.users.findFirst({
      where: eq(users.clerkID, ctx.clerkUserId),
    });
    return user ?? null;
  }),
});
