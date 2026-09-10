import mongoose, { Schema, Document, Model } from "mongoose";

export interface IStudentDocument extends Document {
  customId: string;
  name: string;
  usn: string;
  department: string;
  semester: number;
  email: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
}

const StudentSchema = new Schema<IStudentDocument>(
  {
    customId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Student name is required"],
      trim: true,
    },
    usn: {
      type: String,
      required: [true, "USN is required"],
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    department: {
      type: String,
      required: [true, "Department is required"],
      trim: true,
    },
    semester: {
      type: Number,
      required: [true, "Semester is required"],
      min: [1, "Semester must be between 1 and 8"],
      max: [8, "Semester must be between 1 and 8"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const StudentModel: Model<IStudentDocument> =
  mongoose.models.Student || mongoose.model<IStudentDocument>("Student", StudentSchema);

