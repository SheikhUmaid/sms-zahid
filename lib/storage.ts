import fs from "fs";
import path from "path";
import { Student, StudentInput } from "@/types/student";
import { dbConnect } from "./dbConnect";
import { StudentModel } from "@/models/Student";

const DATA_DIR = path.join(process.cwd(), "data");
const FILE_PATH = path.join(DATA_DIR, "students.json");

const SEED_STUDENTS: Student[] = [
  {
    id: "std-1",
    name: "Aaditya Sharma",
    usn: "1MS23CS001",
    department: "Computer Science & Engineering",
    semester: 5,
    email: "aaditya.sharma@example.com",
    phone: "+91 9876543210",
    createdAt: "2025-08-15T09:30:00.000Z",
    updatedAt: "2025-08-15T09:30:00.000Z",
  },
  {
    id: "std-2",
    name: "Ananya Rao",
    usn: "1MS23IS015",
    department: "Information Science & Engineering",
    semester: 5,
    email: "ananya.rao@example.com",
    phone: "+91 9876543211",
    createdAt: "2025-08-16T10:15:00.000Z",
    updatedAt: "2025-08-16T10:15:00.000Z",
  },
  {
    id: "std-3",
    name: "Rohan Verma",
    usn: "1MS22EC042",
    department: "Electronics & Communication",
    semester: 7,
    email: "rohan.verma@example.com",
    phone: "+91 9876543212",
    createdAt: "2025-08-17T11:00:00.000Z",
    updatedAt: "2025-08-17T11:00:00.000Z",
  },
  {
    id: "std-4",
    name: "Priya Patel",
    usn: "1MS24AI008",
    department: "Artificial Intelligence & Data Science",
    semester: 3,
    email: "priya.patel@example.com",
    phone: "+91 9876543213",
    createdAt: "2025-08-18T14:20:00.000Z",
    updatedAt: "2025-08-18T14:20:00.000Z",
  },
  {
    id: "std-5",
    name: "Vikrant Singh",
    usn: "1MS23ME020",
    department: "Mechanical Engineering",
    semester: 5,
    email: "vikrant.singh@example.com",
    phone: "+91 9876543214",
    createdAt: "2025-08-19T16:45:00.000Z",
    updatedAt: "2025-08-19T16:45:00.000Z",
  },
  {
    id: "std-6",
    name: "Sneha Kulkarni",
    usn: "1MS24CV011",
    department: "Civil Engineering",
    semester: 1,
    email: "sneha.kulkarni@example.com",
    phone: "+91 9876543215",
    createdAt: "2025-08-20T08:00:00.000Z",
    updatedAt: "2025-08-20T08:00:00.000Z",
  },
];

// Fallback JSON File helper functions
function ensureDataFile(): Student[] {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (!fs.existsSync(FILE_PATH)) {
      fs.writeFileSync(FILE_PATH, JSON.stringify(SEED_STUDENTS, null, 2), "utf-8");
      return SEED_STUDENTS;
    }

    const data = fs.readFileSync(FILE_PATH, "utf-8");
    return JSON.parse(data) as Student[];
  } catch (err) {
    console.error("Error reading fallback file:", err);
    return SEED_STUDENTS;
  }
}

function saveDataFile(students: Student[]): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(FILE_PATH, JSON.stringify(students, null, 2), "utf-8");
  } catch (err) {
    console.error("Error saving fallback file:", err);
  }
}

export async function getAllStudents(): Promise<Student[]> {
  try {
    const conn = await dbConnect();
    if (!conn) {
      return ensureDataFile();
    }

    const count = await StudentModel.countDocuments();
    if (count === 0) {
      // Seed MongoDB
      const docs = SEED_STUDENTS.map((s) => ({
        customId: s.id,
        name: s.name,
        usn: s.usn,
        department: s.department,
        semester: s.semester,
        email: s.email,
        phone: s.phone,
      }));
      await StudentModel.insertMany(docs);
    }

    const docs = await StudentModel.find().sort({ createdAt: -1 }).lean();
    return docs.map((doc) => ({
      id: doc.customId || String(doc._id),
      name: doc.name,
      usn: doc.usn,
      department: doc.department,
      semester: doc.semester,
      email: doc.email,
      phone: doc.phone,
      createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : new Date().toISOString(),
      updatedAt: doc.updatedAt ? new Date(doc.updatedAt).toISOString() : new Date().toISOString(),
    }));
  } catch (mongoErr) {
    console.warn("MongoDB query failed. Falling back to local file storage.", mongoErr);
    return ensureDataFile();
  }
}

