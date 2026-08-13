"use client";

import { Clock, Play, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FloorBar, MasteryRing } from "@/components/mastery-ring";
import { SectionLabel } from "@/components/section-label";
import { useReviewer } from "@/components/reviewer-provider";
import {
  componentLabel,
  firstName,
  getComponents,
  pctColor,
  scorePct,
} from "@/lib/questions";
import type { QuizMode } from "@/lib/types";

export function HomeScreen() {
  const { user, stats, greeting, goTo, setSelectedMode } = useReviewer();
  const components = getComponents(user.track);

  function launch(mode: QuizMode) {
    setSelectedMode(mode);
    goTo("mode");
  }

  return (
    <div className="flex flex-col gap-3.5">
      <div>
        <h2 className="font-heading text-[26px] leading-[1.1] font-semibold tracking-tight">
          {greeting.main} {firstName(user.name)}!
        </h2>
        <p className="mt-0.5 text-[11.5px] text-muted-foreground">{greeting.sub}</p>
      </div>

      <div className="grid grid-cols-2 gap-2.5 md:grid-cols-4">
        <StatCard value={stats.total} label="Questions answered" />
        <StatCard value={stats.streak} label="Day streak" />
      </div>

      <Card className="bg-card py-4 shadow-xs ring-foreground/10">
        <CardContent className="space-y-3">
          <SectionLabel>Component scores</SectionLabel>
          {components.map((c) => {
            const s = stats.byComponent[c] || { total: 0, correct: 0 };
            const pct = scorePct(s.correct, s.total);
            const color = pctColor(pct);
            return (
              <div key={c} className="flex items-center gap-3">
                <MasteryRing pct={pct} size={46} />
                <div className="min-w-0 flex-1">
                  <div className="mb-0.5 flex justify-between text-[13px]">
                    <span>{componentLabel(c, user.spec)}</span>
                    <span className="font-semibold" style={{ color }}>
                      {pct !== null ? `${pct}%` : "No data"}
                    </span>
                  </div>
                  <FloorBar pct={pct ?? 0} color={color} />
                  <div className="mt-1 text-[11px]">
                    {pct === null ? (
                      <span className="text-muted-foreground">Not started yet</span>
                    ) : pct >= 50 ? (
                      <span className="font-semibold text-[#0F6E56]">✓ Above the 50% floor</span>
                    ) : (
                      <span className="font-semibold text-[#E24B4A]">
                        ✗ Below 50% floor — needs attention
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <SectionLabel>Start practicing</SectionLabel>
      <div className="flex flex-col gap-1.5">
        <LaunchButton
          icon={<Play className="text-primary" />}
          title="Quick practice"
          sub="10 random questions"
          onClick={() => launch("quick")}
        />
        <LaunchButton
          icon={<Target className="text-[#534AB7]" />}
          title="Topic drill"
          sub="Focus on one component"
          onClick={() => launch("topic")}
        />
        <LaunchButton
          icon={<Clock className="text-[#BA7517]" />}
          title="Mock exam"
          sub="20 items · simulates real exam pressure"
          onClick={() => launch("mock")}
        />
      </div>
    </div>
  );
}

function StatCard({ value, label }: { value: number; label: string }) {
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

function LaunchButton({
  icon,
  title,
  sub,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  sub: string;
  onClick: () => void;
}) {
  return (
    <Button
      variant="outline"
      className="h-auto w-full justify-start gap-3 rounded-xl px-4 py-3 text-left shadow-xs"
      onClick={onClick}
    >
      {icon}
      <span>
        <span className="block font-heading text-[14.5px] font-semibold tracking-tight">
          {title}
        </span>
        <span className="block text-[11.5px] font-medium text-muted-foreground">{sub}</span>
      </span>
    </Button>
  );
}
