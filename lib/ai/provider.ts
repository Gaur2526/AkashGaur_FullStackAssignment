import type { AiAction } from "@/lib/validations/ai";

type GenerateSuggestionInput = {
  action: AiAction;
  title: string;
  content: string;
};

type OpenAIChatCompletion = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
};

type GenerateSuggestionResult = {
  suggestion: string;
  provider: "openai" | "local";
};

const MAX_AI_INPUT_LENGTH = 6_000;

export async function generateDocumentSuggestion({
  action,
  title,
  content,
}: GenerateSuggestionInput): Promise<GenerateSuggestionResult> {
  const trimmedContent = content.trim();

  if (!trimmedContent) {
    return {
      suggestion: "This document is empty, so there is nothing to process yet.",
      provider: "local",
    };
  }

  const input = trimmedContent.slice(0, MAX_AI_INPUT_LENGTH);

  if (!process.env.OPENAI_API_KEY) {
    return {
      suggestion: generateLocalSuggestion(action, input),
      provider: "local",
    };
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
        temperature: 0.3,
        messages: [
          {
            role: "system",
            content:
              "You are a concise writing assistant for a collaborative document editor. Return only the requested output.",
          },
          {
            role: "user",
            content: buildPrompt(action, title, input),
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`AI provider request failed with ${response.status}`);
    }

    const body = (await response.json()) as OpenAIChatCompletion;
    const suggestion = body.choices?.[0]?.message?.content?.trim();

    if (!suggestion) {
      throw new Error("AI provider returned an empty response");
    }

    return {
      suggestion,
      provider: "openai",
    };
  } catch (error) {
    console.warn("Falling back to local AI suggestion", error);
    return {
      suggestion: generateLocalSuggestion(action, input),
      provider: "local",
    };
  }
}

function buildPrompt(action: AiAction, title: string, content: string) {
  if (action === "summarize") {
    return `Summarize the document titled "${title}" in 3 concise bullet points.\n\nDocument:\n${content}`;
  }

  if (action === "improve") {
    return `Improve clarity, grammar, and flow while preserving the meaning of this document titled "${title}".\n\nDocument:\n${content}`;
  }

  return `Rewrite this document titled "${title}" in a clearer, more polished tone while preserving the original meaning.\n\nDocument:\n${content}`;
}

function generateLocalSuggestion(action: AiAction, content: string) {
  if (action === "summarize") {
    const sentences = content
      .split(/(?<=[.!?])\s+/)
      .map((sentence) => sentence.trim())
      .filter(Boolean)
      .slice(0, 3);

    if (sentences.length === 0) {
      return `- ${content.slice(0, 240)}`;
    }

    return sentences.map((sentence) => `- ${sentence}`).join("\n");
  }

  const normalized = content
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  if (action === "improve") {
    return `Local draft cleanup:\n\n${normalized}\n\nSet OPENAI_API_KEY to enable full AI-powered improvements.`;
  }

  return `Local rewrite draft:\n\n${normalized}\n\nSet OPENAI_API_KEY to enable full AI-powered rewriting.`;
}
