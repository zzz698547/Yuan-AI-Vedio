import { Inbox } from "lucide-react";

type EmptyStateProps = {
  title: string;
  description: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="flex min-h-44 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-slate-50/70 px-6 py-8 text-center">
      <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-[#EAF3FF] text-primary">
        <Inbox aria-hidden="true" className="size-5" />
      </div>
      <p className="text-sm font-bold text-foreground">{title}</p>
      <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
