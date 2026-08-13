"use client";

import { Play } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MasteryRing } from "@/components/mastery-ring";
import { useReviewer } from "@/components/reviewer-provider";
import { getAllQuestions } from "@/lib/question-bank";
import {
  getNleSubject,
  isNleSubject,
  questionsForSlice,
  topicsForComponent,
  uniqueMasteryPct,
} from "@/lib/nle-taxonomy";
import { getComponents } from "@/lib/questions";
import { cn } from "@/lib/utils";

export function MasteryPanel() {
  const {
    user,
    history,
    selectedProgressComponent,
    setSelectedProgressComponent,
    openPractice,
  } = useReviewer();
  const components = getComponents(user.track);
  const active = components.includes(selectedProgressComponent)
    ? selectedProgressComponent
    : components[0]!;
  const bank = getAllQuestions();
  const nle = isNleSubject(active);
  const topics = topicsForComponent(active, bank);
  const blurb = nle
    ? getNleSubject(active).blurb
    : "Topics from your question bank.";
  const subjectPct = uniqueMasteryPct(bank, history, active);

  return (
    <Card className="bg-card py-4 shadow-xs">
      <CardContent className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="grid size-8 place-items-center rounded-full bg-[#DCEFE4] text-[#0F6E56]">
                <span className="size-3 rounded-full border-[3px] border-current" />
              </span>
              <h3 className="font-heading text-[18px] font-semibold tracking-tight">Mastery</h3>
            </div>
            <p className="mt-1 text-[12px] leading-snug text-muted-foreground">
              Percentage of unique questions in each topic you have answered correctly.
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <MasteryRing pct={subjectPct} size={36} compact />
            <Select value={active} onValueChange={setSelectedProgressComponent}>
              <SelectTrigger className="h-9 max-w-[170px] border-border bg-card px-2 text-[13px] font-semibold shadow-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="end" className="max-h-72">
                {components.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <p className="text-[11.5px] leading-snug text-muted-foreground">{blurb}</p>

        <Accordion type="single" collapsible className="gap-0">
          {topics.map((topic) => {
            const topicPct = uniqueMasteryPct(bank, history, active, topic.name);
            const count = questionsForSlice(bank, active, topic.name).length;
            return (
              <AccordionItem
                key={topic.name}
                value={topic.name}
                className="border-0 not-last:border-b not-last:border-border"
              >
                <AccordionTrigger className="rounded-lg px-1 py-3 hover:no-underline data-[state=open]:bg-[#E1F5EE]/60">
                  <span className="flex min-w-0 flex-1 items-center gap-3 pr-2">
                    <MasteryRing pct={topicPct} size={34} compact />
                    <span className="min-w-0 text-left text-[13.5px] font-semibold leading-snug">
                      {topic.name}
                      {count ? (
                        <span className="mt-0.5 block text-[10.5px] font-medium text-muted-foreground">
                          {count} in bank
                        </span>
                      ) : null}
                    </span>
                  </span>
                </AccordionTrigger>
                <AccordionContent className="px-1">
                  <div className="ml-4 flex flex-col border-l border-border pl-4">
                    {topic.subtopics.map((sub) => {
                      const subPct = uniqueMasteryPct(bank, history, active, topic.name, sub);
                      const n = questionsForSlice(bank, active, topic.name, sub).length;
                      return (
                        <div key={sub} className="flex items-center gap-2.5 py-2.5">
                          <MasteryRing pct={subPct} size={30} compact />
                          <span className="min-w-0 flex-1 text-[13px] leading-snug">{sub}</span>
                          <button
                            type="button"
                            title={n ? `Practice ${sub}` : `Practice ${sub} (bank empty)`}
                            aria-label={`Practice ${sub}`}
                            className={cn(
                              "grid size-8 shrink-0 place-items-center rounded-full text-[#0F6E56] hover:bg-[#DCEFE4]",
                              !n && "text-muted-foreground/50"
                            )}
                            onClick={() => openPractice(active, topic.name, sub)}
                          >
                            <Play className="size-3.5 fill-current" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </CardContent>
    </Card>
  );
}
