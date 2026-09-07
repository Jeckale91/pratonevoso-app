"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";

const PENDING_ROLE_COOKIE = "pratonevoso_pending_role";

type SignupRole = "allievo" | "maestro";

export function GoogleAuthButton({
  role,
  mode = "login",
}: {
  /** On registrati, pass the selected role so OAuth can assign it after callback. */
  role?: SignupRole;
  mode?: "login" | "signup";
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setError(null);
    setPending(true);

    try {
      if (mode === "signup" && role && (role === "allievo" || role === "maestro")) {
        document.cookie = `${PENDING_ROLE_COOKIE}=${role}; path=/; max-age=600; SameSite=Lax`;
      } else {
        // Login: do not force a role on existing profiles
        document.cookie = `${PENDING_ROLE_COOKIE}=; path=/; max-age=0; SameSite=Lax`;
      }

      const supabase = createClient();
      const origin = window.location.origin;
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${origin}/auth/callback`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
        },
      });

      if (oauthError) {
        setError(oauthError.message || "Accesso Google non riuscito.");
        setPending(false);
      }
      // On success the browser redirects away
    } catch {
      setError("Accesso Google non riuscito. Riprova.");
      setPending(false);
    }
  }

  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="secondary"
        className="w-full"
        disabled={pending}
        onClick={handleClick}
      >
        <GoogleIcon />
        {pending ? "Reindirizzamento…" : "Continua con Google"}
      </Button>
      {error ? (
        <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg
      aria-hidden
      width="18"
      height="18"
      viewBox="0 0 18 18"
      className="shrink-0"
    >
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"
      />
      <path
        fill="#FBBC05"
        d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z"
      />
    </svg>
  );
}

export function AuthDivider() {
  return (
    <div className="relative my-1 flex items-center gap-3">
      <div className="h-px flex-1 bg-ski-blue/15" />
      <span className="text-xs font-medium uppercase tracking-wide text-ski-slate">
        oppure
      </span>
      <div className="h-px flex-1 bg-ski-blue/15" />
    </div>
  );
}
