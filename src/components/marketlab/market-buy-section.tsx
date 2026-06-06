import { MarketBuyForm } from "@/components/marketlab/market-buy-form";
import { isMarketBuyable } from "@/lib/markets/buyable";
import type { Market } from "@/lib/markets/types";
import { getUserPositionForMarket } from "@/lib/positions/queries";
import { getSessionContext } from "@/lib/profile/queries";

type MarketBuySectionProps = {
  market: Market;
};

function getUnavailableMessage(market: Market): string {
  if (market.status === "closed") {
    return "Buying is unavailable because this market is closed.";
  }

  if (market.status === "resolved") {
    return "Buying is unavailable because this market is resolved.";
  }

  if (
    market.close_date &&
    new Date(market.close_date).getTime() <= Date.now()
  ) {
    return "Buying is unavailable because this market has passed its close date.";
  }

  return "Buying is unavailable for this market.";
}

export async function MarketBuySection({ market }: MarketBuySectionProps) {
  const session = await getSessionContext();
  const position = session ? await getUserPositionForMarket(market.id) : null;
  const buyable = isMarketBuyable(market);

  return (
    <MarketBuyForm
      marketId={market.id}
      buyable={buyable}
      isSignedIn={session !== null}
      balanceCents={session?.profile?.balance_cents ?? null}
      yesSharesCents={position?.yes_shares_cents ?? 0}
      noSharesCents={position?.no_shares_cents ?? 0}
      unavailableMessage={getUnavailableMessage(market)}
    />
  );
}
