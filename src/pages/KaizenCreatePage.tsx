import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { generateKaizenInsight } from "../services/aiService";
import type {
  KaizenCategory,
  KaizenPriority,
  KaizenReport,
} from "../types/kaizen";

type KaizenCreatePageProps = {
  reports: KaizenReport[];
  onCreateReport: (report: KaizenReport) => void | Promise<void>;
};

const categories: KaizenCategory[] = [
  "安全",
  "品質",
  "効率",
  "教育",
  "設備",
  "人員配置",
];

const owners = ["佐藤", "田中", "山本", "伊藤", "鈴木", "高橋"];

const today = new Date().toISOString().slice(0, 10);

export default function KaizenCreatePage({
  reports,
  onCreateReport,
}: KaizenCreatePageProps) {
  const [reportedDate, setReportedDate] = useState(today);
  const [site, setSite] = useState("川崎DC");
  const [process, setProcess] = useState("出荷");
  const [category, setCategory] = useState<KaizenCategory>("効率");
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [impact, setImpact] = useState(3);
  const [urgency, setUrgency] = useState(3);
  const [reporter, setReporter] = useState("佐藤");
  const [owner, setOwner] = useState("田中");
  const [dueDate, setDueDate] = useState(today);
  const [aiSummary, setAiSummary] = useState("");
  const [aiAction, setAiAction] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const priority = useMemo<KaizenPriority>(() => {
    const score = impact * urgency;

    if (score >= 9) return "高";
    if (score >= 5) return "中";
    return "低";
  }, [impact, urgency]);

  const nextId = useMemo(() => {
    const maxNumber = reports.reduce((max, report) => {
      const number = Number(report.id.replace("KZ-", ""));
      return Number.isNaN(number) ? max : Math.max(max, number);
    }, 0);

    return `KZ-${String(maxNumber + 1).padStart(3, "0")}`;
  }, [reports]);

  const handleGenerateAiText = async () => {
    if (!title.trim() || !detail.trim()) {
      alert("AI案を生成する前に、タイトルと詳細内容を入力してください。");
      return;
    }

    setIsGenerating(true);

    try {
      const result = await generateKaizenInsight({
        title,
        detail,
        category,
        process,
        impact,
        urgency,
      });

      setAiSummary(result.summary);
      setAiAction(result.action);
    } catch (error) {
      console.error(error);
      alert(
        "GeminiでのAI生成に失敗しました。VITE_GEMINI_FUNCTION_URL、Functionsのデプロイ状況、Gemini APIキーを確認してください。",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim() || !detail.trim()) {
      alert("タイトルと詳細内容を入力してください。");
      return;
    }

    const newReport: KaizenReport = {
      id: nextId,
      reportedDate,
      site,
      process,
      category,
      title,
      detail,
      impact,
      urgency,
      priority,
      status: "未対応",
      reporter,
      owner,
      dueDate,
      aiSummary:
        aiSummary ||
        `${title}について、${process}工程で作業負荷やリスクが発生している可能性があります。`,
      aiAction:
        aiAction ||
        "現場確認を行い、原因を整理したうえで改善アクションを設定する。",
    };

    setIsSaving(true);

    try {
      await onCreateReport(newReport);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div className="mb-6">
          <h3 className="text-lg font-black text-slate-950">
            改善投稿を登録
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            現場で気づいた困りごと、ヒヤリハット、改善提案をFirestoreに保存します。
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <InputField
            label="発生日"
            type="date"
            value={reportedDate}
            onChange={setReportedDate}
          />

          <InputField label="拠点名" value={site} onChange={setSite} />

          <InputField label="工程" value={process} onChange={setProcess} />

          <SelectField
            label="カテゴリ"
            value={category}
            options={categories}
            onChange={(value) => setCategory(value as KaizenCategory)}
          />

          <InputField label="タイトル" value={title} onChange={setTitle} />

          <InputField
            label="期限"
            type="date"
            value={dueDate}
            onChange={setDueDate}
          />

          <SelectField
            label="提案者"
            value={reporter}
            options={owners}
            onChange={setReporter}
          />

          <SelectField
            label="担当者"
            value={owner}
            options={owners}
            onChange={setOwner}
          />
        </div>

        <div className="mt-5">
          <label className="text-sm font-bold text-slate-700">詳細内容</label>
          <textarea
            value={detail}
            onChange={(event) => setDetail(event.target.value)}
            rows={5}
            placeholder="何が起きているか、どんな困りごとがあるかを入力してください。"
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
          />
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h3 className="text-lg font-black text-slate-950">優先度判定</h3>
          <p className="mt-1 text-sm text-slate-500">
            影響度 × 緊急度で優先度を自動判定します。
          </p>

          <RangeField label="影響度" value={impact} onChange={setImpact} />

          <RangeField label="緊急度" value={urgency} onChange={setUrgency} />

          <div className="mt-6 rounded-3xl bg-slate-900 p-5 text-white">
            <p className="text-sm font-bold text-slate-300">自動判定</p>
            <p className="mt-2 text-4xl font-black">優先度：{priority}</p>
            <p className="mt-2 text-sm text-slate-300">
              スコア：{impact * urgency}
            </p>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-lg font-black text-slate-950">
                Gemini AI要約・改善アクション案
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Firebase Functions経由でGemini APIを呼び出します。
              </p>
            </div>

            <button
              type="button"
              onClick={() => void handleGenerateAiText()}
              disabled={isGenerating}
              className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {isGenerating ? "Gemini生成中..." : "GeminiでAI案を生成"}
            </button>
          </div>

          <div className="mt-5 space-y-5">
            <div>
              <label className="text-sm font-bold text-slate-700">
                AI要約
              </label>
              <textarea
                value={aiSummary}
                onChange={(event) => setAiSummary(event.target.value)}
                rows={3}
                placeholder="Geminiで生成された要約がここに入ります。"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
              />
            </div>

            <div>
              <label className="text-sm font-bold text-slate-700">
                改善アクション案
              </label>
              <textarea
                value={aiAction}
                onChange={(event) => setAiAction(event.target.value)}
                rows={4}
                placeholder="Geminiで生成された改善アクション案がここに入ります。"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSaving}
          className="rounded-2xl bg-slate-900 px-8 py-4 text-sm font-black text-white shadow-sm transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {isSaving ? "Firestoreに保存中..." : "Firestoreに保存して詳細へ"}
        </button>
      </div>
    </form>
  );
}

function InputField({
  label,
  type = "text",
  value,
  onChange,
}: {
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="text-sm font-bold text-slate-700">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
      />
    </div>
  );
}

function SelectField({
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
    <div>
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

function RangeField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="mt-5">
      <div className="mb-2 flex items-center justify-between">
        <label className="text-sm font-bold text-slate-700">{label}</label>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-black text-slate-700">
          {value}
        </span>
      </div>

      <input
        type="range"
        min="1"
        max="5"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full"
      />

      <div className="mt-1 flex justify-between text-xs font-bold text-slate-400">
        <span>低い</span>
        <span>高い</span>
      </div>
    </div>
  );
}