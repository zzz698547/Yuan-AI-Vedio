import type { ComponentType, SVGProps } from "react";

type SectionTitleProps = {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  description?: string;
};

export function SectionTitle({
  icon: Icon,
  title,
  description,
}: SectionTitleProps) {
  return (
    <div className="flex min-w-0 items-start gap-3">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-[#EAF3FF] text-[var(--primary)]">
        <Icon aria-hidden="true" className="size-5" />
      </div>
      <div className="min-w-0">
        <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
        {description ? (
          <p className="mt-1 text-sm leading-6 text-slate-500">
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
}
