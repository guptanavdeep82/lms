"use client";

import { useEffect } from "react";
import { staticReplace } from "@/lib/static-nav";

export default function AdminPage() {

  useEffect(() => {
    staticReplace("/admin/courses");
  }, []);

  return null;
}
