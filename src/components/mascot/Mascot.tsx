"use client";

import { useEffect, useRef, useState } from "react";
import DogIcon from "./DogIcon";

const CLICK_LINES = [
  "woof! 🐾",
  "good boy energy",
  "backend's up 👍",
  "sniff sniff",
  "ship it 🚀",
  "pet received, thanks",
];

const AMBIENT_LINES = [
  "still compiling...",
  "optimizing something",
  "reviewing a PR",
  "watching the logs",
  "99% CPU... jk, 25%",
];

const AMBIENT_INTERVAL = 32000;
const REST_ANGLE = 10;
const MAX_SWING = 55;

export default function Mascot() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [tailAngle, setTailAngle] = useState(REST_ANGLE);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [reacting, setReacting] = useState(false);
  const [bubble, setBubble] = useState<{ text: string; visible: boolean }>({
    text: "",
    visible: false,
  });

  const bubbleSourceRef = useRef<"click" | "ambient" | null>(null);
  const bubbleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reactTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tickingRef = useRef(false);

  const showBubble = (text: string, source: "click" | "ambient", duration: number) => {
    bubbleSourceRef.current = source;
    setBubble({ text, visible: true });
    if (bubbleTimeoutRef.current) clearTimeout(bubbleTimeoutRef.current);
    bubbleTimeoutRef.current = setTimeout(() => {
      bubbleSourceRef.current = null;
      setBubble((b) => ({ ...b, visible: false }));
    }, duration);
  };

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);

    const ambientInterval = setInterval(() => {
      if (bubbleSourceRef.current === "click") return;
      const line = AMBIENT_LINES[Math.floor(Math.random() * AMBIENT_LINES.length)];
      showBubble(line, "ambient", 3000);
    }, AMBIENT_INTERVAL);

    if (mq.matches) {
      return () => clearInterval(ambientInterval);
    }

    const handlePointerMove = (e: MouseEvent) => {
      if (tickingRef.current || !wrapperRef.current) return;
      tickingRef.current = true;

      requestAnimationFrame(() => {
        const rect = wrapperRef.current!.getBoundingClientRect();
        const originX = rect.left + rect.width * 0.75;
        const originY = rect.top + rect.height * 0.6;

        const dx = e.clientX - originX;
        const dy = e.clientY - originY;
        const rawAngle = Math.atan2(dy, dx) * (180 / Math.PI);
        const swing = Math.max(-MAX_SWING, Math.min(MAX_SWING, rawAngle));

        setTailAngle(swing);
        tickingRef.current = false;
      });
    };

    window.addEventListener("mousemove", handlePointerMove);

    return () => {
      window.removeEventListener("mousemove", handlePointerMove);
      clearInterval(ambientInterval);
      if (reactTimeoutRef.current) clearTimeout(reactTimeoutRef.current);
      if (bubbleTimeoutRef.current) clearTimeout(bubbleTimeoutRef.current);
    };
  }, []);

  const handleClick = () => {
    const line = CLICK_LINES[Math.floor(Math.random() * CLICK_LINES.length)];
    showBubble(line, "click", 1600);
    setReacting(true);
    if (reactTimeoutRef.current) clearTimeout(reactTimeoutRef.current);
    reactTimeoutRef.current = setTimeout(() => setReacting(false), 500);
  };

  return (
    <div ref={wrapperRef} className="relative inline-block">
      {bubble.visible && (
        <div className="absolute -top-8 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full border border-border bg-bg px-3 py-1 text-xs text-text shadow-sm">
          {bubble.text}
        </div>
      )}
      <button
        type="button"
        aria-label="Say hi to the dog"
        onClick={handleClick}
        className={`block h-16 w-16 cursor-pointer transition-transform duration-300 ${
          reacting
            ? "-translate-y-2"
            : !reducedMotion
              ? "animate-[mascot-bob_3.2s_ease-in-out_infinite]"
              : ""
        }`}
      >
        <DogIcon
          className="h-full w-full"
          animated={!reducedMotion}
          tailAngle={reducedMotion ? undefined : tailAngle}
        />
      </button>
    </div>
  );
}
