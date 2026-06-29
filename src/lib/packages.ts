import { publicBackendBaseUrl } from "@/lib/mock-tests";

export type PackageIncludeItem = {
  type: string;
  id: number | null;
  label: string;
};

export type PackageItem = {
  id: number;
  title: string;
  slug: string;
  package_type: "single" | "combo" | string;
  short_description: string | null;
  description?: string | null;
  image_url: string | null;
  includes: PackageIncludeItem[];
  price: number;
  sale_price: number | null;
  validity_days: number;
  validity_months: number;
  is_featured: boolean;
};

export type StudentLibraryCourse = {
  id: number;
  title: string;
  slug: string;
  course_type: string;
  has_live_classes?: boolean;
  live_sessions_count?: number;
  image_url: string | null;
  short_description: string | null;
  duration_hours: number;
  lessons_count: number;
};

export type StudentLibraryPackage = {
  id: number;
  title: string;
  slug: string;
  package_type: string;
  includes: PackageIncludeItem[];
  validity_days: number;
  validity_months: number;
  image_url: string | null;
  expires_at: string | null;
  purchased_at: string | null;
};

export type StudentLibraryMockCategory = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  tests_count: number;
};

export type StudentLibraryResponse = {
  purchases: Array<{
    id: number;
    purchasable_type: string;
    purchasable_id: number;
    expires_at: string | null;
    created_at: string | null;
  }>;
  courses: StudentLibraryCourse[];
  packages: StudentLibraryPackage[];
  mock_categories: StudentLibraryMockCategory[];
  orders: Array<{
    id: number;
    item_title: string;
    item_type: string;
    final_amount: number;
    status: string;
    paid_at: string | null;
  }>;
  stats: {
    courses_count: number;
    packages_count: number;
    mock_categories_count: number;
    orders_count: number;
  };
};

const includeLabels: Record<string, string> = {
  courses: "Video Courses",
  mock_tests: "Mock Tests",
  live_classes: "Live Classes",
  pdf: "PDF Notes",
};

export function packageIncludeLabel(value: string | PackageIncludeItem) {
  if (typeof value === "object") {
    return value.label || includeLabels[value.type] || value.type || "Included item";
  }

  return includeLabels[value] || value;
}

export function packageEffectivePrice(pkg: PackageItem) {
  return pkg.sale_price ?? pkg.price ?? 0;
}

export function formatInr(amount: number) {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export async function fetchPackages(): Promise<PackageItem[]> {
  const response = await fetch(`${publicBackendBaseUrl}/api/packages`, { cache: "no-store" });
  if (!response.ok) return [];
  const data = await response.json() as { packages?: PackageItem[] };
  return data.packages || [];
}

export async function fetchStudentLibrary(email: string): Promise<StudentLibraryResponse | null> {
  const response = await fetch(`${publicBackendBaseUrl}/api/student/library?email=${encodeURIComponent(email)}`, {
    cache: "no-store",
  });
  if (!response.ok) return null;
  return response.json() as Promise<StudentLibraryResponse>;
}
