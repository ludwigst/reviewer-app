"use client";

import { Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Pill } from "@/components/pill";
import { Tag } from "@/components/tag";
import { useReviewer } from "@/components/reviewer-provider";
import { getNleSubject, isNleSubject } from "@/lib/nle-taxonomy";
import { componentLabel, getComponents } from "@/lib/questions";
import type { ComponentName, Difficulty, QuizMode } from "@/lib/types";

const DIFFS: Difficulty[] = ["mixed", "easy", "medium", "hard"];

export function ModeScreen() {
  const {
    user,
    selectedComponent,
    selectedDiff,
    selectedMode,
    selectedInstant,
    setSelectedComponent,
    setSelectedDiff,
    setSelectedMode,
    toggleInstant,
    startQuizFromMode,
    goTo,
  } = useReviewer();

  const components = getComponents(user.track);
  const isMock = selectedMode === "mock";

  return (
    <div className="flex min-h-full flex-col gap-3.5">
      <h2 className="font-heading text-[21px] font-semibold tracking-tight">Choose component</h2>
      <div className="flex flex-col gap-2">
        {components.map((c) => {
          const selected = selectedComponent === c;
          return (
            <Button
              key={c}
              variant="outline"
              className="h-auto w-full flex-col items-start gap-1 rounded-xl px-4 py-3 text-left shadow-xs"
              style={
                selected
                  ? { borderColor: "#1D9E75", background: "#E1F5EE" }
                  : undefined
              }
              onClick={() => setSelectedComponent(c)}
            >
              <Tag tone={toneFor(c)}>{componentLabel(c, user.spec)}</Tag>
              <span className="text-xs text-muted-foreground">{subtitleFor(c, user.spec)}</span>
            </Button>
          );
        })}
      </div>

      <h2 className="font-heading text-[21px] font-semibold tracking-tight">Difficulty</h2>
      <div className="flex flex-wrap gap-1.5">
        {DIFFS.map((d) => (
          <Pill
            key={d}
            pressed={selectedDiff === d}
            onPressedChange={() => setSelectedDiff(d)}
          >
            {d === "mixed" ? "Mixed" : d[0]!.toUpperCase() + d.slice(1)}
          </Pill>
        ))}
      </div>

      <h2 className="font-heading text-[21px] font-semibold tracking-tight">Mode</h2>
      <div className="flex flex-wrap gap-1.5">
        {(["quick", "mock"] as QuizMode[]).map((m) => (
          <Pill
            key={m}
            pressed={selectedMode === m}
            onPressedChange={() => setSelectedMode(m)}
          >
            {m === "quick" ? "Quick (10 items)" : "Mock (20 items)"}
          </Pill>
        ))}
      </div>

      <h2 className="font-heading text-[21px] font-semibold tracking-tight">Options</h2>
      <div className="flex flex-wrap gap-1.5">
        <Pill
          pressed={!isMock && selectedInstant}
          disabled={isMock}
          onPressedChange={() => toggleInstant()}
          className={isMock ? "opacity-70" : undefined}
        >
          {isMock
            ? "Review at end (timed exam)"
            : `Instant feedback: ${selectedInstant ? "On" : "Off"}`}
        </Pill>
      </div>

      <div className="mt-auto flex flex-col gap-1.5 pt-4">
        <Button
          size="lg"
          className="h-12 w-full rounded-xl bg-[linear-gradient(160deg,#25b083_0%,#1D9E75_45%,#0F6E56_100%)] text-white hover:bg-[#0F6E56]"
          onClick={() => {
            const error = startQuizFromMode();
            if (error) window.alert(error);
          }}
        >
          <Play /> Start session
        </Button>
        <Button variant="outline" className="h-12 w-full rounded-xl" onClick={() => goTo("home")}>
          Back
        </Button>
      </div>
    </div>
  );
}

function toneFor(c: ComponentName) {
  return c === "Gen Ed" ? "gened" : c === "Prof Ed" ? "profed" : "spec";
}

function subtitleFor(c: ComponentName, spec: string) {
  if (isNleSubject(c)) return getNleSubject(c).blurb;
  if (c === "Gen Ed") return "English, Filipino, Math, Science, Araling Panlipunan";
  if (c === "Prof Ed") return "Child dev, Assessment, Curriculum, Ed Tech...";
  if (c === "Specialization") return `${spec} board content`;
  return "Board exam content";
}
