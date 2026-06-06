import { describe, expect, it } from "vitest";

import { formatFakeBalance } from "@/lib/profile/format";

describe("formatFakeBalance", () => {
  it("formats cents as fake dollars", () => {
    expect(formatFakeBalance(100_000)).toBe("$1,000.00 fake");
    expect(formatFakeBalance(10_000)).toBe("$100.00 fake");
    expect(formatFakeBalance(1_000)).toBe("$10.00 fake");
  });
});
