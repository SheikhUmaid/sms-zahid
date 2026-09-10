import { NextRequest, NextResponse } from "next/server";
import { getAllStudents, createStudent } from "@/lib/storage";
import { validateStudentInput } from "@/lib/validation";
import { StudentInput } from "@/types/student";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("q")?.toLowerCase().trim() || "";
    const department = searchParams.get("department") || "";
    const semester = searchParams.get("semester") || "";

    let students = await getAllStudents();

    if (search) {
      students = students.filter(
        (s) =>
          s.name.toLowerCase().includes(search) ||
          s.usn.toLowerCase().includes(search) ||
          s.email.toLowerCase().includes(search)
      );
    }

    if (department && department !== "all") {
      students = students.filter((s) => s.department === department);
    }

    if (semester && semester !== "all") {
      students = students.filter((s) => s.semester === Number(semester));
    }

    return NextResponse.json({
      success: true,
      data: students,
    });
  } catch (error) {
    console.error("GET /api/students error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch student records." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: StudentInput = await request.json();
    const existingStudents = await getAllStudents();
    const validationErrors = validateStudentInput(body, existingStudents);

    if (validationErrors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed.",
          errors: validationErrors,
        },
        { status: 400 }
      );
    }

    const newStudent = await createStudent(body);
    return NextResponse.json(
      {
        success: true,
        data: newStudent,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/students error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create student record." },
      { status: 500 }
    );
  }
}
