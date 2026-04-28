import type { KaizenCategory } from "../types/kaizen";

export type GenerateKaizenInsightInput = {
  title: string;
  detail: string;
  category: KaizenCategory;
  process: string;
  impact: number;
  urgency: number;
};

export type GenerateKaizenInsightResult = {
  summary: string;
  action: string;
};

export async function generateKaizenInsight(
  input: GenerateKaizenInsightInput,
): Promise<GenerateKaizenInsightResult> {
  const functionUrl = import.meta.env.VITE_GEMINI_FUNCTION_URL as string;

  if (!functionUrl) {
    throw new Error("VITE_GEMINI_FUNCTION_URL が設定されていません。");
  }

  const response = await fetch(functionUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`AI生成に失敗しました: ${errorText}`);
  }

  const data = (await response.json()) as GenerateKaizenInsightResult;

  return {
    summary: data.summary,
    action: data.action,
  };
}