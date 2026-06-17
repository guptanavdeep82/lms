"use client";

import { useEffect, useState } from "react";
import { getStudentSession } from "@/lib/student-auth";

export function useStudentEmail() {
  const [email, setEmail] = useState("");

  useEffect(() => {
    const session = getStudentSession();
    setEmail(session?.email || "");
  }, []);

  return email;
}
