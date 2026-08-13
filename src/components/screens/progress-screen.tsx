"use client";

import { Card, CardContent } from "@/components/ui/card";
import { MasteryPanel } from "@/components/mastery-panel";
import { SectionLabel } from "@/components/section-label";
import { useReviewer } from "@/components/reviewer-provider";
import { pctColor } from "@/lib/questions";
import { cn } from "@/lib/utils";

export function ProgressScreen() {
  const { stats } = useReviewer();
  const overall = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : null;

  return (
    <div className="flex flex-col gap-3.5">
      <h2 className="font-heading text-[21px] font-semibold tracking-tight">Your progress</h2>
      <div className="grid grid-cols-2 gap-2.5">
        <StatCard value={String(stats.total)} label="Total answered" />
        <StatCard value={overall === null ? "—" : `${overall}%`} label="Overall accuracy" />
      </div>

      <MasteryPanel />

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
                  <span className="text-[13px]">{s.component}</span>
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
