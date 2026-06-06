import { describe, expect, it } from "vitest";

import { formatCloseDate, formatMarketStatus } from "@/lib/markets/format";

describe("formatMarketStatus", () => {
  it("formats known statuses", () => {
    expect(formatMarketStatus("open")).toBe("Open");
    expect(formatMarketStatus("closed")).toBe("Closed");
    expect(formatMarketStatus("resolved")).toBe("Resolved");
  });

  it("returns unknown statuses unchanged", () => {
    expect(formatMarketStatus("paused")).toBe("paused");
  });
});

describe("formatCloseDate", () => {
  it("returns a friendly label when close date is missing", () => {
    expect(formatCloseDate(null)).toBe("No close date");
  });

  it("formats a close date", () => {
    const formatted = formatCloseDate("2026-12-31T18:00:00.000Z");
    expect(formatted).toContain("2026");
  });
});
