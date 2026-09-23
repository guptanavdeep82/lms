export type PaletteStatus =
  | "answered"
  | "answered-review"
  | "not-answered"
  | "review"
  | "not-visited"
  | "correct"
  | "incorrect"
  | "skipped"
  | "unseen";

const sizeMap = {
  sm: "h-7 w-7 text-[11px]",
  md: "h-8 w-8 text-xs",
  lg: "h-9 w-9 text-sm",
};

export function formatExamClock(totalSeconds: number) {
  const hours = Math.floor(Math.max(0, totalSeconds) / 3600);
  const minutes = Math.floor((Math.max(0, totalSeconds) % 3600) / 60);
  const seconds = Math.max(0, totalSeconds) % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function formatMmSs(totalSeconds: number) {
  const minutes = Math.floor(Math.max(0, totalSeconds) / 60);
  const seconds = Math.max(0, totalSeconds) % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export function scoreToneClass(score: number, maxMarks = 0) {
  if (score < 0) return "text-[#dc2626]";
  if (maxMarks > 0 && score / maxMarks >= 0.5) return "text-[#16a34a]";
  if (score > 0) return "text-[#d97706]";
  return "text-[#475467]";
}

export function accuracyToneClass(accuracy: number) {
  if (accuracy >= 60) return "text-[#16a34a]";
  if (accuracy >= 30) return "text-[#d97706]";
  return "text-[#dc2626]";
}

export function questionStatusClass(status: PaletteStatus) {
  switch (status) {
    case "correct":
    case "answered":
      return "border-[#15803d] bg-[#22c55e] text-white";
    case "incorrect":
    case "not-answered":
      return "border-[#b91c1c] bg-[#ef4444] text-white";
    case "answered-review":
    case "review":
      return "rounded-full border-[#6b21a8] bg-[#7e22ce] text-white";
    case "skipped":
      return "border-[#98a2b3] bg-[#e4e7ec] text-[#475467]";
    case "unseen":
    case "not-visited":
    default:
      return "border-[#c4c4c4] bg-[#e8e8e8] text-[#333]";
  }
}

export function PaletteIcon({
  status,
  number = 1,
  size = "md",
}: {
  status: PaletteStatus;
  number?: number | string;
  size?: keyof typeof sizeMap;
}) {
  const box = sizeMap[size];

  if (status === "review") {
    return (
      <span className={`relative inline-grid shrink-0 ${box} place-items-center rounded-full bg-[#7e22ce] font-bold text-white`}>
        {number}
      </span>
    );
  }

  if (status === "answered-review") {
    return (
      <span className={`relative inline-grid shrink-0 ${box} place-items-center rounded-full bg-[#7e22ce] font-bold text-white`}>
        {number}
        <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-sm bg-[#22c55e]" />
      </span>
    );
  }

  if (status === "answered" || status === "correct") {
    return (
      <span
        className={`inline-grid ${box} place-items-center bg-[#22c55e] font-bold text-white`}
        style={{ clipPath: "polygon(0 0, 100% 0, 100% 72%, 50% 100%, 0 72%)" }}
      >
        {number}
      </span>
    );
  }

  if (status === "not-answered" || status === "incorrect") {
    return (
      <span
        className={`inline-grid ${box} place-items-center bg-[#ef4444] font-bold text-white`}
        style={{ clipPath: "polygon(0 28%, 50% 0, 100% 28%, 100% 100%, 0 100%)" }}
      >
        {number}
      </span>
    );
  }

  return (
    <span className={`inline-grid ${box} place-items-center rounded-[3px] border border-[#c4c4c4] bg-[#d9d9d9] font-bold text-[#333]`}>
      {number}
    </span>
  );
}

export const PALETTE_LEGEND: Array<{ status: PaletteStatus; label: string }> = [
  { status: "not-visited", label: "You have not visited the question yet." },
  { status: "not-answered", label: "You have not answered the question." },
  { status: "answered", label: "You have answered the question." },
  { status: "review", label: "You have NOT answered the question, but have marked the question for review." },
  { status: "answered-review", label: "You have answered the question, but marked it for review." },
];
