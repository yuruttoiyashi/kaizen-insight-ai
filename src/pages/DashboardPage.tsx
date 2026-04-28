import {
  CategoryBadge,
  PriorityBadge,
  StatusBadge,
} from "../components/common/Badges";
import type { KaizenCategory, KaizenReport, PageKey } from "../types/kaizen";

type DashboardPageProps = {
  reports: KaizenReport[];
  onMovePage: (page: PageKey) => void;
  onOpenDetail: (id: string) => void;
};

const categories: KaizenCategory[] = [
  "安全",
  "品質",
  "効率",
  "教育",
  "設備",
  "人員配置",
];

export default function DashboardPage({
  reports,
  onMovePage,
  onOpenDetail,
}: DashboardPageProps) {
  const total = reports.length;
  const notStarted = reports.filter((report) => report.status === "未対応").length;
  const inProgress = reports.filter((report) => report.status === "対応中").length;
  const completed = reports.filter((report) => report.status === "完了").length;
  const highPriority = reports.filter((report) => report.priority === "高").length;
  const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100);

  const categoryCounts = categories.map((category) => ({
    category,
    count: reports.filter((report) => report.category === category).length,
  }));

  const maxCategoryCount = Math.max(
    ...categoryCounts.map((item) => item.count),
    1,
  );

  const urgentReports = [...reports]
    .filter((report) => report.status !== "完了")
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 4);

  const recentReports = [...reports]
    .sort((a, b) => b.reportedDate.localeCompare(a.reportedDate))
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <SummaryCard
          label="総投稿数"
          value={`${total}件`}
          subText="登録済みの改善投稿"
        />
        <SummaryCard
          label="未対応"
          value={`${notStarted}件`}
          subText="確認が必要"
        />
        <SummaryCard
          label="対応中"
          value={`${inProgress}件`}
          subText="進行中の改善"
        />
        <SummaryCard
          label="高優先度"
          value={`${highPriority}件`}
          subText="早めの対応推奨"
        />
        <SummaryCard
          label="完了率"
          value={`${completionRate}%`}
          subText="改善完了の割合"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-black text-slate-950">
                カテゴリ別の改善投稿
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                安全・品質・効率など、現場課題の偏りを確認できます。
              </p>
            </div>

            <button
              type="button"
              onClick={() => onMovePage("report")}
              className="rounded-2xl bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-200"
            >
              レポートへ
            </button>
          </div>

          <div className="space-y-4">
            {categoryCounts.map((item) => {
              const width = `${Math.max(
                (item.count / maxCategoryCount) * 100,
                8,
              )}%`;

              return (
                <div key={item.category}>
                  <div className="mb-2 flex items-center justify-between">
                    <CategoryBadge category={item.category} />
                    <span className="text-sm font-bold text-slate-600">
                      {item.count}件
                    </span>
                  </div>

                  <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-slate-900"
                      style={{ width }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-3xl bg-slate-900 p-6 text-white shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
            AI Insight
          </p>

          <h3 className="mt-3 text-2xl font-black">
            未対応の高優先度課題から着手しましょう
          </h3>

          <p className="mt-4 text-sm leading-7 text-slate-300">
            現在、高優先度の改善投稿が {highPriority}
            件あります。安全・品質に関わる内容は、期限と担当者を明確にして進めると改善活動として見せやすくなります。
          </p>

          <button
            type="button"
            onClick={() => onMovePage("list")}
            className="mt-6 rounded-2xl bg-white px-5 py-3 text-sm font-black text-slate-950 hover:bg-slate-100"
          >
            改善一覧を確認する
          </button>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h3 className="text-lg font-black text-slate-950">
            期限が近い改善タスク
          </h3>

          <div className="mt-4 space-y-3">
            {urgentReports.map((report) => (
              <button
                key={report.id}
                type="button"
                onClick={() => onOpenDetail(report.id)}
                className="w-full rounded-2xl border border-slate-200 p-4 text-left transition hover:border-slate-300 hover:bg-slate-50"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <PriorityBadge priority={report.priority} />
                  <StatusBadge status={report.status} />
                  <span className="text-xs font-bold text-slate-400">
                    期限：{report.dueDate}
                  </span>
                </div>

                <p className="mt-3 font-black text-slate-950">
                  {report.title}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  {report.process} / 担当：{report.owner}
                </p>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h3 className="text-lg font-black text-slate-950">
            最近の改善投稿
          </h3>

          <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
            {recentReports.map((report, index) => (
              <button
                key={report.id}
                type="button"
                onClick={() => onOpenDetail(report.id)}
                className={`w-full p-4 text-left transition hover:bg-slate-50 ${
                  index !== recentReports.length - 1
                    ? "border-b border-slate-200"
                    : ""
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="font-black text-slate-950">{report.title}</p>
                  <StatusBadge status={report.status} />
                </div>

                <p className="mt-2 text-sm text-slate-500">
                  {report.reportedDate} / {report.site} / {report.process}
                </p>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  subText,
}: {
  label: string;
  value: string;
  subText: string;
}) {
  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <p className="text-sm font-bold text-slate-500">{label}</p>

      <p className="mt-3 text-3xl font-black tracking-tight text-slate-950">
        {value}
      </p>

      <p className="mt-2 text-sm text-slate-400">{subText}</p>
    </div>
  );
}