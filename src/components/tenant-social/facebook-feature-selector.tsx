"use client";

import { Badge } from "@/components/ui/badge";
import type { FacebookLoginFeature } from "@/types/facebook-sdk";

type FacebookFeatureSelectorProps = {
  advancedScopesEnabled: boolean;
  disabled?: boolean;
  features: FacebookLoginFeature[];
  onToggle: (featureId: string) => void;
  selectedFeatureIds: string[];
};

export function FacebookFeatureSelector({
  advancedScopesEnabled,
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
          預設只請求基本登入權限；粉專發布與成效權限需通過 Meta App Review 後才會開放。
        </p>
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        {features.map((feature) => {
          const checked = selectedFeatureIds.includes(feature.id);
          const isReviewLocked =
            Boolean(feature.requiresAppReview) && !advancedScopesEnabled;
          const isDisabled = disabled || isReviewLocked;

          return (
            <label
              key={feature.id}
              className="flex min-w-0 cursor-pointer items-start gap-3 rounded-2xl border border-border bg-white p-3 transition hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(15,23,42,0.07)] has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-70"
            >
              <input
                type="checkbox"
                checked={checked}
                disabled={isDisabled}
                onChange={() => onToggle(feature.id)}
                className="mt-1 size-4 shrink-0 accent-[var(--primary)]"
              />
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold text-foreground">
                  {feature.label}
                  {isReviewLocked ? (
                    <span className="ml-2 text-xs font-semibold text-warning">
                      需 Meta 審核
                    </span>
                  ) : null}
                </span>
                <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                  {feature.description}
                </span>
                <span className="mt-2 flex flex-wrap gap-1.5">
                  {feature.scopes.map((scope) => (
                    <Badge
                      key={scope}
                      variant="info"
                      className="h-auto max-w-full shrink break-all px-2 py-1 text-left font-mono leading-4 whitespace-normal"
                    >
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
