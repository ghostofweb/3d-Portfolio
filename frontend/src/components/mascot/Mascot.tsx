"use client";

import { useEffect, useRef, useState } from "react";
import DogIcon from "./DogIcon";
import { API_URL } from "@/lib/api";
import { getVisitorId } from "@/lib/visitor";

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
const REACT_DURATION = 1100;

interface Heart {
  id: number;
  x: number;
}

export default function Mascot() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [tailAngle, setTailAngle] = useState(REST_ANGLE);
  const [reducedMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [reacting, setReacting] = useState(false);
  const [hearts, setHearts] = useState<Heart[]>([]);
  const [patCount, setPatCount] = useState<number | null>(null);
  const [hasPatted, setHasPatted] = useState(
    () =>
      typeof window !== "undefined" &&
      localStorage.getItem(`patted:${getVisitorId()}`) === "1",
  );
  const [bubble, setBubble] = useState<{ text: string; visible: boolean }>({
    text: "",
    visible: false,
  });

  const bubbleSourceRef = useRef<"click" | "ambient" | null>(null);
  const bubbleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reactTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tickingRef = useRef(false);
  const heartIdRef = useRef(0);

  const showBubble = (text: string, source: "click" | "ambient", duration: number) => {
    bubbleSourceRef.current = source;
    setBubble({ text, visible: true });
    if (bubbleTimeoutRef.current) clearTimeout(bubbleTimeoutRef.current);
    bubbleTimeoutRef.current = setTimeout(() => {
      bubbleSourceRef.current = null;
      setBubble((b) => ({ ...b, visible: false }));
    }, duration);
  };

  // Load the current pat count once on mount (fails silently if the backend is unreachable)
  useEffect(() => {
    fetch(`${API_URL}/api/mascot/pats`, { signal: AbortSignal.timeout(5000) })
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json?.success) setPatCount(json.data.count);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const ambientInterval = setInterval(() => {
      if (bubbleSourceRef.current === "click") return;
      const line = AMBIENT_LINES[Math.floor(Math.random() * AMBIENT_LINES.length)];
      showBubble(line, "ambient", 3000);
    }, AMBIENT_INTERVAL);

    if (reducedMotion) {
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
  }, [reducedMotion]);

  const spawnHearts = () => {
    const newHearts = Array.from({ length: 3 }, () => ({
      id: heartIdRef.current++,
      x: -14 + Math.random() * 28,
    }));
    setHearts((h) => [...h, ...newHearts]);
    setTimeout(() => {
      setHearts((h) => h.filter((heart) => !newHearts.includes(heart)));
    }, 1200);
  };

  const recordPat = async () => {
    try {
      const visitorId = getVisitorId();
      const res = await fetch(`${API_URL}/api/mascot/pat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visitorId }),
        signal: AbortSignal.timeout(5000),
      });
      if (!res.ok) return;
      const json = await res.json();
      if (json?.success) {
        setPatCount(json.data.count);
        localStorage.setItem(`patted:${visitorId}`, "1");
        setHasPatted(true);
      }
    } catch {
      // offline/unreachable backend - the local reaction still plays, count just won't update
    }
  };

  const handleClick = () => {
    const line = CLICK_LINES[Math.floor(Math.random() * CLICK_LINES.length)];
    showBubble(line, "click", 1600);
    setReacting(true);
    if (!reducedMotion) spawnHearts();
    void recordPat();

    if (reactTimeoutRef.current) clearTimeout(reactTimeoutRef.current);
    reactTimeoutRef.current = setTimeout(() => setReacting(false), REACT_DURATION);
  };

  return (
    <div ref={wrapperRef} className="relative inline-block">
      {bubble.visible && (
        <div className="absolute -top-8 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full border border-border bg-bg px-3 py-1 text-xs text-text shadow-sm">
          {bubble.text}
        </div>
      )}

      {hearts.map((heart) => (
        <span
          key={heart.id}
          className="mascot-heart pointer-events-none absolute left-1/2 top-2 z-10 text-sm"
          style={{ marginLeft: heart.x }}
        >
          💛
        </span>
      ))}

      <button
        type="button"
        aria-label="Pat the dog"
        onClick={handleClick}
        className={`block h-16 w-16 cursor-pointer ${reacting ? "mascot-pop" : ""}`}
      >
        <span
          className={`block h-full w-full ${
            !reacting && !reducedMotion ? "animate-[mascot-bob_3.2s_ease-in-out_infinite]" : ""
          }`}
        >
          <DogIcon
            className="h-full w-full drop-shadow-sm"
            animated={!reducedMotion}
            tailAngle={reducedMotion ? undefined : tailAngle}
            reacting={reacting}
          />
        </span>
      </button>

      {patCount !== null && (
        <p className="mt-2 text-center text-[11px] text-text-muted">
          🐾 {patCount.toLocaleString()} pat{patCount === 1 ? "" : "s"}
          {hasPatted && <span className="text-accent"> · you patted!</span>}
        </p>
      )}
    </div>
  );
}
