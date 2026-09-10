import { NextRequest, NextResponse } from "next/server";
import {
  getStudentById,
  updateStudent,
  deleteStudent,
  getAllStudents,
} from "@/lib/storage";
import { validateStudentInput } from "@/lib/validation";
import { StudentInput } from "@/types/student";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const student = await getStudentById(id);

    if (!student) {
      return NextResponse.json(
        { success: false, error: "Student record not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: student,
    });
  } catch (error) {
    console.error("GET /api/students/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch student record." },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const existing = await getStudentById(id);

    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Student record not found." },
        { status: 404 }
      );
    }

    const body: StudentInput = await request.json();
    const allStudents = await getAllStudents();
    const validationErrors = validateStudentInput(body, allStudents, id);

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

    const updated = await updateStudent(id, body);
    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    console.error("PUT /api/students/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update student record." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const deleted = await deleteStudent(id);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: "Student record not found or already deleted." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Student record deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE /api/students/[id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete student record." },
      { status: 500 }
    );
  }
}
