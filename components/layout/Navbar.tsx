"use client";

import React from "react";
import Link from "next/link";
import { GraduationCap, Menu, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface NavbarProps {
  onMobileMenuToggle: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onMobileMenuToggle }) => {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/80 px-4 sm:px-6 backdrop-blur-md">
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileMenuToggle}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden cursor-pointer"
          aria-label="Open mobile menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-white font-bold shadow-xs transition-transform group-hover:scale-105">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-slate-900 text-base leading-tight block">
              EduTrack
            </span>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-indigo-600 block">
              Student Management
            </span>
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <Link href="/students/add">
          <Button size="sm" className="hidden sm:inline-flex">
            <Plus className="w-4 h-4" />
            Add Student
          </Button>
        </Link>
      </div>
    </header>
  );
};

