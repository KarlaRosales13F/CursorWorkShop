import Link from "next/link";

import { AuthCard } from "@/components/marketlab/auth-card";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Check your email | MarketLab",
  description: "Confirm your email address to finish creating your account.",
};

export default function CheckEmailPage() {
  return (
    <AuthCard
      title="Check your email"
      description="We sent a confirmation link to your inbox. Open it to finish creating your account."
    >
      <div className="space-y-4 text-sm text-muted-foreground">
        <p>
          After you confirm, come back here and sign in to see your fake balance
          in the header.
        </p>
        <Button asChild className="w-full">
          <Link href="/sign-in">Back to sign in</Link>
        </Button>
      </div>
    </AuthCard>
  );
}
