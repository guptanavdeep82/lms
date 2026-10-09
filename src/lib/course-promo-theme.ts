import { countLabel, courseAccessLabel, courseContentHighlights, type ListingCourse } from "@/lib/courses";

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
      gradient: "linear-gradient(135deg, #0E318D 0%, #0538A1 52%, #0957D3 100%)",
      statusLabel: "PDF Course",
      subtitle: "Downloadable Notes & PDF Pack",
      accent: "#ffffff",
      button: "#0957D3",
    };
  }

  if (type === "live") {
    return {
      gradient: "linear-gradient(135deg, #061533 0%, #0538A1 55%, #0957D3 100%)",
      statusLabel: "On Going",
      subtitle: "Live Interactive Batch",
      accent: "#ffffff",
      button: "#0957D3",
    };
  }

  return {
    gradient: "linear-gradient(135deg, #0E318D 0%, #0538A1 50%, #0957D3 100%)",
    statusLabel: "Video Course",
    subtitle: "Recorded Video Lessons",
    accent: "#ffffff",
    button: "#0957D3",
  };
}

export function buildCoursePromoFeatures(course: ListingCourse): string[] {
  const features = courseContentHighlights(course).slice(0, 3);

  if (course.price === 0) {
    features.push("Free enrollment with instant access");
  }
  if (course.tags.length) {
    features.push(`Covers ${course.tags.slice(0, 2).join(", ")}`);
  }
  if (course.students > 0) {
    features.push(`${countLabel(course.students, "student")} enrolled`);
  }
  features.push(courseAccessLabel(course.validityMonths));

  return features.slice(0, 4);
}

export function coursePromoPriceLabel(price: number, original: number) {
  if (price === 0) return "Free";
  if (original > price) {
    return `₹${price.toLocaleString("en-IN")}`;
  }
  return `₹${price.toLocaleString("en-IN")}`;
}
