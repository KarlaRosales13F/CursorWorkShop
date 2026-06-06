import { formatMarketStatus } from "@/lib/markets/format";
import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<string, string> = {
  open: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  closed:
    "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  resolved: "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300",
};

type MarketStatusBadgeProps = {
  status: string;
  className?: string;
};

export function MarketStatusBadge({
  status,
  className,
}: MarketStatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        STATUS_STYLES[status] ?? "border-border bg-muted text-muted-foreground",
        className,
      )}
    >
      {formatMarketStatus(status)}
    </span>
  );
}
