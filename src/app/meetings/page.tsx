"use client";

import { useState } from "react";
import type { ConversationCircle, BookingSlot } from "@/lib/types";
import {
  CONVERSATION_CIRCLES,
  BOOKING_SLOTS,
  speakerById,
} from "@/lib/mockData";
import { useSettings } from "@/context/SettingsContext";
import { useProgress } from "@/context/ProgressContext";
import { useIsClient } from "@/hooks/useIsClient";
import { Card, SectionHeading } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/cn";

type Tab = "circles" | "book";

export default function MeetingsPage() {
  const [tab, setTab] = useState<Tab>("circles");

  return (
    <div className="mx-auto max-w-content space-y-6">
      <header className="pt-2">
        <h1 className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          Live practice
        </h1>
        <p className="mt-2 text-[15px] text-ink-muted">
          Real conversations with native speakers and fluent coaches.
        </p>
      </header>

      <div className="flex gap-2 rounded-pill bg-accent-soft p-1">
        <TabButton active={tab === "circles"} onClick={() => setTab("circles")}>
          Conversation Circles
        </TabButton>
        <TabButton active={tab === "book"} onClick={() => setTab("book")}>
          Book a session
        </TabButton>
      </div>

      {tab === "circles" ? <CirclesFeed /> : <BookingList />}
    </div>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex-1 rounded-pill px-4 py-2 text-sm font-medium transition-colors",
        active ? "bg-surface text-ink shadow-sm" : "text-ink-muted hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}

// ---- Conversation Circles ----------------------------------

function CirclesFeed() {
  const sorted = [...CONVERSATION_CIRCLES].sort(
    (a, b) => +new Date(a.dateTime) - +new Date(b.dateTime),
  );
  return (
    <div className="space-y-4">
      {sorted.map((c) => (
        <CircleCard key={c.id} circle={c} />
      ))}
    </div>
  );
}

function CircleCard({ circle }: { circle: ConversationCircle }) {
  const { profile } = useSettings();
  const isClient = useIsClient();
  const [showPrep, setShowPrep] = useState(false);

  const prepReleased = isClient
    ? Date.now() >= +new Date(circle.prepPackReleasesAt)
    : false;

  return (
    <Card>
      <div className="flex flex-wrap items-center gap-2">
        <Badge tone="accent">{circle.levelRange}</Badge>
        <Badge>{circle.speaker.badge}</Badge>
      </div>
      <h2 className="mt-3 text-lg font-semibold text-ink">{circle.title}</h2>
      <p className="mt-1 text-sm text-ink-muted">{circle.theme}</p>

      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
        <Detail label="When">
          {isClient
            ? new Date(circle.dateTime).toLocaleString(undefined, {
                weekday: "short",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })
            : "—"}
        </Detail>
        <Detail label="Host">{circle.speaker.name}</Detail>
        <Detail label="Format">{circle.format}</Detail>
        <Detail label="Theme">{circle.theme}</Detail>
      </dl>

      {/* Autistic-mode agenda note */}
      {profile.autisticMode && (
        <p className="mt-4 rounded-lg bg-accent-soft px-3 py-2 text-xs text-ink-muted">
          Calm format: the full agenda is shared in advance, speaking goes in a
          predictable round-robin order, your camera is optional, you can join
          1:1 or send a recorded answer, and &ldquo;you may pass&rdquo; is always fine.
        </p>
      )}

      {/* Prep pack */}
      <div className="mt-4">
        {prepReleased ? (
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowPrep((s) => !s)}
            >
              {showPrep ? "Hide prep pack" : "Open prep pack"}
            </Button>
            {showPrep && (
              <div className="mt-3 space-y-3 rounded-xl border border-border bg-base/50 p-4">
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-subtle">
                    8 phrases to use
                  </h3>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {circle.prepPack.phrases.map((p) => (
                      <Badge key={p}>{p}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-subtle">
                    3 warm-up questions
                  </h3>
                  <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-ink-muted">
                    {circle.prepPack.warmUpQuestions.map((q) => (
                      <li key={q}>{q}</li>
                    ))}
                  </ol>
                </div>
              </div>
            )}
          </>
        ) : (
          <p className="text-xs text-ink-subtle">
            Prep pack (8 phrases + 3 warm-up questions) unlocks 48h before the
            session.
          </p>
        )}
      </div>
    </Card>
  );
}

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <dt className="text-xs text-ink-subtle">{label}</dt>
      <dd className="text-ink">{children}</dd>
    </div>
  );
}

// ---- On-demand booking -------------------------------------

function BookingList() {
  const { attendMeeting } = useProgress();
  const isClient = useIsClient();
  const [booked, setBooked] = useState<Set<string>>(new Set());

  function book(slot: BookingSlot) {
    setBooked((prev) => new Set(prev).add(slot.id));
    attendMeeting();
  }

  return (
    <Card>
      <SectionHeading
        title="Available slots"
        description="Pick a time with a speaker. 1:1 or small group."
      />
      <ul className="divide-y divide-border">
        {BOOKING_SLOTS.map((slot) => {
          const speaker = speakerById(slot.speakerId);
          const isBooked = booked.has(slot.id);
          const full = slot.booked >= slot.capacity;
          return (
            <li key={slot.id} className="flex items-center justify-between gap-4 py-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-ink">{speaker?.name}</span>
                  {speaker && <Badge>{speaker.badge}</Badge>}
                  <Badge tone="neutral">{slot.kind}</Badge>
                </div>
                <p className="mt-1 text-sm text-ink-muted">
                  {isClient
                    ? new Date(slot.dateTime).toLocaleString(undefined, {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "—"}{" "}
                  · {slot.durationMin} min
                </p>
              </div>
              {isBooked ? (
                <Badge tone="success">Booked ✓</Badge>
              ) : (
                <Button
                  size="sm"
                  disabled={full}
                  onClick={() => book(slot)}
                >
                  {full ? "Full" : "Book"}
                </Button>
              )}
            </li>
          );
        })}
      </ul>
      <p className="mt-4 text-xs text-ink-subtle">
        Demo booking — speakers and slots are sample data in this version.
      </p>
    </Card>
  );
}