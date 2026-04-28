import {
  CategoryBadge,
  PriorityBadge,
  StatusBadge,
} from "../components/common/Badges";
import type { KaizenReport, KaizenStatus } from "../types/kaizen";

type KaizenDetailPageProps = {
  report: KaizenReport | null;
  onBack: () => void;
  onUpdateStatus: (id: string, status: KaizenStatus) => void;
};

const statuses: KaizenStatus[] = ["未対応", "対応中", "完了", "保留"];

export default function KaizenDetailPage({
  report,
  onBack,
  onUpdateStatus,
}: KaizenDetailPageProps) {
  if (!report) {
    return (
      <div className="rounded-3xl bg-white p-8 text-center shadow-sm ring-1 ring-slate-200">
        <p className="text-lg font-black text-slate-950">
          改善投稿が見つかりませんでした。
        </p>
        <button
          type="button"
          onClick={onBack}
          className="mt-6 rounded-2xl bg-slate-900 px-5 py-3 text-sm font-bold text-white"
        >
          一覧へ戻る
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={onBack}
        className="rounded-2xl bg-white px-5 py-3 text-sm font-bold text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50"
      >
        ← 一覧へ戻る
      </button>

      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <div className="flex flex-wrap gap-2">
              <CategoryBadge category={report.category} />
              <PriorityBadge priority={report.priority} />
              <StatusBadge status={report.status} />
            </div>

            <h3 className="mt-5 text-2xl font-black tracking-tight text-slate-950">
              {report.title}
            </h3>

            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
              {report.detail}
            </p>
          </div>

          <div className="min-w-[240px] rounded-3xl bg-slate-50 p-5 ring-1 ring-slate-200">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">
              Status Update
            </p>
            <label className="mt-4 block text-sm font-bold text-slate-700">
              対応状況
            </label>
            <select
              value={report.status}
              onChange={(event) =>
                onUpdateStatus(report.id, event.target.value as KaizenStatus)
              }
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
            >
              {statuses.map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <InfoCard label="ID" value={report.id} />
        <InfoCard label="発生日" value={report.reportedDate} />
        <InfoCard label="期限" value={report.dueDate} />
        <InfoCard label="拠点" value={report.site} />
        <InfoCard label="工程" value={report.process} />
        <InfoCard label="担当者" value={report.owner} />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl bg-slate-900 p-6 text-white shadow-sm">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
            AI Summary
          </p>
          <h3 className="mt-3 text-xl font-black">AI要約</h3>
          <p className="mt-4 text-sm leading-7 text-slate-200">
            {report.aiSummary}
          </p>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
            Action Plan
          </p>
          <h3 className="mt-3 text-xl font-black text-slate-950">
            改善アクション案
          </h3>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            {report.aiAction}
          </p>
        </div>
      </section>

      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h3 className="text-lg font-black text-slate-950">対応メモ</h3>
        <p className="mt-1 text-sm text-slate-500">
  現場確認内容、対応方針、完了時の振り返りを記録するためのメモ欄です。
</p>
        <textarea
          rows={5}
          placeholder="現場確認内容、対応方針、完了メモなどを入力"
          className="mt-4 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
        />
      </section>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <p className="text-sm font-bold text-slate-500">{label}</p>
      <p className="mt-2 text-lg font-black text-slate-950">{value}</p>
    </div>
  );
}