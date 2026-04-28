export type KaizenCategory =
  | "安全"
  | "品質"
  | "効率"
  | "教育"
  | "設備"
  | "人員配置";

export type KaizenPriority = "高" | "中" | "低";

export type KaizenStatus = "未対応" | "対応中" | "完了" | "保留";

export type PageKey =
  | "dashboard"
  | "list"
  | "create"
  | "detail"
  | "report"
  | "settings";

export type KaizenReport = {
  id: string;
  reportedDate: string;
  site: string;
  process: string;
  category: KaizenCategory;
  title: string;
  detail: string;
  impact: number;
  urgency: number;
  priority: KaizenPriority;
  status: KaizenStatus;
  reporter: string;
  owner: string;
  dueDate: string;
  aiSummary: string;
  aiAction: string;
};