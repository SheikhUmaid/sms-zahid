"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { StudentInput, ValidationError, DEPARTMENTS, SEMESTERS } from "@/types/student";
import { validateStudentInput } from "@/lib/validation";
import { User, IdCard, Mail, Phone } from "lucide-react";

interface StudentFormProps {
  initialValues?: StudentInput;
  onSubmit: (data: StudentInput) => Promise<void>;
  submitLabel?: string;
  isEditing?: boolean;
  studentId?: string;
}

interface ApiFormError {
  message?: string;
  errors?: ValidationError[];
}

export const StudentForm: React.FC<StudentFormProps> = ({
  initialValues = {
    name: "",
    usn: "",
    department: "",
    semester: 1,
    email: "",
    phone: "",
  },
  onSubmit,
  submitLabel = "Save Student",
}) => {
  const router = useRouter();
  const [formData, setFormData] = useState<StudentInput>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const departmentOptions = DEPARTMENTS.map((dept) => ({
    value: dept,
    label: dept,
  }));

  const semesterOptions = SEMESTERS.map((sem) => ({
    value: sem,
    label: `Semester ${sem}`,
  }));

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "semester" ? Number(value) : value,
    }));

    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors: ValidationError[] = validateStudentInput(formData);
    if (validationErrors.length > 0) {
      const errMap: Record<string, string> = {};
      validationErrors.forEach((err) => {
        errMap[err.field] = err.message;
      });
      setErrors(errMap);
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(formData);
    } catch (err: unknown) {
      const formErr = err as ApiFormError;
      if (formErr?.errors) {
        const errMap: Record<string, string> = {};
        formErr.errors.forEach((e: ValidationError) => {
          errMap[e.field] = e.message;
        });
        setErrors(errMap);
      } else {
        setErrors({ general: formErr.message || "An unexpected error occurred." });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs">
      {errors.general && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
          {errors.general}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Input
          label="Student Name"
          name="name"
          placeholder="e.g. Aaditya Sharma"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          icon={<User className="w-4 h-4" />}
          required
        />

        <Input
          label="USN (University Seat No.)"
          name="usn"
          placeholder="e.g. 1MS23CS001"
          value={formData.usn}
          onChange={handleChange}
          error={errors.usn}
          icon={<IdCard className="w-4 h-4" />}
          required
        />

        <Select
          label="Department"
          name="department"
          options={departmentOptions}
          value={formData.department}
          onChange={handleChange}
          error={errors.department}
          placeholder="Select Department"
          required
        />

        <Select
          label="Semester"
          name="semester"
          options={semesterOptions}
          value={formData.semester}
          onChange={handleChange}
          error={errors.semester}
          placeholder="Select Semester"
          required
        />

        <Input
          label="Email Address"
          name="email"
          type="email"
          placeholder="e.g. student@example.com"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          icon={<Mail className="w-4 h-4" />}
          required
        />

        <Input
          label="Phone Number"
          name="phone"
          type="tel"
          placeholder="e.g. +91 9876543210"
          value={formData.phone}
          onChange={handleChange}
          error={errors.phone}
          icon={<Phone className="w-4 h-4" />}
          required
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};
