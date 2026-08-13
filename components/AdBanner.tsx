export function AdBanner({
  variant = "box",
  label = "Sponsored Ad",
}: {
  variant?: "box" | "leaderboard" | "skyscraper" | "mobile";
  label?: string;
}) {
  const sizes: Record<string, string> = {
    box: "h-[250px] w-[300px]",
    leaderboard: "h-[90px] w-full max-w-[728px]",
    skyscraper: "h-[600px] w-[160px]",
    mobile: "h-[70px] w-full",
  };

  return (
    <div
      className={`${sizes[variant]} mx-auto flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-900/60`}
    >
      <p className="px-3 text-center text-[11px] font-semibold uppercase tracking-widest text-slate-500">
        {label}
      </p>
      <p className="mt-1 px-3 text-center text-xs text-slate-600">
        728x90 · Replace this ad slot with your ad network
      </p>
    </div>
  );
}