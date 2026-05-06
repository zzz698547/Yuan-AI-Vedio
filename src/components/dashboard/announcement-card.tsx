import { Megaphone } from "lucide-react";

import { announcements } from "@/data/mock-admin";

export function AnnouncementCard() {
  return (
    <section className="dashboard-card">
      <h2 className="mb-5 text-lg font-bold tracking-tight text-foreground">
        系統公告
      </h2>

      <div className="flex flex-col gap-3">
        {announcements.map((announcement) => (
          <article
            key={announcement.title}
            className="flex gap-3 rounded-2xl border border-border bg-white p-4"
          >
            <div className="icon-bubble shrink-0">
              <Megaphone aria-hidden="true" className="size-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-sm font-bold text-foreground">
                  {announcement.title}
                </h3>
                <time className="text-xs font-medium text-muted-foreground">
                  {announcement.date}
                </time>
              </div>
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
                {announcement.content}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
