"use client";

import { useEffect, useRef, useState } from "react";

export default function ImageLightbox({
  children,
}: {
  children: React.ReactNode;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeSrc, setActiveSrc] = useState<string | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "IMG") {
        setActiveSrc((target as HTMLImageElement).src);
      }
    };

    container.addEventListener("click", handleClick);
    return () => container.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    if (!activeSrc) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveSrc(null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [activeSrc]);

  return (
    <>
      <div ref={containerRef}>{children}</div>

      {activeSrc && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setActiveSrc(null)}
          className="fixed inset-0 z-[100] flex cursor-zoom-out items-center justify-center bg-black/85 p-6 backdrop-blur-sm"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={activeSrc}
            alt=""
            className="max-h-full max-w-full rounded-lg object-contain shadow-2xl"
          />
        </div>
      )}
    </>
  );
}
