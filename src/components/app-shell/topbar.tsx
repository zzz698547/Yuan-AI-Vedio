"use client";

import {
  Bell,
  CalendarDays,
  ChevronDown,
  DatabaseZap,
  Download,
  LogOut,
  RefreshCw,
  Search,
  Settings,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { MobileSidebar } from "@/components/app-shell/mobile-sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { invalidateApiCache } from "@/lib/api-cache";
import { clearMockSession } from "@/lib/mock-auth";
import { cn } from "@/lib/utils";

type TopbarProps = {
  mode?: "admin" | "tenant";
  className?: string;
};

export function Topbar({ mode = "admin", className }: TopbarProps) {
  const router = useRouter();
  const dashboardHref = mode === "admin" ? "/admin/dashboard" : "/tenant/dashboard";
  const settingsHref = mode === "admin" ? "/admin/settings" : "/tenant/settings";
  const userRole = mode === "admin" ? "超級管理員" : "創意團隊";

  function handleLogout() {
    clearMockSession();
    router.push("/login");
  }

  async function handleInitializeData() {
    await fetch("/api/bootstrap", {
      method: "POST",
    });
    invalidateApiCache();
    router.refresh();

    if (typeof window !== "undefined") {
      window.location.reload();
    }
  }

  function handleClearCache() {
    invalidateApiCache();
    router.refresh();
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-40 flex h-[72px] items-center gap-3 border-b border-border bg-white/90 px-4 shadow-[0_10px_30px_rgba(15,23,42,0.04)] backdrop-blur-xl supports-[backdrop-filter]:bg-white/80 lg:px-8",
        className
      )}
    >
      <div className="lg:hidden">
        <MobileSidebar mode={mode} />
      </div>

      <div className="min-w-0 flex-1" />

      <label className="relative hidden w-[280px] xl:block">
        <span className="sr-only">搜尋內容</span>
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          placeholder="搜尋內容..."
          className="h-11 rounded-[14px] border-border bg-white pl-10 text-sm shadow-none"
        />
      </label>

      <Button
        variant="outline"
        className="hidden h-11 rounded-[14px] border-border bg-white px-3 text-muted-foreground xl:inline-flex"
      >
        <CalendarDays data-icon="inline-start" />
        2026/05/01 - 2026/05/31
      </Button>

      <Button className="hidden h-11 rounded-[14px] bg-primary px-4 text-primary-foreground hover:bg-primary/90 sm:inline-flex">
        <Download data-icon="inline-start" />
        匯出報表
      </Button>

      <Button
        variant="outline"
        size="icon-lg"
        className="relative size-11 rounded-[14px] border-border bg-white"
        aria-label="查看通知"
      >
        <Bell />
        <span className="absolute -right-1 -top-1 flex min-w-5 items-center justify-center rounded-full bg-danger px-1.5 text-[11px] font-bold leading-5 text-white ring-2 ring-white">
          3
        </span>
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <button
              type="button"
              className="flex h-11 items-center gap-3 rounded-[14px] px-2 text-left transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/40"
              aria-label="開啟使用者選單"
            >
              <Avatar size="lg" className="size-10">
                <AvatarFallback className="bg-[#EAF3FF] text-sm font-bold text-primary">
                  AD
                </AvatarFallback>
              </Avatar>
              <span className="hidden min-w-0 flex-col leading-tight md:flex">
                <span className="text-sm font-semibold text-foreground">
                  Admin
                </span>
                <span className="text-xs font-medium text-muted-foreground">
                  {userRole}
                </span>
              </span>
              <ChevronDown
                aria-hidden="true"
                className="hidden size-4 text-muted-foreground md:block"
              />
            </button>
          }
        />
        <DropdownMenuContent align="end" sideOffset={8} className="w-52">
          <div className="px-1.5 py-1 text-xs font-medium text-muted-foreground">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-semibold text-foreground">
                Admin
              </span>
              <span className="text-xs text-muted-foreground">{userRole}</span>
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              render={
                <Link href={dashboardHref} className="w-full" />
              }
            >
              <UserRound />
              回到儀表板
            </DropdownMenuItem>
            <DropdownMenuItem
              render={
                <Link href={settingsHref} className="w-full" />
              }
            >
              <Settings />
              帳號設定
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={handleInitializeData}>
              <DatabaseZap />
              初始化全站資料
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleClearCache}>
              <RefreshCw />
              清除全站快取
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={handleLogout}>
            <LogOut />
            登出
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
