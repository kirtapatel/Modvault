import { AdBanner } from "./AdBanner";

export function MobileAdBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#12181f]/95 px-2 py-1.5 backdrop-blur-xl md:hidden">
      <AdBanner variant="mobile" label="Ad" />
    </div>
  );
}