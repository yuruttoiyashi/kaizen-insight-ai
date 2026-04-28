import type { KaizenCategory, KaizenPriority, KaizenReport } from "../types/kaizen";

type ReportPageProps = {
  reports: KaizenReport[];
};

const categories: KaizenCategory[] = [
  "安全",
  "品質",
  "効率",
  "教育",
  "設備",
  "人員配置",
];

const priorities: KaizenPriority[] = ["高", "中", "低"];

export default function ReportPage({ reports }: ReportPageProps) {
  const total = reports.length;
  const completed = reports.filter((report) => report.status === "完了").length;
  const completionRate = total === 0 ? 0 : Math.round((completed / total) * 100);

  const categoryRows = categories.map((category) => ({
    label: category,
    count: reports.filter((report) => report.category === category).length,
  }));

  const priorityRows = priorities.map((priority) => ({
    label: priority,
    count: reports.filter((report) => report.priority === priority).length,
  }));

  const ownerRows = Array.from(new Set(reports.map((report) => report.owner))).map(
    (owner) => ({
      label: owner,
      count: reports.filter((report) => report.owner === owner).length,
      completed: reports.filter(
        (report) => report.owner === owner && report.status === "完了",
      ).length,
    }),
  );

  return (
    <div className="space-y-6">
      <section className="grid gap-4 md:grid-cols-3">
        <ReportSummary label="改善投稿数" value={`${total}件`} />
        <ReportSummary label="完了数" value={`${completed}件`} />
        <ReportSummary label="完了率" value={`${completionRate}%`} />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <ChartCard title="カテゴリ別件数" rows={categoryRows} total={total} />
        <ChartCard title="優先度別件数" rows={priorityRows} total={total} />
      </section>

      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h3 className="text-lg font-black text-slate-950">
          担当者別の対応状況
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          改善タスクの担当状況と完了状況を確認できます。
        </p>

        <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-6 py-4">担当者</th>
                <th className="px-6 py-4">担当件数</th>
                <th className="px-6 py-4">完了件数</th>
                <th className="px-6 py-4">完了率</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {ownerRows.map((row) => {
                const rate =
                  row.count === 0 ? 0 : Math.round((row.completed / row.count) * 100);

                return (
                  <tr key={row.label}>
                    <td className="px-6 py-4 font-black text-slate-950">
                      {row.label}
                    </td>
                    <td className="px-6 py-4 text-slate-600">{row.count}件</td>
                    <td className="px-6 py-4 text-slate-600">
                      {row.completed}件
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-28 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-slate-900"
                            style={{ width: `${rate}%` }}
                          />
                        </div>
                        <span className="text-sm font-bold text-slate-600">
                          {rate}%
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function ReportSummary({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <p className="text-sm font-bold text-slate-500">{label}</p>
      <p className="mt-3 text-4xl font-black tracking-tight text-slate-950">
        {value}
      </p>
    </div>
  );
}

function ChartCard({
  title,
  rows,
  total,
}: {
  title: string;
  rows: Array<{ label: string; count: number }>;
  total: number;
}) {
  const max = Math.max(...rows.map((row) => row.count), 1);

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
      <h3 className="text-lg font-black text-slate-950">{title}</h3>
      <div className="mt-5 space-y-4">
        {rows.map((row) => {
          const width = `${Math.max((row.count / max) * 100, 8)}%`;
          const rate = total === 0 ? 0 : Math.round((row.count / total) * 100);

          return (
            <div key={row.label}>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-black text-slate-700">
                  {row.label}
                </span>
                <span className="text-sm font-bold text-slate-500">
                  {row.count}件 / {rate}%
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
  );
}