"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createServerSupabaseClient } from "@/lib/supabase/server";

export type AuthActionState = {
  error?: string;
};

function readRequiredField(formData: FormData, name: string): string | null {
  const value = formData.get(name);

  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export async function signInAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = readRequiredField(formData, "email");
  const password = readRequiredField(formData, "password");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/markets");
}

export async function signUpAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = readRequiredField(formData, "email");
  const password = readRequiredField(formData, "password");
  const firstName = readRequiredField(formData, "first_name");
  const lastName = readRequiredField(formData, "last_name");

  if (!email || !password || !firstName || !lastName) {
    return { error: "All fields are required." };
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  if (data.session) {
    revalidatePath("/", "layout");
    redirect("/markets");
  }

  redirect("/sign-up/check-email");
}

export async function signOutAction(): Promise<void> {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/markets");
}
