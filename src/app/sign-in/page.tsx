import { redirect } from "next/navigation";

import { AuthCard } from "@/components/marketlab/auth-card";
import { SignInForm } from "@/components/marketlab/sign-in-form";
import { getAuthUser } from "@/lib/profile/queries";

export const metadata = {
  title: "Sign in | MarketLab",
  description: "Sign in to MarketLab with your email and password.",
};

export default async function SignInPage() {
  const user = await getAuthUser();

  if (user) {
    redirect("/markets");
  }

  return (
    <AuthCard
      title="Sign in"
      description="Use your email and password to access your fake-money account."
    >
      <SignInForm />
    </AuthCard>
  );
}
