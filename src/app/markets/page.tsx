import { MarketCard } from "@/components/marketlab/market-card";
import { MarketsEmptyState } from "@/components/marketlab/markets-empty-state";
import { getMarkets } from "@/lib/markets/queries";

export const metadata = {
  title: "Markets | MarketLab",
  description: "Browse fictional Yes/No markets using fake money.",
};

export default async function MarketsPage() {
  const markets = await getMarkets();

  return (
    <div className="space-y-8">
      <section className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Markets
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Browse fictional Yes/No markets using fake money.
        </p>
      </section>

      {markets.length === 0 ? (
        <MarketsEmptyState />
      ) : (
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {markets.map((market) => (
            <MarketCard key={market.id} market={market} />
          ))}
        </section>
      )}
    </div>
  );
}
