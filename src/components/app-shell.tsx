"use client";

import { BarChart3, Home, Play } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tag } from "@/components/tag";
import { useReviewer } from "@/components/reviewer-provider";
import { HomeScreen } from "@/components/screens/home-screen";
import { ModeScreen } from "@/components/screens/mode-screen";
import { OnboardingScreen } from "@/components/screens/onboarding-screen";
import { PracticeScreen } from "@/components/screens/practice-screen";
import { ProgressScreen } from "@/components/screens/progress-screen";
import { QuizScreen } from "@/components/screens/quiz-screen";
import { ResultsScreen } from "@/components/screens/results-screen";
import { ReviewScreen } from "@/components/screens/review-screen";
import { daysUntilExam, firstName, initials } from "@/lib/questions";
import { cn } from "@/lib/utils";
import type { ScreenId } from "@/lib/types";

const NAV: { id: ScreenId; label: string; icon: typeof Home }[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "mode", label: "Practice", icon: Play },
  { id: "progress", label: "Progress", icon: BarChart3 },
];

export function AppShell() {
  const { hydrated, screen, user, goTo } = useReviewer();

  if (!hydrated) {
    return (
      <div className="flex min-h-dvh items-center justify-center text-sm text-muted-foreground">
        Opening your study journal…
      </div>
    );
  }

  if (screen === "onboarding") {
    return (
      <div className="app-frame">
        <OnboardingScreen />
      </div>
    );
  }

  const days = daysUntilExam(user);
  const showChrome = screen !== "quiz";

  return (
    <div className="app-frame">
      {showChrome ? (
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card/80 px-5 py-3 backdrop-blur-md md:px-9">
          <div className="flex items-center gap-2">
            <Avatar className="size-8 after:hidden">
              <AvatarFallback className="bg-[linear-gradient(150deg,#1D9E75,#0F6E56)] text-[11px] font-bold text-white">
                {initials(user.name || "R")}
              </AvatarFallback>
            </Avatar>
            <span className="font-heading text-[17px] font-semibold tracking-tight">
              {firstName(user.name)}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Tag tone={user.track === "Elementary" ? "gened" : "spec"}>{user.track}</Tag>
            {days ? (
              <span className="text-[11.5px] text-muted-foreground">{days}d left</span>
            ) : null}
          </div>
        </header>
      ) : null}

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="flex flex-col gap-3.5 px-5 py-6 md:px-9">
          {screen === "home" ? <HomeScreen /> : null}
          {screen === "mode" ? <ModeScreen /> : null}
          {screen === "practice" ? <PracticeScreen /> : null}
          {screen === "quiz" ? <QuizScreen /> : null}
          {screen === "results" ? <ResultsScreen /> : null}
          {screen === "review" ? <ReviewScreen /> : null}
          {screen === "progress" ? <ProgressScreen /> : null}
        </div>
      </div>

      {screen === "home" || screen === "mode" || screen === "progress" || screen === "practice" ? (
        <nav className="sticky bottom-0 z-10 flex border-t border-border bg-card/90 pb-[env(safe-area-inset-bottom)] backdrop-blur-md">
          {NAV.map((item) => {
            const active =
              screen === item.id || (item.id === "home" && screen === "practice");
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => goTo(item.id)}
                className={cn(
                  "relative flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-semibold text-muted-foreground transition-colors",
                  active && "text-[#0F6E56]"
                )}
              >
                {active ? (
                  <span className="absolute top-0 left-1/2 h-[3px] w-[26px] -translate-x-1/2 rounded-b-sm bg-primary" />
                ) : null}
                <Icon className={cn("size-[22px] transition-transform", active && "-translate-y-0.5")} />
                {item.label}
              </button>
            );
          })}
        </nav>
      ) : null}
    </div>
  );
}
