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
  "grabbing coffee ☕",
  "watching the logs",
  "99% CPU... jk, 25%",
];

const WALK_INTERVAL = 20000;
const WALK_DURATION = 3000;

export default function Mascot() {
  const [left, setLeft] = useState(24);
  const [facing, setFacing] = useState<1 | -1>(1);
  const [walking, setWalking] = useState(false);
  const [bubble, setBubble] = useState<{ text: string; visible: boolean }>({
    text: "",
    visible: false,
  });

  const leftRef = useRef(24);
  const bubbleSourceRef = useRef<"click" | "ambient" | null>(null);
  const walkTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const bubbleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    if (mq.matches) return;

    const interval = setInterval(() => {
      const maxLeft = Math.max(24, window.innerWidth - 96);
      const newLeft = 24 + Math.random() * (maxLeft - 24);

      setFacing(newLeft < leftRef.current ? -1 : 1);
      leftRef.current = newLeft;
      setLeft(newLeft);

      setWalking(true);
      if (walkTimeoutRef.current) clearTimeout(walkTimeoutRef.current);
      walkTimeoutRef.current = setTimeout(() => setWalking(false), WALK_DURATION);

      if (bubbleSourceRef.current !== "click") {
        const line = AMBIENT_LINES[Math.floor(Math.random() * AMBIENT_LINES.length)];
        showBubble(line, "ambient", WALK_DURATION);
      }
    }, WALK_INTERVAL);

    return () => {
      clearInterval(interval);
      if (walkTimeoutRef.current) clearTimeout(walkTimeoutRef.current);
      if (bubbleTimeoutRef.current) clearTimeout(bubbleTimeoutRef.current);
    };
  }, []);

  const handleClick = () => {
    const line = CLICK_LINES[Math.floor(Math.random() * CLICK_LINES.length)];
    showBubble(line, "click", 1600);
  };

  const isClickReacting = bubble.visible && bubbleSourceRef.current === "click";

  return (
    <div
      className="fixed bottom-4 z-40 transition-[left] ease-in-out"
      style={{ left, transitionDuration: `${WALK_DURATION}ms` }}
    >
      {bubble.visible && (
        <div className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-border bg-bg px-3 py-1 text-xs text-text shadow-sm">
          {bubble.text}
        </div>
      )}
      <button
        type="button"
        aria-label="Say hi to the dog"
        onClick={handleClick}
        style={{ transform: `scaleX(${facing})` }}
        className="block h-16 w-16 cursor-pointer"
      >
        <span
          className={`block h-full w-full transition-transform duration-300 ${
            isClickReacting
              ? "-translate-y-3"
              : walking
                ? "animate-[mascot-walk_0.5s_ease-in-out_infinite]"
                : "animate-[mascot-bob_2.4s_ease-in-out_infinite]"
          }`}
        >
          <DogIcon className="h-full w-full drop-shadow-md" />
        </span>
      </button>
    </div>
  );
}
