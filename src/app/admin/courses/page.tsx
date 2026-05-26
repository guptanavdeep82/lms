"use client";

import {
  BadgeIndianRupee,
  BookOpen,
  Check,
  ChevronDown,
  ClipboardCheck,
  Clock3,
  FileText,
  ImagePlus,
  Layers3,
  ListChecks,
  Pencil,
  Plus,
  Search,
  Settings2,
  Tags,
  Trash2,
  Upload,
  Users,
  X,
} from "lucide-react";
import { ChangeEvent, FormEvent, useMemo, useState } from "react";

type ExamType = {
  id: number;
  name: string;
  code: string;
  status: "Active" | "Draft";
  courses: number;
};

type CourseMeta = {
  id: number;
  name: string;
  status: "Active" | "Draft";
  courses: number;
};

type Course = {
  id: number;
  title: string;
  category: string;
  subject: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  price: string;
  duration: string;
  image: string;
  status: "Published" | "Draft";
  examTypeIds: number[];
};

type CourseForm = Omit<Course, "id" | "status"> & {
  status: Course["status"];
};

type Difficulty = "Easy" | "Medium" | "Hard";

type MockTest = {
  id: number;
  title: string;
  description: string;
  examTypeId: number;
  mockType: "Full Mock" | "Sectional" | "Topic-wise" | "Mini Test" | "Previous Year";
  difficulty: Difficulty;
  status: "Published" | "Draft";
  access: "Free" | "Premium";
  questions: string;
  duration: string;
  attempts: string;
  image: string;
};

type MockTestForm = Omit<MockTest, "id">;

const initialExamTypes: ExamType[] = [
  { id: 1, name: "SBI PO", code: "SBI-PO", status: "Active", courses: 4 },
  { id: 2, name: "IBPS PO", code: "IBPS-PO", status: "Active", courses: 6 },
  { id: 3, name: "RBI Grade B", code: "RBI-GB", status: "Active", courses: 2 },
  { id: 4, name: "Insurance Exams", code: "INS", status: "Draft", courses: 3 },
];

const initialCategories: CourseMeta[] = [
  { id: 1, name: "Banking", status: "Active", courses: 9 },
  { id: 2, name: "Insurance", status: "Active", courses: 3 },
  { id: 3, name: "Aptitude", status: "Active", courses: 5 },
];

const initialSubjects: CourseMeta[] = [
  { id: 1, name: "Quantitative Aptitude", status: "Active", courses: 6 },
  { id: 2, name: "Reasoning Ability", status: "Active", courses: 5 },
  { id: 3, name: "English Language", status: "Active", courses: 4 },
  { id: 4, name: "Banking Awareness", status: "Draft", courses: 2 },
];

const initialModules: CourseMeta[] = [
  { id: 1, name: "Foundation Lessons", status: "Active", courses: 12 },
  { id: 2, name: "Recorded Videos", status: "Active", courses: 48 },
  { id: 3, name: "Mock Test Mapping", status: "Active", courses: 22 },
];

const initialCourses: Course[] = [
  {
    id: 1,
    title: "IBPS PO Complete Course",
    category: "Banking",
    subject: "Quantitative Aptitude",
    level: "Intermediate",
    price: "4999",
    duration: "6 Months",
    image: "/hero-students.png",
    status: "Published",
    examTypeIds: [2],
  },
  {
    id: 2,
    title: "RBI Grade B Masterclass",
    category: "Banking",
    subject: "Banking Awareness",
    level: "Advanced",
    price: "7999",
    duration: "12 Months",
    image: "/building-professionals.png",
    status: "Draft",
    examTypeIds: [3],
  },
];

const emptyCourse: CourseForm = {
  title: "",
  category: "Banking",
  subject: "Quantitative Aptitude",
  level: "Beginner",
  price: "",
  duration: "",
  image: "",
  status: "Draft",
  examTypeIds: [],
};

