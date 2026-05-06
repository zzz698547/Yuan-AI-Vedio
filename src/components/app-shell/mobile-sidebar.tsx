"use client";

import { Menu } from "lucide-react";

import { Sidebar } from "@/components/app-shell/sidebar";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type MobileSidebarProps = {
  mode: "admin" | "tenant";
};

export function MobileSidebar({ mode }: MobileSidebarProps) {
  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button
            variant="outline"
            size="icon-lg"
            className="border-border bg-card"
            aria-label="開啟側邊選單"
          />
        }
      >
        <Menu />
      </SheetTrigger>
      <SheetContent
        side="left"
        showCloseButton={false}
        className="w-[var(--dashboard-sidebar-width)] max-w-[var(--dashboard-sidebar-width)] p-0"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>管理選單</SheetTitle>
          <SheetDescription>開啟管理員後台導覽選單</SheetDescription>
        </SheetHeader>
        <Sidebar
          mode={mode}
          className="h-full border-r-0"
        />
      </SheetContent>
    </Sheet>
  );
}
