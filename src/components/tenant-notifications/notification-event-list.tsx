"use client";

import { CheckCircle2, Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import type {
  NotificationEventId,
  NotificationEventOption,
} from "@/types/notification";

type NotificationEventListProps = {
  events: NotificationEventOption[];
  enabledEvents: NotificationEventId[];
  isSaving: boolean;
  onToggle: (eventId: NotificationEventId) => void;
  onSave: () => void;
};

export function NotificationEventList({
  events,
  enabledEvents,
  isSaving,
  onToggle,
  onSave,
}: NotificationEventListProps) {
  return (
    <section className="dashboard-card">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground">通知執行項目</h2>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            勾選後，對應事件發生時會通知已綁定的 Telegram。
          </p>
        </div>
        <Button
          type="button"
          disabled={isSaving}
          onClick={onSave}
          className="h-10 rounded-xl"
        >
          <Save data-icon="inline-start" />
          {isSaving ? "儲存中..." : "儲存勾選"}
        </Button>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {events.map((event) => {
          const checked = enabledEvents.includes(event.id);

          return (
            <label
              key={event.id}
              className="flex cursor-pointer gap-3 rounded-2xl border border-border bg-slate-50 p-4 transition hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_14px_32px_rgba(15,23,42,0.08)]"
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => onToggle(event.id)}
                className="mt-1 size-4 accent-[var(--primary)]"
              />
              <span>
                <span className="flex items-center gap-2 font-bold text-foreground">
                  {event.title}
                  {checked ? (
                    <CheckCircle2 className="size-4 text-success" aria-hidden="true" />
                  ) : null}
                </span>
                <span className="mt-1 block text-sm leading-6 text-muted-foreground">
                  {event.description}
                </span>
              </span>
            </label>
          );
        })}
      </div>
    </section>
  );
}
