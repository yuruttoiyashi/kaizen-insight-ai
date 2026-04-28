import { useMemo, useState } from "react";
import {
  CategoryBadge,
  PriorityBadge,
  StatusBadge,
} from "../components/common/Badges";
import type {
  KaizenCategory,
  KaizenPriority,
  KaizenReport,
  KaizenStatus,
} from "../types/kaizen";

type KaizenListPageProps = {
  reports: KaizenReport[];
  onOpenDetail: (id: string) => void;
};

const categories: Array<KaizenCategory | "すべて"> = [
  "すべて",
  "安全",
  "品質",
  "効率",
  "教育",
  "設備",
  "人員配置",
];

const statuses: Array<KaizenStatus | "すべて"> = [
  "すべて",
  "未対応",
  "対応中",
  "完了",
  "保留",
];

const priorities: Array<KaizenPriority | "すべて"> = [
  "すべて",
  "高",
  "中",
  "低",
];

export default function KaizenListPage({
  reports,
  onOpenDetail,
}: KaizenListPageProps) {
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState<KaizenCategory | "すべて">("すべて");
  const [status, setStatus] = useState<KaizenStatus | "すべて">("すべて");
  const [priority, setPriority] = useState<KaizenPriority | "すべて">("すべて");

  const filteredReports = useMemo(() => {
    const normalizedKeyword = keyword.trim().toLowerCase();

    return reports.filter((report) => {
      const matchesKeyword =
        normalizedKeyword.length === 0 ||
        [
          report.id,
          report.title,
          report.detail,
          report.site,
          report.process,
          report.reporter,
          report.owner,
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedKeyword);

      const matchesCategory =
        category === "すべて" || report.category === category;

      const matchesStatus = status === "すべて" || report.status === status;

      const matchesPriority =
        priority === "すべて" || report.priority === priority;

      return (
        matchesKeyword && matchesCategory && matchesStatus && matchesPriority
      );
    });
  }, [category, keyword, priority, reports, status]);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end">
          <div className="flex-1">
            <label className="text-sm font-bold text-slate-700">
              キーワード検索
            </label>
            <input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="タイトル、工程、担当者などで検索"
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
            />
          </div>

          <SelectBox
            label="カテゴリ"
            value={category}
            options={categories}
            onChange={(value) => setCategory(value as KaizenCategory | "すべて")}
          />

          <SelectBox
            label="ステータス"
            value={status}
            options={statuses}
            onChange={(value) => setStatus(value as KaizenStatus | "すべて")}
          />

          <SelectBox
            label="優先度"
            value={priority}
            options={priorities}
            onChange={(value) => setPriority(value as KaizenPriority | "すべて")}
          />
        </div>
      </section>

      <section className="rounded-3xl bg-white shadow-sm ring-1 ring-slate-200">
        <div className="flex flex-col gap-2 border-b border-slate-200 p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-lg font-black text-slate-950">
              改善投稿一覧
            </h3>
            <p className="mt-1 text-sm text-slate-500">
              {filteredReports.length}件の改善投稿を表示しています。
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[980px] w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">タイトル</th>
                <th className="px-6 py-4">工程</th>
                <th className="px-6 py-4">カテゴリ</th>
                <th className="px-6 py-4">優先度</th>
                <th className="px-6 py-4">ステータス</th>
                <th className="px-6 py-4">担当</th>
                <th className="px-6 py-4">期限</th>
                <th className="px-6 py-4">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredReports.map((report) => (
                <tr key={report.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-bold text-slate-500">
                    {report.id}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-black text-slate-950">{report.title}</p>
                    <p className="mt-1 line-clamp-1 text-xs text-slate-500">
                      {report.detail}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{report.process}</td>
                  <td className="px-6 py-4">
                    <CategoryBadge category={report.category} />
                  </td>
                  <td className="px-6 py-4">
                    <PriorityBadge priority={report.priority} />
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={report.status} />
                  </td>
                  <td className="px-6 py-4 text-slate-600">{report.owner}</td>
                  <td className="px-6 py-4 text-slate-600">
                    {report.dueDate}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      type="button"
                      onClick={() => onOpenDetail(report.id)}
                      className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-700"
                    >
                      詳細
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function SelectBox({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="min-w-[160px]">
      <label className="text-sm font-bold text-slate-700">{label}</label>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </div>
  );
}