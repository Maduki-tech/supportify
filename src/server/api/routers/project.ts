import { createTRPCRouter, protectedProcedure } from "../trpc";
import { projects } from "~/server/db/schema";

import { z } from "zod";

export const projectRoute = createTRPCRouter({

    create: protectedProcedure
        .input(z.object({
            name: z.string().min(1),
            organizationId: z.number(),
        }))
        .mutation(async ({ ctx, input }) => {
            await ctx.db.insert(projects)
                .values({
                    name: input.name,
                    organizationID: input.organizationId,
                })
        }),

})
