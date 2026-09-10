"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Student, StudentInput } from "@/types/student";
import { PageHeader } from "@/components/layout/PageHeader";
import { StudentForm } from "@/components/students/StudentForm";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";
import { Button } from "@/components/ui/Button";
import { useToast } from "@/components/ui/ToastContext";
import { ArrowLeft } from "lucide-react";

export default function EditStudentPage({
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

  useEffect(() => {
    async function fetchStudent() {
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
    fetchStudent();
  }, [studentId]);

  const handleSubmit = async (formData: StudentInput) => {
    const res = await fetch(`/api/students/${studentId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const json = await res.json();

    if (!res.ok || !json.success) {
      throw json;
    }

    showToast(`Student record for "${json.data.name}" updated successfully!`, "success");
    router.push(`/students/${studentId}`);
  };

  if (loading) {
    return <LoadingSpinner label="Loading student record for editing..." />;
  }

  if (error || !student) {
    return (
      <div className="space-y-6">
        <PageHeader title="Edit Student Record" />
        <div className="p-8 text-center rounded-2xl bg-white border border-slate-200 shadow-xs max-w-md mx-auto space-y-4">
          <p className="text-sm text-slate-500">{error || "Student record not found."}</p>
          <Link href="/students">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4" />
              Back to Students List
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const initialFormValues: StudentInput = {
    name: student.name,
    usn: student.usn,
    department: student.department,
    semester: student.semester,
    email: student.email,
    phone: student.phone,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link
          href={`/students/${studentId}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Cancel and Back
        </Link>
      </div>

      <PageHeader
        title={`Edit Student — ${student.name}`}
        description="Update student information and save changes to the record."
      />

      <StudentForm
        initialValues={initialFormValues}
        onSubmit={handleSubmit}
        submitLabel="Save Changes"
        isEditing
        studentId={studentId}
      />
    </div>
  );
}

