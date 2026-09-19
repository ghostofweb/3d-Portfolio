"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import type { PointerEvent } from "react";
import DogIcon from "./DogIcon";
import { API_URL } from "@/lib/api";
import { getVisitorId } from "@/lib/visitor";

const CLICK_LINES = [
  "woof!",
  "good boy energy",
  "backend's up",
  "sniff sniff",
  "ship it",
  "pet received, thanks",
];

const AMBIENT_LINES = [
  "still compiling...",
  "optimizing something",
  "reviewing a PR",
  "watching the logs",
  "99% CPU... jk, 25%",
];

const NUDGE_LINES = ["pat me", "psst, pat the dog", "he is friendly, go on"];

const AMBIENT_INTERVAL = 32000;
const FIRST_NUDGE_DELAY = 2500;
const NUDGE_INTERVAL = 22000;
const BECKON_DURATION = 1100;
const REST_ANGLE = 10;
const MAX_SWING = 55;
const REACT_DURATION = 1100;
const PATTED_EVENT = "mascot-patted";

type BubbleSource = "click" | "ambient" | "hint";

interface Heart {
  id: number;
  x: number;
}

const subscribePatted = (onChange: () => void) => {
  window.addEventListener(PATTED_EVENT, onChange);
  return () => window.removeEventListener(PATTED_EVENT, onChange);
};
const getPattedSnapshot = () =>
  localStorage.getItem(`patted:${getVisitorId()}`) === "1";
const getPattedServerSnapshot = () => false;

export default function Mascot() {
  const dogRef = useRef<HTMLButtonElement>(null);
  const [tailAngle, setTailAngle] = useState(REST_ANGLE);
  const [reducedMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [reacting, setReacting] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [beckoning, setBeckoning] = useState(false);
  const [hearts, setHearts] = useState<Heart[]>([]);
  const [patCount, setPatCount] = useState<number | null>(null);
  const hasPatted = useSyncExternalStore(
    subscribePatted,
    getPattedSnapshot,
    getPattedServerSnapshot,
  );
  const [bubble, setBubble] = useState({ text: "", visible: false, hint: false });

  const bubbleSourceRef = useRef<BubbleSource | null>(null);
  const bubbleTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reactTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tickingRef = useRef(false);
  const heartIdRef = useRef(0);
  const hoveringRef = useRef(false);
  const interactedRef = useRef(false);

  const showBubble = useCallback(
    (text: string, source: BubbleSource, duration: number) => {
      bubbleSourceRef.current = source;
      setBubble({ text, visible: true, hint: source === "hint" });
      if (bubbleTimeoutRef.current) clearTimeout(bubbleTimeoutRef.current);
      bubbleTimeoutRef.current = setTimeout(() => {
        bubbleSourceRef.current = null;
        setBubble((b) => ({ ...b, visible: false }));
      }, duration);
    },
    [],
  );

  // Load the current pat count once on mount (fails silently if the backend is unreachable)
  useEffect(() => {
    fetch(`${API_URL}/api/mascot/pats`, { signal: AbortSignal.timeout(5000) })
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json?.success) setPatCount(json.data.count);
      })
      .catch(() => {});
  }, []);

  // Invite first-time visitors to pat the dog: a short bubble and a paw wave,
  // a few times at long intervals, and never again once they interact.
  useEffect(() => {
    if (hasPatted) return;

    let nudges = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let beckonTimer: ReturnType<typeof setTimeout> | undefined;

    const nudge = () => {
      if (interactedRef.current || nudges >= NUDGE_LINES.length) return;
      if (!hoveringRef.current && bubbleSourceRef.current !== "click") {
        showBubble(NUDGE_LINES[nudges], "hint", 3200);
        if (!reducedMotion) {
          setBeckoning(true);
          beckonTimer = setTimeout(() => setBeckoning(false), BECKON_DURATION);
        }
      }
      nudges += 1;
      timer = setTimeout(nudge, NUDGE_INTERVAL);
    };

    timer = setTimeout(nudge, FIRST_NUDGE_DELAY);

    return () => {
      clearTimeout(timer);
      clearTimeout(beckonTimer);
    };
  }, [hasPatted, reducedMotion, showBubble]);

  useEffect(() => {
    const ambientInterval = setInterval(() => {
      if (bubbleSourceRef.current === "click" || bubbleSourceRef.current === "hint") return;
      const line = AMBIENT_LINES[Math.floor(Math.random() * AMBIENT_LINES.length)];
      showBubble(line, "ambient", 3000);
    }, AMBIENT_INTERVAL);

    if (reducedMotion) {
      return () => clearInterval(ambientInterval);
    }

    const handlePointerMove = (e: MouseEvent) => {
      if (tickingRef.current || !dogRef.current) return;
      tickingRef.current = true;

      requestAnimationFrame(() => {
        const rect = dogRef.current!.getBoundingClientRect();
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
  }, [reducedMotion, showBubble]);

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
        window.dispatchEvent(new Event(PATTED_EVENT));
      }
    } catch {
      // offline/unreachable backend - the local reaction still plays, count just won't update
    }
  };

  const handleClick = () => {
    interactedRef.current = true;
    const line = CLICK_LINES[Math.floor(Math.random() * CLICK_LINES.length)];
    showBubble(line, "click", 1600);
    setReacting(true);
    if (!reducedMotion) spawnHearts();
    void recordPat();

    if (reactTimeoutRef.current) clearTimeout(reactTimeoutRef.current);
    reactTimeoutRef.current = setTimeout(() => setReacting(false), REACT_DURATION);
  };

  const handlePointerEnter = (e: PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    hoveringRef.current = true;
    setHovering(true);
  };

  const handlePointerLeave = () => {
    hoveringRef.current = false;
    setHovering(false);
  };

  return (
    <div className="relative inline-block">
      {bubble.visible && (
        <div
          className={`absolute -top-8 left-0 z-10 whitespace-nowrap rounded-full border bg-bg px-3 py-1 text-xs shadow-sm ${
            bubble.hint ? "border-accent text-accent" : "border-border text-text"
          }`}
        >
          {bubble.text}
        </div>
      )}

      {hearts.map((heart) => (
        <span
          key={heart.id}
          className="mascot-heart pointer-events-none absolute left-6 top-2 z-10"
          style={{ marginLeft: heart.x }}
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-accent" aria-hidden="true">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </span>
      ))}

      <button
        ref={dogRef}
        type="button"
        aria-label="Pat the dog"
        onClick={handleClick}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        className={`block h-16 w-16 cursor-pointer transition-transform duration-200 ease-out hover:scale-105 ${
          reacting ? "mascot-pop" : ""
        }`}
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
            hovering={hovering && !reducedMotion}
            beckoning={beckoning}
          />
        </span>
      </button>

      <div className="mt-2 flex items-center gap-2 whitespace-nowrap">
        <button
          type="button"
          tabIndex={-1}
          aria-hidden="true"
          onClick={handleClick}
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
          className={`cursor-pointer rounded-full border px-2.5 py-0.5 text-[11px] font-medium transition-colors ${
            hasPatted
              ? hovering
                ? "border-accent text-accent"
                : "border-border text-text-muted"
              : hovering
                ? "border-accent bg-accent text-bg"
                : "border-accent bg-bg text-accent"
          }`}
        >
          {hasPatted ? "Pat again" : "Pat me"}
        </button>
        {patCount !== null && (
          <span className="text-[11px] text-text-muted">
            {patCount.toLocaleString()} pat{patCount === 1 ? "" : "s"}
          </span>
        )}
      </div>
    </div>
  );
}
