"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pill } from "@/components/pill";
import { SectionLabel } from "@/components/section-label";
import { useReviewer } from "@/components/reviewer-provider";
import { SPECIALIZATIONS } from "@/lib/copy";
import type { Track } from "@/lib/types";

export function OnboardingScreen() {
  const { user, setUser, completeOnboarding } = useReviewer();
  const [name, setName] = useState(user.name);

  return (
    <div className="flex min-h-full flex-col justify-center gap-5 p-5 md:p-8">
      <div>
        <h1 className="font-heading text-[38px] leading-[1.04] font-semibold tracking-tight">
          LET Reviewer
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your AI-powered board exam companion
        </p>
      </div>

      <div className="space-y-2">
        <SectionLabel>Your name</SectionLabel>
        <Input
          id="user-name"
          value={name}
          placeholder="e.g. Maria Santos"
          className="h-12 rounded-xl bg-card text-[14.5px]"
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <SectionLabel>Exam track</SectionLabel>
        <div className="flex flex-wrap gap-2">
          {(["Elementary", "Secondary"] as Track[]).map((track) => (
            <Pill
              key={track}
              pressed={user.track === track}
              onPressedChange={() => setUser({ track })}
            >
              {track}
            </Pill>
          ))}
        </div>
      </div>

      {user.track === "Secondary" ? (
        <div className="space-y-2">
          <SectionLabel>Specialization</SectionLabel>
          <Select value={user.spec} onValueChange={(spec) => setUser({ spec })}>
            <SelectTrigger className="h-12 w-full rounded-xl bg-card">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SPECIALIZATIONS.map((spec) => (
                <SelectItem key={spec} value={spec}>
                  {spec}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : null}

      <div className="space-y-2">
        <Label className="sr-only" htmlFor="exam-date">
          Exam date
        </Label>
        <SectionLabel>Exam date (optional)</SectionLabel>
        <Input
          id="exam-date"
          type="date"
          value={user.examDate ?? ""}
          className="h-12 rounded-xl bg-card text-[14.5px]"
          onChange={(e) => setUser({ examDate: e.target.value || null })}
        />
      </div>

      <Button
        size="lg"
        className="h-12 w-full rounded-xl bg-[linear-gradient(160deg,#25b083_0%,#1D9E75_45%,#0F6E56_100%)] text-white shadow-[0_10px_22px_-10px_rgba(15,110,86,0.7)] hover:bg-[#0F6E56]"
        onClick={() =>
          completeOnboarding({
            ...user,
            name: name.trim() || "Reviewer",
          })
        }
      >
        Get started <ArrowRight />
      </Button>
    </div>
  );
}
