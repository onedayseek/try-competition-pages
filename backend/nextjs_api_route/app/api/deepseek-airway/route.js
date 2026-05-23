import OpenAI from "openai";

const knowledgeBase = [
  { title: "上气道空间关系", content: "舌体、软腭、咽腔、会厌和喉入口共同构成气道管理关键空间。" },
  { title: "全麻后舌后坠", content: "全麻后扩张肌张力下降，舌根更易向咽后壁移动，导致咽腔狭窄。" }
];

export async function POST(req) {
  const { message, mode = "机制推理导师", model = "deepseek-chat" } = await req.json();
  if (!process.env.DEEPSEEK_API_KEY) {
    return Response.json({ error: "DEEPSEEK_API_KEY not configured" }, { status: 500 });
  }

  const client = new OpenAI({ apiKey: process.env.DEEPSEEK_API_KEY, baseURL: "https://api.deepseek.com" });
  const context = knowledgeBase.map((r, i) => `[${i+1}] ${r.title}: ${r.content}`).join("\n");

  const completion = await client.chat.completions.create({
    model,
    temperature: 0.35,
    messages: [
      { role: "system", content: `你是困难气道主题专科AI助教。当前模式：${mode}。仅用于教学，不替代临床决策。\n课程知识库：\n${context}` },
      { role: "user", content: message }
    ],
  });

  return Response.json({
    answer: completion.choices[0]?.message?.content || "",
    tags: ["DeepSeek API", mode, "RAG知识库"],
    sources: knowledgeBase.map(r => r.title),
    usage: completion.usage
  });
}
