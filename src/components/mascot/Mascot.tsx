"use client";

import { useEffect, useRef, useState } from "react";
import DogIcon from "./DogIcon";

const REACTIONS = [
  "woof! 🐾",
  "still compiling...",
  "backend's up 👍",
  "sniff sniff",
  "ship it 🚀",
];

export default function Mascot() {
  const [left, setLeft] = useState(24);
  const [reacting, setReacting] = useState(false);
  const [message, setMessage] = useState(REACTIONS[0]);
  const reducedMotion = useRef(false);
  const reactTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotion.current = mq.matches;

    if (mq.matches) return;

    const interval = setInterval(() => {
      const maxLeft = Math.max(24, window.innerWidth - 96);
      setLeft(24 + Math.random() * (maxLeft - 24));
    }, 18000);

    return () => clearInterval(interval);
  }, []);

  const handleClick = () => {
    setMessage(REACTIONS[Math.floor(Math.random() * REACTIONS.length)]);
    setReacting(true);
    if (reactTimeout.current) clearTimeout(reactTimeout.current);
    reactTimeout.current = setTimeout(() => setReacting(false), 1400);
  };

  return (
    <div
      className="fixed bottom-4 z-40 transition-[left] duration-[3000ms] ease-in-out"
      style={{ left }}
    >
      {reacting && (
        <div className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-border bg-bg px-3 py-1 text-xs text-text shadow-sm">
          {message}
        </div>
      )}
      <button
        type="button"
        aria-label="Say hi to the dog"
        onClick={handleClick}
        className={`block h-16 w-16 cursor-pointer transition-transform duration-300 ${
          reacting ? "-translate-y-3 rotate-6" : "animate-[mascot-bob_2.4s_ease-in-out_infinite]"
        }`}
      >
        <DogIcon className="h-full w-full drop-shadow-md" />
      </button>
    </div>
  );
}
