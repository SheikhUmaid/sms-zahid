"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, UserPlus, X } from "lucide-react";

interface SidebarProps {
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isMobileOpen,
  onMobileClose,
}) => {
  const pathname = usePathname();

  const navigation = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "All Students", href: "/students", icon: Users },
    { name: "Register Student", href: "/students/add", icon: UserPlus },
  ];

  const sidebarContent = (
    <div className="flex h-full flex-col justify-between p-4">
      <div className="space-y-6">
        <div className="px-3 py-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Navigation
          </p>
          <nav className="mt-3 space-y-1">
            {navigation.map((item) => {
              const isActive =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onMobileClose}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-indigo-50 text-indigo-700 font-semibold"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 ${
                      isActive ? "text-indigo-600" : "text-slate-400"
                    }`}
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-4">
        <h4 className="text-xs font-semibold text-slate-800 uppercase tracking-wider">
          System Info
        </h4>
        <p className="mt-1 text-xs text-slate-500">
          Student Management System v1.0.0 — App Router & REST API
        </p>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:pt-16 border-r border-slate-200 bg-white">
        {sidebarContent}
      </aside>

      {/* Mobile drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={onMobileClose}
          />
          <div className="fixed inset-y-0 left-0 flex w-72 flex-col bg-white shadow-xl z-50">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
              <span className="font-semibold text-slate-900 text-sm">Menu</span>
              <button
                onClick={onMobileClose}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

