"use client";

import { Badge } from "@/components/ui/badge";
import type { FacebookLoginFeature } from "@/types/facebook-sdk";

type FacebookFeatureSelectorProps = {
  disabled?: boolean;
  features: FacebookLoginFeature[];
  onToggle: (featureId: string) => void;
  selectedFeatureIds: string[];
};

export function FacebookFeatureSelector({
  disabled,
  features,
  onToggle,
  selectedFeatureIds,
}: FacebookFeatureSelectorProps) {
  return (
    <div className="mt-4 rounded-2xl border border-border bg-slate-50 p-4">
      <div className="flex flex-col gap-1">
        <p className="text-sm font-bold text-foreground">授權後要啟用的功能</p>
        <p className="text-xs leading-5 text-muted-foreground">
          勾選後會自動組合 Facebook Login scope，正式送審時請確認權限用途一致。
        </p>
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        {features.map((feature) => {
          const checked = selectedFeatureIds.includes(feature.id);

          return (
            <label
              key={feature.id}
              className="flex cursor-pointer gap-3 rounded-2xl border border-border bg-white p-3 transition hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(15,23,42,0.07)]"
            >
              <input
                type="checkbox"
                checked={checked}
                disabled={disabled}
                onChange={() => onToggle(feature.id)}
                className="mt-1 size-4 accent-[var(--primary)]"
              />
              <span>
                <span className="block text-sm font-bold text-foreground">
                  {feature.label}
                </span>
                <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                  {feature.description}
                </span>
                <span className="mt-2 flex flex-wrap gap-1.5">
                  {feature.scopes.map((scope) => (
                    <Badge key={scope} variant="info" className="font-mono">
                      {scope}
                    </Badge>
                  ))}
                </span>
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
