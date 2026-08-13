"use client";

import { cn } from "@/lib/utils";
import { Toggle } from "@/components/ui/toggle";

export function Pill({
  pressed,
  children,
  onPressedChange,
  disabled,
  className,
}: {
  pressed: boolean;
  children: React.ReactNode;
  onPressedChange?: (next: boolean) => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <Toggle
      pressed={pressed}
      disabled={disabled}
      onPressedChange={onPressedChange}
      variant="outline"
      className={cn(
        "h-9 rounded-full border-border px-4 text-[13px] font-semibold text-muted-foreground shadow-xs data-[state=on]:border-[#0F6E56] data-[state=on]:bg-[linear-gradient(160deg,#1D9E75,#0F6E56)] data-[state=on]:text-white data-[state=on]:hover:bg-[#0F6E56] data-[state=on]:hover:text-white",
        className
      )}
    >
      {children}
    </Toggle>
  );
}
