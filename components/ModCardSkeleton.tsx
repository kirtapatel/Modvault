export function ModCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
      <div className="skeleton aspect-[16/10] w-full rounded-none" />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-center gap-2">
          <div className="skeleton h-4 w-16" />
          <div className="skeleton h-3 w-14" />
        </div>
        <div className="skeleton h-4 w-4/5" />
        <div className="skeleton h-3 w-full" />
        <div className="skeleton h-3 w-2/3" />
        <div className="mt-auto flex items-center justify-between border-t border-white/10 pt-3">
          <div className="skeleton h-4 w-16" />
          <div className="skeleton h-4 w-14" />
        </div>
      </div>
    </div>
  );
}