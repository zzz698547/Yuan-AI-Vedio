import { CheckCircle2, ShieldCheck } from "lucide-react";

import { StatusBadge } from "@/components/integrations/status-badge";
import { Badge } from "@/components/ui/badge";
import {
  tenantAiBindingSteps,
  tenantAiProviderHighlights,
} from "@/data/tenant-ai-models";
import type { AiProviderBinding } from "@/types/integrations";

type TenantAiProviderHighlightsProps = {
  providers: AiProviderBinding[];
};

export function TenantAiBindingChecklist() {
  return (
    <aside className="dashboard-card xl:col-span-4">
      <div className="flex items-center gap-3">
        <div className="icon-bubble">
          <ShieldCheck aria-hidden="true" className="size-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">綁定檢查清單</h2>
          <p className="text-sm text-muted-foreground">
            建議依序完成，確保模型可穩定執行。
          </p>
        </div>
      </div>
      <div className="mt-5 flex flex-col gap-4">
        {tenantAiBindingSteps.map((step) => (
          <div key={step.title} className="flex gap-3">
            <CheckCircle2
              aria-hidden="true"
              className="mt-1 size-5 shrink-0 text-success"
            />
            <div>
              <p className="font-bold text-foreground">{step.title}</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}

export function TenantAiProviderHighlights({
  providers,
}: TenantAiProviderHighlightsProps) {
  return (
    <section className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      {tenantAiProviderHighlights.map((highlight) => {
        const provider = providers.find((item) => item.id === highlight.providerId);

        return (
          <article
            key={highlight.providerId}
            className="dashboard-card dashboard-card-hover"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-foreground">
                  {highlight.title} 使用建議
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {highlight.description}
                </p>
              </div>
              {provider ? <StatusBadge status={provider.status} /> : null}
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {highlight.useCases.map((useCase) => (
                <Badge key={useCase} variant="info" className="rounded-full">
                  {useCase}
                </Badge>
              ))}
            </div>
          </article>
        );
      })}
    </section>
  );
}
