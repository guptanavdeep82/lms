"use client";

import { Suspense } from "react";
import { CoursesCatalog } from "@/components/courses/CoursesCatalog";
import "@/styles/courses-catalog.css";

export default function Page() {
  return (
    <main>
      <Suspense fallback={<div className="p-10 text-center font-semibold text-slate-600">Loading courses...</div>}>
        <CoursesCatalog />
      </Suspense>
    </main>
  );
}
