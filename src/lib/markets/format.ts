import type { Market, MarketStatus } from "@/lib/markets/types";

const STATUS_LABELS: Record<MarketStatus, string> = {
  open: "Open",
  closed: "Closed",
  resolved: "Resolved",
};

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeStyle: "short",
});

export function formatMarketStatus(status: string): string {
  if (status in STATUS_LABELS) {
    return STATUS_LABELS[status as MarketStatus];
  }

  return status;
}

export function formatCloseDate(closeDate: Market["close_date"]): string {
  if (!closeDate) {
    return "No close date";
  }

  return dateFormatter.format(new Date(closeDate));
}
