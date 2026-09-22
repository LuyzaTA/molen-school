"use client";

import { useProgress, type SaveStatus } from "@/context/ProgressContext";
import { useSettings } from "@/context/SettingsContext";
import { cn } from "@/lib/cn";

const LABEL: Record<SaveStatus, string> = {
  saved: "Progress saved ✓",
  unsaved: "Save progress",
  saving: "Saving…",
  error: "Couldn't save — try again",
};

/** Manual "Save progress" control (always available, even with auto-save on). */
export function SaveProgressButton({
  status,
  block,
  className,
}: {
  status: SaveStatus;
  block?: boolean;
  className?: string;
}) {
  const { saveNow } = useProgress();
  const disabled = status === "saving" || status === "saved";
  return (
    <button
      type="button"
      onClick={() => void saveNow()}
      disabled={disabled}
      className={cn(
        "rounded-lg px-3 py-2 text-sm font-semibold transition-colors",
        block && "w-full",
        status === "unsaved" && "bg-accent text-accent-ink hover:opacity-90",
        status === "error" && "bg-danger/10 text-danger hover:bg-danger/20",
        status === "saving" && "bg-accent-soft text-ink-muted",
        status === "saved" && "bg-success/10 text-success",
        className,
      )}
    >
      {LABEL[status]}
    </button>
  );
}

/**
 * Header indicator: appears only when progress needs saving (auto-save off,
 * or a save failed), so students always see there's something to save.
 */
export function HeaderSaveIndicator() {
  const { account, profile } = useSettings();
  const { saveStatus } = useProgress();
  if (account?.isAdmin) return null;
  const show = saveStatus === "error" || (!profile.autoSave && saveStatus !== "saved");
  if (!show) return null;
  return <SaveProgressButton status={saveStatus} className="py-1.5" />;
}
