"use client";

import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { TenantPlan } from "@/types/tenant-management";

export type TenantCreatePayload = {
  name: string;
  contact: string;
  username: string;
  password: string;
  nickname: string;
  plan: TenantPlan;
};

type TenantCreateModalProps = {
  open: boolean;
  existingUsernames: string[];
  onClose: () => void;
  onCreate: (payload: TenantCreatePayload) => void;
};

const planOptions: TenantPlan[] = ["創作者版", "專業版", "企業旗艦版"];

export function TenantCreateModal({
  open,
  existingUsernames,
  onClose,
  onCreate,
}: TenantCreateModalProps) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [plan, setPlan] = useState<TenantPlan>("創作者版");
  const [error, setError] = useState("");

  if (!open) {
    return null;
  }

  function resetForm() {
    setName("");
    setContact("");
    setUsername("");
    setPassword("");
    setNickname("");
    setPlan("創作者版");
    setError("");
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const payload: TenantCreatePayload = {
      name: name.trim(),
      contact: contact.trim(),
      username: username.trim(),
      password,
      nickname: nickname.trim(),
      plan,
    };

    if (
      !payload.name ||
      !payload.contact ||
      !payload.username ||
      !payload.password ||
      !payload.nickname
    ) {
      setError("請完整填寫租戶名稱、聯絡人、帳號、密碼與暱稱。");
      return;
    }

    if (payload.password.length < 8) {
      setError("密碼至少需要 8 個字元。");
      return;
    }

    if (existingUsernames.includes(payload.username.toLowerCase())) {
      setError("此帳號已存在，請改用其他帳號。");
      return;
    }

    onCreate(payload);
    resetForm();
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/20 p-4 backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="dashboard-card w-full max-w-2xl">
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-foreground">新增租戶</h2>
          <p className="text-sm text-muted-foreground">
            建立租戶前，請先設定租戶登入帳號、密碼與顯示暱稱。
          </p>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-foreground">租戶名稱</span>
            <Input value={name} onChange={(event) => setName(event.target.value)} className="h-11 rounded-[14px] bg-white" />
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-foreground">聯絡人</span>
            <Input value={contact} onChange={(event) => setContact(event.target.value)} className="h-11 rounded-[14px] bg-white" />
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-foreground">租戶帳號</span>
            <Input value={username} onChange={(event) => setUsername(event.target.value)} className="h-11 rounded-[14px] bg-white" />
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-foreground">租戶密碼</span>
            <Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="h-11 rounded-[14px] bg-white" />
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-foreground">租戶暱稱</span>
            <Input value={nickname} onChange={(event) => setNickname(event.target.value)} className="h-11 rounded-[14px] bg-white" />
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-foreground">方案</span>
            <select
              value={plan}
              onChange={(event) => setPlan(event.target.value as TenantPlan)}
              className="h-11 rounded-[14px] border border-border bg-white px-3 text-sm font-medium outline-none focus:ring-3 focus:ring-ring/40"
            >
              {planOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>

        {error ? (
          <p className="mt-4 rounded-2xl border border-danger/20 bg-danger/10 px-4 py-3 text-sm font-semibold text-danger">
            {error}
          </p>
        ) : null}

        <div className="mt-6 flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={handleClose}>
            取消
          </Button>
          <Button type="submit">建立租戶</Button>
        </div>
      </form>
    </div>
  );
}
