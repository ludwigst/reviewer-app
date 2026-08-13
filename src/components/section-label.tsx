import { cn } from "@/lib/utils";

export function SectionLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.12em] text-muted-foreground uppercase",
        className
      )}
    >
      <span className="h-0.5 w-3.5 rounded-full bg-primary/80" />
      {children}
    </div>
  );
}
