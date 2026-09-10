export interface Student {
  id: string;
  name: string;
  usn: string;
  department: string;
  semester: number;
  email: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
}

export type StudentInput = Omit<Student, "id" | "createdAt" | "updatedAt">;

export interface ValidationError {
  field: keyof StudentInput;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: ValidationError[];
}

export const DEPARTMENTS = [
  "Computer Science & Engineering",
  "Information Science & Engineering",
  "Electronics & Communication",
  "Electrical & Electronics",
  "Mechanical Engineering",
  "Civil Engineering",
  "Artificial Intelligence & Data Science",
] as const;

export const SEMESTERS = [1, 2, 3, 4, 5, 6, 7, 8] as const;

