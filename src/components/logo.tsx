export function LogoMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <span
      className={`grid place-items-center rounded-full bg-yellow text-violet-deep ${className}`}
      aria-hidden
    >
      <svg viewBox="0 0 24 24" className="h-[58%] w-[58%]" fill="none">
        <path
          d="M12 5.2c.4 1.1.4 1.8 0 2.4"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <path
          d="M7.2 10.2h9.6M8.4 10.2 7 16.8c1.4 1.3 2.9 1.9 5 1.9s3.6-.6 5-1.9l-1.4-6.6"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}
