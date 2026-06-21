"use client";

import { useState } from "react";
import { A1_TOPICS, A2_TOPICS, B1_TOPICS, B2_TOPICS, C1_TOPICS, C2_TOPICS, BUSINESS_TOPICS } from "@/lib/topics";
import { Chip } from "@/components/ui/Chip";
import { Button } from "@/components/ui/Button";
import { Card, SectionHeading } from "@/components/ui/Card";
import { useSettings } from "@/context/SettingsContext";
import { getCEFRInfo } from "@/lib/cefr";
import type { CEFRLevel } from "@/lib/types";

const LEVEL_TOPICS: Record<CEFRLevel, string[]> = {
  A1: A1_TOPICS,
  A2: A2_TOPICS,
  B1: B1_TOPICS,
  B2: B2_TOPICS,
  C1: C1_TOPICS,
  C2: C2_TOPICS,
};

const LEVEL_DESCRIPTION: Record<CEFRLevel, string> = {
  A1: "Pick a beginner topic from the A1 curriculum. You can also type your own — keep it simple and familiar.",
  A2: "Pick an everyday topic to practise real-life situations. You can also type your own — keep it concrete and practical.",
  B1: "Pick a topic and share your opinions and experiences. Your own interest works brilliantly — the more you care about it, the more you'll speak.",
  B2: "Pick a challenging topic for in-depth discussion. The more complex, the better — aim for depth and argument.",
  C1: "Pick any topic that lets you show nuance and precision. Cultural depth and academic register are what you're aiming for.",
  C2: "Pick anything that challenges you at the highest level — literary, philosophical, professional, or cultural.",
};

export function TopicPicker({
  onPick,
}: {
  onPick: (topic: string) => void;
}) {
  const { profile } = useSettings();
  const [selected, setSelected] = useState<string | null>(null);
  const [custom, setCustom] = useState("");

  const info = getCEFRInfo(profile.level);
  const business = profile.track === "business";
  const topics = business ? BUSINESS_TOPICS : LEVEL_TOPICS[profile.level] ?? A1_TOPICS;
  const chosen = custom.trim() || selected;

  const sectionTitle = business
    ? "Business topics"
    : `${profile.level} · ${info.name} topics`;

  const description = business
    ? "Pick a workplace situation to practise. Your own scenario works just as well."
    : LEVEL_DESCRIPTION[profile.level];

  return (
    <div className="mx-auto max-w-content space-y-6">
      <header className="pt-2">
        <p className="text-sm font-medium text-ink-subtle">
          {business ? "Business Vocabulary" : `${profile.level} · ${info.name}`} · ~
          {Math.round(info.speakingRatio * 100)}% speaking
        </p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          {business
            ? "Which work situation do you want to practise?"
            : profile.level === "A1" || profile.level === "A2"
            ? "Choose a topic for today's class"
            : "What do you want to talk about today?"}
        </h1>
        <p className="mt-2 text-[15px] text-ink-muted">{description}</p>
      </header>

      <Card>
        <SectionHeading title={sectionTitle} />
        <div className="flex flex-wrap gap-2">
          {topics.map((t) => (
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
            placeholder={
              profile.level === "A1"
                ? "e.g. my pet, my school, the park…"
                : profile.level === "A2"
                ? "e.g. a trip I took, my favourite restaurant…"
                : "e.g. the history of Formula 1, my favourite RPG, marine biology…"
            }
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
        {chosen ? `Build my class on "${chosen}"` : "Choose a topic to continue"}
      </Button>
    </div>
  );
}
