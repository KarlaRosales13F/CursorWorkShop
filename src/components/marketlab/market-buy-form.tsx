"use client";

import Link from "next/link";
import { useActionState, useState } from "react";

import { buySharesAction } from "@/app/actions/trade";
import {
  AuthField,
  authInputClassName,
} from "@/components/marketlab/auth-field";
import { Button } from "@/components/ui/button";
import { formatFakeDollars, formatFakeShares } from "@/lib/fake-money";
import type { BuyActionState, BuySide } from "@/lib/trade/types";
import { cn } from "@/lib/utils";

const initialState: BuyActionState = {};

type MarketBuyFormProps = {
  marketId: string;
  buyable: boolean;
  isSignedIn: boolean;
  balanceCents: number | null;
  yesSharesCents: number;
  noSharesCents: number;
  unavailableMessage: string;
};

function sideButtonClassName(isSelected: boolean): string {
  return cn(
    "flex-1",
    isSelected && "ring-2 ring-ring ring-offset-2 ring-offset-background",
  );
}

export function MarketBuyForm({
  marketId,
  buyable,
  isSignedIn,
  balanceCents,
  yesSharesCents,
  noSharesCents,
  unavailableMessage,
}: MarketBuyFormProps) {
  const [state, formAction, pending] = useActionState(
    buySharesAction,
    initialState,
  );
  const [side, setSide] = useState<BuySide>("yes");

  if (!isSignedIn) {
    return (
      <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-card-foreground">
          Buy shares
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Sign in to buy Yes or No shares with fake money on this market.
        </p>
        <div className="mt-4">
          <Button asChild>
            <Link href="/sign-in">Sign in</Link>
          </Button>
        </div>
      </section>
    );
  }

  if (!buyable) {
    return (
      <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-card-foreground">
          Buy shares
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {unavailableMessage}
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-card-foreground">Buy shares</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Spend fake dollars to add Yes or No shares. This workshop app uses fake
        money only.
      </p>

      <dl className="mt-4 grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-border bg-background p-3">
          <dt className="text-xs font-medium text-muted-foreground">
            Available balance
          </dt>
          <dd className="mt-1 text-sm font-semibold text-foreground">
            {balanceCents !== null
              ? formatFakeDollars(balanceCents)
              : "Unavailable"}
          </dd>
        </div>
        <div className="rounded-lg border border-border bg-background p-3">
          <dt className="text-xs font-medium text-muted-foreground">
            Your Yes shares
          </dt>
          <dd className="mt-1 text-sm font-semibold text-foreground">
            {formatFakeShares(yesSharesCents)}
          </dd>
        </div>
        <div className="rounded-lg border border-border bg-background p-3">
          <dt className="text-xs font-medium text-muted-foreground">
            Your No shares
          </dt>
          <dd className="mt-1 text-sm font-semibold text-foreground">
            {formatFakeShares(noSharesCents)}
          </dd>
        </div>
      </dl>

      <form action={formAction} className="mt-5 space-y-4">
        <input type="hidden" name="market_id" value={marketId} />
        <input type="hidden" name="side" value={side} />

        <fieldset className="space-y-2">
          <legend className="text-sm font-medium text-foreground">Side</legend>
          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              className={sideButtonClassName(side === "yes")}
              variant={side === "yes" ? "default" : "outline"}
              onClick={() => setSide("yes")}
              disabled={pending}
            >
              Buy Yes
            </Button>
            <Button
              type="button"
              className={sideButtonClassName(side === "no")}
              variant={side === "no" ? "default" : "outline"}
              onClick={() => setSide("no")}
              disabled={pending}
            >
              Buy No
            </Button>
          </div>
        </fieldset>

        <AuthField id="amount" label="Fake dollar amount">
          <input
            id="amount"
            name="amount"
            type="text"
            inputMode="decimal"
            autoComplete="off"
            placeholder="10.00"
            required
            disabled={pending}
            className={authInputClassName}
          />
        </AuthField>

        {state.error ? (
          <p
            className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
            role="alert"
          >
            {state.error}
          </p>
        ) : null}

        {state.success && state.message ? (
          <p
            className="rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm text-foreground"
            role="status"
          >
            {state.message}
          </p>
        ) : null}

        <Button type="submit" disabled={pending}>
          {pending ? "Buying..." : `Buy ${side === "yes" ? "Yes" : "No"}`}
        </Button>
      </form>
    </section>
  );
}
