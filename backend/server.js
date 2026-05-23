import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import fs from "node:fs";
import path from "node:path";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

const PORT = process.env.PORT || 8787;
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

const client = new OpenAI({
  apiKey: DEEPSEEK_API_KEY,
  baseURL: process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com",
});

const __dirname = path.resolve();
const knowledgeBase = JSON.parse(fs.readFileSync(path.join(__dirname, "knowledge", "airway_kb.json"), "utf-8"));
const systemPrompt = fs.readFileSync(path.join(__dirname, "prompts", "system_prompt.md"), "utf-8");

function scoreChunk(query, chunk) {
  const q = query.toLowerCase();
  const text = `${chunk.title} ${chunk.category} ${chunk.content} ${chunk.teaching_use}`.toLowerCase();
  let score = 0;
  for (const token of ["打鼾", "肥胖", "舌", "软腭", "会厌", "mallampati", "麻醉", "全麻", "喉镜", "塌陷", "气道", "生理", "解剖", "文献", "指南"]) {
    if (q.includes(token.toLowerCase()) && text.includes(token.toLowerCase())) score += 2;
  }
  return score;
}

function retrieveContext(query, k = 5) {
  return knowledgeBase.map((item) => ({ ...item, score: scoreChunk(query, item) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, k);
}

function modeInstruction(mode) {
  if (mode === "题库生成官") return "当前模式：题库生成官。请输出题干、A-D四个选项、答案、解析、考点、适用教学环节。";
  if (mode === "虚拟病例教官") return "当前模式：虚拟病例教官。请像OSCE考官一样分步追问，并给出参考思路和评分点。";
  if (mode === "文献导读员") return "当前模式：文献导读员。请给出阅读问题、机制连接、教学转化点，避免编造不存在的文献细节。";
  return "当前模式：机制推理导师。请按解剖—生理—病理生理—临床联系回答。";
}

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "deepseek-airway-backend" });
});

app.post("/api/deepseek-airway", async (req, res) => {
  try {
    if (!DEEPSEEK_API_KEY) return res.status(500).json({ error: "DEEPSEEK_API_KEY is not configured." });
    const { message, mode = "机制推理导师", model = "deepseek-chat", history = [] } = req.body || {};
    if (!message || typeof message !== "string") return res.status(400).json({ error: "message is required." });

    const retrieved = retrieveContext(message, 5);
    const contextText = retrieved.map((r, i) => `[${i + 1}] ${r.title}｜${r.category}\n${r.content}\n教学用途：${r.teaching_use}\n来源：${r.source}`).join("\n\n");

    const messages = [
      { role: "system", content: `${systemPrompt}\n${modeInstruction(mode)}\n\n课程知识库检索结果：\n${contextText}` },
      ...history.slice(-6).map((m) => ({ role: m.role === "assistant" ? "assistant" : "user", content: String(m.content || "").slice(0, 1200) })),
      { role: "user", content: message },
    ];

    const completion = await client.chat.completions.create({
      model,
      messages,
      temperature: 0.35,
      max_tokens: 1400,
      stream: false,
    });

    res.json({
      answer: completion.choices?.[0]?.message?.content || "",
      mode,
      model,
      tags: ["DeepSeek API", mode, "RAG知识库"],
      sources: retrieved.map((r) => `${r.title}（${r.source}）`),
      usage: completion.usage || null,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "DeepSeek request failed.", detail: err?.message || String(err) });
  }
});

app.listen(PORT, () => {
  console.log(`DeepSeek Airway backend running on http://localhost:${PORT}`);
});
