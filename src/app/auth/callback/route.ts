import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { homeForRole } from "@/lib/auth";
import type { UserRole } from "@/lib/database.types";

const PENDING_ROLE_COOKIE = "pratonevoso_pending_role";

function parsePendingRole(
  raw: string | undefined,
): "allievo" | "maestro" | null {
  if (raw === "allievo" || raw === "maestro") return raw;
  return null;
}

function fullNameFromMetadata(
  meta: Record<string, unknown> | undefined,
): string | null {
  if (!meta) return null;
  if (typeof meta.full_name === "string" && meta.full_name.trim()) {
    return meta.full_name.trim();
  }
  if (typeof meta.name === "string" && meta.name.trim()) {
    return meta.name.trim();
  }
  const given =
    typeof meta.given_name === "string" ? meta.given_name.trim() : "";
  const family =
    typeof meta.family_name === "string" ? meta.family_name.trim() : "";
  const joined = [given, family].filter(Boolean).join(" ");
  return joined || null;
}

async function finalizeSession(
  origin: string,
  request: NextRequest,
): Promise<NextResponse> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const url = new URL("/login", origin);
    url.searchParams.set(
      "errore",
      "Sessione non disponibile dopo la conferma. Accedi di nuovo.",
    );
    return NextResponse.redirect(url);
  }

  const pendingRole = parsePendingRole(
    request.cookies.get(PENDING_ROLE_COOKIE)?.value,
  );

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .maybeSingle();

  const metaName = fullNameFromMetadata(
    user.user_metadata as Record<string, unknown> | undefined,
  );

  // Never overwrite admin via self-signup cookie; otherwise apply pending role
  let effectiveRole: UserRole = (profile?.role ?? "allievo") as UserRole;
  if (pendingRole && effectiveRole !== "admin") {
    effectiveRole = pendingRole;
  }

  const effectiveFullName = profile?.full_name?.trim()
    ? profile.full_name
    : metaName;

  const roleChanged = !profile || profile.role !== effectiveRole;
  const nameNeedsSync = Boolean(effectiveFullName) && !profile?.full_name;

  if (!profile || roleChanged || nameNeedsSync) {
    await supabase.from("profiles").upsert({
      id: user.id,
      role: effectiveRole,
      ...(effectiveFullName ? { full_name: effectiveFullName } : {}),
    });
  }

  const response = NextResponse.redirect(
    `${origin}${homeForRole(effectiveRole)}`,
  );
  response.cookies.set(PENDING_ROLE_COOKIE, "", {
    path: "/",
    maxAge: 0,
  });
  return response;
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const errorDescription = searchParams.get("error_description");

  if (errorDescription) {
    const url = new URL("/login", origin);
    url.searchParams.set(
      "errore",
      "Il link di conferma non è valido o è scaduto. Accedi con email e password.",
    );
    return NextResponse.redirect(url);
  }

  const supabase = await createClient();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return finalizeSession(origin, request);
    }
  }

  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type: type as
        | "signup"
        | "email"
        | "recovery"
        | "invite"
        | "magiclink"
        | "email_change",
      token_hash: tokenHash,
    });
    if (!error) {
      return finalizeSession(origin, request);
    }
  }

  const url = new URL("/login", origin);
  url.searchParams.set(
    "errore",
    "Conferma non riuscita. Se hai già un account, accedi con email e password.",
  );
  return NextResponse.redirect(url);
}
