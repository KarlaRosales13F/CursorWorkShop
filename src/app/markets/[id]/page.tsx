import Link from "next/link";
import { notFound } from "next/navigation";

import { MarketBuySection } from "@/components/marketlab/market-buy-section";
import { MarketStatusBadge } from "@/components/marketlab/market-status-badge";
import { ProbabilityChart } from "@/components/marketlab/probability-chart";
import { formatCloseDate } from "@/lib/markets/format";
import { getMarketProbabilityData } from "@/lib/markets/probability";
import { getMarketById } from "@/lib/markets/queries";

type MarketDetailPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: MarketDetailPageProps) {
  const { id } = await params;
  const market = await getMarketById(id);

  if (!market) {
    return { title: "Market not found | MarketLab" };
  }

  return {
    title: `${market.title} | MarketLab`,
    description: market.description,
  };
}

export default async function MarketDetailPage({
  params,
}: MarketDetailPageProps) {
  const { id } = await params;
  const market = await getMarketById(id);

  if (!market) {
    notFound();
  }

  const { yesChance, series } = await getMarketProbabilityData(market);

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/markets"
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          ← Back to markets
        </Link>
      </div>

      <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-3">
            <h1 className="text-3xl font-semibold tracking-tight text-card-foreground">
              {market.title}
            </h1>
            <p className="max-w-3xl text-base leading-7 text-muted-foreground">
              {market.description || "No description provided."}
            </p>
          </div>
          <MarketStatusBadge status={market.status} />
        </div>

        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-muted-foreground">
              Status
            </dt>
            <dd className="mt-1 text-sm text-foreground">{market.status}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-muted-foreground">
              Close date
            </dt>
            <dd className="mt-1 text-sm text-foreground">
              {formatCloseDate(market.close_date)}
            </dd>
          </div>
        </dl>
      </section>

      <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-card-foreground">Outcomes</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-border bg-background p-4">
            <p className="text-sm font-medium text-muted-foreground">Yes</p>
            <p className="mt-2 text-2xl font-semibold text-foreground">
              {yesChance.yesPercent.toFixed(1)}%
            </p>
          </div>
          <div className="rounded-lg border border-border bg-background p-4">
            <p className="text-sm font-medium text-muted-foreground">No</p>
            <p className="mt-2 text-2xl font-semibold text-foreground">
              {yesChance.noPercent.toFixed(1)}%
            </p>
          </div>
        </div>
      </section>

      <ProbabilityChart series={series} />

      <MarketBuySection market={market} />
    </div>
  );
}
