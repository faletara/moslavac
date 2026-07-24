"use client";

import { useEffect, useState } from "react";
import {
  TIME_UNIT_FORMS,
  type PluralForms,
  pluralForm,
} from "@/lib/helpers/plural";

interface MatchCountdownProps {
  kickoffAtUtcMs: number;
}

interface TimeParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

function diffParts(target: number, now: number): TimeParts {
  const diff = target - now;
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
  }
  const seconds = Math.floor(diff / 1000) % 60;
  const minutes = Math.floor(diff / (1000 * 60)) % 60;
  const hours = Math.floor(diff / (1000 * 60 * 60)) % 24;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  return { days, hours, minutes, seconds, isPast: false };
}

export default function MatchCountdown({ kickoffAtUtcMs }: MatchCountdownProps) {
  const [parts, setParts] = useState<TimeParts | null>(null);

  useEffect(() => {
    const update = () => setParts(diffParts(kickoffAtUtcMs, Date.now()));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [kickoffAtUtcMs]);

  if (!parts || parts.isPast) return null;

  return (
    <section className="mt-16 border-t border-border/60 pt-12 sm:mt-20">
      <h2 className="text-center text-[0.6rem] font-medium uppercase tracking-[0.3em] text-muted-foreground sm:text-xs sm:tracking-[0.4em]">
        Početak za
      </h2>

      <div className="mt-6 grid grid-cols-4 gap-3 mx-auto max-w-md sm:gap-6">
        <CountdownCell value={parts.days} forms={TIME_UNIT_FORMS.day} />
        <CountdownCell value={parts.hours} forms={TIME_UNIT_FORMS.hour} />
        <CountdownCell value={parts.minutes} forms={TIME_UNIT_FORMS.minute} />
        <CountdownCell value={parts.seconds} forms={TIME_UNIT_FORMS.second} />
      </div>
    </section>
  );
}

function CountdownCell({
  value,
  forms,
}: {
  value: number;
  forms: PluralForms;
}) {
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="font-black tabular-nums leading-none text-3xl sm:text-5xl">
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-[0.55rem] font-medium uppercase tracking-[0.25em] text-muted-foreground sm:text-[0.6rem] sm:tracking-[0.3em]">
        {pluralForm(value, forms)}
      </span>
    </div>
  );
}
