import { cn } from "@/lib/utils";
import { pctColor } from "@/lib/questions";

export function MasteryRing({
  pct,
  size = 56,
  compact = false,
}: {
  pct: number | null | undefined;
  size?: number;
  compact?: boolean;
}) {
  const color = pctColor(pct);
  const p = pct === null || pct === undefined ? 0 : pct;
  const label =
    pct === null || pct === undefined
      ? compact
        ? "0"
        : "—"
      : compact
        ? String(pct)
        : `${pct}%`;
  const fontSize = Math.round(size * (compact ? 0.34 : 0.27));

  return (
    <div
      role="img"
      aria-label={`Mastery ${label}`}
      className="relative grid shrink-0 place-items-center rounded-full shadow-[inset_0_1px_3px_rgba(35,35,28,0.10)]"
      style={{
        width: size,
        height: size,
        background: `conic-gradient(${color} calc(${p} * 1%), #F1E9D8 0)`,
      }}
    >
      <span
        className="absolute inset-1 rounded-full border border-black/5 bg-card"
        aria-hidden
      />
      <span
        className="relative font-heading font-semibold tracking-tight"
        style={{ color, fontSize }}
      >
        {label}
      </span>
    </div>
  );
}

export function FloorBar({
  pct,
  color,
  className,
}: {
  pct: number;
  color: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted shadow-[inset_0_1px_2px_rgba(35,35,28,0.08)]",
        className
      )}
    >
      <div
        className="h-full rounded-full transition-[width] duration-500"
        style={{ width: `${pct}%`, background: color }}
      />
    </div>
  );
}
