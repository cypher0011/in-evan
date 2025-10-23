"use client";

import type { CSSProperties } from "react";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import HotGrid from "@/components/minibar/HotGrid";
import MiniBarManager from "@/components/minibar/Manager";

export default function MiniBarPage() {
  
  const vars = {
  "--sidebar-width": "calc(var(--spacing) * 72)",
  "--header-height": "calc(var(--spacing) * 12)",
} as React.CSSProperties;


  return (
    <SidebarProvider style={vars}>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />

        {}
        <main className="flex-1 p-4 md:p-6 space-y-6">
          {}
          <HotGrid />

          {}
          <MiniBarManager />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
