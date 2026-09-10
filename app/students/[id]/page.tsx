"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Student } from "@/types/student";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/ToastContext";
import {
  User,
  IdCard,
  Building2,
  GraduationCap,
  Mail,
  Phone,
  Calendar,
  ArrowLeft,
  Edit3,
  Trash2,
} from "lucide-react";

export default function StudentDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const studentId = resolvedParams.id;
  const router = useRouter();
  const { showToast } = useToast();

  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function fetchStudentDetails() {
      try {
        setLoading(true);
        const res = await fetch(`/api/students/${studentId}`);
        const json = await res.json();

        if (json.success) {
          setStudent(json.data);
        } else {
          setError(json.error || "Student record not found.");
        }
      } catch {
        setError("Error connecting to server.");
      } finally {
        setLoading(false);
      }
    }
    fetchStudentDetails();
  }, [studentId]);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const res = await fetch(`/api/students/${studentId}`, {
        method: "DELETE",
      });
      const json = await res.json();

      if (json.success) {
        showToast(`Student record deleted successfully.`, "success");
        router.push("/students");
      } else {
        showToast(json.error || "Failed to delete student.", "error");
      }
    } catch {
      showToast("Error deleting student record.", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading student details..." />;
  }

  if (error || !student) {
    return (
      <div className="space-y-6">
        <PageHeader title="Student Details" />
        <div className="p-8 text-center rounded-2xl bg-white border border-slate-200 shadow-xs max-w-md mx-auto space-y-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600 mx-auto">
            <User className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900">
            Student Not Found
          </h3>
          <p className="text-sm text-slate-500">
            {error || "The student record you requested does not exist or has been removed."}
          </p>
          <div className="pt-2">
            <Link href="/students">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4" />
                Back to Students List
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const createdDate = new Date(student.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Link
          href="/students"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Students
        </Link>
        <div className="flex items-center gap-3">
          <Link href={`/students/${student.id}/edit`}>
            <Button variant="outline" size="sm">
              <Edit3 className="w-4 h-4" />
              Edit Profile
            </Button>
          </Link>
          <Button
            variant="danger"
            size="sm"
            onClick={() => setIsDeleteOpen(true)}
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-8 max-w-3xl">
        {/* Header Profile Info */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 text-white font-bold text-xl shadow-xs">
              {student.name.substring(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                {student.name}
              </h2>
              <p className="font-mono text-sm font-semibold text-indigo-600 mt-0.5">
                {student.usn}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Badge variant="indigo" size="md">
              {student.department}
            </Badge>
            <Badge variant="slate" size="md">
              Semester {student.semester}
            </Badge>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
            <User className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Full Name
              </p>
              <p className="text-sm font-semibold text-slate-900 mt-1">
                {student.name}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
            <IdCard className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                USN Number
              </p>
              <p className="text-sm font-semibold text-slate-900 font-mono mt-1">
                {student.usn}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
            <Building2 className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Department
              </p>
              <p className="text-sm font-semibold text-slate-900 mt-1">
                {student.department}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
            <GraduationCap className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Current Semester
              </p>
              <p className="text-sm font-semibold text-slate-900 mt-1">
                Semester {student.semester}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
            <Mail className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Email Address
              </p>
              <a
                href={`mailto:${student.email}`}
                className="text-sm font-semibold text-indigo-600 hover:underline mt-1 block"
              >
                {student.email}
              </a>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
            <Phone className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Phone Number
              </p>
              <a
                href={`tel:${student.phone}`}
                className="text-sm font-semibold text-indigo-600 hover:underline mt-1 block"
              >
                {student.phone}
              </a>
            </div>
          </div>
        </div>

        {/* Footer Meta */}
        <div className="flex items-center gap-2 text-xs text-slate-400 pt-4 border-t border-slate-100">
          <Calendar className="w-4 h-4" />
          <span>Record registered on {createdDate}</span>
        </div>
      </div>

      {/* Delete confirmation modal */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Student Record"
        message={
          <>
            Are you sure you want to delete student record for{" "}
            <strong className="text-slate-900 font-semibold">
              {student.name} ({student.usn})
            </strong>
            ? This action cannot be undone.
          </>
        }
        confirmText="Delete Record"
        isLoading={isDeleting}
      />
    </div>
  );
}

