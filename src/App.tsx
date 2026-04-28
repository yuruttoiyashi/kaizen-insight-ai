import { useEffect, useMemo, useState } from "react";
import { demoKaizenReports } from "./data/demoKaizenReports";
import DashboardPage from "./pages/DashboardPage";
import KaizenListPage from "./pages/KaizenListPage";
import KaizenCreatePage from "./pages/KaizenCreatePage";
import KaizenDetailPage from "./pages/KaizenDetailPage";
import ReportPage from "./pages/ReportPage";
import SettingsPage from "./pages/SettingsPage";
import {
  createKaizenReport,
  fetchKaizenReports,
  seedDemoKaizenReports,
  updateKaizenReportStatus,
} from "./services/kaizenService";
import type { KaizenReport, KaizenStatus, PageKey } from "./types/kaizen";

type NavItem = {
  key: PageKey;
  label: string;
  description: string;
};

const navItems: NavItem[] = [
  {
    key: "dashboard",
    label: "ダッシュボード",
    description: "全体状況",
  },
  {
    key: "list",
    label: "改善一覧",
    description: "投稿管理",
  },
  {
    key: "create",
    label: "改善登録",
    description: "新規作成",
  },
  {
    key: "report",
    label: "レポート",
    description: "傾向分析",
  },
  {
    key: "settings",
    label: "設定",
    description: "アプリ情報",
  },
];

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageKey>("dashboard");
  const [reports, setReports] = useState<KaizenReport[]>([]);
  const [selectedReportId, setSelectedReportId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const loadReports = async () => {
    setIsLoading(true);
    setLoadError("");

    try {
      let firestoreReports = await fetchKaizenReports();

      if (firestoreReports.length === 0) {
        await seedDemoKaizenReports(demoKaizenReports);
        firestoreReports = await fetchKaizenReports();
      }

      setReports(firestoreReports);
      setSelectedReportId((current) => current || firestoreReports[0]?.id || "");
    } catch (error) {
      console.error(error);

      setLoadError(
  "Firestoreからデータを取得できませんでした。Firebase設定・Firestore Database・Firestore Rulesを確認してください。一時的に初期データを表示しています。",
);

      setReports(demoKaizenReports);
      setSelectedReportId(demoKaizenReports[0]?.id ?? "");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadReports();
  }, []);

  const selectedReport = useMemo(
    () => reports.find((report) => report.id === selectedReportId) ?? null,
    [reports, selectedReportId],
  );

  const handleOpenDetail = (id: string) => {
    setSelectedReportId(id);
    setCurrentPage("detail");
  };

  const handleCreateReport = async (report: KaizenReport) => {
    try {
      await createKaizenReport(report);

      setReports((prev) => {
        const exists = prev.some((item) => item.id === report.id);

        if (exists) {
          return prev.map((item) => (item.id === report.id ? report : item));
        }

        return [report, ...prev];
      });

      setSelectedReportId(report.id);
      setCurrentPage("detail");
    } catch (error) {
      console.error(error);
      alert("Firestoreへの保存に失敗しました。Firebase設定やFirestore Rulesを確認してください。");
    }
  };

  const handleUpdateStatus = async (id: string, status: KaizenStatus) => {
    const beforeReports = reports;

    setReports((prev) =>
      prev.map((report) =>
        report.id === id
          ? {
              ...report,
              status,
            }
          : report,
      ),
    );

    try {
      await updateKaizenReportStatus(id, status);
    } catch (error) {
      console.error(error);
      setReports(beforeReports);
      alert("ステータス更新に失敗しました。Firestore設定を確認してください。");
    }
  };

  const pageTitle = useMemo(() => {
    if (currentPage === "detail") {
      return selectedReport ? selectedReport.title : "改善詳細";
    }

    return (
      navItems.find((item) => item.key === currentPage)?.label ??
      "Kaizen Insight AI"
    );
  }, [currentPage, selectedReport]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 border-r border-slate-200 bg-white px-5 py-6 lg:block">
          <div className="mb-8">
            <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-lg font-black text-white shadow-sm">
              KI
            </div>

            <h1 className="text-xl font-black tracking-tight text-slate-950">
              Kaizen Insight AI
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              現場の気づきを、改善アクションに変えるAI業務改善アプリ
            </p>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const isActive = currentPage === item.key;

              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setCurrentPage(item.key)}
                  className={`w-full rounded-2xl px-4 py-3 text-left transition ${
                    isActive
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                  }`}
                >
                  <span className="block text-sm font-bold">{item.label}</span>
                  <span
                    className={`mt-1 block text-xs ${
                      isActive ? "text-slate-300" : "text-slate-400"
                    }`}
                  >
                    {item.description}
                  </span>
                </button>
              );
            })}
          </nav>

          <div className="mt-8 rounded-3xl bg-slate-50 p-4 ring-1 ring-slate-200">
  <p className="text-xs font-bold text-slate-500">CONNECTED</p>
  <p className="mt-2 text-sm leading-6 text-slate-600">
    Cloud Firestoreで改善投稿を管理し、Firebase Functions経由でGemini AI要約を生成します。
  </p>
</div>
        </aside>

        <main className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 px-4 py-4 backdrop-blur md:px-8">
            <div className="mx-auto flex max-w-7xl flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                  Kaizen Management Dashboard
                </p>
                <h2 className="mt-1 text-2xl font-black tracking-tight text-slate-950">
                  {pageTitle}
                </h2>
              </div>

              <div className="flex flex-wrap gap-2 lg:hidden">
                {navItems.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setCurrentPage(item.key)}
                    className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                      currentPage === item.key
                        ? "bg-slate-900 text-white"
                        : "bg-white text-slate-600 ring-1 ring-slate-200"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => void loadReports()}
                  className="rounded-2xl bg-white px-5 py-3 text-sm font-bold text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50"
                >
                  再読み込み
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentPage("create")}
                  className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-slate-700"
                >
                  改善を登録する
                </button>
              </div>
            </div>
          </header>

          <section className="mx-auto max-w-7xl px-4 py-6 md:px-8">
            {loadError && (
              <div className="mb-6 rounded-3xl bg-rose-50 p-4 text-sm font-bold text-rose-700 ring-1 ring-rose-200">
                {loadError}
              </div>
            )}

            {isLoading ? (
              <div className="rounded-3xl bg-white p-10 text-center shadow-sm ring-1 ring-slate-200">
                <p className="text-lg font-black text-slate-950">
                  Firestoreからデータを読み込み中です...
                </p>
              </div>
            ) : (
              <>
                {currentPage === "dashboard" && (
                  <DashboardPage
                    reports={reports}
                    onMovePage={setCurrentPage}
                    onOpenDetail={handleOpenDetail}
                  />
                )}

                {currentPage === "list" && (
                  <KaizenListPage
                    reports={reports}
                    onOpenDetail={handleOpenDetail}
                  />
                )}

                {currentPage === "create" && (
                  <KaizenCreatePage
                    reports={reports}
                    onCreateReport={handleCreateReport}
                  />
                )}

                {currentPage === "detail" && (
                  <KaizenDetailPage
                    report={selectedReport}
                    onBack={() => setCurrentPage("list")}
                    onUpdateStatus={handleUpdateStatus}
                  />
                )}

                {currentPage === "report" && <ReportPage reports={reports} />}

                {currentPage === "settings" && <SettingsPage />}
              </>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}