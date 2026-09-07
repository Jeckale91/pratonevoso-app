export function BadgePill({
  children,
  color,
}: {
  children: React.ReactNode;
  color?: string | null;
}) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
      style={{
        backgroundColor: color ? `${color}22` : "#046BD222",
        color: color || "#046BD2",
      }}
    >
      {children}
    </span>
  );
}

export function StatusPill({
  status,
}: {
  status: string;
}) {
  const map: Record<string, string> = {
    confirmed: "bg-emerald-100 text-emerald-800",
    pending: "bg-amber-100 text-amber-800",
    cancelled: "bg-slate-200 text-slate-600",
    assigned: "bg-sky-100 text-sky-800",
    in_progress: "bg-violet-100 text-violet-800",
    completed: "bg-emerald-100 text-emerald-800",
  };
  const labels: Record<string, string> = {
    confirmed: "Confermata",
    pending: "In attesa",
    cancelled: "Annullata",
    assigned: "Assegnata",
    in_progress: "In corso",
    completed: "Completata",
  };
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${map[status] ?? "bg-slate-100 text-slate-700"}`}
    >
      {labels[status] ?? status}
    </span>
  );
}
