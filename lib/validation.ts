import { StudentInput, ValidationError, DEPARTMENTS } from "@/types/student";

export function validateStudentInput(
  data: Partial<StudentInput>,
  existingStudents?: { usn: string; id?: string }[],
  currentStudentId?: string
): ValidationError[] {
  const errors: ValidationError[] = [];

  // Name validation
  if (!data.name || typeof data.name !== "string" || !data.name.trim()) {
    errors.push({ field: "name", message: "Student name is required." });
  } else if (data.name.trim().length < 2) {
    errors.push({
      field: "name",
      message: "Student name must be at least 2 characters.",
    });
  }

  // USN validation
  if (!data.usn || typeof data.usn !== "string" || !data.usn.trim()) {
    errors.push({ field: "usn", message: "USN is required." });
  } else {
    const cleanUsn = data.usn.trim().toUpperCase();
    const usnRegex = /^[A-Z0-9]{4,15}$/;
    if (!usnRegex.test(cleanUsn)) {
      errors.push({
        field: "usn",
        message: "USN must be 4 to 15 alphanumeric characters.",
      });
    } else if (existingStudents) {
      const isDuplicate = existingStudents.some(
        (s) => s.usn.toUpperCase() === cleanUsn && s.id !== currentStudentId
      );
      if (isDuplicate) {
        errors.push({
          field: "usn",
          message: "A student with this USN already exists.",
        });
      }
    }
  }

  // Department validation
  if (!data.department || !data.department.trim()) {
    errors.push({ field: "department", message: "Department is required." });
  } else if (!DEPARTMENTS.includes(data.department as (typeof DEPARTMENTS)[number])) {
    errors.push({ field: "department", message: "Invalid department selected." });
  }

  // Semester validation
  const semNum = Number(data.semester);
  if (!data.semester || isNaN(semNum)) {
    errors.push({ field: "semester", message: "Semester is required." });
  } else if (semNum < 1 || semNum > 8 || !Number.isInteger(semNum)) {
    errors.push({
      field: "semester",
      message: "Semester must be an integer between 1 and 8.",
    });
  }

  // Email validation
  if (!data.email || typeof data.email !== "string" || !data.email.trim()) {
    errors.push({ field: "email", message: "Email address is required." });
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email.trim())) {
      errors.push({
        field: "email",
        message: "Please enter a valid email address.",
      });
    }
  }

  // Phone validation
  if (!data.phone || typeof data.phone !== "string" || !data.phone.trim()) {
    errors.push({ field: "phone", message: "Phone number is required." });
  } else {
    const cleanPhone = data.phone.replace(/[\s\-\(\)\+]/g, "");
    const phoneRegex = /^\d{10,15}$/;
    if (!phoneRegex.test(cleanPhone)) {
      errors.push({
        field: "phone",
        message: "Phone number must contain 10 to 15 digits.",
      });
    }
  }

  return errors;
}

