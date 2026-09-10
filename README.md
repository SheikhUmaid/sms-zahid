# Student Management System (EduTrack)

A modern, full-stack Student Management System built with **Next.js 15 (App Router)**, **React 19**, **TailwindCSS v4**, **TypeScript**, **MongoDB (via Mongoose)**, **ESLint**, and **Prettier**.

---

## 🚀 Features

- **📊 Dashboard**: High-level metrics showing total student enrollment, active departments count, highest semester, department breakdown progress bars, and recent registrations.
- **📋 Student List**: Responsive desktop table view and mobile card grid displaying student details.
- **🔍 Real-Time Search & Filtering**: Instant search by Student Name, USN (University Seat Number), or Email, with filter dropdowns for Department and Semester.
- **📝 Student Registration**: Comprehensive registration form with client-side and server-side input validation (Name, USN, Department, Semester, Email, Phone Number).
- **👤 Student Details Profile**: Dedicated profile view for individual students with quick action buttons for editing and deletion.
- **✏️ Edit & Update Student**: Modify existing student records with pre-populated form fields and live validation.
- **🗑️ Delete Confirmation**: Confirmation modal before deleting any student record with toast notification feedback.
- **🗄️ MongoDB Database Integration**: Built with Mongoose connection caching (`lib/dbConnect.ts`) and automatic seed data population on initial startup. Fallback persistence included.
- **📱 Responsive UI/UX**: Mobile-first design with drawer sidebar, clean typography, badge indicators, loading spinners, empty states, and toast notifications.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI & Components**: React 19, TailwindCSS v4, Lucide Icons
- **Language**: TypeScript
- **Database**: MongoDB & Mongoose
- **Code Quality**: ESLint, Prettier

---

## 📁 Project Structure

```text
student-management-system/
├── app/
│   ├── page.tsx                  # Dashboard Homepage
│   ├── layout.tsx                # Root Layout with Navbar & Sidebar
│   ├── globals.css               # Global Styles & Tailwind Imports
│   ├── students/
│   │   ├── page.tsx              # Student Records List & Search/Filter
│   │   ├── add/
│   │   │   └── page.tsx          # Register New Student Page
│   │   └── [id]/
│   │       ├── page.tsx          # Student Details View
│   │       └── edit/
│   │           └── page.tsx      # Edit Student Page
│   └── api/
│       └── students/
│           ├── route.ts          # GET (list/filter) & POST (create)
│           └── [id]/
│               └── route.ts      # GET (id), PUT (update), DELETE (delete)
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx            # Application Top Navigation
│   │   ├── Sidebar.tsx           # Navigation Drawer
│   │   └── PageHeader.tsx        # Page Header Banner
│   ├── students/
│   │   ├── StudentForm.tsx       # Reusable Add/Edit Form Component
│   │   └── StudentTable.tsx      # Desktop Table & Mobile Card Component
│   └── ui/
│       ├── Button.tsx            # Custom Button Component
│       ├── Input.tsx             # Form Input Component
│       ├── Select.tsx            # Form Select Component
│       ├── Modal.tsx             # Accessible Modal Dialog
│       ├── ConfirmDialog.tsx     # Action Confirmation Modal
│       ├── ToastContext.tsx      # Toast Notification Provider
│       ├── Badge.tsx             # Status & Department Badges
│       ├── LoadingSpinner.tsx    # Loading Indicator
│       └── EmptyState.tsx        # Empty List Placeholder
├── lib/
│   ├── dbConnect.ts              # Mongoose Connection Manager
│   ├── storage.ts                # MongoDB & Persistence Layer
│   └── validation.ts             # Input Validation Rules
├── models/
│   └── Student.ts                # Mongoose Student Schema
├── types/
│   └── student.ts                # TypeScript Interfaces & Constants
├── .env.example                  # Environment Variables Template
├── .env.local                    # Local Environment Configuration
├── tasks.md                      # Development Roadmap & Task Checklist
└── README.md                     # Project Documentation
```

---

## 🚦 Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher (v22 recommended)
- **npm**: v9.0.0 or higher
- **MongoDB**: Local MongoDB instance (`mongodb://localhost:27017`) or MongoDB Atlas cloud connection string.

### 1. Installation

Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd sms
npm install
```

### 2. Environment Setup

Create a `.env.local` file in the root directory:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/student_management_db
```

### 3. Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

---

## 📡 API Reference

| Method | Endpoint | Purpose | Query Parameters / Body |
|---|---|---|---|
| `GET` | `/api/students` | List all students | `?q=search&department=CS&semester=5` |
| `POST` | `/api/students` | Register a new student | JSON payload (`name`, `usn`, `department`, `semester`, `email`, `phone`) |
| `GET` | `/api/students/:id` | Fetch student details | N/A |
| `PUT` | `/api/students/:id` | Update student details | JSON payload |
| `DELETE` | `/api/students/:id` | Delete student record | N/A |

---

## 🧪 Linting & Building

Run ESLint code quality checks:
```bash
npx eslint .
```

Format code with Prettier:
```bash
npm run format
```

Build for production:
```bash
npm run build
```

# sms
# sms-zahid
