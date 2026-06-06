import { describe, expect, it } from "vitest";

import {
  computeTotalSharesCents,
  formatPositionShares,
} from "@/lib/positions/format";

describe("computeTotalSharesCents", () => {
  it("sums yes and no share cents", () => {
    expect(computeTotalSharesCents(1000, 500)).toBe(1500);
    expect(computeTotalSharesCents(0, 250)).toBe(250);
  });
});

describe("formatPositionShares", () => {
  it("formats share amounts as fake dollars", () => {
    expect(formatPositionShares(1000)).toBe("$10.00 fake");
  });
});