export async function getStudentById(id: string): Promise<Student | undefined> {
  try {
    const conn = await dbConnect();
    if (conn) {
      const doc = await StudentModel.findOne({ customId: id }).lean();
      if (doc) {
        return {
          id: doc.customId,
          name: doc.name,
          usn: doc.usn,
          department: doc.department,
          semester: doc.semester,
          email: doc.email,
          phone: doc.phone,
          createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : new Date().toISOString(),
          updatedAt: doc.updatedAt ? new Date(doc.updatedAt).toISOString() : new Date().toISOString(),
        };
      }
    }
  } catch {
    // Fallback to file storage
  }

  const students = ensureDataFile();
  return students.find((s) => s.id === id);
}

export async function createStudent(input: StudentInput): Promise<Student> {
  const customId = `std-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const cleanStudent: Student = {
    id: customId,
    name: input.name.trim(),
    usn: input.usn.trim().toUpperCase(),
    department: input.department.trim(),
    semester: Number(input.semester),
    email: input.email.trim(),
    phone: input.phone.trim(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  try {
    const conn = await dbConnect();
    if (conn) {
      const doc = await StudentModel.create({
        customId,
        name: cleanStudent.name,
        usn: cleanStudent.usn,
        department: cleanStudent.department,
        semester: cleanStudent.semester,
        email: cleanStudent.email,
        phone: cleanStudent.phone,
      });

      return {
        id: doc.customId,
        name: doc.name,
        usn: doc.usn,
        department: doc.department,
        semester: doc.semester,
        email: doc.email,
        phone: doc.phone,
        createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : cleanStudent.createdAt,
        updatedAt: doc.updatedAt ? new Date(doc.updatedAt).toISOString() : cleanStudent.updatedAt,
      };
    }
  } catch (mongoErr) {
    console.warn("MongoDB create failed. Saving to fallback file storage.", mongoErr);
  }

  const students = ensureDataFile();
  students.unshift(cleanStudent);
  saveDataFile(students);
  return cleanStudent;
}

export async function updateStudent(id: string, input: StudentInput): Promise<Student | null> {
  const cleanInput = {
    name: input.name.trim(),
    usn: input.usn.trim().toUpperCase(),
    department: input.department.trim(),
    semester: Number(input.semester),
    email: input.email.trim(),
    phone: input.phone.trim(),
  };

  try {
    const conn = await dbConnect();
    if (conn) {
      const updatedDoc = await StudentModel.findOneAndUpdate(
        { customId: id },
        { $set: cleanInput },
        { new: true, runValidators: true }
      ).lean();

      if (updatedDoc) {
        return {
          id: updatedDoc.customId,
          name: updatedDoc.name,
          usn: updatedDoc.usn,
          department: updatedDoc.department,
          semester: updatedDoc.semester,
          email: updatedDoc.email,
          phone: updatedDoc.phone,
          createdAt: updatedDoc.createdAt ? new Date(updatedDoc.createdAt).toISOString() : new Date().toISOString(),
          updatedAt: updatedDoc.updatedAt ? new Date(updatedDoc.updatedAt).toISOString() : new Date().toISOString(),
        };
      }
    }
  } catch {
    // Fallback to file storage
  }

  const students = ensureDataFile();
  const index = students.findIndex((s) => s.id === id);
  if (index === -1) return null;

  const existing = students[index];
  const updated: Student = {
    ...existing,
    ...cleanInput,
    updatedAt: new Date().toISOString(),
  };

  students[index] = updated;
  saveDataFile(students);
  return updated;
}

export async function deleteStudent(id: string): Promise<boolean> {
  try {
    const conn = await dbConnect();
    if (conn) {
      const res = await StudentModel.deleteOne({ customId: id });
      if (res.deletedCount > 0) {
        return true;
      }
    }
  } catch {
    // Fallback to file storage
  }

  const students = ensureDataFile();
  const filtered = students.filter((s) => s.id !== id);
  if (filtered.length === students.length) {
    return false;
  }
  saveDataFile(filtered);
  return true;
}
