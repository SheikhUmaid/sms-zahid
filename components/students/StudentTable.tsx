"use client";

import React from "react";
import Link from "next/link";
import { Student } from "@/types/student";
import { Badge } from "@/components/ui/Badge";
import { Eye, Edit3, Trash2, Mail, Phone } from "lucide-react";

interface StudentTableProps {
  students: Student[];
  onDeleteClick: (student: Student) => void;
}

export const StudentTable: React.FC<StudentTableProps> = ({
  students,
  onDeleteClick,
}) => {
  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <th className="py-3.5 px-4">Student Name</th>
              <th className="py-3.5 px-4">USN</th>
              <th className="py-3.5 px-4">Department</th>
              <th className="py-3.5 px-4">Semester</th>
              <th className="py-3.5 px-4">Contact Info</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
            {students.map((student) => (
              <tr
                key={student.id}
                className="hover:bg-slate-50/60 transition-colors"
              >
                <td className="py-4 px-4 font-medium text-slate-900">
                  <Link
                    href={`/students/${student.id}`}
                    className="hover:text-indigo-600 font-semibold transition-colors"
                  >
                    {student.name}
                  </Link>
                </td>
                <td className="py-4 px-4 font-mono text-xs font-semibold text-slate-600">
                  {student.usn}
                </td>
                <td className="py-4 px-4">
                  <Badge variant="indigo">{student.department}</Badge>
                </td>
                <td className="py-4 px-4">
                  <Badge variant="slate">Sem {student.semester}</Badge>
                </td>
                <td className="py-4 px-4">
                  <div className="flex flex-col text-xs text-slate-500 gap-0.5">
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      {student.email}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      {student.phone}
                    </span>
                  </div>
                </td>
                <td className="py-4 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <Link
                      href={`/students/${student.id}`}
                      className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-indigo-600 transition-colors cursor-pointer"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <Link
                      href={`/students/${student.id}/edit`}
                      className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-amber-600 transition-colors cursor-pointer"
                      title="Edit Student"
                    >
                      <Edit3 className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => onDeleteClick(student)}
                      className="rounded-lg p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                      title="Delete Student"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card Grid View */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {students.map((student) => (
          <div
            key={student.id}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <Link
                  href={`/students/${student.id}`}
                  className="font-bold text-slate-900 text-base hover:text-indigo-600 transition-colors block"
                >
                  {student.name}
                </Link>
                <span className="font-mono text-xs font-semibold text-slate-500">
                  {student.usn}
                </span>
              </div>
              <Badge variant="indigo">Sem {student.semester}</Badge>
            </div>

            <div className="space-y-1.5 text-xs text-slate-600 pt-1 border-t border-slate-100">
              <p className="font-medium text-slate-700">{student.department}</p>
              <div className="flex items-center gap-1.5 text-slate-500">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{student.email}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-500">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{student.phone}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <Link
                href={`/students/${student.id}`}
                className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-indigo-600 px-3 py-1.5 rounded-lg border border-slate-200"
              >
                <Eye className="w-3.5 h-3.5" />
                View
              </Link>
              <Link
                href={`/students/${student.id}/edit`}
                className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg border border-amber-200"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Edit
              </Link>
              <button
                onClick={() => onDeleteClick(student)}
                className="inline-flex items-center gap-1 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg border border-red-200 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

