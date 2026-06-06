export function MarketsEmptyState() {
  return (
    <div className="rounded-xl border border-dashed border-border bg-card px-6 py-12 text-center">
      <h2 className="text-xl font-semibold text-card-foreground">
        No markets yet
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
        Browse fictional Yes/No markets using fake money. When markets are
        available in Supabase, they will appear here.
      </p>
    </div>
  );
}
