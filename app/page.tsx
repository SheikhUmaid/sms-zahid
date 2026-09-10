"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Student, DEPARTMENTS } from "@/types/student";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Badge } from "@/components/ui/Badge";
import {
  Users,
  GraduationCap,
  Building2,
  UserPlus,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

export default function DashboardPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);
        const res = await fetch("/api/students");
        const json = await res.json();
        if (json.success) {
          setStudents(json.data);
        } else {
          setError(json.error || "Failed to load dashboard data.");
        }
      } catch {
        setError("Error connecting to server.");
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, []);

  if (loading) {
    return <LoadingSpinner label="Loading dashboard summary..." />;
  }

  if (error) {
    return (
      <div className="p-8 text-center rounded-2xl bg-red-50 border border-red-200 text-red-700">
        <p className="font-semibold">{error}</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </div>
    );
  }

  const totalStudents = students.length;
  const activeDepartmentsCount = new Set(students.map((s) => s.department)).size;
  const highestSem = students.reduce(
    (max, s) => (s.semester > max ? s.semester : max),
    0
  );

  // Group by department
  const deptCounts: Record<string, number> = {};
  students.forEach((s) => {
    deptCounts[s.department] = (deptCounts[s.department] || 0) + 1;
  });

  const recentStudents = students.slice(0, 5);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Overview of student enrollment, department metrics, and recent registrations."
        action={
          <Link href="/students/add">
            <Button>
              <UserPlus className="w-4 h-4" />
              Register Student
            </Button>
          </Link>
        }
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Students
            </p>
            <h3 className="text-2xl font-bold text-slate-900 mt-0.5">
              {totalStudents}
            </h3>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Active Departments
            </p>
            <h3 className="text-2xl font-bold text-slate-900 mt-0.5">
              {activeDepartmentsCount} / {DEPARTMENTS.length}
            </h3>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Highest Semester
            </p>
            <h3 className="text-2xl font-bold text-slate-900 mt-0.5">
              {highestSem > 0 ? `Semester ${highestSem}` : "N/A"}
            </h3>
          </div>
        </div>
      </div>

      {/* Main Grid: Department Breakdown & Recent Additions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Department Breakdown */}
        <div className="lg:col-span-1 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <h3 className="text-base font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              Department Breakdown
            </h3>
            <div className="space-y-3">
              {DEPARTMENTS.map((dept) => {
                const count = deptCounts[dept] || 0;
                const percentage =
                  totalStudents > 0 ? Math.round((count / totalStudents) * 100) : 0;
                return (
                  <div key={dept} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-slate-700 truncate max-w-[200px]" title={dept}>
                        {dept}
                      </span>
                      <span className="text-slate-500 font-semibold">{count}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-indigo-600 transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent Registrations */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-semibold text-slate-900">
                Recent Student Additions
              </h3>
              <Link
                href="/students"
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                View All
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {recentStudents.length === 0 ? (
              <p className="text-sm text-slate-500 py-6 text-center">
                No student records registered yet.
              </p>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentStudents.map((student) => (
                  <div
                    key={student.id}
                    className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 p-2 rounded-xl transition-colors"
                  >
                    <div>
                      <Link
                        href={`/students/${student.id}`}
                        className="font-semibold text-slate-900 text-sm hover:text-indigo-600 transition-colors"
                      >
                        {student.name}
                      </Link>
                      <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                        <span className="font-mono">{student.usn}</span>
                        <span>•</span>
                        <span>{student.department}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant="indigo">Sem {student.semester}</Badge>
                      <Link href={`/students/${student.id}`}>
                        <Button size="sm" variant="ghost">
                          View
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

