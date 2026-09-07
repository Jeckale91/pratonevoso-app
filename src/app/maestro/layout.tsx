import { AppShell } from "@/components/layout/AppShell";
import { getProfile } from "@/lib/auth";

const nav = [
  { href: "/maestro", label: "Dashboard", icon: "🏂" },
  { href: "/maestro/lezioni", label: "Lezioni", icon: "📅" },
  { href: "/maestro/schede", label: "Schede", icon: "📋" },
  { href: "/maestro/badge", label: "Badge", icon: "🏅" },
  { href: "/maestro/messaggi", label: "Messaggi", icon: "💬" },
];

export default async function MaestroLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { profile } = await getProfile();

  return (
    <AppShell
      title="Area Maestro"
      subtitle="Scuola Sci Pratonevoso"
      nav={nav}
      userName={profile.full_name}
    >
      {children}
    </AppShell>
  );
}
