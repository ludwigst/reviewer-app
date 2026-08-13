import { cn } from "@/lib/utils";

export function Tag({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: "easy" | "medium" | "hard" | "gened" | "profed" | "spec" | "bloom" | "neutral";
  className?: string;
}) {
  const tones: Record<string, string> = {
    easy: "bg-[#DCEFE4] text-[#0C5440] border-[#0C5440]/12",
    medium: "bg-[#F6E7CC] text-[#6B3E0A] border-[#6B3E0A]/14",
    hard: "bg-[#F7DFDC] text-[#7A241F] border-[#7A241F]/14",
    gened: "bg-[#E7E3F4] text-[#3C3489] border-[#3C3489]/14",
    profed: "bg-[#DCEFE4] text-[#0C5440] border-[#0C5440]/12",
    spec: "bg-[#F6E7CC] text-[#6B3E0A] border-[#6B3E0A]/14",
    bloom: "bg-[#E7E3F4] text-[#3C3489] border-[#3C3489]/14",
    neutral: "bg-muted text-muted-foreground border-border",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}
