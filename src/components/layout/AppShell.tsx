import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { signOut } from "@/app/actions/auth";

export type NavItem = { href: string; label: string; icon: string };

export function AppShell({
  title,
  subtitle,
  nav,
  children,
  userName,
}: {
  title: string;
  subtitle?: string;
  nav: NavItem[];
  children: ReactNode;
  userName?: string | null;
}) {
  return (
    <div className="min-h-screen bg-ski-ice">
      <header className="sticky top-0 z-40 border-b border-ski-blue/10 bg-ski-blue text-white shadow-md shadow-ski-blue/20">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/brand/LOGO_WHITE.svg"
              alt="Scuola Sci Pratonevoso"
              width={40}
              height={40}
              className="h-10 w-10"
              priority
            />
            <div>
              <p className="text-sm font-semibold leading-tight">{title}</p>
              {subtitle ? (
                <p className="text-xs text-white/80">{subtitle}</p>
              ) : null}
            </div>
          </Link>
          <div className="flex items-center gap-3">
            {userName ? (
              <span className="hidden text-sm text-white/90 sm:inline">
                Ciao, {userName.split(" ")[0]}
              </span>
            ) : null}
            <form action={signOut}>
              <button
                type="submit"
                className="rounded-lg bg-white/15 px-3 py-1.5 text-xs font-medium hover:bg-white/25"
              >
                Esci
              </button>
            </form>
          </div>
        </div>
        <nav className="mx-auto flex max-w-5xl gap-1 overflow-x-auto px-2 pb-2">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-lg px-3 py-2 text-sm text-white/90 hover:bg-white/15"
            >
              <span className="mr-1.5">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6">{children}</main>
      <footer className="border-t border-ski-blue/10 bg-white py-6 text-center text-xs text-ski-slate">
        Scuola Sci Pratonevoso · Piazzale Dodero, 12 — 12083 Prato Nevoso (CN)
        <br />
        0174 334166 · scuolascipratonevoso.it
      </footer>
    </div>
  );
}
