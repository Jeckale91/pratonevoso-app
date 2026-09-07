"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input, Label } from "@/components/ui/Input";
import { AuthDivider, GoogleAuthButton } from "@/components/auth/GoogleAuthButton";
import type { AuthState } from "@/app/actions/auth";

type SignupRole = "allievo" | "maestro";

export function LoginForm({
  action,
  nextPath,
}: {
  action: (prev: AuthState, formData: FormData) => Promise<AuthState>;
  nextPath?: string;
}) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <div className="space-y-4">
      <GoogleAuthButton mode="login" />
      <AuthDivider />
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
    </div>
  );
}

export function SignUpForm({
  action,
}: {
  action: (prev: AuthState, formData: FormData) => Promise<AuthState>;
}) {
  const [state, formAction, pending] = useActionState(action, {});
  const [role, setRole] = useState<SignupRole>("allievo");

  const submitLabel =
    role === "maestro" ? "Crea account maestro" : "Crea account allievo";

  return (
    <div className="space-y-4">
      <div>
        <Label>Tipo di account</Label>
        <div
          className="mt-1.5 grid grid-cols-2 gap-1 rounded-xl border border-ski-blue/20 bg-ski-ice p-1"
          role="radiogroup"
          aria-label="Tipo di account"
        >
          <RoleOption
            value="allievo"
            label="Allievo"
            selected={role === "allievo"}
            onSelect={setRole}
          />
          <RoleOption
            value="maestro"
            label="Maestro"
            selected={role === "maestro"}
            onSelect={setRole}
          />
        </div>
        <p className="mt-1.5 text-xs text-ski-slate">
          {role === "maestro"
            ? "Accesso all'area maestri (gestione allievi, lezioni, schede)."
            : "Accesso all'area allievi (lezioni, schede, badge, messaggi)."}
        </p>
      </div>

      <GoogleAuthButton mode="signup" role={role} />
      <AuthDivider />

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="role" value={role} />
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
          {pending ? "Registrazione…" : submitLabel}
        </Button>
        <p className="text-center text-sm text-ski-slate">
          Hai già un account?{" "}
          <Link href="/login" className="font-medium text-ski-blue">
            Accedi
          </Link>
        </p>
      </form>
    </div>
  );
}

function RoleOption({
  value,
  label,
  selected,
  onSelect,
}: {
  value: SignupRole;
  label: string;
  selected: boolean;
  onSelect: (role: SignupRole) => void;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={() => onSelect(value)}
      className={`rounded-lg px-3 py-2.5 text-sm font-medium transition ${
        selected
          ? "bg-white text-ski-blue shadow-sm"
          : "text-ski-slate hover:text-ski-ink"
      }`}
    >
      {label}
    </button>
  );
}
