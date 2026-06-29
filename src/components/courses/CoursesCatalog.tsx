"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CoursePromoCard } from "@/components/courses/CoursePromoCard";
import { fetchCourses, mapApiCourseToListingCourse, type ListingCourse } from "@/lib/courses";

type Filters = {
  type: "all" | "video" | "pdf" | "live";
  cat: string;
  exam: string;
  level: string;
  minPrice: number | null;
  maxPrice: number | null;
  rating: number;
  search: string;
  sort: string;
};

const defaultFilters: Filters = {
  type: "all",
  cat: "all",
  exam: "all",
  level: "all",
  minPrice: null,
  maxPrice: null,
  rating: 0,
  search: "",
  sort: "popular",
};

export function CoursesCatalog() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [courses, setCourses] = useState<ListingCourse[]>([]);
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const type = searchParams.get("type");
    const apiType = type === "video" || type === "pdf" || type === "live" ? type : undefined;

    setLoading(true);
    fetchCourses(apiType)
      .then((items) => setCourses(items.map(mapApiCourseToListingCourse)))
      .finally(() => setLoading(false));
  }, [searchParams]);

  useEffect(() => {
    const type = searchParams.get("type");
    if (type === "video" || type === "pdf" || type === "live") {
      setFilters((current) => ({ ...current, type }));
    } else {
      setFilters((current) => ({ ...current, type: "all" }));
    }
  }, [searchParams]);

  const filtered = useMemo(() => {
    let list = [...courses];

    if (filters.type === "video") {
      list = list.filter((course) => course.type === "video");
    } else if (filters.type === "pdf") {
      list = list.filter((course) => course.type === "pdf");
    } else if (filters.type === "live") {
      list = list.filter((course) => course.offersLive);
    }
    if (filters.cat !== "all") list = list.filter((course) => course.category === filters.cat);
    if (filters.exam !== "all") list = list.filter((course) => course.exam === filters.exam || course.exam === "all");
    if (filters.level !== "all") list = list.filter((course) => course.level === filters.level);
    if (filters.minPrice !== null) list = list.filter((course) => course.price >= filters.minPrice!);
    if (filters.maxPrice !== null) list = list.filter((course) => course.price <= filters.maxPrice!);
    if (filters.rating > 0) list = list.filter((course) => course.rating >= filters.rating);
    if (filters.search) {
      const query = filters.search.toLowerCase();
      list = list.filter(
        (course) =>
          course.title.toLowerCase().includes(query)
          || course.desc.toLowerCase().includes(query)
          || course.tags.some((tag) => tag.toLowerCase().includes(query)),
      );
    }

    if (filters.sort === "newest") list.sort((a, b) => b.id - a.id);
    else if (filters.sort === "price-low") list.sort((a, b) => a.price - b.price);
    else if (filters.sort === "price-high") list.sort((a, b) => b.price - a.price);
    else if (filters.sort === "rating") list.sort((a, b) => b.rating - a.rating);
    else list.sort((a, b) => b.students - a.students);

    return list;
  }, [courses, filters]);

  const setType = (type: Filters["type"]) => {
    setFilters((current) => ({ ...current, type }));
    if (type === "all") router.replace("/courses");
    else router.replace(`/courses?type=${type}`);
  };

  const clearFilters = () => {
    setFilters(defaultFilters);
    router.replace("/courses");
  };

  return (
    <>
      <div className="courses-hero-strip">
        <div>
          <h1>All Courses</h1>
          <p>Expert-designed courses for IBPS, SBI, RBI, Insurance and all competitive banking exams. Start your journey today.</p>
        </div>
        <div className="courses-hero-stats">
          <div><strong>{courses.length}</strong><small>Courses</small></div>
          <div><strong>12,500+</strong><small>Students</small></div>
          <div><strong>850+</strong><small>Selections</small></div>
        </div>
      </div>

      <div className="courses-search-bar">
        <div className="courses-search-input-wrap">
          <i className="fa fa-search" />
          <input
            type="text"
            placeholder="Search courses, topics, exams..."
            value={filters.search}
            onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value.toLowerCase().trim() }))}
          />
        </div>
        <span className="courses-results-count">{filtered.length} Course{filtered.length === 1 ? "" : "s"}</span>
        <div className="courses-sort-wrap">
          <span>Sort by:</span>
          <select
            value={filters.sort}
            onChange={(event) => setFilters((current) => ({ ...current, sort: event.target.value }))}
          >
            <option value="popular">Most Popular</option>
            <option value="newest">Newest First</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      <div className="courses-page-layout">
        <aside className="courses-sidebar">
          <FilterSection title="Course Type">
            <ChipGroup
              options={[
                ["all", "All Types"],
                ["video", "Video Courses"],
                ["pdf", "PDF Courses"],
                ["live", "Live Courses"],
              ]}
              value={filters.type}
              onChange={(value) => setType(value as Filters["type"])}
            />
          </FilterSection>

          <FilterSection title="Category">
            <ChipGroup
              options={[
                ["all", "All"], ["ibps", "IBPS"], ["sbi", "SBI"], ["rbi", "RBI"], ["insurance", "Insurance"],
                ["aptitude", "Aptitude"], ["english", "English"], ["gk", "GK / Affairs"], ["ssc", "SSC / Railway"],
              ]}
              value={filters.cat}
              onChange={(value) => setFilters((current) => ({ ...current, cat: value }))}
            />
          </FilterSection>

          <FilterSection title="Exam Type">
            <ChipGroup
              options={[
                ["all", "All Exams"], ["po", "PO / Officer"], ["clerk", "Clerk"], ["grade-b", "Grade B"], ["aao", "AAO / SO"],
              ]}
              value={filters.exam}
              onChange={(value) => setFilters((current) => ({ ...current, exam: value }))}
            />
          </FilterSection>

          <FilterSection title="Price Range">
            <div className="courses-price-inputs">
              <input
                type="number"
                placeholder="Min ₹"
                value={filters.minPrice ?? ""}
                onChange={(event) => setFilters((current) => ({
                  ...current,
                  minPrice: event.target.value === "" ? null : Number(event.target.value),
                }))}
              />
              <span>–</span>
              <input
                type="number"
                placeholder="Max ₹"
                value={filters.maxPrice ?? ""}
                onChange={(event) => setFilters((current) => ({
                  ...current,
                  maxPrice: event.target.value === "" ? null : Number(event.target.value),
                }))}
              />
            </div>
            <ChipGroup
              options={[
                ["free", "Free"], ["u2k", "Under ₹2K"], ["u5k", "Under ₹5K"], ["o5k", "₹5K+"],
              ]}
              value=""
              onChange={(value) => {
                if (value === "free") setFilters((current) => ({ ...current, minPrice: 0, maxPrice: 0 }));
                if (value === "u2k") setFilters((current) => ({ ...current, minPrice: null, maxPrice: 2000 }));
                if (value === "u5k") setFilters((current) => ({ ...current, minPrice: null, maxPrice: 5000 }));
                if (value === "o5k") setFilters((current) => ({ ...current, minPrice: 5000, maxPrice: null }));
              }}
            />
          </FilterSection>

          <FilterSection title="Level">
            <div className="courses-level-list">
              {[
                ["all", "All Levels"], ["beginner", "Beginner"], ["intermediate", "Intermediate"], ["advanced", "Advanced"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  className={filters.level === value ? "active" : ""}
                  onClick={() => setFilters((current) => ({ ...current, level: value }))}
                >
                  <span className="courses-level-cb"><i className="fa fa-check" /></span>
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </FilterSection>

          <button type="button" className="courses-clear-btn" onClick={clearFilters}>
            <i className="fa fa-times" /> Clear All Filters
          </button>
        </aside>

        <div className="courses-area">
          {loading ? (
            <div className="courses-promo-grid">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="h-[420px] animate-pulse rounded-[18px] bg-slate-200" />
              ))}
            </div>
          ) : filtered.length ? (
            <div className="courses-promo-grid">
              {filtered.map((course) => (
                <CoursePromoCard
                  key={course.id}
                  course={course}
                  href={course.offersLive ? `/live-classes/course/${course.slug}` : undefined}
                />
              ))}
            </div>
          ) : (
            <div className="courses-no-results">
              <i className="fa fa-search-minus" />
              <h3>No courses found</h3>
              <p>Try adjusting your filters or search terms</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="courses-filter-section">
      <h3>{title}</h3>
      {children}
    </div>
  );
}

function ChipGroup({
  options,
  value,
  onChange,
}: {
  options: string[][];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="courses-chip-group">
      {options.map(([optionValue, label]) => (
        <button
          key={optionValue}
          type="button"
          className={value === optionValue ? "active" : ""}
          onClick={() => onChange(optionValue)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
