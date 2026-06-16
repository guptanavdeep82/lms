"use client";

import { Suspense } from "react";
import { PublicFooter } from "@/components/PublicFooter";
import { PublicHeader } from "@/components/PublicHeader";
import { CoursesCatalog } from "@/components/courses/CoursesCatalog";
import "@/styles/courses-catalog.css";

export default function Page() {
  return (
    <>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
      <PublicHeader active="courses" />
      <main>
        <Suspense fallback={<div className="p-10 text-center font-semibold text-slate-600">Loading courses...</div>}>
          <CoursesCatalog />
        </Suspense>
      </main>
      <PublicFooter />
    </>
  );
}
