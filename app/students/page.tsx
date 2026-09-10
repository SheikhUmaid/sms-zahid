"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Student, DEPARTMENTS, SEMESTERS } from "@/types/student";
import { PageHeader } from "@/components/layout/PageHeader";
import { StudentTable } from "@/components/students/StudentTable";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/ToastContext";
import { Search, Filter, RotateCcw, UserPlus, Users } from "lucide-react";

export default function StudentsPage() {
  const { showToast } = useToast();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDept, setSelectedDept] = useState("");
  const [selectedSem, setSelectedSem] = useState("");

  // Delete modal state
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.set("q", searchTerm);
      if (selectedDept && selectedDept !== "all")
        params.set("department", selectedDept);
      if (selectedSem && selectedSem !== "all")
        params.set("semester", selectedSem);

      const res = await fetch(`/api/students?${params.toString()}`);
      const json = await res.json();
      if (json.success) {
        setStudents(json.data);
      } else {
        setError(json.error || "Failed to load student list.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [searchTerm, selectedDept, selectedSem]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStudents();
    }, 250);
    return () => clearTimeout(timer);
  }, [fetchStudents]);

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedDept("");
    setSelectedSem("");
  };

  const handleDeleteConfirm = async () => {
    if (!studentToDelete) return;
    try {
      setIsDeleting(true);
      const res = await fetch(`/api/students/${studentToDelete.id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        showToast(
          `Student "${studentToDelete.name}" deleted successfully.`,
          "success"
        );
        setStudentToDelete(null);
        fetchStudents();
      } else {
        showToast(json.error || "Failed to delete student.", "error");
      }
    } catch {
      showToast("Error executing delete request.", "error");
    } finally {
      setIsDeleting(false);
    }
  };

  const departmentOptions = [
    { value: "all", label: "All Departments" },
    ...DEPARTMENTS.map((d) => ({ value: d, label: d })),
  ];

  const semesterOptions = [
    { value: "all", label: "All Semesters" },
    ...SEMESTERS.map((s) => ({ value: String(s), label: `Semester ${s}` })),
  ];

  const hasActiveFilters = searchTerm !== "" || selectedDept !== "" || selectedSem !== "";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Student Records"
        description="Search, filter, view, edit, and manage all registered student records."
        action={
          <Link href="/students/add">
            <Button>
              <UserPlus className="w-4 h-4" />
              Add New Student
            </Button>
          </Link>
        }
      />

      {/* Search & Filter Toolbar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-5">
            <Input
              placeholder="Search by name, USN, or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-4 h-4" />}
            />
          </div>

          <div className="md:col-span-3">
            <Select
              options={departmentOptions}
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              placeholder="Filter by Department"
            />
          </div>

          <div className="md:col-span-2">
            <Select
              options={semesterOptions}
              value={selectedSem}
              onChange={(e) => setSelectedSem(e.target.value)}
              placeholder="Filter by Semester"
            />
          </div>

          <div className="md:col-span-2 flex items-center justify-end">
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetFilters}
                className="w-full md:w-auto"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <LoadingSpinner label="Fetching student records..." />
      ) : error ? (
        <div className="p-8 text-center rounded-2xl bg-red-50 border border-red-200 text-red-700">
          <p>{error}</p>
          <Button variant="outline" className="mt-4" onClick={fetchStudents}>
            Try Again
          </Button>
        </div>
      ) : students.length === 0 ? (
        <EmptyState
          title={hasActiveFilters ? "No matching students found" : "No students registered yet"}
          description={
            hasActiveFilters
              ? "Try adjusting your search query or clear filters to see more results."
              : "Get started by registering the first student record in the system."
          }
          icon={hasActiveFilters ? <Filter className="w-7 h-7" /> : <Users className="w-7 h-7" />}
          actionLabel={hasActiveFilters ? "Clear Search & Filters" : "Add Student"}
          onAction={
            hasActiveFilters
              ? handleResetFilters
              : () => (window.location.href = "/students/add")
          }
        />
      ) : (
        <StudentTable
          students={students}
          onDeleteClick={(student) => setStudentToDelete(student)}
        />
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={Boolean(studentToDelete)}
        onClose={() => setStudentToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Student Record"
        message={
          <>
            Are you sure you want to delete student record for{" "}
            <strong className="text-slate-900 font-semibold">
              {studentToDelete?.name} ({studentToDelete?.usn})
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

