"use client";

import { ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tag } from "@/components/tag";
import { useReviewer } from "@/components/reviewer-provider";
import { formatTimer } from "@/lib/quiz";
import { cn } from "@/lib/utils";

export function QuizScreen() {
  const { user, quiz, selectAnswer, nextQuestion, endSession } = useReviewer();
  const q = quiz.questions[quiz.current];
  const chosen = quiz.chosen[quiz.current];
  const answered = chosen !== undefined;
  const last = quiz.current === quiz.totalQuestions - 1;

  if (!q) {
    return (
      <div className="flex flex-col gap-3">
        <p className="text-sm text-muted-foreground">No question loaded.</p>
        <Button onClick={endSession}>See results</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm text-muted-foreground">
          Question {quiz.current + 1} of {quiz.totalQuestions}
        </span>
        <div className="flex flex-wrap items-center justify-end gap-1.5">
          {quiz.timerRemaining !== null ? (
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full border border-black/5 bg-muted px-2.5 py-0.5 text-xs font-semibold tabular-nums",
                quiz.timerRemaining <= 60 && "border-[#6B3E0A]/18 bg-[#F6E7CC] text-[#6B3E0A]"
              )}
            >
              <Clock className="size-3.5" />
              {formatTimer(quiz.timerRemaining)}
            </span>
          ) : null}
          {q.bloom ? <Tag tone="bloom">{q.bloom}</Tag> : null}
          <Tag tone={difficultyTone(q.difficulty)}>{q.difficulty}</Tag>
          <Tag tone={componentTone(q.component)}>
            {q.component === "Specialization" ? user.spec : q.component}
          </Tag>
        </div>
      </div>

      <Progress
        value={((quiz.current + 1) / quiz.totalQuestions) * 100}
        className="h-1.5 bg-muted"
      />
      <div className="text-[11.5px] text-muted-foreground">{q.topic}</div>
      <div className="font-heading min-h-14 text-[21px] leading-[1.4] font-medium tracking-tight">
        {q.stem}
      </div>

      <div className="flex flex-col gap-2">
        {q.choices.map((choice, i) => {
          let state: "idle" | "correct" | "wrong" | "reveal" | "picked" = "idle";
          if (answered && quiz.instant) {
            if (i === q.answer) state = i === chosen ? "correct" : "reveal";
            else if (i === chosen) state = "wrong";
          } else if (answered && i === chosen) {
            state = "picked";
          }
          return (
            <button
              key={i}
              type="button"
              disabled={answered}
              onClick={() => selectAnswer(i)}
              className={cn(
                "relative w-full rounded-xl border border-border bg-card py-3.5 pr-4 pl-13 text-left text-[14.5px] leading-[1.45] shadow-xs transition",
                "hover:enabled:border-black/25 hover:enabled:shadow-md active:enabled:scale-[0.99] disabled:cursor-default",
                state === "correct" && "border-primary bg-[#DCEFE4] text-[#0C5440]",
                state === "reveal" && "border-primary bg-[#DCEFE4] text-[#0C5440]",
                state === "wrong" && "border-[#E24B4A] bg-[#F7DFDC] text-[#7A241F]",
                state === "picked" && "border-black/30 bg-muted"
              )}
            >
              <span
                className={cn(
                  "absolute top-1/2 left-2.5 grid size-7 -translate-y-1/2 place-items-center rounded-lg border border-black/5 bg-muted font-heading text-[13px] font-semibold text-muted-foreground",
                  (state === "correct" || state === "reveal") &&
                    "border-[#0F6E56] bg-primary text-white",
                  state === "wrong" && "border-[#E24B4A] bg-[#E24B4A] text-white",
                  state === "picked" && "bg-[#5C5849] text-white"
                )}
              >
                {String.fromCharCode(65 + i)}
              </span>
              {choice}
            </button>
          );
        })}
      </div>

      {answered && quiz.instant ? (
        <div className="rounded-xl border border-black/5 border-l-[3px] border-l-primary bg-muted px-4 py-3.5 text-[13.5px] leading-[1.65] text-muted-foreground">
          {chosen === q.answer ? "✓ Correct! " : "✗ Incorrect. "}
          {q.explanation}
        </div>
      ) : null}

      {answered ? (
        <div className="flex flex-col gap-1.5">
          <Button
            size="lg"
            className="h-12 w-full rounded-xl bg-[linear-gradient(160deg,#25b083_0%,#1D9E75_45%,#0F6E56_100%)] text-white hover:bg-[#0F6E56]"
            onClick={nextQuestion}
          >
            {last ? "See results" : "Next"} <ArrowRight />
          </Button>
          <Button variant="outline" className="h-12 w-full rounded-xl" onClick={endSession}>
            End session
          </Button>
        </div>
      ) : null}
    </div>
  );
}

function difficultyTone(d: "easy" | "medium" | "hard") {
  return d;
}

function componentTone(c: "Gen Ed" | "Prof Ed" | "Specialization") {
  return c === "Gen Ed" ? "gened" : c === "Prof Ed" ? "profed" : "spec";
}
