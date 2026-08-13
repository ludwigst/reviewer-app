"use client";

import { ListChecks } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SectionLabel } from "@/components/section-label";
import { useReviewer } from "@/components/reviewer-provider";
import { firstName } from "@/lib/questions";

export function ResultsScreen() {
  const { user, quiz, resultCopy, lastReview, goTo, resetQuiz } = useReviewer();
  const pct = lastReview?.score ?? 0;
  const correct = quiz.sessionCorrect;
  const total = quiz.sessionTotal;
  const weak = [...new Set(quiz.sessionWrong)];

  return (
    <div className="flex flex-col gap-3">
      <div>
        <h2 className="font-heading text-[21px] font-semibold tracking-tight">
          {resultCopy?.main} {firstName(user.name)}!
        </h2>
        <p className="text-[11.5px] text-muted-foreground">{resultCopy?.sub}</p>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <StatCard value={`${pct}%`} label="Score" />
        <StatCard value={`${correct}/${total}`} label="Correct" />
      </div>

      <Card className="bg-card py-4 shadow-xs">
        <CardContent>
          <SectionLabel className="mb-1.5">50% floor check</SectionLabel>
          <p className="text-sm">
            {pct >= 50 ? (
              <>
                <span className="font-semibold text-[#1D9E75]">✓ Passed the 50% floor</span>
                {" — You cleared the minimum threshold for this component."}
              </>
            ) : (
              <>
                <span className="font-semibold text-[#E24B4A]">✗ Below 50% floor</span>
                {" — In the real LET, below 50% on any component is an automatic fail, regardless of your overall average."}
              </>
            )}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-card py-4 shadow-xs">
        <CardContent>
          <SectionLabel className="mb-1.5">Weak areas</SectionLabel>
          <p className="text-sm text-muted-foreground">
            {weak.length ? weak.join(" · ") : "Nothing to flag this session!"}
          </p>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-1.5">
        <Button
          size="lg"
          className="h-12 w-full rounded-xl bg-[linear-gradient(160deg,#25b083_0%,#1D9E75_45%,#0F6E56_100%)] text-white hover:bg-[#0F6E56]"
          onClick={() => goTo("review")}
        >
          <ListChecks /> Review answers
        </Button>
        <Button
          variant="outline"
          className="h-12 w-full rounded-xl"
          onClick={() => {
            resetQuiz();
            goTo("mode");
          }}
        >
          Practice again
        </Button>
        <Button
          variant="outline"
          className="h-12 w-full rounded-xl"
          onClick={() => {
            resetQuiz();
            goTo("home");
          }}
        >
          Back to home
        </Button>
      </div>
    </div>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-black/5 bg-muted px-3 py-3.5 text-center">
      <span className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-primary to-transparent opacity-70" />
      <div className="font-heading text-[28px] leading-none font-semibold tracking-tight">
        {value}
      </div>
      <div className="mt-1.5 text-[11px] font-medium text-muted-foreground">{label}</div>
    </div>
  );
}
