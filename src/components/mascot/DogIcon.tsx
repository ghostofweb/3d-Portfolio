export default function DogIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 60"
      className={className}
      shapeRendering="geometricPrecision"
      aria-hidden="true"
    >
      {/* laptop */}
      <rect x="14" y="42" width="36" height="4" rx="1" fill="#8a8f98" />
      <rect x="18" y="30" width="28" height="14" rx="2" fill="#9aa0aa" />
      <rect x="21" y="33" width="22" height="8" rx="1" fill="#d7dbe0" />

      {/* body */}
      <rect x="16" y="26" width="32" height="18" rx="9" fill="#e2963c" />

      {/* ears */}
      <path d="M12 10 L22 22 L14 26 Z" fill="#c97a25" />
      <path d="M52 10 L42 22 L50 26 Z" fill="#c97a25" />

      {/* head */}
      <circle cx="32" cy="24" r="16" fill="#e2963c" />

      {/* headphone band */}
      <path
        d="M18 16 A14 14 0 0 1 46 16"
        stroke="#2b2b2b"
        strokeWidth="3"
        fill="none"
      />
      <circle cx="18" cy="20" r="4.5" fill="#2b2b2b" />
      <circle cx="46" cy="20" r="4.5" fill="#2b2b2b" />

      {/* snout */}
      <ellipse cx="32" cy="29" rx="8" ry="6" fill="#f2c98a" />
      <ellipse cx="32" cy="29" rx="2.4" ry="1.8" fill="#241a12" />

      {/* eyes */}
      <circle cx="26" cy="22" r="1.8" fill="#241a12" />
      <circle cx="38" cy="22" r="1.8" fill="#241a12" />

      {/* paws */}
      <rect x="20" y="40" width="6" height="6" rx="2" fill="#c97a25" />
      <rect x="38" y="40" width="6" height="6" rx="2" fill="#c97a25" />
    </svg>
  );
}