const initialMockTests: MockTest[] = [
  {
    id: 1,
    title: "IBPS PO Prelims - Full Mock #1",
    description: "Complete prelims simulation with Reasoning, Quant and English sections.",
    examTypeId: 2,
    mockType: "Full Mock",
    difficulty: "Medium",
    status: "Published",
    access: "Premium",
    questions: "100",
    duration: "60 min",
    attempts: "8420",
    image: "/building-professionals.png",
  },
  {
    id: 2,
    title: "Reasoning Mini Test #42",
    description: "Fast daily practice test for puzzles, seating and coding-decoding.",
    examTypeId: 1,
    mockType: "Mini Test",
    difficulty: "Easy",
    status: "Published",
    access: "Free",
    questions: "25",
    duration: "20 min",
    attempts: "5100",
    image: "/hero-students.png",
  },
];

const emptyMockTest: MockTestForm = {
  title: "",
  description: "",
  examTypeId: 1,
  mockType: "Full Mock",
  difficulty: "Medium",
  status: "Draft",
  access: "Premium",
  questions: "",
  duration: "",
  attempts: "",
  image: "",
};

function StatusPill({ status }: { status: string }) {
  const active = status === "Active" || status === "Published";
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-extrabold ${
        active ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
      }`}
    >
      {status}
    </span>
  );
}

function SmallMetric({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: typeof BookOpen;
}) {
  return (
    <div className="rounded-[18px] border border-slate-200 bg-white p-4 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">{label}</p>
          <p className="mt-2 text-2xl font-black tracking-[-0.04em] text-[#050808]">{value}</p>
        </div>
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-[#fff8dc] text-[#050808]">
          <Icon size={20} />
        </span>
      </div>
    </div>
  );
}

export default function AdminCoursesPage() {
  const [activeTab, setActiveTab] = useState("courses");
  const [examTypes, setExamTypes] = useState(initialExamTypes);
  const [categories, setCategories] = useState(initialCategories);
  const [subjects, setSubjects] = useState(initialSubjects);
  const [modules, setModules] = useState(initialModules);
  const [courses, setCourses] = useState(initialCourses);
  const [mockTests, setMockTests] = useState(initialMockTests);
  const [courseForm, setCourseForm] = useState<CourseForm>(emptyCourse);
  const [mockTestForm, setMockTestForm] = useState<MockTestForm>(emptyMockTest);
  const [editingCourseId, setEditingCourseId] = useState<number | null>(null);
  const [editingMockTestId, setEditingMockTestId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [newExamType, setNewExamType] = useState({ name: "", code: "" });
  const [newMeta, setNewMeta] = useState("");

  const filteredCourses = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return courses;
    return courses.filter((course) =>
      [course.title, course.category, course.subject, course.level, course.status].some((value) =>
        value.toLowerCase().includes(term),
      ),
    );
  }, [courses, search]);

  const filteredMockTests = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return mockTests;
    return mockTests.filter((mock) => {
      const examName = examTypes.find((type) => type.id === mock.examTypeId)?.name || "";
      return [mock.title, mock.description, mock.mockType, mock.difficulty, mock.status, mock.access, examName].some((value) =>
        value.toLowerCase().includes(term),
      );
    });
  }, [examTypes, mockTests, search]);

  const tabs = [
    { id: "courses", label: "Courses", icon: BookOpen },
    { id: "mock-tests", label: "Mock Tests", icon: ClipboardCheck },
    { id: "exam-types", label: "Exam Type Management", icon: ListChecks },
    { id: "categories", label: "Categories", icon: Tags },
    { id: "subjects", label: "Subjects", icon: FileText },
    { id: "modules", label: "Modules", icon: Layers3 },
  ];

  const selectedExamTypeNames = (ids: number[]) =>
    ids.map((id) => examTypes.find((type) => type.id === id)?.name).filter(Boolean).join(", ");

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setCourseForm((current) => ({ ...current, image: URL.createObjectURL(file) }));
  };

  const handleMockImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setMockTestForm((current) => ({ ...current, image: URL.createObjectURL(file) }));
  };

  const toggleExamType = (id: number) => {
    setCourseForm((current) => {
      const exists = current.examTypeIds.includes(id);
      return {
        ...current,
        examTypeIds: exists
          ? current.examTypeIds.filter((typeId) => typeId !== id)
          : [...current.examTypeIds, id],
      };
    });
  };

  const saveCourse = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!courseForm.title.trim()) return;

    if (editingCourseId) {
      setCourses((current) =>
        current.map((course) => (course.id === editingCourseId ? { ...course, ...courseForm } : course)),
      );
      setEditingCourseId(null);
    } else {
      setCourses((current) => [{ ...courseForm, id: Date.now() }, ...current]);
    }

    setCourseForm(emptyCourse);
  };

  const editCourse = (course: Course) => {
    const form: CourseForm = {
      title: course.title,
      category: course.category,
      subject: course.subject,
      level: course.level,
      price: course.price,
      duration: course.duration,
      image: course.image,
      status: course.status,
      examTypeIds: course.examTypeIds,
    };
    setCourseForm(form);
    setEditingCourseId(course.id);
    setActiveTab("courses");
  };

  const saveMockTest = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!mockTestForm.title.trim()) return;

    if (editingMockTestId) {
      setMockTests((current) =>
        current.map((mock) => (mock.id === editingMockTestId ? { ...mock, ...mockTestForm } : mock)),
      );
      setEditingMockTestId(null);
    } else {
      setMockTests((current) => [{ ...mockTestForm, id: Date.now() }, ...current]);
    }

    setMockTestForm(emptyMockTest);
  };

  const editMockTest = (mock: MockTest) => {
    setMockTestForm({
      title: mock.title,
      description: mock.description,
      examTypeId: mock.examTypeId,
      mockType: mock.mockType,
      difficulty: mock.difficulty,
      status: mock.status,
      access: mock.access,
      questions: mock.questions,
      duration: mock.duration,
      attempts: mock.attempts,
      image: mock.image,
    });
    setEditingMockTestId(mock.id);
    setActiveTab("mock-tests");
  };

  const addExamType = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newExamType.name.trim() || !newExamType.code.trim()) return;
    setExamTypes((current) => [
      ...current,
      { id: Date.now(), name: newExamType.name.trim(), code: newExamType.code.trim(), status: "Active", courses: 0 },
    ]);
    setNewExamType({ name: "", code: "" });
  };

  const addMeta = (
    event: FormEvent<HTMLFormElement>,
    setter: React.Dispatch<React.SetStateAction<CourseMeta[]>>,
  ) => {
    event.preventDefault();
    if (!newMeta.trim()) return;
    setter((current) => [...current, { id: Date.now(), name: newMeta.trim(), status: "Active", courses: 0 }]);
    setNewMeta("");
  };

  const metaPanel = (
    title: string,
    description: string,
    items: CourseMeta[],
    setter: React.Dispatch<React.SetStateAction<CourseMeta[]>>,
  ) => (
    <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)] lg:p-7">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#b99000]">Dynamic Module</p>
          <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-[#050808]">{title}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">{description}</p>
        </div>
        <form onSubmit={(event) => addMeta(event, setter)} className="flex min-w-full gap-2 sm:min-w-[420px]">
          <input
            value={newMeta}
            onChange={(event) => setNewMeta(event.target.value)}
            placeholder={`Add ${title.toLowerCase()}`}
            className="h-11 min-w-0 flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none transition focus:border-[#ffd21f] focus:bg-white"
          />
          <button className="inline-flex h-11 items-center gap-2 rounded-2xl bg-[#050808] px-4 text-sm font-black text-[#ffd21f]">
            <Plus size={16} /> Add
          </button>
        </form>
      </div>

      <div className="mt-6 grid gap-3">
        {items.map((item) => (
          <div key={item.id} className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-black text-[#050808]">{item.name}</p>
                <StatusPill status={item.status} />
              </div>
              <p className="mt-1 text-xs font-semibold text-slate-500">{item.courses} linked records</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  setter((current) =>
                    current.map((row) =>
                      row.id === item.id ? { ...row, status: row.status === "Active" ? "Draft" : "Active" } : row,
                    ),
                  )
                }
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-700"
              >
                Toggle
              </button>
              <button
                onClick={() => setter((current) => current.filter((row) => row.id !== item.id))}
                className="grid h-9 w-9 place-items-center rounded-xl bg-red-50 text-red-600"
                aria-label={`Delete ${item.name}`}
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );

  return (
    <main className="min-h-screen bg-[#f6f7fb] text-[#050808]">
      <div className="flex min-h-screen">
        <aside className="hidden w-[280px] border-r border-white/10 bg-[#050808] p-5 text-white lg:block">
          <div className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logics-logo.jpeg" alt="KR Logics" className="h-12 w-12 rounded-2xl object-cover ring-1 ring-[#ffd21f]/35" />
            <div>
              <p className="text-lg font-black leading-none">KR Logics</p>
              <p className="mt-1 text-xs font-bold uppercase tracking-[0.18em] text-[#ffd21f]">Admin Panel</p>
            </div>
          </div>

          <div className="mt-8">
            <p className="mb-3 text-xs font-black uppercase tracking-[0.18em] text-white/35">Courses Group</p>
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-extrabold transition ${
                      active ? "bg-[#ffd21f] text-[#050808]" : "text-white/70 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Icon size={18} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        <section className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#b99000]">Courses & Mock Test Administration</p>
                <h1 className="mt-1 text-2xl font-black tracking-[-0.04em] text-[#050808] sm:text-3xl">Learning Content Management</h1>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex h-11 min-w-[250px] items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4">
                  <Search size={17} className="text-slate-400" />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search courses or mock tests..."
                    className="min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none"
                  />
                </div>
                <button className="inline-flex h-11 items-center gap-2 rounded-2xl bg-[#050808] px-4 text-sm font-black text-[#ffd21f] shadow-lg shadow-slate-900/10">
                  <Settings2 size={17} /> Settings
                </button>
              </div>
            </div>
          </header>

          <div className="block overflow-x-auto border-b border-slate-200 bg-white px-4 py-3 lg:hidden">
            <div className="flex min-w-max gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`rounded-2xl px-4 py-2 text-sm font-black ${
                    activeTab === tab.id ? "bg-[#050808] text-[#ffd21f]" : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6 p-4 sm:p-6 lg:p-8">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              <SmallMetric label="Total Courses" value={String(courses.length)} icon={BookOpen} />
              <SmallMetric label="Mock Tests" value={String(mockTests.length)} icon={ClipboardCheck} />
              <SmallMetric label="Exam Types" value={String(examTypes.length)} icon={ListChecks} />
              <SmallMetric label="Subjects" value={String(subjects.length)} icon={FileText} />
              <SmallMetric label="Modules" value={String(modules.length)} icon={Layers3} />
            </div>

            {activeTab === "courses" ? (
              <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
                <form onSubmit={saveCourse} className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)] lg:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-[#b99000]">Create Course</p>
                      <h2 className="mt-2 text-2xl font-black tracking-[-0.04em]">{editingCourseId ? "Update Course" : "New Course"}</h2>
                    </div>
                    {editingCourseId ? (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingCourseId(null);
                          setCourseForm(emptyCourse);
                        }}
                        className="grid h-9 w-9 place-items-center rounded-xl bg-slate-100 text-slate-600"
                        aria-label="Cancel edit"
                      >
                        <X size={16} />
                      </button>
                    ) : null}
                  </div>

                  <label className="mt-6 block">
                    <span className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Course Image</span>
                    <div className="mt-2 overflow-hidden rounded-3xl border border-dashed border-slate-300 bg-slate-50">
                      <div className="relative grid min-h-[180px] place-items-center">
                        {courseForm.image ? (
                          <>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={courseForm.image} alt="Course preview" className="h-full min-h-[180px] w-full object-cover" />
                          </>
                        ) : (
                          <div className="text-center">
                            <ImagePlus className="mx-auto text-slate-400" size={34} />
                            <p className="mt-2 text-sm font-bold text-slate-500">Upload course thumbnail</p>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center justify-between border-t border-slate-200 bg-white px-4 py-3">
                        <span className="text-xs font-semibold text-slate-500">PNG, JPG, WebP</span>
                        <span className="inline-flex items-center gap-2 rounded-xl bg-[#fff8dc] px-3 py-2 text-xs font-black text-[#050808]">
                          <Upload size={14} /> Browse
                        </span>
                      </div>
                    </div>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="sr-only" />
                  </label>

                  <div className="mt-5 grid gap-4">
                    <label>
                      <span className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Course Title</span>
                      <input
                        value={courseForm.title}
                        onChange={(event) => setCourseForm((current) => ({ ...current, title: event.target.value }))}
                        className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none transition focus:border-[#ffd21f] focus:bg-white"
                        placeholder="e.g. SBI PO Complete Course"
                      />
                    </label>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <label>
                        <span className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Category</span>
                        <select
                          value={courseForm.category}
                          onChange={(event) => setCourseForm((current) => ({ ...current, category: event.target.value }))}
                          className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none"
                        >
                          {categories.map((category) => (
                            <option key={category.id}>{category.name}</option>
                          ))}
                        </select>
                      </label>
                      <label>
                        <span className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Subject</span>
                        <select
                          value={courseForm.subject}
                          onChange={(event) => setCourseForm((current) => ({ ...current, subject: event.target.value }))}
                          className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none"
                        >
                          {subjects.map((subject) => (
                            <option key={subject.id}>{subject.name}</option>
                          ))}
                        </select>
                      </label>
                    </div>

                    <div>
                      <span className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Exam Type Multi Select</span>
                      <div className="mt-2 grid gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                        {examTypes.map((type) => {
                          const checked = courseForm.examTypeIds.includes(type.id);
                          return (
                            <button
                              key={type.id}
                              type="button"
                              onClick={() => toggleExamType(type.id)}
                              className={`flex items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-bold transition ${
                                checked ? "bg-[#050808] text-[#ffd21f]" : "bg-white text-slate-600"
                              }`}
                            >
                              <span>{type.name}</span>
                              <span className={`grid h-5 w-5 place-items-center rounded-md ${checked ? "bg-[#ffd21f] text-[#050808]" : "bg-slate-100 text-transparent"}`}>
                                <Check size={13} />
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <label>
                        <span className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Price</span>
                        <input
                          value={courseForm.price}
                          onChange={(event) => setCourseForm((current) => ({ ...current, price: event.target.value }))}
                          className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none"
                          placeholder="4999"
                        />
                      </label>
                      <label>
                        <span className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Duration</span>
                        <input
                          value={courseForm.duration}
                          onChange={(event) => setCourseForm((current) => ({ ...current, duration: event.target.value }))}
                          className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none"
                          placeholder="6 Months"
                        />
                      </label>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <label>
                        <span className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Level</span>
                        <select
                          value={courseForm.level}
                          onChange={(event) => setCourseForm((current) => ({ ...current, level: event.target.value as CourseForm["level"] }))}
                          className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none"
                        >
                          <option>Beginner</option>
                          <option>Intermediate</option>
                          <option>Advanced</option>
                        </select>
                      </label>
                      <label>
                        <span className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Status</span>
                        <select
                          value={courseForm.status}
                          onChange={(event) => setCourseForm((current) => ({ ...current, status: event.target.value as CourseForm["status"] }))}
                          className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none"
                        >
                          <option>Draft</option>
                          <option>Published</option>
                        </select>
                      </label>
                    </div>
                  </div>

                  <button className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#ffd21f] text-sm font-black text-[#050808] shadow-lg shadow-yellow-200/60">
                    <Plus size={17} /> {editingCourseId ? "Update Course" : "Create Course"}
                  </button>
                </form>

                <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)] lg:p-6">
                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.2em] text-[#b99000]">Dynamic List</p>
                      <h2 className="mt-2 text-2xl font-black tracking-[-0.04em]">Courses</h2>
                    </div>
                    <button className="inline-flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-black text-slate-700">
                      Filter <ChevronDown size={16} />
                    </button>
                  </div>

                  <div className="mt-5 grid gap-4">
                    {filteredCourses.map((course) => (
                      <article key={course.id} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_12px_34px_rgba(15,23,42,0.04)]">
                        <div className="grid gap-4 p-4 md:grid-cols-[170px_1fr_auto] md:items-center">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={course.image || "/hero-students.png"} alt={course.title} className="h-36 w-full rounded-2xl object-cover md:h-28" />
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <StatusPill status={course.status} />
                              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-extrabold text-slate-500">{course.level}</span>
                            </div>
                            <h3 className="mt-3 text-lg font-black tracking-[-0.03em] text-[#050808]">{course.title}</h3>
                            <div className="mt-2 flex flex-wrap gap-3 text-xs font-bold text-slate-500">
                              <span className="inline-flex items-center gap-1"><Tags size={13} /> {course.category}</span>
                              <span className="inline-flex items-center gap-1"><FileText size={13} /> {course.subject}</span>
                              <span className="inline-flex items-center gap-1"><Clock3 size={13} /> {course.duration}</span>
                              <span className="inline-flex items-center gap-1"><BadgeIndianRupee size={13} /> {course.price}</span>
                            </div>
                            <p className="mt-2 line-clamp-1 text-xs font-semibold text-slate-500">
                              Exam Types: {selectedExamTypeNames(course.examTypeIds) || "Not selected"}
                            </p>
                          </div>
                          <div className="flex gap-2 md:flex-col">
                            <button
                              onClick={() => editCourse(course)}
                              className="grid h-10 w-10 place-items-center rounded-2xl bg-[#fff8dc] text-[#050808]"
                              aria-label={`Edit ${course.title}`}
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              onClick={() => setCourses((current) => current.filter((row) => row.id !== course.id))}
                              className="grid h-10 w-10 place-items-center rounded-2xl bg-red-50 text-red-600"
                              aria-label={`Delete ${course.title}`}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              </div>
            ) : null}

            {activeTab === "mock-tests" ? (
              <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
                <form onSubmit={saveMockTest} className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)] lg:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.18em] text-[#b99000]">Create Mock Test</p>
                      <h2 className="mt-2 text-2xl font-black tracking-[-0.04em]">{editingMockTestId ? "Update Mock Test" : "New Mock Test"}</h2>
                    </div>
                    {editingMockTestId ? (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingMockTestId(null);
                          setMockTestForm(emptyMockTest);
                        }}
                        className="grid h-9 w-9 place-items-center rounded-xl bg-slate-100 text-slate-600"
                        aria-label="Cancel mock test edit"
                      >
                        <X size={16} />
                      </button>
                    ) : null}
                  </div>

                  <label className="mt-6 block">
                    <span className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Mock Test Image</span>
                    <div className="mt-2 overflow-hidden rounded-3xl border border-dashed border-slate-300 bg-slate-50">
                      <div className="relative grid min-h-[180px] place-items-center">
                        {mockTestForm.image ? (
                          <>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={mockTestForm.image} alt="Mock test preview" className="h-full min-h-[180px] w-full object-cover" />
                          </>
                        ) : (
                          <div className="text-center">
                            <ImagePlus className="mx-auto text-slate-400" size={34} />
                            <p className="mt-2 text-sm font-bold text-slate-500">Upload mock test thumbnail</p>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center justify-between border-t border-slate-200 bg-white px-4 py-3">
                        <span className="text-xs font-semibold text-slate-500">Public mock card image</span>
                        <span className="inline-flex items-center gap-2 rounded-xl bg-[#fff8dc] px-3 py-2 text-xs font-black text-[#050808]">
                          <Upload size={14} /> Browse
                        </span>
                      </div>
                    </div>
                    <input type="file" accept="image/*" onChange={handleMockImageUpload} className="sr-only" />
                  </label>

                  <div className="mt-5 grid gap-4">
                    <label>
                      <span className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Mock Test Title</span>
                      <input
                        value={mockTestForm.title}
                        onChange={(event) => setMockTestForm((current) => ({ ...current, title: event.target.value }))}
                        className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none transition focus:border-[#ffd21f] focus:bg-white"
                        placeholder="e.g. SBI PO Prelims Mock #1"
                      />
                    </label>

                    <label>
                      <span className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Description</span>
                      <textarea
                        value={mockTestForm.description}
                        onChange={(event) => setMockTestForm((current) => ({ ...current, description: event.target.value }))}
                        className="mt-2 min-h-[92px] w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold outline-none transition focus:border-[#ffd21f] focus:bg-white"
                        placeholder="Short description for mock test card"
                      />
                    </label>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <label>
                        <span className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Exam Type</span>
                        <select
                          value={mockTestForm.examTypeId}
                          onChange={(event) => setMockTestForm((current) => ({ ...current, examTypeId: Number(event.target.value) }))}
                          className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none"
                        >
                          {examTypes.map((type) => (
                            <option key={type.id} value={type.id}>{type.name}</option>
                          ))}
                        </select>
                      </label>
                      <label>
                        <span className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Mock Type</span>
                        <select
                          value={mockTestForm.mockType}
                          onChange={(event) => setMockTestForm((current) => ({ ...current, mockType: event.target.value as MockTestForm["mockType"] }))}
                          className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none"
                        >
                          <option>Full Mock</option>
                          <option>Sectional</option>
                          <option>Topic-wise</option>
                          <option>Mini Test</option>
                          <option>Previous Year</option>
                        </select>
                      </label>
                    </div>

                    <div>
                      <span className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Difficulty</span>
                      <div className="mt-2 grid grid-cols-3 gap-2">
                        {(["Easy", "Medium", "Hard"] as Difficulty[]).map((level) => (
                          <button
                            key={level}
                            type="button"
                            onClick={() => setMockTestForm((current) => ({ ...current, difficulty: level }))}
                            className={`h-11 rounded-2xl text-sm font-black transition ${
                              mockTestForm.difficulty === level
                                ? "bg-[#050808] text-[#ffd21f]"
                                : "border border-slate-200 bg-slate-50 text-slate-600"
                            }`}
                          >
                            {level}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                      <label>
                        <span className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Questions</span>
                        <input
                          value={mockTestForm.questions}
                          onChange={(event) => setMockTestForm((current) => ({ ...current, questions: event.target.value }))}
                          className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none"
                          placeholder="100"
                        />
                      </label>
                      <label>
                        <span className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Duration</span>
                        <input
                          value={mockTestForm.duration}
                          onChange={(event) => setMockTestForm((current) => ({ ...current, duration: event.target.value }))}
                          className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none"
                          placeholder="60 min"
                        />
                      </label>
                      <label>
                        <span className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Attempts</span>
                        <input
                          value={mockTestForm.attempts}
                          onChange={(event) => setMockTestForm((current) => ({ ...current, attempts: event.target.value }))}
                          className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none"
                          placeholder="8420"
                        />
                      </label>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <label>
                        <span className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Access</span>
                        <select
                          value={mockTestForm.access}
                          onChange={(event) => setMockTestForm((current) => ({ ...current, access: event.target.value as MockTestForm["access"] }))}
                          className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none"
                        >
                          <option>Free</option>
                          <option>Premium</option>
                        </select>
                      </label>
                      <label>
                        <span className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">Status</span>
                        <select
                          value={mockTestForm.status}
                          onChange={(event) => setMockTestForm((current) => ({ ...current, status: event.target.value as MockTestForm["status"] }))}
                          className="mt-2 h-12 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none"
                        >
                          <option>Draft</option>
                          <option>Published</option>
                        </select>
                      </label>
                    </div>
                  </div>

                  <button className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[#ffd21f] text-sm font-black text-[#050808] shadow-lg shadow-yellow-200/60">
                    <Plus size={17} /> {editingMockTestId ? "Update Mock Test" : "Create Mock Test"}
                  </button>
                </form>

                <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)] lg:p-6">
                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.2em] text-[#b99000]">Dynamic Mock Test List</p>
                      <h2 className="mt-2 text-2xl font-black tracking-[-0.04em]">Mock Tests</h2>
                    </div>
                    <a href="/mock-tests" className="inline-flex h-11 items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-black text-slate-700">
                      Public Preview
                    </a>
                  </div>

                  <div className="mt-5 grid gap-4">
                    {filteredMockTests.map((mock) => {
                      const examName = examTypes.find((type) => type.id === mock.examTypeId)?.name || "Exam";
                      const difficultyTone =
                        mock.difficulty === "Easy"
                          ? "bg-emerald-50 text-emerald-700"
                          : mock.difficulty === "Medium"
                            ? "bg-amber-50 text-amber-700"
                            : "bg-red-50 text-red-700";

                      return (
                        <article key={mock.id} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_12px_34px_rgba(15,23,42,0.04)]">
                          <div className="grid gap-4 p-4 md:grid-cols-[170px_1fr_auto] md:items-center">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={mock.image || "/building-professionals.png"} alt={mock.title} className="h-36 w-full rounded-2xl object-cover md:h-28" />
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <StatusPill status={mock.status} />
                                <span className={`rounded-full px-2.5 py-1 text-xs font-extrabold ${difficultyTone}`}>{mock.difficulty}</span>
                                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-extrabold text-slate-500">{mock.access}</span>
                              </div>
                              <h3 className="mt-3 text-lg font-black tracking-[-0.03em] text-[#050808]">{mock.title}</h3>
                              <p className="mt-1 line-clamp-1 text-sm font-semibold text-slate-500">{mock.description}</p>
                              <div className="mt-2 flex flex-wrap gap-3 text-xs font-bold text-slate-500">
                                <span className="inline-flex items-center gap-1"><ListChecks size={13} /> {examName}</span>
                                <span className="inline-flex items-center gap-1"><ClipboardCheck size={13} /> {mock.mockType}</span>
                                <span className="inline-flex items-center gap-1"><FileText size={13} /> {mock.questions} Qs</span>
                                <span className="inline-flex items-center gap-1"><Clock3 size={13} /> {mock.duration}</span>
                                <span className="inline-flex items-center gap-1"><Users size={13} /> {mock.attempts}</span>
                              </div>
                            </div>
                            <div className="flex gap-2 md:flex-col">
                              <button
                                onClick={() => editMockTest(mock)}
                                className="grid h-10 w-10 place-items-center rounded-2xl bg-[#fff8dc] text-[#050808]"
                                aria-label={`Edit ${mock.title}`}
                              >
                                <Pencil size={16} />
                              </button>
                              <button
                                onClick={() => setMockTests((current) => current.filter((row) => row.id !== mock.id))}
                                className="grid h-10 w-10 place-items-center rounded-2xl bg-red-50 text-red-600"
                                aria-label={`Delete ${mock.title}`}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </section>
              </div>
            ) : null}

            {activeTab === "exam-types" ? (
              <section className="rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_rgba(15,23,42,0.06)] lg:p-7">
                <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-[#b99000]">New Module Added</p>
                    <h2 className="mt-2 text-2xl font-black tracking-[-0.04em] text-[#050808]">Exam Type Management</h2>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                      Admin yahan exam types create karega. Course create/edit karte time ye same list multi-select me show hoti hai.
                    </p>
                  </div>
                  <form onSubmit={addExamType} className="grid min-w-full gap-2 sm:min-w-[520px] sm:grid-cols-[1fr_140px_auto]">
                    <input
                      value={newExamType.name}
                      onChange={(event) => setNewExamType((current) => ({ ...current, name: event.target.value }))}
                      placeholder="Exam type name"
                      className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none transition focus:border-[#ffd21f] focus:bg-white"
                    />
                    <input
                      value={newExamType.code}
                      onChange={(event) => setNewExamType((current) => ({ ...current, code: event.target.value }))}
                      placeholder="Code"
                      className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm font-semibold outline-none transition focus:border-[#ffd21f] focus:bg-white"
                    />
                    <button className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#050808] px-4 text-sm font-black text-[#ffd21f]">
                      <Plus size={16} /> Add
                    </button>
                  </form>
                </div>

                <div className="mt-6 grid gap-3 md:grid-cols-2">
                  {examTypes.map((type) => (
                    <div key={type.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-black text-[#050808]">{type.name}</h3>
                            <StatusPill status={type.status} />
                          </div>
                          <p className="mt-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">{type.code}</p>
                        </div>
                        <button
                          onClick={() => setExamTypes((current) => current.filter((row) => row.id !== type.id))}
                          className="grid h-9 w-9 place-items-center rounded-xl bg-red-50 text-red-600"
                          aria-label={`Delete ${type.name}`}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                      <div className="mt-4 flex items-center justify-between rounded-2xl bg-white px-4 py-3 text-sm font-bold text-slate-600">
                        <span className="inline-flex items-center gap-2"><Users size={15} /> Linked courses</span>
                        <span>{type.courses}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ) : null}

            {activeTab === "categories"
              ? metaPanel("Categories", "Course categories dynamic hain. Course create form me ye dropdown se select hoti hain.", categories, setCategories)
              : null}
            {activeTab === "subjects"
              ? metaPanel("Subjects", "Subjects dynamic hain. Admin subject add/delete karega aur course form me list auto update hogi.", subjects, setSubjects)
              : null}
            {activeTab === "modules"
              ? metaPanel("Modules", "Course ke andar mapped modules, lesson groups aur mock-test mapping sections dynamic manage karne ke liye.", modules, setModules)
              : null}
          </div>
        </section>
      </div>
    </main>
  );
}
