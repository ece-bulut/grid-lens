import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Plain bordered card. */
export function Panel({ children, className, id }: { children: ReactNode; className?: string; id?: string }) {
  return (
    <div
      id={id}
      className={cn(
        "relative rounded-lg border border-zinc-800/80 bg-zinc-950/60 transition-colors duration-300 ease-out hover:border-zinc-700",
        className,
      )}
    >
      {children}
    </div>
  );
}

/** Small rounded label. */
export function Pill({ children, tone = "neutral", className }: { children: ReactNode; tone?: "neutral" | "accent"; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs whitespace-nowrap",
        tone === "neutral" && "border-zinc-700 text-zinc-300",
        tone === "accent" && "border-emerald-500/40 bg-emerald-500/10 text-emerald-400",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Label/value cell. Only the numeric value uses the mono face. */
export function Metric({ label, value, unit, className }: { label: string; value: ReactNode; unit?: string; className?: string }) {
  return (
    <div className={cn("px-4 py-3", className)}>
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="mt-1 text-lg text-zinc-100">
        <span className="font-mono tabular-nums">{value}</span>
        {unit && <span className="ml-1 text-xs text-zinc-500">{unit}</span>}
      </p>
    </div>
  );
}
