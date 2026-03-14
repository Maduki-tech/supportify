import { createTRPCRouter, publicProcedure } from "../trpc";
import { tickets } from "~/server/db/schema";
import { z } from "zod";

export const tickerRoute = createTRPCRouter({

    create: publicProcedure
        .input(z.object({
            title: z.string().min(1),
            description: z.string().min(1),
            projectId: z.number(),
        }))
        .mutation(async ({ ctx, input }) => {
            await ctx.db.insert(tickets)
                .values({
                    title: input.title,
                    description: input.description,
                    projectID: input.projectId,
                })
        }),


});
