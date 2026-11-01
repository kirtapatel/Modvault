const gradients: Record<string, string> = {
  gtav: "from-[#bf4417]/60 via-[#2a1007] to-black",
  minecraft: "from-[#d97706]/50 via-[#241807] to-black",
  skyrim: "from-[#7c2d12]/60 via-[#1c0f09] to-black",
};

export function GameThumb({
  gameSlug,
  title,
  thumbnailUrl,
}: {
  gameSlug: string;
  title: string;
  thumbnailUrl: string | null;
}) {
  if (thumbnailUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={thumbnailUrl}
        alt={title}
        className="h-full w-full object-cover"
        loading="lazy"
      />
    );
  }
  const gradient = gradients[gameSlug] ?? "from-white/10 to-black";
  return (
    <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${gradient}`}>
      <div className="text-center">
        <div className="mx-auto mb-2 h-16 w-16 rounded-2xl border border-brand/25 bg-brand/5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur" />
        <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-white/50">
          {gameSlug}
        </span>
        <span className="mt-1 block text-[10px] text-white/30">{title}</span>
      </div>
    </div>
  );
}