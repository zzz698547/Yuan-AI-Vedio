"use client";

import { ChevronDown, Plus, RotateCcw, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import type { TenantPlan, TenantStatus } from "@/types/tenant-management";

export type TenantStatusFilter = TenantStatus | "全部狀態";
export type TenantPlanFilter = TenantPlan | "全部方案";

const statusOptions: TenantStatusFilter[] = [
  "全部狀態",
  "啟用中",
  "即將到期",
  "已停權",
];

const planOptions: TenantPlanFilter[] = [
  "全部方案",
  "企業旗艦版",
  "專業版",
  "創作者版",
];

function FilterDropdown<T extends string>({
  label,
  value,
  options,
  onSelect,
}: {
  label: string;
  value: T;
  options: T[];
  onSelect: (value: T) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="outline"
            className="h-11 justify-between rounded-[14px] border-border bg-white px-4 text-muted-foreground"
          />
        }
      >
        {value === options[0] ? label : value}
        <ChevronDown data-icon="inline-end" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" sideOffset={8} className="w-44">
        <DropdownMenuGroup>
          {options.map((option) => (
            <DropdownMenuItem key={option} onClick={() => onSelect(option)}>
              {option}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

type TenantManagementToolbarProps = {
  query: string;
  statusFilter: TenantStatusFilter;
  planFilter: TenantPlanFilter;
  onQueryChange: (value: string) => void;
  onStatusChange: (value: TenantStatusFilter) => void;
  onPlanChange: (value: TenantPlanFilter) => void;
  onRestore: () => void;
  onAddTenant: () => void;
};

export function TenantManagementToolbar({
  query,
  statusFilter,
  planFilter,
  onQueryChange,
  onStatusChange,
  onPlanChange,
  onRestore,
  onAddTenant,
}: TenantManagementToolbarProps) {
  return (
    <section className="dashboard-card flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <label className="relative w-full lg:max-w-md">
        <span className="sr-only">搜尋租戶</span>
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="搜尋租戶"
          className="h-11 rounded-[14px] border-border bg-white pl-10"
        />
      </label>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:justify-end">
        <FilterDropdown
          label="狀態篩選"
          value={statusFilter}
          options={statusOptions}
          onSelect={onStatusChange}
        />
        <FilterDropdown
          label="方案篩選"
          value={planFilter}
          options={planOptions}
          onSelect={onPlanChange}
        />
        <Button variant="outline" className="h-11 rounded-[14px]" onClick={onRestore}>
          <RotateCcw data-icon="inline-start" />
          初始化資料
        </Button>
        <Button className="h-11 rounded-[14px] px-4" onClick={onAddTenant}>
          <Plus data-icon="inline-start" />
          新增租戶
        </Button>
      </div>
    </section>
  );
}
