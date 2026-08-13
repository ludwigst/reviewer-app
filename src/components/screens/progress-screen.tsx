"use client";

import { Play } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { FloorBar, MasteryRing } from "@/components/mastery-ring";
import { Pill } from "@/components/pill";
import { SectionLabel } from "@/components/section-label";
import { useReviewer } from "@/components/reviewer-provider";
import {
  componentLabel,
  getComponents,
  getTaxonomy,
  pctColor,
  scorePct,
  topicShortName,
} from "@/lib/questions";
import { cn } from "@/lib/utils";

export function ProgressScreen() {
  const {
    user,
    stats,
    selectedProgressComponent,
    setSelectedProgressComponent,
    startTopicDrill,
  } = useReviewer();
  const components = getComponents(user.track);
  const active = components.includes(selectedProgressComponent)
    ? selectedProgressComponent
    : components[0]!;
  const cs = stats.byComponent[active] || { total: 0, correct: 0 };
  const cpct = scorePct(cs.correct, cs.total);
  const tax = getTaxonomy(active, user.spec);
  const groups = Object.keys(tax);
  const overall = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : null;
  const defaultOpen = groups.filter((g) => {
    const topics = tax[g]!;
    let gt = 0;
    let gc = 0;
    for (const t of topics) {
      const ts = stats.byTopic[active]?.[t] || { total: 0, correct: 0 };
      gt += ts.total;
      gc += ts.correct;
    }
    const gpct = scorePct(gc, gt);
    return gpct !== null && gpct < 50;
  });

  return (
    <div className="flex flex-col gap-3.5">
      <h2 className="font-heading text-[21px] font-semibold tracking-tight">Your progress</h2>
      <div className="grid grid-cols-2 gap-2.5">
        <StatCard value={String(stats.total)} label="Total answered" />
        <StatCard value={overall === null ? "—" : `${overall}%`} label="Overall accuracy" />
      </div>

      <div className="flex flex-wrap gap-1.5">
        {components.map((c) => (
          <Pill
            key={c}
            pressed={c === active}
            onPressedChange={() => setSelectedProgressComponent(c)}
          >
            {componentLabel(c, user.spec)}
          </Pill>
        ))}
      </div>

      <Card className="bg-card py-4 shadow-xs">
        <CardContent>
          <div className="flex items-center gap-4">
            <MasteryRing pct={cpct} size={66} />
            <div className="min-w-0 flex-1">
              <div className="font-heading text-lg font-semibold tracking-tight">
                {componentLabel(active, user.spec)}
              </div>
              <div className="mt-0.5 mb-2 text-xs text-muted-foreground">
                {cs.total} answered · {cs.correct} correct
              </div>
              <FloorBadge pct={cpct} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card py-4 shadow-xs">
        <CardContent className="space-y-2.5">
          <SectionLabel>Topic mastery</SectionLabel>
          {groups.length === 0 ? (
            <p className="text-sm text-muted-foreground">No topics found for this component.</p>
          ) : (
            <Accordion type="multiple" defaultValue={defaultOpen} className="gap-2">
              {groups.map((g) => {
                const topics = tax[g]!;
                let gt = 0;
                let gc = 0;
                const rows = topics.map((t) => {
                  const ts = stats.byTopic[active]?.[t] || { total: 0, correct: 0 };
                  gt += ts.total;
                  gc += ts.correct;
                  return { t, ts, tpct: scorePct(ts.correct, ts.total) };
                });
                const gpct = scorePct(gc, gt);
                const gcolor = pctColor(gpct);
                return (
                  <AccordionItem
                    key={g}
                    value={g}
                    className="overflow-hidden rounded-xl border border-border bg-card shadow-xs not-last:border-b"
                  >
                    <AccordionTrigger className="px-3.5 py-3 hover:no-underline">
                      <span className="flex min-w-0 flex-1 items-center gap-2.5 pr-2">
                        <span className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold">
                          {g}
                          {gpct !== null && gpct < 50 ? (
                            <span className="rounded-full border border-[#7A241F]/14 bg-[#F7DFDC] px-1.5 py-px text-[9.5px] font-bold tracking-wide text-[#7A241F] uppercase">
                              below floor
                            </span>
                          ) : null}
                        </span>
                        <span className="min-w-10 flex-1">
                          <FloorBar pct={gpct ?? 0} color={gcolor} className="mt-0 h-[5px]" />
                        </span>
                        <span
                          className="font-heading min-w-8 text-right text-[13px] font-semibold"
                          style={{ color: gcolor }}
                        >
                          {gpct !== null ? `${gpct}%` : "—"}
                        </span>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="px-3.5">
                      <div className="flex flex-col gap-2.5 border-t border-black/5 pt-2.5">
                        {rows.map(({ t, ts, tpct }) => {
                          const color = pctColor(tpct);
                          return (
                            <div key={t}>
                              <div className="mb-1 flex items-baseline justify-between gap-2">
                                <span className="inline-flex items-center gap-1.5 text-[13px]">
                                  {topicShortName(t)}
                                  {tpct !== null && tpct < 50 ? (
                                    <span className="rounded-full border border-[#7A241F]/14 bg-[#F7DFDC] px-1.5 py-px text-[9.5px] font-bold tracking-wide text-[#7A241F] uppercase">
                                      below floor
                                    </span>
                                  ) : null}
                                </span>
                                <span className="inline-flex items-center gap-2">
                                  <span className="text-[12.5px] font-semibold" style={{ color }}>
                                    {tpct !== null ? `${tpct}%` : "—"}
                                  </span>
                                  <button
                                    type="button"
                                    title="Drill this topic"
                                    aria-label={`Drill ${topicShortName(t)}`}
                                    className="grid size-[30px] place-items-center rounded-lg border border-border bg-card text-[#0F6E56] shadow-xs hover:border-primary hover:bg-[#DCEFE4]"
                                    onClick={() => {
                                      const error = startTopicDrill(active, t);
                                      if (error) window.alert(error);
                                    }}
                                  >
                                    <Play className="size-3.5 fill-current" />
                                  </button>
                                </span>
                              </div>
                              <FloorBar pct={tpct ?? 0} color={color} className="mt-0 h-[5px]" />
                              <div className="mt-1 text-[10.5px] text-muted-foreground">
                                {ts.total} answered
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          )}
        </CardContent>
      </Card>

      <Card className="bg-card py-4 shadow-xs">
        <CardContent>
          <SectionLabel className="mb-2">Recent sessions</SectionLabel>
          {stats.sessions.length ? (
            stats.sessions
              .slice(-5)
              .reverse()
              .map((s, i) => (
                <div
                  key={`${s.date}-${i}`}
                  className={cn(
                    "flex justify-between py-1.5",
                    i < 4 && "border-b border-black/5"
                  )}
                >
                  <span className="text-[13px]">
                    {s.component === "Specialization" ? user.spec : s.component}
                  </span>
                  <span
                    className="text-[13px] font-semibold"
                    style={{ color: pctColor(s.score) }}
                  >
                    {s.score}%
                  </span>
                </div>
              ))
          ) : (
            <p className="text-sm text-muted-foreground">No sessions yet. Start practicing!</p>
          )}
        </CardContent>
      </Card>
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

function FloorBadge({ pct }: { pct: number | null }) {
  if (pct === null) {
    return (
      <span className="inline-flex items-center rounded-full border border-black/5 bg-muted px-2.5 py-0.5 text-[11px] font-bold text-muted-foreground">
        No data yet
      </span>
    );
  }
  if (pct >= 50) {
    return (
      <span className="inline-flex items-center rounded-full border border-[#0C5440]/14 bg-[#DCEFE4] px-2.5 py-0.5 text-[11px] font-bold text-[#0C5440]">
        ✓ Above 50% floor
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full border border-[#7A241F]/16 bg-[#F7DFDC] px-2.5 py-0.5 text-[11px] font-bold text-[#7A241F]">
      ✗ Below 50% floor
    </span>
  );
}
