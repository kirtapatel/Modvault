"use client";

import { useState } from "react";
import { X, ChevronLeft, ChevronRight, Camera } from "lucide-react";

export function ScreenshotGallery({ images }: { images: string[] }) {
  const [active, setActive] = useState<number | null>(null);

  if (images.length === 0) return null;

  return (
    <div>
      <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-white">
        <Camera className="h-5 w-5 text-brand" />
        Photos ({images.length})
      </h2>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => setActive(i)}
            className="group relative overflow-hidden rounded-xl border border-white/10 transition-all hover:border-brand/50"
            aria-label={`View photo ${i + 1}`}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={`Screenshot ${i + 1}`}
              loading="lazy"
              className="aspect-video w-full object-cover transition-transform duration-200 group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      {active !== null && images[active] && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 p-4 backdrop-blur-sm"
          onClick={() => setActive(null)}
        >
          <button
            type="button"
            onClick={() => setActive(null)}
            className="absolute right-4 top-4 rounded-full bg-slate-800/80 p-2 text-slate-200 transition-colors hover:bg-slate-700"
            aria-label="Close photo viewer"
          >
            <X className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setActive((active - 1 + images.length) % images.length);
            }}
            className="absolute left-3 rounded-full bg-slate-800/80 p-2 text-slate-200 transition-colors hover:bg-brand sm:left-6"
            aria-label="Previous photo"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setActive((active + 1) % images.length);
            }}
            className="absolute right-3 rounded-full bg-slate-800/80 p-2 text-slate-200 transition-colors hover:bg-brand sm:right-6"
            aria-label="Next photo"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[active]}
            alt={`Screenshot ${active + 1}`}
            className="max-h-[85vh] max-w-full rounded-xl border border-white/10 object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}