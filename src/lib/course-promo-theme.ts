import type { ListingCourse } from "@/lib/courses";

export type CoursePromoTheme = {
  gradient: string;
  statusLabel: string;
  subtitle: string;
  accent: string;
  button: string;
};

export function getCoursePromoTheme(type: ListingCourse["type"]): CoursePromoTheme {
  if (type === "pdf") {
    return {
      gradient: "linear-gradient(135deg, #2e1065 0%, #6d28d9 52%, #a855f7 100%)",
      statusLabel: "PDF Course",
      subtitle: "Downloadable Notes & PDF Pack",
      accent: "#ffffff",
      button: "#7c3aed",
    };
  }

  if (type === "live") {
    return {
      gradient: "linear-gradient(135deg, #061533 0%, #6d28d9 55%, #a855f7 100%)",
      statusLabel: "On Going",
      subtitle: "Live Interactive Batch",
      accent: "#ffffff",
      button: "#7c3aed",
    };
  }

  return {
    gradient: "linear-gradient(135deg, #2e1065 0%, #6d28d9 50%, #7c3aed 100%)",
    statusLabel: "Video Course",
    subtitle: "Recorded Video Lessons",
    accent: "#ffffff",
    button: "#7c3aed",
  };
}

export function buildCoursePromoFeatures(course: ListingCourse): string[] {
  const features: string[] = [];

  if (course.type === "pdf") {
    features.push("Lifetime downloadable PDF access");
    features.push("Topic-wise notes and practice sheets");
  } else if (course.type === "live") {
    features.push(`${course.hours || 0}+ hours of live classes with expert faculty`);
    features.push("Session recordings available after each class");
  } else {
    features.push(`${course.hours || 0}+ hours of recorded video content`);
    features.push(`${course.tests || 0}+ structured lessons and modules`);
  }

  if (course.tags.length) {
    features.push(`Covers ${course.tags.slice(0, 2).join(", ")}`);
  } else {
    features.push(`Designed for ${course.category.toUpperCase()} exam preparation`);
  }

  features.push(
    course.price === 0
      ? "Free enrollment with instant access"
      : `Expert guidance with ${course.students.toLocaleString()}+ learners`,
  );

  return features.slice(0, 4);
}

export function coursePromoPriceLabel(price: number, original: number) {
  if (price === 0) return "Free";
  if (original > price) {
    return `₹${price.toLocaleString("en-IN")}`;
  }
  return `₹${price.toLocaleString("en-IN")}`;
}
