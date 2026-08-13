"use client";

import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MasteryPanel } from "@/components/mastery-panel";
import { useReviewer } from "@/components/reviewer-provider";
import { firstName } from "@/lib/questions";

export function HomeScreen() {
  const { user, greeting, goTo, setSelectedMode } = useReviewer();

  return (
    <div className="flex flex-col gap-3.5">
      <div>
        <h2 className="font-heading text-[26px] leading-[1.1] font-semibold tracking-tight">
          {greeting.main} {firstName(user.name)}!
        </h2>
        <p className="mt-0.5 text-[11.5px] text-muted-foreground">{greeting.sub}</p>
      </div>

      <MasteryPanel />

      <Button
        variant="outline"
        className="h-auto w-full justify-start gap-3 rounded-xl px-4 py-3 text-left shadow-xs"
        onClick={() => {
          setSelectedMode("mock");
          goTo("mode");
        }}
      >
        <Clock className="text-[#BA7517]" />
        <span>
          <span className="block font-heading text-[14.5px] font-semibold tracking-tight">
            Mock exam
          </span>
          <span className="block text-[11.5px] font-medium text-muted-foreground">
            20 items · full-length practice
          </span>
        </span>
      </Button>
    </div>
  );
}
