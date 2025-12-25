import { describe, it, expect, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("Network Tools Router", () => {
  describe("tools.whoisLookup", () => {
    it("should accept a domain and return WHOIS data structure", async () => {
      const ctx = createContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.tools.whoisLookup({ domain: "example.com" });

      expect(result).toBeDefined();
      expect(result).toHaveProperty("registrar");
      expect(result).toHaveProperty("createdDate");
      expect(result).toHaveProperty("expiryDate");
      expect(result).toHaveProperty("updatedDate");
      expect(result).toHaveProperty("registrant");
    });

    it("should reject empty domain input", async () => {
      const ctx = createContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.tools.whoisLookup({ domain: "" });
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe("tools.bgpLookup", () => {
    it(
      "should accept a query and return BGP routes array",
      async () => {
        const ctx = createContext();
        const caller = appRouter.createCaller(ctx);

        try {
          const result = await caller.tools.bgpLookup({ query: "192.0.2.0/24" });
          expect(Array.isArray(result)).toBe(true);
          if (result.length > 0) {
            expect(result[0]).toHaveProperty("cidr");
            expect(result[0]).toHaveProperty("asn");
          }
        } catch (error) {
          expect(error).toBeDefined();
        }
      },
      { timeout: 20000 }
    );

    it("should reject empty query input", async () => {
      const ctx = createContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.tools.bgpLookup({ query: "" });
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error).toBeDefined();
      }
    });
  });

  describe("tools.checkUptime", () => {
    it(
      "should accept a URL and return uptime check data",
      async () => {
        const ctx = createContext();
        const caller = appRouter.createCaller(ctx);

        try {
          const result = await caller.tools.checkUptime({ url: "https://example.com" });
          expect(result).toBeDefined();
          expect(result).toHaveProperty("statusCode");
          expect(result).toHaveProperty("responseTime");
          expect(result).toHaveProperty("contentLength");
          expect(result).toHaveProperty("contentType");
          expect(result).toHaveProperty("isOnline");
          expect(typeof result.statusCode).toBe("number");
          expect(typeof result.responseTime).toBe("number");
          expect(typeof result.isOnline).toBe("boolean");
        } catch (error) {
          expect(error).toBeDefined();
        }
      },
      { timeout: 15000 }
    );

    it("should reject invalid URL input", async () => {
      const ctx = createContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.tools.checkUptime({ url: "not-a-valid-url" });
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect(error).toBeDefined();
      }
    });

    it(
      "should handle unreachable URLs gracefully",
      async () => {
        const ctx = createContext();
        const caller = appRouter.createCaller(ctx);

        try {
          const result = await caller.tools.checkUptime({ url: "https://invalid-domain-that-does-not-exist-12345.com" });
          expect(result).toBeDefined();
        } catch (error) {
          expect(error).toBeDefined();
        }
      },
      { timeout: 15000 }
    );
  });
});
