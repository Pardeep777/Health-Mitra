import React from "react";
import { Outlet } from "react-router-dom";
import { PublicNavbar } from "../components/layout/PublicNavbar";
import { PublicFooter } from "../components/layout/PublicFooter";
import { Toast } from "../components/common/Toast";
import { MobileBottomNav } from "../components/layout/MobileBottomNav";

export function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <PublicNavbar />
      <main className="flex-1 pb-16 lg:pb-0">
        <Outlet />
      </main>
      <PublicFooter />
      <MobileBottomNav />
      <Toast />
    </div>
  );
}
