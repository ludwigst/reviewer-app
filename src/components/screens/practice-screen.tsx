"use client";

import { BookOpenCheck, Clock, ListChecks, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useReviewer } from "@/components/reviewer-provider";
import { questionsForSlice } from "@/lib/nle-taxonomy";
import { getAllQuestions } from "@/lib/question-bank";

export function PracticeScreen() {
  const { practiceTarget, startPractice, goTo, setSelectedMode } = useReviewer();

  if (!practiceTarget) {
    return (
      <div className="flex flex-col gap-3">
        <p className="text-sm text-muted-foreground">Pick a subtopic from Mastery to start.</p>
        <Button variant="outline" onClick={() => goTo("home")}>
          Back to Mastery
        </Button>
      </div>
    );
  }

  const n = questionsForSlice(
    getAllQuestions(),
    practiceTarget.component,
    practiceTarget.topicGroup,
    practiceTarget.subtopic
  ).length;

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="text-[12px] font-semibold tracking-wide text-[#0F6E56] uppercase">
          {practiceTarget.component}
        </p>
        <p className="mt-1 text-[12.5px] text-muted-foreground">{practiceTarget.topicGroup}</p>
        <h2 className="font-heading mt-1 text-[24px] leading-tight font-semibold tracking-tight">
          {practiceTarget.subtopic}
        </h2>
      </div>

      <Button
        size="lg"
        className="h-12 w-full rounded-xl bg-[linear-gradient(160deg,#25b083_0%,#1D9E75_45%,#0F6E56_100%)] text-white hover:bg-[#0F6E56]"
        disabled={!n}
        onClick={() => {
          const error = startPractice();
          if (error) window.alert(error);
        }}
      >
        <Play className="fill-current" /> Start Practice Test
      </Button>
      {!n ? (
        <p className="text-center text-[12.5px] text-muted-foreground">
          No questions in the bank for this subtopic yet.
        </p>
      ) : null}

      <div className="flex flex-col gap-3">
        <Feature
          icon={<ListChecks className="size-5" />}
          title="10 Questions"
          body="Complete set of 10 practice questions to test your knowledge."
        />
        <Feature
          icon={<Clock className="size-5" />}
          title="12 minutes"
          body="Complete the practice test within 12 minutes to simulate real exam conditions."
        />
        <Feature
          icon={<BookOpenCheck className="size-5" />}
          title="Detailed explanations"
          body="Learn from comprehensive explanations for each question."
        />
      </div>

      <Card className="bg-muted py-4 shadow-none">
        <CardContent className="space-y-2">
          <div className="font-heading text-[15px] font-semibold">Ready for a full-length exam?</div>
          <p className="text-[12.5px] text-muted-foreground">
            Test your knowledge with a comprehensive mock exam. Perfect for final preparation and
            time management practice.
          </p>
          <Button
            variant="outline"
            className="mt-1 w-full rounded-xl"
            onClick={() => {
              setSelectedMode("mock");
              goTo("mode");
            }}
          >
            Try Mock Exams
          </Button>
        </CardContent>
      </Card>

      <Button variant="ghost" onClick={() => goTo("home")}>
        Back to Mastery
      </Button>
    </div>
  );
}

function Feature({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="flex gap-3">
      <div className="grid size-10 shrink-0 place-items-center rounded-full bg-[#DCEFE4] text-[#0F6E56]">
        {icon}
      </div>
      <div>
        <div className="text-[14px] font-semibold">{title}</div>
        <p className="text-[12.5px] leading-snug text-muted-foreground">{body}</p>
      </div>
    </div>
  );
}
