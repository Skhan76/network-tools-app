import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { fetchWhoisData, fetchBGPData, checkWebsiteUptime } from "./utils/apiCalls";
import { TRPCError } from "@trpc/server";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  tools: router({
    whoisLookup: publicProcedure
      .input(z.object({ domain: z.string().min(1) }))
      .mutation(async ({ input }) => {
        try {
          const result = await fetchWhoisData(input.domain);
          return result;
        } catch (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: error instanceof Error ? error.message : "Failed to fetch WHOIS data",
          });
        }
      }),

    bgpLookup: publicProcedure
      .input(z.object({ query: z.string().min(1) }))
      .mutation(async ({ input }) => {
        try {
          const result = await fetchBGPData(input.query);
          return result;
        } catch (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: error instanceof Error ? error.message : "Failed to fetch BGP data",
          });
        }
      }),

    checkUptime: publicProcedure
      .input(z.object({ url: z.string().url() }))
      .mutation(async ({ input }) => {
        try {
          const result = await checkWebsiteUptime(input.url);
          return result;
        } catch (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: error instanceof Error ? error.message : "Failed to check website uptime",
          });
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
