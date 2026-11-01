import type { Metadata } from "next";
import { Suspense } from "react";
import { UploadForm } from "@/components/UploadForm";

export const metadata: Metadata = {
  title: "Upload Mod — ModVault",
  description: "Share your game mods with the ModVault community.",
};

export default function UploadPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold text-white">
          Upload a <span className="glow-text">Mod</span>
        </h1>
        <p className="mt-2 text-sm text-white/50">
          Share your creation with the world. Your download links are hosted on MediaFire.
        </p>
      </div>
      <Suspense fallback={<p className="text-center text-white/35">Loading upload form…</p>}>
        <UploadForm />
      </Suspense>
    </main>
  );
}