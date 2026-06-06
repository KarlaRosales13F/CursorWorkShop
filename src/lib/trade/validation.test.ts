import { describe, expect, it } from "vitest";

import {
  isValidBuySide,
  mapBuyRpcError,
  parseBuyAmountCents,
} from "@/lib/trade/validation";

describe("isValidBuySide", () => {
  it("accepts yes and no", () => {
    expect(isValidBuySide("yes")).toBe(true);
    expect(isValidBuySide("no")).toBe(true);
  });

  it("rejects invalid sides", () => {
    expect(isValidBuySide("maybe")).toBe(false);
    expect(isValidBuySide("")).toBe(false);
  });
});

describe("parseBuyAmountCents", () => {
  it("delegates to fake dollar parsing", () => {
    expect(parseBuyAmountCents("2.50")).toEqual({ ok: true, cents: 250 });
  });

  it("rejects invalid amounts", () => {
    expect(parseBuyAmountCents("0")).toEqual({
      ok: false,
      error: "Amount must be greater than zero.",
    });
  });
});

describe("mapBuyRpcError", () => {
  it("maps authentication errors", () => {
    expect(mapBuyRpcError("Not authenticated")).toContain("Sign in");
  });

  it("maps insufficient balance", () => {
    expect(mapBuyRpcError("Insufficient fake balance")).toContain(
      "enough fake balance",
    );
  });

  it("maps closed market errors", () => {
    expect(mapBuyRpcError("Market is not open for buying")).toContain(
      "not available",
    );
  });

  it("maps missing RPC setup errors", () => {
    expect(
      mapBuyRpcError(
        "Could not find the function public.buy_market_shares(uuid, text, bigint)",
      ),
    ).toContain("task db:push");
  });
});
