import { eq } from "drizzle-orm";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { organization } from "~/server/db/schema";

export const organizationRoute = createTRPCRouter({
    create: protectedProcedure
        .input(z.object({ name: z.string().min(1) }))
        .mutation(async ({ ctx, input }) => {
            const [newOrg] = await ctx.db.insert(organization).values({
                name: input.name,
            }).returning();
            return newOrg!;
        }),

    getOrgByID: protectedProcedure
        .input(z.object({ id: z.number() }))
        .query(async ({ ctx, input }) => {
            const org = await ctx.db.query.organization.findFirst({
                where: eq(organization.id, input.id),
            })
            return org ?? null
        }),

    deleteOrgByID: protectedProcedure
        .input(z.object({ id: z.number() }))
        .mutation(async ({ ctx, input }) => {
            await ctx.db.update(organization)
                .set({ deletedAt: new Date() })
                .where(eq(organization.id, input.id))
        }),

});
