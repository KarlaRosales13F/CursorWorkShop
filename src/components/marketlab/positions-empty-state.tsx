import Link from "next/link";

import { Button } from "@/components/ui/button";

export function PositionsEmptyState() {
  return (
    <div className="rounded-xl border border-dashed border-border bg-card px-6 py-12 text-center">
      <h2 className="text-xl font-semibold text-card-foreground">
        No positions yet
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
        You have not bought any Yes or No shares yet. Browse open markets and
        spend fake money to build your first position.
      </p>
      <div className="mt-6">
        <Button asChild>
          <Link href="/markets">Browse markets</Link>
        </Button>
      </div>
    </div>
  );
}
