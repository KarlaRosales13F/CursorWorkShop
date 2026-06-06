import Image from "next/image";
import Link from "next/link";

import { SignOutButton } from "@/components/marketlab/sign-out-button";
import { ThemeToggle } from "@/components/marketlab/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  getHeaderAuthState,
  shouldShowSignedOutActions,
} from "@/lib/auth/header-state";
import { getSessionContext } from "@/lib/profile/queries";

export async function Header() {
  const session = await getSessionContext();
  const authState = getHeaderAuthState(
    session?.user ?? null,
    session?.profile ?? null,
  );

  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <div className="flex items-center gap-6">
          <Link href="/markets" className="flex items-center gap-3">
            <Image
              src="/logo/logo-marketlab.webp"
              alt="MarketLab"
              width={677}
              height={369}
              className="h-10 w-auto object-contain dark:brightness-110"
              priority
            />
            <span className="sr-only">MarketLab</span>
          </Link>

          <nav aria-label="Main navigation">
            <Link
              href="/markets"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Markets
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {authState.status === "signed-in" ? (
            <div className="flex items-center gap-3">
              <p className="rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-sm font-medium text-foreground dark:bg-muted/30">
                <span className="sr-only">Fake money balance: </span>
                {authState.balanceLabel}
              </p>
              <SignOutButton />
            </div>
          ) : null}

          {shouldShowSignedOutActions(authState) ? (
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" size="sm">
                <Link href="/sign-in">Sign in</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/sign-up">Sign up</Link>
              </Button>
            </div>
          ) : null}

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
