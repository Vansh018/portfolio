type IconProps = { className?: string };

export function ArrowUpRight({ className }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 16 16" fill="none">
      <path d="M4 12 12 4M6 4h6v6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ArrowRight({ className }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 16 16" fill="none">
      <path d="M3 8h10m-4-4 4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function MenuIcon({ className }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 20 20" fill="none">
      <path d="M3 6h14M3 14h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function CloseIcon({ className }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 20 20" fill="none">
      <path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function ChevronDown({ className }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 16 16" fill="none">
      <path d="m4 6.5 4 4 4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CheckIcon({ className }: IconProps) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 16 16" fill="none">
      <path d="m3.5 8.5 3 3 6-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
