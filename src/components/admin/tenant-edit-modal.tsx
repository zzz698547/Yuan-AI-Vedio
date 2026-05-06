"use client";

import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { TenantRecord } from "@/types/tenant-management";

type TenantEditModalProps = {
  tenant: TenantRecord | null;
  onClose: () => void;
  onSave: (tenant: TenantRecord, name: string, contact: string) => void;
};

export function TenantEditModal({
  tenant,
  onClose,
  onSave,
}: TenantEditModalProps) {
  if (!tenant) {
    return null;
  }

  return (
    <TenantEditForm
      key={tenant.id}
      tenant={tenant}
      onClose={onClose}
      onSave={onSave}
    />
  );
}

function TenantEditForm({ tenant, onClose, onSave }: {
  tenant: TenantRecord;
  onClose: () => void;
  onSave: (tenant: TenantRecord, name: string, contact: string) => void;
}) {
  const [name, setName] = useState(tenant.name);
  const [contact, setContact] = useState(tenant.contact);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim() || !contact.trim()) {
      return;
    }

    onSave(tenant, name.trim(), contact.trim());
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/20 p-4 backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="dashboard-card w-full max-w-lg">
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-foreground">編輯租戶</h2>
          <p className="text-sm text-muted-foreground">
            修改租戶名稱與聯絡人，資料會更新在目前 mock state。
          </p>
        </div>

        <div className="mt-5 grid gap-4">
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-foreground">
              租戶名稱
            </span>
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="h-11 rounded-[14px] bg-white"
              placeholder="請輸入租戶名稱"
            />
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-foreground">
              聯絡人
            </span>
            <Input
              value={contact}
              onChange={(event) => setContact(event.target.value)}
              className="h-11 rounded-[14px] bg-white"
              placeholder="請輸入聯絡人"
            />
          </label>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onClose}>
            取消
          </Button>
          <Button type="submit">儲存變更</Button>
        </div>
      </form>
    </div>
  );
}
