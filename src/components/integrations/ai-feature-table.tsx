"use client";

import { useState } from "react";
import { Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ModelFeatureBinding } from "@/types/integrations";

type AiFeatureTableProps = {
  features: ModelFeatureBinding[];
  savingFeature: string;
  onSave: (feature: ModelFeatureBinding) => void;
};

export function AiFeatureTable({
  features,
  savingFeature,
  onSave,
}: AiFeatureTableProps) {
  return (
    <section className="dashboard-card overflow-hidden">
      <div className="mb-5">
        <h2 className="text-lg font-bold tracking-tight text-foreground">
          模型用途設定
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          可調整每個 AI 功能使用的主要模型、備援模型、預估成本與狀態。
        </p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-white">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>功能</TableHead>
              <TableHead>目前模型</TableHead>
              <TableHead>備援模型</TableHead>
              <TableHead>預估成本</TableHead>
              <TableHead>狀態</TableHead>
              <TableHead>操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {features.map((feature) => (
              <EditableFeatureRow
                key={feature.feature}
                feature={feature}
                isSaving={savingFeature === feature.feature}
                onSave={onSave}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
}

function EditableFeatureRow({
  feature,
  isSaving,
  onSave,
}: {
  feature: ModelFeatureBinding;
  isSaving: boolean;
  onSave: (feature: ModelFeatureBinding) => void;
}) {
  const [draft, setDraft] = useState(feature);

  return (
    <TableRow>
      <TableCell className="min-w-36 font-semibold text-foreground">
        {feature.feature}
      </TableCell>
      <TableCell className="min-w-52">
        <Input
          value={draft.currentModel}
          onChange={(event) =>
            setDraft({ ...draft, currentModel: event.target.value })
          }
          className="h-9 rounded-xl"
        />
      </TableCell>
      <TableCell className="min-w-52">
        <Input
          value={draft.fallbackModel}
          onChange={(event) =>
            setDraft({ ...draft, fallbackModel: event.target.value })
          }
          className="h-9 rounded-xl"
        />
      </TableCell>
      <TableCell className="min-w-32">
        <Input
          value={draft.estimatedCost}
          onChange={(event) =>
            setDraft({ ...draft, estimatedCost: event.target.value })
          }
          className="h-9 rounded-xl font-mono"
        />
      </TableCell>
      <TableCell className="min-w-32">
        <select
          value={draft.status}
          onChange={(event) =>
            setDraft({
              ...draft,
              status: event.target.value as ModelFeatureBinding["status"],
            })
          }
          className="h-9 rounded-xl border border-border bg-white px-3 text-sm font-semibold text-foreground"
        >
          <option value="啟用中">啟用中</option>
          <option value="測試中">測試中</option>
          <option value="待設定">待設定</option>
        </select>
      </TableCell>
      <TableCell>
        <Button
          type="button"
          variant="outline"
          disabled={isSaving}
          onClick={() => onSave(draft)}
          className="rounded-xl"
        >
          <Save data-icon="inline-start" />
          {isSaving ? "儲存中" : "套用"}
        </Button>
      </TableCell>
    </TableRow>
  );
}
