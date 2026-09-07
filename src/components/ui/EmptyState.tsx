export function EmptyState({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-ski-blue/20 bg-ski-ice/60 px-6 py-10 text-center">
      <p className="text-base font-semibold text-ski-ink">{title}</p>
      {description ? (
        <p className="mt-2 text-sm text-ski-slate">{description}</p>
      ) : null}
    </div>
  );
}
