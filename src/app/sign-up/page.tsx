import { redirect } from "next/navigation";

import { AuthCard } from "@/components/marketlab/auth-card";
import { SignUpForm } from "@/components/marketlab/sign-up-form";
import { getAuthUser } from "@/lib/profile/queries";

export const metadata = {
  title: "Sign up | MarketLab",
  description: "Create a MarketLab account with fake money to start trading.",
};

export default async function SignUpPage() {
  const user = await getAuthUser();

  if (user) {
    redirect("/markets");
  }

  return (
    <AuthCard
      title="Create account"
      description="Sign up with your name and email. Your profile starts with $100.00 fake."
    >
      <SignUpForm />
    </AuthCard>
  );
}
