"use client";

import { Bookmark, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tag } from "@/components/tag";
import { useReviewer } from "@/components/reviewer-provider";
import { cn } from "@/lib/utils";
import { componentLabel } from "@/lib/questions";

export function ReviewScreen() {
  const { user, lastReview, goTo, isBookmarked, toggleBookmark } = useReviewer();

  if (!lastReview) {
    return (
      <div className="flex flex-col gap-3">
        <p className="text-sm text-muted-foreground">No answered questions to review.</p>
        <Button variant="outline" className="h-12 w-full rounded-xl" onClick={() => goTo("home")}>
          Done
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div>
        <h2 className="font-heading text-[21px] font-semibold tracking-tight">Answer review</h2>
        <p className="text-[11.5px] text-muted-foreground">
          {componentLabel(lastReview.component, user.spec)} · {lastReview.score}% ·{" "}
          {lastReview.items.length} question{lastReview.items.length === 1 ? "" : "s"}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {lastReview.items.map((it, idx) => {
          const q = it.q;
          const chosen = it.chosen;
          const answered = chosen !== undefined;
          const correct = answered && chosen === q.answer;
          const status = !answered ? "skipped" : correct ? "right" : "wrong";
          const saved = isBookmarked(q.id);
          return (
            <article
              key={`${q.id}-${idx}`}
              className={cn(
                "rounded-xl border border-border border-l-[3px] bg-card p-4 shadow-xs",
                status === "right" && "border-l-primary",
                status === "wrong" && "border-l-[#E24B4A]",
                status === "skipped" && "border-l-[#BA7517]"
              )}
            >
              <div className="mb-2 flex items-center gap-2">
                <span className="grid size-[22px] place-items-center rounded-[7px] border border-black/5 bg-muted font-heading text-xs font-semibold text-muted-foreground">
                  {idx + 1}
                </span>
                <span
                  className={cn(
                    "text-[11px] font-bold tracking-wide",
                    status === "right" && "text-[#0F6E56]",
                    status === "wrong" && "text-[#E24B4A]",
                    status === "skipped" && "text-[#6B3E0A]"
                  )}
                >
                  {!answered ? "Not answered" : correct ? "Correct" : "Incorrect"}
                </span>
                <span className="ml-auto inline-flex items-center gap-1.5">
                  {q.bloom ? <Tag tone="bloom">{q.bloom}</Tag> : null}
                  <Tag tone={q.difficulty}>{q.difficulty}</Tag>
                </span>
              </div>
              <p className="font-heading mb-2.5 text-base leading-[1.4] font-medium tracking-tight">
                {q.stem}
              </p>
              <div className="mb-2.5 flex flex-col gap-1.5">
                {q.choices.map((c, i) => {
                  const isCorrect = i === q.answer;
                  const isWrongPick = answered && i === chosen && !isCorrect;
                  return (
                    <div
                      key={i}
                      className={cn(
                        "flex items-center gap-2.5 rounded-[10px] border border-border bg-card px-3 py-2 text-[13px]",
                        isCorrect && "border-primary bg-[#DCEFE4] text-[#0C5440]",
                        isWrongPick && "border-[#E24B4A] bg-[#F7DFDC] text-[#7A241F]"
                      )}
                    >
                      <span
                        className={cn(
                          "grid size-[22px] place-items-center rounded-md border border-black/5 bg-muted font-heading text-[11px] font-semibold text-muted-foreground",
                          isCorrect && "border-[#0F6E56] bg-primary text-white",
                          isWrongPick && "border-[#E24B4A] bg-[#E24B4A] text-white"
                        )}
                      >
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className="flex-1 leading-[1.4]">{c}</span>
                      {isCorrect ? <Check className="size-4 text-[#0F6E56]" /> : null}
                      {isWrongPick ? <X className="size-4 text-[#E24B4A]" /> : null}
                    </div>
                  );
                })}
              </div>
              <div className="mb-2.5 rounded-xl border border-black/5 border-l-[3px] border-l-primary bg-muted px-4 py-3.5 text-[13.5px] leading-[1.65] text-muted-foreground">
                {q.explanation}
              </div>
              <Button
                variant="outline"
                className={cn(
                  "h-11 w-full rounded-xl",
                  saved && "border-[#6B3E0A]/25 bg-[#F6E7CC] text-[#6B3E0A] hover:bg-[#F6E7CC]"
                )}
                onClick={() => toggleBookmark(q.id)}
              >
                <Bookmark className={saved ? "fill-current" : undefined} />
                {saved ? "Saved" : "Bookmark"}
              </Button>
            </article>
          );
        })}
      </div>

      <Button variant="outline" className="h-12 w-full rounded-xl" onClick={() => goTo("results")}>
        Done
      </Button>
    </div>
  );
}
