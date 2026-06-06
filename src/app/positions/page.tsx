import Link from "next/link";

import { PositionsEmptyState } from "@/components/marketlab/positions-empty-state";
import { PositionsList } from "@/components/marketlab/positions-list";
import { Button } from "@/components/ui/button";
import { getUserPositionsWithMarkets } from "@/lib/positions/queries";
import { getAuthUser } from "@/lib/profile/queries";

export const metadata = {
  title: "My Positions | MarketLab",
  description:
    "View your fake-money Yes/No positions across fictional markets.",
};

export default async function PositionsPage() {
  const user = await getAuthUser();

  if (!user) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            My Positions
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Sign in to see the markets where you hold fake-money Yes or No
            shares.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card px-6 py-12 text-center shadow-sm">
          <h2 className="text-xl font-semibold text-card-foreground">
            Sign in required
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
            Your positions are private. Sign in to view only your own fake-money
            holdings.
          </p>
          <div className="mt-6">
            <Button asChild>
              <Link href="/sign-in">Sign in</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const positions = await getUserPositionsWithMarkets();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          My Positions
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Markets where you hold fake-money Yes or No shares. Amounts are shown
          in fake dollars for this workshop app only.
        </p>
      </div>

      {positions.length === 0 ? (
        <PositionsEmptyState />
      ) : (
        <PositionsList positions={positions} />
      )}
    </div>
  );
}
