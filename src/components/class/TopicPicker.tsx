"use client";

import { useState } from "react";
import { PRESET_TOPICS } from "@/lib/topics";
import { Chip } from "@/components/ui/Chip";
import { Button } from "@/components/ui/Button";
import { Card, SectionHeading } from "@/components/ui/Card";
import { useSettings } from "@/context/SettingsContext";
import { getCEFRInfo } from "@/lib/cefr";

export function TopicPicker({
  onPick,
}: {
  onPick: (topic: string) => void;
}) {
  const { profile } = useSettings();
  const [selected, setSelected] = useState<string | null>(null);
  const [custom, setCustom] = useState("");

  const info = getCEFRInfo(profile.level);
  const chosen = custom.trim() || selected;

  return (
    <div className="mx-auto max-w-content space-y-6">
      <header className="pt-2">
        <p className="text-sm font-medium text-ink-subtle">
          {profile.level} · {info.name} · ~{Math.round(info.speakingRatio * 100)}% speaking
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          What do you want to talk about today?
        </h1>
        <p className="mt-2 text-[15px] text-ink-muted">
          Pick anything. A special interest you could talk about for hours works
          brilliantly — the deeper you go, the more you&apos;ll speak.
        </p>
      </header>

      <Card>
        <SectionHeading title="Popular topics" />
        <div className="flex flex-wrap gap-2">
          {PRESET_TOPICS.map((t) => (
            <Chip
              key={t}
              selected={selected === t && !custom.trim()}
              onClick={() => {
                setSelected(t);
                setCustom("");
              }}
            >
              {t}
            </Chip>
          ))}
        </div>

        <div className="mt-6">
          <label htmlFor="custom-topic" className="mb-2 block text-sm font-medium text-ink">
            …or your own topic
          </label>
          <input
            id="custom-topic"
            value={custom}
            onChange={(e) => {
              setCustom(e.target.value);
              if (e.target.value) setSelected(null);
            }}
            placeholder="e.g. the history of Formula 1, my favourite RPG, marine biology…"
            className="input-field"
          />
        </div>
      </Card>

      <Button
        size="lg"
        block
        disabled={!chosen}
        onClick={() => chosen && onPick(chosen)}
      >
        {chosen ? `Build my class on “${chosen}”` : "Choose a topic to continue"}
      </Button>
    </div>
  );
}