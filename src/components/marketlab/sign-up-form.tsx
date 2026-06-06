"use client";

import Link from "next/link";
import { useActionState } from "react";

import { type AuthActionState, signUpAction } from "@/app/actions/auth";
import {
  AuthField,
  authInputClassName,
} from "@/components/marketlab/auth-field";
import { Button } from "@/components/ui/button";

const initialState: AuthActionState = {};

export function SignUpForm() {
  const [state, formAction, pending] = useActionState(
    signUpAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <AuthField id="first_name" label="First name">
          <input
            id="first_name"
            name="first_name"
            type="text"
            autoComplete="given-name"
            required
            className={authInputClassName}
          />
        </AuthField>

        <AuthField id="last_name" label="Last name">
          <input
            id="last_name"
            name="last_name"
            type="text"
            autoComplete="family-name"
            required
            className={authInputClassName}
          />
        </AuthField>
      </div>

      <AuthField id="email" label="Email">
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className={authInputClassName}
        />
      </AuthField>

      <AuthField id="password" label="Password">
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={6}
          className={authInputClassName}
        />
      </AuthField>

      {state.error ? (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </p>
      ) : null}

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Creating account..." : "Create account"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/sign-in"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
