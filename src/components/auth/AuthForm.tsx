"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import type { AuthState } from "@/app/actions/auth";

export function LoginForm({
  action,
  nextPath,
}: {
  action: (prev: AuthState, formData: FormData) => Promise<AuthState>;
  nextPath?: string;
}) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="space-y-4">
      {nextPath ? <input type="hidden" name="next" value={nextPath} /> : null}
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="nome@email.it"
        />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          placeholder="••••••••"
        />
      </div>
      {state.error ? (
        <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Accesso…" : "Accedi"}
      </Button>
      <p className="text-center text-sm text-ski-slate">
        Non hai un account?{" "}
        <Link href="/registrati" className="font-medium text-ski-blue">
          Registrati
        </Link>
      </p>
    </form>
  );
}

export function SignUpForm({
  action,
}: {
  action: (prev: AuthState, formData: FormData) => Promise<AuthState>;
}) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <Label htmlFor="full_name">Nome e cognome</Label>
        <Input
          id="full_name"
          name="full_name"
          required
          placeholder="Mario Rossi"
        />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="nome@email.it"
        />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="new-password"
          required
          minLength={6}
          placeholder="Almeno 6 caratteri"
        />
      </div>
      {state.error ? (
        <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}
      {state.success ? (
        <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          {state.success}
        </p>
      ) : null}
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Registrazione…" : "Crea account allievo"}
      </Button>
      <p className="text-center text-sm text-ski-slate">
        Hai già un account?{" "}
        <Link href="/login" className="font-medium text-ski-blue">
          Accedi
        </Link>
      </p>
    </form>
  );
}
