import { describe, expect, it } from "vitest";

import {
  formatFakeDollars,
  formatFakeShares,
  parseFakeDollarInput,
} from "@/lib/fake-money";

describe("parseFakeDollarInput", () => {
  it("accepts whole dollar amounts", () => {
    expect(parseFakeDollarInput("1")).toEqual({ ok: true, cents: 100 });
    expect(parseFakeDollarInput("10")).toEqual({ ok: true, cents: 1000 });
  });

  it("accepts one- and two-decimal amounts", () => {
    expect(parseFakeDollarInput("1.5")).toEqual({ ok: true, cents: 150 });
    expect(parseFakeDollarInput("10.00")).toEqual({ ok: true, cents: 1000 });
    expect(parseFakeDollarInput("0.01")).toEqual({ ok: true, cents: 1 });
  });

  it("rejects empty input", () => {
    expect(parseFakeDollarInput("")).toEqual({
      ok: false,
      error: "Enter a fake dollar amount.",
    });
    expect(parseFakeDollarInput("   ")).toEqual({
      ok: false,
      error: "Enter a fake dollar amount.",
    });
  });

  it("rejects more than two decimal places", () => {
    expect(parseFakeDollarInput("1.234")).toEqual({
      ok: false,
      error: "Use a valid amount with up to two decimal places.",
    });
  });

  it("rejects non-numeric input", () => {
    expect(parseFakeDollarInput("abc")).toEqual({
      ok: false,
      error: "Use a valid amount with up to two decimal places.",
    });
  });

  it("rejects zero and negative amounts", () => {
    expect(parseFakeDollarInput("0")).toEqual({
      ok: false,
      error: "Amount must be greater than zero.",
    });
    expect(parseFakeDollarInput("0.00")).toEqual({
      ok: false,
      error: "Amount must be greater than zero.",
    });
  });
});

describe("formatFakeDollars", () => {
  it("formats cents as fake dollars", () => {
    expect(formatFakeDollars(10000)).toBe("$100.00 fake");
    expect(formatFakeDollars(150)).toBe("$1.50 fake");
  });
});

describe("formatFakeShares", () => {
  it("uses the same fake dollar formatting", () => {
    expect(formatFakeShares(2500)).toBe("$25.00 fake");
  });
});
