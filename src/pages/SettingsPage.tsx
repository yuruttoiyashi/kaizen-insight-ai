export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
          Application
        </p>

        <h3 className="mt-3 text-2xl font-black text-slate-950">
          Kaizen Insight AI
        </h3>

        <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
          物流・倉庫・事務現場で発生するヒヤリハットや改善提案を一元管理し、
          Firestoreによるデータ保存と、Firebase Functions経由のGemini API連携によって、
          AI要約・改善アクション提案まで行える業務改善支援アプリです。
        </p>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h3 className="text-lg font-black text-slate-950">使用技術</h3>

          <div className="mt-4 flex flex-wrap gap-2">
            {[
              "React",
              "Vite",
              "TypeScript",
              "Tailwind CSS",
              "Firebase",
              "Cloud Firestore",
              "Firebase Functions",
              "Gemini API",
              "Vercel",
            ].map((item) => (
              <span
                key={item}
                className="rounded-full bg-slate-100 px-4 py-2 text-sm font-bold text-slate-700"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h3 className="text-lg font-black text-slate-950">実装済み機能</h3>

          <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-600">
            <li>・改善提案、ヒヤリハットの登録</li>
            <li>・Firestoreへの改善投稿保存</li>
            <li>・Firestoreからのデータ取得</li>
            <li>・ステータス更新の保存</li>
            <li>・Firebase Functions経由のGemini API連携</li>
            <li>・GeminiによるAI要約、改善アクション案生成</li>
            <li>・カテゴリ別、優先度別のダッシュボード表示</li>
            <li>・担当者別、カテゴリ別のレポート表示</li>
          </ul>
        </div>
      </section>

      <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <h3 className="text-lg font-black text-slate-950">今後の拡張候補</h3>

        <p className="mt-1 text-sm text-slate-500">
          ポートフォリオとしてさらに実務感を高めるための追加機能です。
        </p>

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[
            {
              title: "ログイン機能",
              text: "管理者・一般ユーザーで操作範囲を分ける権限管理を追加する。",
            },
            {
              title: "対応メモ保存",
              text: "詳細ページの対応メモをFirestoreに保存し、対応履歴として残す。",
            },
            {
              title: "CSV出力",
              text: "改善投稿一覧や月次レポートをCSVで出力できるようにする。",
            },
            {
              title: "月次レポート生成",
              text: "Geminiを使って改善活動の月次サマリーを自動生成する。",
            },
            {
              title: "完了後効果記録",
              text: "改善前後の作業時間やミス件数を比較して効果を見える化する。",
            },
            {
              title: "通知機能",
              text: "期限が近い改善タスクを担当者に通知できるようにする。",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-3xl bg-slate-50 p-5 ring-1 ring-slate-200"
            >
              <h4 className="font-black text-slate-950">{item.title}</h4>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}