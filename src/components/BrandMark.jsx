export default function BrandMark({ className = "w-7 h-7" }) {
  return (
    <svg
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* helmet shell */}
      <circle cx="14" cy="14" r="12.5" stroke="var(--brand)" strokeWidth="1.4" />
      {/* visor */}
      <path
        d="M6.2 13.6C6.2 9.4 9.7 6 14 6s7.8 3.4 7.8 7.6c0 1-.8 1.8-1.8 1.8H8c-1 0-1.8-.8-1.8-1.8Z"
        fill="var(--brand)"
      />
      {/* visor reflection */}
      <path
        d="M9.6 12.4c.5-2 2.2-3.4 4.4-3.4"
        stroke="var(--bg)"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      {/* neck seal */}
      <rect x="10.5" y="20.4" width="7" height="2" rx="1" fill="var(--brand)" />
    </svg>
  );
}
