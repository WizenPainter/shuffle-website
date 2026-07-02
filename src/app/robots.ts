import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/**
 * Explicitly welcomes both search-engine and AI crawlers. AI assistants
 * (ChatGPT, Claude, Gemini, Perplexity, etc.) use these named user-agents to
 * fetch and cite content, so we opt in rather than rely on the default.
 */
export default function robots(): MetadataRoute.Robots {
  const aiBots = [
    "GPTBot", // OpenAI / ChatGPT training + browsing
    "OAI-SearchBot", // ChatGPT search
    "ChatGPT-User", // ChatGPT live browsing
    "ClaudeBot", // Anthropic / Claude
    "Claude-Web",
    "anthropic-ai",
    "PerplexityBot", // Perplexity
    "Perplexity-User",
    "Google-Extended", // Gemini / Vertex AI grounding
    "Applebot-Extended", // Apple Intelligence
    "Amazonbot",
    "Bytespider", // TikTok / Doubao
    "DeepSeekBot", // DeepSeek
    "cohere-ai",
    "Meta-ExternalAgent",
    "YouBot",
  ];

  return {
    rules: [
      { userAgent: "*", allow: "/" },
      ...aiBots.map((userAgent) => ({ userAgent, allow: "/" })),
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
