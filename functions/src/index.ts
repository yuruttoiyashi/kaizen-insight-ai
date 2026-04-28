import { onRequest } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import { GoogleGenAI } from "@google/genai";

const geminiApiKey = defineSecret("GEMINI_API_KEY");

type GenerateKaizenInsightRequest = {
  title?: string;
  detail?: string;
  category?: string;
  process?: string;
  impact?: number;
  urgency?: number;
};

type GeminiJsonResult = {
  summary?: string;
  action?: string;
};

function extractJson(text: string): GeminiJsonResult | null {
  const cleaned = text
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();

  try {
    return JSON.parse(cleaned) as GeminiJsonResult;
  } catch {
    return null;
  }
}

function createFallbackSummary(body: GenerateKaizenInsightRequest): string {
  return `${body.title ?? "現場課題"}により、${
    body.process ?? "対象"
  }工程で作業負荷やリスクが発生している可能性があります。`;
}

function createFallbackAction(body: GenerateKaizenInsightRequest): string {
  if (body.category === "安全") {
    return "現場確認を行い、危険箇所の見える化・仮置きルール・動線整理を優先して実施する。";
  }

  if (body.category === "品質") {
    return "チェック項目を整理し、記録フォーマットを統一して再発防止につなげる。";
  }

  if (body.category === "教育") {
    return "新人向けの簡易手順書やチェックリストを作成し、教育内容を標準化する。";
  }

  if (body.category === "人員配置") {
    return "ピーク時間帯と必要人数を確認し、休憩・配置・応援ルールを見直す。";
  }

  return "作業手順と発生頻度を確認し、ムダな移動・重複確認・待ち時間を減らす改善案を検討する。";
}

export const generateKaizenInsight = onRequest(
  {
    region: "asia-northeast1",
    cors: true,
    invoker: "public",
    secrets: [geminiApiKey],
    timeoutSeconds: 60,
    memory: "512MiB",
  },
  async (request, response): Promise<void> => {
    if (request.method !== "POST") {
      response.status(405).json({
        error: "POSTメソッドのみ対応しています。",
      });
      return;
    }

    try {
      const body = request.body as GenerateKaizenInsightRequest;

      if (!body.title || !body.detail) {
        response.status(400).json({
          error: "title と detail は必須です。",
        });
        return;
      }

      const apiKey = geminiApiKey.value();

      if (!apiKey) {
        response.status(500).json({
          error: "GEMINI_API_KEY が設定されていません。",
        });
        return;
      }

      const ai = new GoogleGenAI({
        apiKey,
      });

      const prompt = `
あなたは物流・倉庫現場の業務改善を支援するAIです。
以下の改善投稿について、現場管理者が使いやすい形で要約と改善アクションを作成してください。

必ずJSONのみで返してください。
Markdownや説明文は不要です。

JSON形式:
{
  "summary": "80文字以内の要約",
  "action": "120文字以内の具体的な改善アクション"
}

改善投稿:
タイトル: ${body.title}
カテゴリ: ${body.category ?? "未指定"}
工程: ${body.process ?? "未指定"}
影響度: ${body.impact ?? "未指定"}
緊急度: ${body.urgency ?? "未指定"}
詳細: ${body.detail}
`;

      const geminiResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const text = geminiResponse.text ?? "";
      const parsed = extractJson(text);

      response.status(200).json({
        summary: parsed?.summary || createFallbackSummary(body),
        action: parsed?.action || createFallbackAction(body),
      });
      return;
    } catch (error) {
      console.error(error);

      const body = request.body as GenerateKaizenInsightRequest;

      response.status(200).json({
        summary: createFallbackSummary(body),
        action: createFallbackAction(body),
      });
      return;
    }
  },
);