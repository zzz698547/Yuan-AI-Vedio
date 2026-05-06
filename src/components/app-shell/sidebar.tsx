"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  BadgeDollarSign,
  Bell,
  BrainCircuit,
  Building2,
  CalendarClock,
  ChartNoAxesCombined,
  Clapperboard,
  FileVideo,
  Flame,
  LayoutDashboard,
  LinkIcon,
  Palette,
  Play,
  RefreshCw,
  Scissors,
  ScrollText,
  SearchCheck,
  Settings,
  Share2,
  ShieldCheck,
  SlidersHorizontal,
  UsersRound,
  Video,
  WandSparkles,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { adminNavItems, tenantNavItems } from "@/config/nav";
import { cn } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = {
  Activity,
  BadgeDollarSign,
  Bell,
  BrainCircuit,
  Building2,
  CalendarClock,
  ChartNoAxesCombined,
  Clapperboard,
  FileVideo,
  Flame,
  LayoutDashboard,
  Link: LinkIcon,
  Palette,
  RefreshCw,
  Scissors,
  ScrollText,
  SearchCheck,
  Settings,
  Share2,
  ShieldCheck,
  SlidersHorizontal,
  UsersRound,
  Video,
  WandSparkles,
};

type SidebarProps = {
  mode: "admin" | "tenant";
  className?: string;
};

export function Sidebar({ mode, className }: SidebarProps) {
  const pathname = usePathname();
  const navItems = mode === "admin" ? adminNavItems : tenantNavItems;

  return (
    <aside
      className={cn(
        "flex h-screen w-[260px] flex-col border-r border-border bg-white p-5 text-sidebar-foreground shadow-[8px_0_28px_rgba(15,23,42,0.03)]",
        className
      )}
    >
      <Link href={mode === "admin" ? "/admin/dashboard" : "/tenant/dashboard"}>
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-[0_12px_24px_rgb(47_128_237_/_0.22)]">
            <Play aria-hidden="true" className="size-[18px] fill-current" />
          </div>
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-[15px] font-bold leading-5 text-foreground">
              Veltrix AI
            </span>
            <span className="text-xs font-medium text-muted-foreground">
              SaaS Dashboard
            </span>
          </div>
        </div>
      </Link>

      <nav
        className="mt-7 flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto pr-1"
        aria-label={mode === "admin" ? "管理員選單" : "租戶選單"}
      >
        {navItems.map((group) => (
          <section key={group.title} className="flex flex-col gap-2">
            <h2 className="px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              {group.title}
            </h2>
            <div className="flex flex-col gap-1">
              {group.items.map((item) => {
                const Icon = iconMap[item.iconName] ?? LayoutDashboard;
                const isActive =
                  pathname === item.href || pathname.startsWith(`${item.href}/`);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "relative flex h-10 items-center gap-3 rounded-xl px-3 text-sm font-semibold transition-all duration-200 ease-out",
                      isActive
                        ? "bg-[#EAF3FF] text-primary shadow-[0_10px_24px_rgba(47,128,237,0.12)] ring-1 ring-primary/10 before:absolute before:left-0 before:top-1/2 before:h-5 before:w-1 before:-translate-y-1/2 before:rounded-full before:bg-primary"
                        : "text-muted-foreground hover:bg-slate-50 hover:text-foreground"
                    )}
                  >
                    <Icon aria-hidden="true" className="size-[17px] shrink-0" />
                    <span className="min-w-0 flex-1 truncate">
                      {item.title}
                    </span>
                    {item.badge ? (
                      <span className="rounded-full bg-[#EAF3FF] px-2 py-0.5 text-[11px] font-semibold text-primary">
                        {item.badge}
                      </span>
                    ) : null}
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </nav>

      <div className="mt-5 rounded-[20px] border border-[#DCE8F8] bg-[#F7FBFF] p-4 soft-shadow">
        <div className="flex flex-col gap-1">
          <p className="text-xs font-medium text-muted-foreground">目前方案</p>
          <p className="text-sm font-bold text-foreground">企業旗艦版</p>
        </div>
        <div className="mt-4 flex items-center justify-between text-xs">
          <span className="text-muted-foreground">有效期限</span>
          <span className="font-semibold text-foreground">2026/12/31</span>
        </div>
        <div className="mt-4 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">使用量</span>
            <span className="font-semibold text-primary">75%</span>
          </div>
          <Progress value={75} className="[&_[data-slot=progress-track]]:h-2" />
        </div>
        <Button className="mt-4 h-9 w-full rounded-xl">升級方案</Button>
      </div>
    </aside>
  );
}
