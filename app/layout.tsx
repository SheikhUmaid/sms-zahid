import type { Metadata } from "next";
import "./globals.css";
import { AppLayout } from "@/components/layout/AppLayout";

export const metadata: Metadata = {
  title: "EduTrack - Student Management System",
  description: "Modern Student Management System with Next.js, React, and MongoDB",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased">
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
