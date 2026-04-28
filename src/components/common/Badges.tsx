import type {
  KaizenCategory,
  KaizenPriority,
  KaizenStatus,
} from "../../types/kaizen";

type BadgeProps = {
  children: React.ReactNode;
  className: string;
};

function Badge({ children, className }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${className}`}
    >
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: KaizenStatus }) {
  const styles: Record<KaizenStatus, string> = {
    未対応: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
    対応中: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    完了: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
    保留: "bg-slate-100 text-slate-600 ring-1 ring-slate-200",
  };

  return <Badge className={styles[status]}>{status}</Badge>;
}

export function PriorityBadge({ priority }: { priority: KaizenPriority }) {
  const styles: Record<KaizenPriority, string> = {
    高: "bg-red-50 text-red-700 ring-1 ring-red-200",
    中: "bg-orange-50 text-orange-700 ring-1 ring-orange-200",
    低: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  };

  return <Badge className={styles[priority]}>優先度：{priority}</Badge>;
}

export function CategoryBadge({ category }: { category: KaizenCategory }) {
  const styles: Record<KaizenCategory, string> = {
    安全: "bg-red-50 text-red-700 ring-1 ring-red-200",
    品質: "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200",
    効率: "bg-sky-50 text-sky-700 ring-1 ring-sky-200",
    教育: "bg-violet-50 text-violet-700 ring-1 ring-violet-200",
    設備: "bg-slate-100 text-slate-700 ring-1 ring-slate-200",
    人員配置: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  };

  return <Badge className={styles[category]}>{category}</Badge>;
}