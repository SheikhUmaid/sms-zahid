"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { StudentForm } from "@/components/students/StudentForm";
import { StudentInput } from "@/types/student";
import { useToast } from "@/components/ui/ToastContext";

export default function AddStudentPage() {
  const router = useRouter();
  const { showToast } = useToast();

  const handleSubmit = async (formData: StudentInput) => {
    const res = await fetch("/api/students", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const json = await res.json();

    if (!res.ok || !json.success) {
      throw json;
    }

    showToast(`Student "${json.data.name}" registered successfully!`, "success");
    router.push("/students");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Register New Student"
        description="Enter student personal and academic details to create a new record."
      />
      <StudentForm onSubmit={handleSubmit} submitLabel="Register Student" />
    </div>
  );
}

