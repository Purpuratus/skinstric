// Simple line icons (so no extra icon package is needed).
const base = {
  width: 56,
  height: 56,
  viewBox: "0 0 56 56",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function CameraIcon() {
  return (
    <svg {...base}>
      <path d="M8 18h8l3-5h18l3 5h8a2 2 0 0 1 2 2v24a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V20a2 2 0 0 1 2-2z" />
      <circle cx="28" cy="31" r="9" />
    </svg>
  );
}

export function GalleryIcon() {
  return (
    <svg {...base}>
      <rect x="6" y="9" width="44" height="38" rx="2" />
      <circle cx="19" cy="22" r="4" />
      <path d="M6 41l13-12 10 9 8-7 13 11" />
    </svg>
  );
}
