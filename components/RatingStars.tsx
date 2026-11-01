import { Star, StarHalf } from "lucide-react";

export function RatingStars({ rating, size = 16 }: { rating: number; size?: number }) {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.5;

  return (
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => {
        if (i < full) {
          return <Star key={i} style={{ width: size, height: size }} className="fill-amber-400 text-amber-400" />;
        }
        if (i === full && hasHalf) {
          return <StarHalf key={i} style={{ width: size, height: size }} className="fill-amber-400 text-amber-400" />;
        }
        return <Star key={i} style={{ width: size, height: size }} className="text-white/15" />;
      })}
    </span>
  );
}