import React, { useMemo, useState } from "react";
import {
  Activity,
  AirVent,
  ArrowRight,
  BadgeCheck,
  BarChart3,
  BookOpen,
  Bot,
  Brain,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Compass,
  Eye,
  FileText,
  Filter,
  Film,
  GalleryVerticalEnd,
  GraduationCap,
  HeartPulse,
  Image as ImageIcon,
  Layers3,
  Library,
  Lightbulb,
  Maximize2,
  MessageCircle,
  Microscope,
  MonitorPlay,
  PenSquare,
  PlayCircle,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  Stethoscope,
  Target,
  Upload,
  UserRound,
  Users,
  WandSparkles,
  X,
} from "lucide-react";
import "./index.css";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

async function callAirwayAI({ message, mode = "机制推理导师", model = "deepseek-chat", history = [] }) {
  const res = await fetch(`${API_BASE}/api/deepseek-airway`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, mode, model, history }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

function cx(...args) {
  return args.filter(Boolean).join(" ");
}

function Badge({ children, tone = "blue" }) {
  const map = {
    blue: "bg-blue-50 text-blue-700 ring-blue-200",
    cyan: "bg-cyan-50 text-cyan-700 ring-cyan-200",
    indigo: "bg-indigo-50 text-indigo-700 ring-indigo-200",
    emerald: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    amber: "bg-amber-50 text-amber-700 ring-amber-200",
    rose: "bg-rose-50 text-rose-700 ring-rose-200",
    violet: "bg-violet-50 text-violet-700 ring-violet-200",
    slate: "bg-slate-50 text-slate-600 ring-slate-200",
    dark: "bg-slate-950 text-white ring-slate-800",
  };
  return <span className={cx("inline-flex rounded-full px-3 py-1 text-xs font-black ring-1", map[tone] || map.blue)}>{children}</span>;
}

function Card({ children, className = "" }) {
  return <div className={cx("rounded-[30px] border border-slate-200 bg-white/90 shadow-[0_20px_70px_rgba(15,23,42,0.07)] backdrop-blur", className)}>{children}</div>;
}

function Section({ id, eyebrow, title, desc, children, action }) {
  return (
    <section id={id} className="scroll-mt-24 pt-16">
      <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <Badge tone="slate">{eyebrow}</Badge>
          <h2 className="mt-3 max-w-5xl text-3xl font-black tracking-tight text-slate-950 md:text-5xl">{title}</h2>
          {desc && <p className="mt-3 max-w-4xl text-base leading-8 text-slate-600">{desc}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

const nav = [
  ["home", "首页"],
  ["overview", "总控台"],
  ["pathway", "机制路径"],
  ["atlas", "图谱舱"],
  ["animation", "动画剧场"],
  ["simulator", "模拟器"],
  ["resources", "资源库"],
  ["aihub", "AI中枢"],
  ["case", "虚拟病人"],
  ["quiz", "题库"],
  ["studio", "工作台"],
];

const images = [
  {
    title: "系统解剖总览",
    tag: "系统解剖",
    img: "/images/anatomy_of_the_upper_respiratory_system.png",
    desc: "定位上气道与喉入口在整个呼吸系统中的位置，为后续机制学习建立空间地图。",
    hotspots: ["鼻/口入口", "咽腔通道", "喉入口", "气管延续"],
    prompt: "请从系统解剖角度解读上气道图谱，说明其与困难气道评估的关系。",
  },
  {
    title: "上气道矢状位精细图",
    tag: "局部解剖",
    img: "/images/detailed_sagittal_view_of_upper_airway.png",
    desc: "突出舌体、软腭、咽腔、会厌和喉口的空间关系，是理解喉镜仅见会厌的关键图谱。",
    hotspots: ["舌体占位", "软腭后缘", "咽后壁", "会厌遮挡"],
    prompt: "请解读上气道矢状位图，重点解释舌体、软腭、会厌、咽腔与喉镜暴露困难的联系。",
  },
  {
    title: "清醒状态气道开放机制",
    tag: "生理",
    img: "/images/upper_airway_mechanism_in_awake_state.png",
    desc: "展示清醒状态下扩张肌张力、吸气负压和气流稳定之间的动态平衡。",
    hotspots: ["扩张肌张力", "吸气负压", "气流稳定", "咽腔开放"],
    prompt: "请用生理学语言解释清醒状态下上气道如何维持开放。",
  },
  {
    title: "组织结构与可塌陷性",
    tag: "组胚",
    img: "/images/upper_airway_anatomy_and_tissue_structure.png",
    desc: "从组织层面说明上气道为何并非固定硬管，而是一个可变形、可塌陷的软组织通道。",
    hotspots: ["黏膜层", "肌层", "脂肪沉积", "组织顺应性"],
    prompt: "请从组胚与局部组织结构角度解释上气道为何具有动态可塌陷性。",
  },
  {
    title: "OSA 病理生理链",
    tag: "病理生理",
    img: "/images/obstructive_sleep_apnea_pathophysiology_diagram.png",
    desc: "串联肥胖、打鼾、肌张力下降、舌后坠和气道塌陷等关键节点。",
    hotspots: ["肥胖", "打鼾", "肌张力下降", "舌后坠"],
    prompt: "请把肥胖、打鼾、全麻后肌张力下降、舌后坠和气道塌陷整合成一条病理生理链。",
  },
  {
    title: "气道评估与风险提示",
    tag: "临床联系",
    img: "/images/airway_assessment_clinical_indicators_and_risks.png",
    desc: "将 Mallampati、肥胖、打鼾和诱导后风险迁移到临床判断。",
    hotspots: ["Mallampati", "打鼾史", "肥胖", "诱导后阻塞"],
    prompt: "请结合 Mallampati、肥胖、打鼾和诱导后风险，生成一段临床联系讲解。",
  },
];

const pathway = [
  ["现象导入", "肥胖、打鼾、全麻后舌后坠、喉镜仅见会厌", "从一个临床困境提出三个机制问题。"],
  ["系统定位", "呼吸系统与上气道入口", "把局部问题放回呼吸通道整体地图。"],
  ["局部空间", "舌体、软腭、咽腔、会厌、喉口", "解释为什么 Mallampati 和喉镜暴露都与口咽空间相关。"],
  ["组织基础", "黏膜、肌肉、脂肪、结缔组织", "说明上气道为什么是可变形、可塌陷的软组织通道。"],
  ["生理平衡", "扩张肌张力、吸气负压、气流阻力", "解释清醒状态下气道为何能保持开放。"],
  ["失衡塌陷", "肥胖占位、打鼾、全麻肌张力下降", "解释潜在狭窄如何变成实际阻塞。"],
  ["临床迁移", "风险识别、预氧合、暴露困难、术后处理", "把基础机制转化为临床判断与处理优先级。"],
];

const resources = [
  // 原始研究与经典文献
  { type: "原始文献", title: "Mallampati 1985：困难插管临床预测体征", desc: "困难气道教学中最核心的原始研究之一，用于解释舌根相对大小、口咽结构可见度与直接喉镜暴露之间的关系。", link: "https://pubmed.ncbi.nlm.nih.gov/4027773/", tags: ["Mallampati", "原始研究", "口咽空间"] },
  { type: "原始文献", title: "Mallampati 1983：临床预测体征早期报告", desc: "用于追溯 Mallampati 评分思想的早期来源，适合放入文献发展脉络模块。", link: "https://pubmed.ncbi.nlm.nih.gov/6336553/", tags: ["Mallampati", "历史脉络"] },
  { type: "原始文献", title: "Samsoon & Young 1987：Mallampati 分级改良", desc: "用于比较原始 Mallampati 与后续改良分类，强化评分体系演化的教学理解。", link: "https://pubmed.ncbi.nlm.nih.gov/3592174/", tags: ["Mallampati", "分级改良", "困难插管"] },
  { type: "原始文献", title: "Wilson 1988：困难插管多因素预测", desc: "用于引入多因素风险评估思想，避免学生把困难气道判断简化为单一评分。", link: "https://pubmed.ncbi.nlm.nih.gov/3414791/", tags: ["多因素评估", "困难插管"] },
  { type: "原始文献", title: "Cormack & Lehane 1984：喉镜暴露分级", desc: "用于解释“仅见会厌”的喉镜视角意义，连接解剖空间与临床暴露结果。", link: "https://pubmed.ncbi.nlm.nih.gov/6475627/", tags: ["Cormack-Lehane", "会厌", "喉镜暴露"] },

  // 指南与共识
  { type: "指南", title: "ASA 2022 困难气道管理实践指南", desc: "困难气道教学的核心指南资源，适合用于讲授术前评估、备用方案、氧合优先和团队沟通。", link: "https://pubmed.ncbi.nlm.nih.gov/34762729/", tags: ["ASA", "困难气道", "指南"] },
  { type: "指南", title: "DAS 2015 成人意外困难插管指南", desc: "适合将意外困难插管转化为流程化教学：Plan A-D、限制尝试次数、氧合优先。", link: "https://pubmed.ncbi.nlm.nih.gov/26556848/", tags: ["DAS", "Plan A-D", "流程"] },
  { type: "指南", title: "Canadian Airway Focus Group：困难气道建议", desc: "用于拓展比较不同体系下困难气道管理的策略差异。", link: "https://pubmed.ncbi.nlm.nih.gov/23974063/", tags: ["气道管理", "共识", "加拿大"] },
  { type: "指南", title: "Vortex Approach：气道危机思维模型", desc: "用于课堂讨论“不能插管、不能氧合”情境下的认知框架与团队沟通。", link: "https://vortexapproach.org/", tags: ["危机管理", "Vortex", "氧合"] },
  { type: "指南", title: "AIDAA：All India Difficult Airway Association", desc: "用于展示困难气道管理在不同指南体系中的策略表述。", link: "https://pubmed.ncbi.nlm.nih.gov/27716788/", tags: ["AIDAA", "困难气道", "指南"] },

  // 综述与机制
  { type: "综述", title: "肥胖与阻塞性睡眠呼吸暂停机制综述", desc: "解释肥胖如何通过上气道软组织占位、咽腔狭窄和通气负荷改变促进 OSA。", link: "https://pmc.ncbi.nlm.nih.gov/articles/PMC2645252/", tags: ["肥胖", "OSA", "病理生理"] },
  { type: "综述", title: "Obstructive Sleep Apnea：病理生理总览", desc: "用于梳理上气道解剖、神经肌肉控制和睡眠状态下气道塌陷机制。", link: "https://www.ncbi.nlm.nih.gov/books/NBK459252/", tags: ["OSA", "上气道塌陷", "睡眠"] },
  { type: "综述", title: "Upper Airway Anatomy and Physiology in OSA", desc: "围绕上气道结构与生理调控，帮助学生理解打鼾与阻塞之间的连续谱。", link: "https://pmc.ncbi.nlm.nih.gov/articles/PMC4402674/", tags: ["上气道", "生理", "OSA"] },
  { type: "综述", title: "Obesity and Difficult Airway：麻醉相关风险", desc: "用于连接肥胖、预氧合储备下降、面罩通气困难和插管困难。", link: "https://pubmed.ncbi.nlm.nih.gov/23460534/", tags: ["肥胖", "麻醉", "困难气道"] },
  { type: "综述", title: "Airway Management in Obese Patients", desc: "用于扩展肥胖患者气道策略：体位、预氧合、视频喉镜与拔管风险。", link: "https://pubmed.ncbi.nlm.nih.gov/27871596/", tags: ["肥胖", "气道管理", "预氧合"] },
  { type: "综述", title: "Physiology of Pharyngeal Airway Patency", desc: "聚焦咽腔开放性、吸气负压与扩张肌活动，支撑生理学模块。", link: "https://pubmed.ncbi.nlm.nih.gov/18250210/", tags: ["咽腔", "生理", "肌张力"] },

  // 教材式与开放学习资源
  { type: "解剖资源", title: "TeachMeAnatomy：Pharynx", desc: "用于复习咽部结构、咽缩肌、黏膜层次与呼吸/吞咽通道关系。", link: "https://teachmeanatomy.info/neck/viscera/pharynx/", tags: ["咽部", "解剖", "开放资源"] },
  { type: "解剖资源", title: "Kenhub：Respiratory System", desc: "用于系统解剖总览，帮助学生先建立呼吸系统与上气道入口的位置关系。", link: "https://www.kenhub.com/en/library/anatomy/the-respiratory-system", tags: ["系统解剖", "呼吸系统"] },
  { type: "解剖资源", title: "TeachMeAnatomy：Larynx", desc: "用于解释会厌、喉口、声门结构与喉镜暴露的局部解剖基础。", link: "https://teachmeanatomy.info/neck/viscera/larynx/", tags: ["喉", "会厌", "声门"] },
  { type: "解剖资源", title: "NCBI Bookshelf：Mallampati Score", desc: "作为 Mallampati 分级的补充学习材料，适合学生课前预习。", link: "https://www.ncbi.nlm.nih.gov/books/NBK585119/", tags: ["Mallampati", "评分", "学习资源"] },
  { type: "解剖资源", title: "NCBI Bookshelf：Difficult Airway", desc: "用于学生理解困难气道定义、评估要点和基本处理策略。", link: "https://www.ncbi.nlm.nih.gov/books/NBK470224/", tags: ["困难气道", "定义", "评估"] },

  // 图像、动画与多模态内容
  { type: "图像图谱", title: "上气道矢状位结构标注图", desc: "用于标注舌体、软腭、咽腔、会厌和喉口，支撑空间结构理解。", link: "", tags: ["图谱", "矢状位", "结构标注"] },
  { type: "图像图谱", title: "正常与狭窄上气道对比图", desc: "展示软组织占位增加、咽腔有效空间缩小和气流阻力上升。", link: "", tags: ["对比图", "气道狭窄"] },
  { type: "图像图谱", title: "Mallampati 分级示意图", desc: "用于课堂中快速展示口咽结构可见度差异。", link: "", tags: ["Mallampati", "分级图"] },
  { type: "机制动画", title: "系统解剖→局部解剖→组胚→生理→病生→临床 串联动画", desc: "用于2至3分钟机制串讲，强调多学科连续性。", link: "", tags: ["机制动画", "多学科"] },
  { type: "机制动画", title: "全麻后舌后坠动态塌陷动画", desc: "用于解释肌张力下降如何导致舌根后移、咽腔狭窄和气道阻塞。", link: "", tags: ["舌后坠", "动态塌陷"] },
  { type: "机制动画", title: "喉镜仅见会厌视角动画", desc: "把局部解剖结构转化为喉镜视野，解释声门暴露失败的空间机制。", link: "", tags: ["会厌", "喉镜视角"] },

  // 病例、PBL、OSCE 与教学评价
  { type: "病例", title: "PBL三幕式病例：肥胖打鼾患者全麻诱导", desc: "通过术前评估、诱导后暴露、术后舌后坠三个阶段释放信息。", link: "", tags: ["PBL", "病例", "三幕式"] },
  { type: "病例", title: "虚拟病人路径：评估—准备—暴露—处理", desc: "用于学生在平台中完成风险识别、策略选择和机制解释。", link: "", tags: ["虚拟病人", "流程训练"] },
  { type: "评价", title: "OSCE站点：困难气道风险评估", desc: "评价学生是否能够识别肥胖、打鼾、Mallampati高级别等风险线索。", link: "", tags: ["OSCE", "风险评估"] },
  { type: "评价", title: "OSCE站点：舌后坠处理与气道开放", desc: "评价学生是否掌握托下颌、开放气道、吸氧和通气道使用的优先级。", link: "", tags: ["OSCE", "术后处理"] },
  { type: "评价", title: "课堂投票题：48小时内是否拔管的伦理讨论迁移", desc: "用于拓展医学伦理与气道安全决策之间的讨论，不替代临床决策。", link: "", tags: ["伦理讨论", "课堂投票"] },
  { type: "评价", title: "形成性评价Rubric：机制解释能力", desc: "从结构识别、因果推理、临床迁移、表达清晰度四项评分。", link: "", tags: ["Rubric", "形成性评价"] },

  // AI提示词与教师工具
  { type: "AI工具", title: "AI读图提示词包", desc: "面向医学图谱生成结构识别、机制解释、课堂追问和讲稿转化。", link: "", tags: ["AI提示词", "读图"] },
  { type: "AI工具", title: "AI动画分镜提示词包", desc: "用于生成写实3D医学机制动画的镜头提示词和分镜说明。", link: "", tags: ["AI动画", "分镜"] },
  { type: "AI工具", title: "AI题库生成提示词包", desc: "生成基础题、机制题、病例题、综合题及答案解析。", link: "", tags: ["题库", "AI生成"] },
  { type: "AI工具", title: "AI文献赏读提示词包", desc: "把指南和原始文献转化为学生可读的导读卡、讨论题和课堂讲稿。", link: "", tags: ["文献导读", "AI工具"] },
  { type: "教师工具", title: "2分钟课堂导入讲稿", desc: "用临床困境快速抓住学生注意力，引出基础医学机制链。", link: "", tags: ["讲稿", "课堂导入"] },
  { type: "教师工具", title: "5分钟机制串讲讲稿", desc: "按现象、解剖、生理、病理生理、临床联系组织完整讲授。", link: "", tags: ["讲稿", "机制串讲"] },
  { type: "教师工具", title: "小组讨论任务单", desc: "引导学生分组完成结构标注、机制解释和处理优先级讨论。", link: "", tags: ["小组讨论", "任务单"] },
  { type: "教师工具", title: "课后自学任务包", desc: "整合图谱复盘、文献导读、题库训练和AI问答任务。", link: "", tags: ["自学", "任务包"] },
];

const quiz = [
  { category: "解剖", stem: "上气道困难暴露最关键的空间结构组合是：", options: ["舌体、软腭、咽腔、会厌、喉口", "食管、胃、十二指肠", "肝、胆、胰", "肾、输尿管、膀胱"], answer: 0, explain: "困难气道主要发生在口咽—喉入口区域，舌体、软腭、会厌和咽腔空间关系尤其关键。" },
  { category: "生理", stem: "清醒状态下维持上气道开放的重要因素是：", options: ["上气道扩张肌张力", "胃肠蠕动", "红细胞数量", "胆汁分泌"], answer: 0, explain: "扩张肌张力持续维持咽腔开放，是抵抗吸气负压导致塌陷的重要机制。" },
  { category: "病理生理", stem: "肥胖打鼾患者全麻后更易舌后坠的机制是：", options: ["肌张力下降叠加软组织占位", "气管软骨完全骨化", "牙齿长度增加", "肺泡数量增加"], answer: 0, explain: "肥胖增加软组织占位，打鼾提示上气道稳定性下降，全麻降低肌张力，使潜在狭窄变成实际阻塞。" },
  { category: "临床", stem: "喉镜下仅见会厌通常提示：", options: ["声门暴露困难风险增加", "声门暴露极佳", "无需备用方案", "一定无法通气"], answer: 0, explain: "仅见会厌提示声门暴露不理想，需要及时调整气道策略。" },
];

function AIWidget({ basePrompt, mode = "机制推理导师", title = "AI 互动", compact = false }) {
  const [prompt, setPrompt] = useState(basePrompt || "");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const ask = async () => {
    const q = prompt.trim();
    if (!q || loading) return;
    setLoading(true);
    setText("");
    try {
      const data = await callAirwayAI({ message: q, mode, model: "deepseek-chat" });
      setText(data.answer || "AI 已响应，但未返回 answer 字段。");
    } catch {
      setText("AI 接口暂不可用。请确认后端服务仍在运行，默认地址为 http://localhost:8787。");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className={cx("mt-4 rounded-3xl border border-blue-100 bg-blue-50/70 p-4", compact && "p-3")}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 font-black text-slate-950"><Sparkles size={18} /> {title}</div>
        <Badge tone="blue">{mode}</Badge>
      </div>
      <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} className="h-24 w-full resize-none rounded-2xl border border-blue-100 bg-white p-3 text-sm leading-6 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100" />
      <div className="mt-3 flex flex-wrap gap-2">
        {["更通俗", "更学术", "生成课堂追问", "生成1分钟讲稿", "生成病例迁移", "生成考试题"].map((x) => (
          <button key={x} onClick={() => setPrompt((p) => `${p}\n\n请${x}。`)} className="rounded-full bg-white px-3 py-1.5 text-xs font-black text-blue-700 ring-1 ring-blue-100">{x}</button>
        ))}
        <button onClick={ask} disabled={loading} className="ml-auto inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800 disabled:opacity-60"><Send size={15} /> 发送给AI</button>
      </div>
      {(loading || text) && <div className="mt-3 whitespace-pre-wrap rounded-2xl bg-white p-4 text-sm leading-7 text-slate-700 ring-1 ring-blue-100">{loading ? "AI 正在生成中……" : text}</div>}
    </div>
  );
}

function FloatingCopilot() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)} className="fixed bottom-6 right-6 z-[80] flex items-center gap-2 rounded-full bg-slate-950 px-5 py-4 font-black text-white shadow-2xl shadow-slate-900/30">
        <Bot size={20} /> 全站AI
      </button>
      {open && (
        <div className="fixed bottom-24 right-6 z-[90] w-[min(430px,calc(100vw-32px))] rounded-[28px] border border-slate-200 bg-white p-4 shadow-2xl">
          <div className="mb-2 flex items-center justify-between">
            <div className="font-black text-slate-950">全站 AI Copilot</div>
            <button onClick={() => setOpen(false)} className="rounded-full bg-slate-100 p-1"><X size={16} /></button>
          </div>
          <AIWidget compact title="开放式问答" basePrompt="请围绕从打鼾到困难气道，帮本系统解释一个学习问题：" mode="机制推理导师" />
        </div>
      )}
    </>
  );
}

function ImageModal({ item, onClose }) {
  const [broken, setBroken] = useState(false);
  if (!item) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-6xl overflow-auto rounded-[30px] bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-start justify-between border-b border-slate-200 bg-white/95 p-5 backdrop-blur">
          <div>
            <Badge tone="blue">{item.tag}</Badge>
            <h3 className="mt-2 text-2xl font-black text-slate-900">{item.title}</h3>
            <p className="mt-2 max-w-3xl text-slate-600">{item.desc}</p>
          </div>
          <button onClick={onClose} className="rounded-full bg-slate-100 p-2 text-slate-600"><X size={18} /></button>
        </div>
        <div className="grid gap-6 p-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="overflow-hidden rounded-3xl bg-slate-100">
            {!broken ? <img src={item.img} alt={item.title} className="h-full w-full object-cover" onError={() => setBroken(true)} /> : <div className="flex h-[430px] items-center justify-center text-slate-400"><ImageIcon size={48} /></div>}
          </div>
          <div>
            <div className="rounded-3xl bg-slate-50 p-5">
              <div className="font-black text-slate-900">图中重点</div>
              <div className="mt-3 grid gap-2">
                {item.hotspots.map((h) => <div key={h} className="rounded-2xl bg-white p-3 text-sm font-semibold text-slate-700">{h}</div>)}
              </div>
            </div>
            <AIWidget title="AI 深度读图" mode="图像解读教官" basePrompt={item.prompt} />
          </div>
        </div>
      </div>
    </div>
  );
}

function VisualAtlas() {
  const [active, setActive] = useState(null);
  const [broken, setBroken] = useState({});
  return (
    <>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {images.map((item) => (
          <Card key={item.title} className="overflow-hidden">
            <button className="block w-full text-left" onClick={() => setActive(item)}>
              <div className="relative h-56 bg-slate-100">
                {!broken[item.title] ? <img src={item.img} alt={item.title} className="h-full w-full object-cover" onError={() => setBroken((s) => ({ ...s, [item.title]: true }))} /> : <div className="flex h-full items-center justify-center text-slate-400"><ImageIcon size={44} /></div>}
                <div className="absolute left-4 top-4"><Badge tone="blue">{item.tag}</Badge></div>
                <div className="absolute bottom-4 right-4 rounded-full bg-white/90 p-2 text-slate-950"><Maximize2 size={16} /></div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-black text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">{item.desc}</p>
                <div className="mt-3 inline-flex items-center gap-2 text-sm font-bold text-blue-700">查看大图与AI深度读图 <ArrowRight size={16} /></div>
              </div>
            </button>
          </Card>
        ))}
      </div>
      <ImageModal item={active} onClose={() => setActive(null)} />
    </>
  );
}

function AnimationTheater() {
  const [localVideo, setLocalVideo] = useState("");
  const [useLocal, setUseLocal] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [chapter, setChapter] = useState(0);

  const defaultVideo = "/videos/airway_mechanism.mp4";
  const currentSrc = useLocal && localVideo ? localVideo : defaultVideo;

  const chapters = [
    {
      time: "00:00",
      title: "系统定位",
      desc: "从呼吸系统整体进入上气道入口，建立空间坐标。",
      prompt: "请围绕机制动画第一幕“系统定位”，生成一段20秒讲解词，强调呼吸系统到上气道入口的过渡。"
    },
    {
      time: "00:28",
      title: "局部聚焦",
      desc: "聚焦舌体、软腭、咽腔、会厌与喉口的相互遮挡关系。",
      prompt: "请围绕机制动画第二幕“局部聚焦”，解释舌体、软腭、咽腔、会厌与喉口之间的空间关系。"
    },
    {
      time: "00:55",
      title: "组织基础",
      desc: "呈现黏膜、肌层、脂肪与结缔组织构成的可变形通道。",
      prompt: "请围绕机制动画第三幕“组织基础”，解释上气道为什么不是固定硬管，而是可塌陷软组织通道。"
    },
    {
      time: "01:20",
      title: "生理平衡",
      desc: "展示清醒状态下扩张肌张力维持气道开放的动态平衡。",
      prompt: "请围绕机制动画第四幕“生理平衡”，讲清扩张肌张力、吸气负压和气道开放之间的关系。"
    },
    {
      time: "01:50",
      title: "麻醉后失衡",
      desc: "呈现全麻后肌张力下降、舌后坠、咽腔狭窄与会厌遮挡。",
      prompt: "请围绕机制动画第五幕“麻醉后失衡”，串联肥胖、打鼾、肌张力下降、舌后坠与仅见会厌。"
    },
    {
      time: "02:20",
      title: "临床回归",
      desc: "回到Mallampati、喉镜暴露、预氧合和术后气道处理。",
      prompt: "请围绕机制动画第六幕“临床回归”，把基础机制迁移到困难气道评估和术后舌后坠处理。"
    },
  ];

  const chooseLocalVideo = (file) => {
    if (!file) return;
    setLocalVideo(URL.createObjectURL(file));
    setUseLocal(true);
    setVideoReady(false);
    setVideoError(false);
  };

  const activeChapter = chapters[chapter];

  return (
    <div className="grid gap-5 lg:grid-cols-[1.18fr_0.82fr]">
      <Card className="overflow-hidden">
        <div className="relative bg-slate-950">
          <video
            key={currentSrc}
            className="aspect-video w-full bg-slate-950 object-cover"
            controls
            preload="metadata"
            poster="/images/detailed_sagittal_view_of_upper_airway.png"
            src={currentSrc}
            onLoadedMetadata={() => {
              setVideoReady(true);
              setVideoError(false);
            }}
            onCanPlay={() => {
              setVideoReady(true);
              setVideoError(false);
            }}
            onError={() => {
              setVideoReady(false);
              setVideoError(true);
            }}
          />

          {!videoReady && (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-900 text-white">
              <div className="max-w-2xl p-8 text-center">
                <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl bg-white/10 ring-1 ring-white/20">
                  <Film size={42} />
                </div>
                <h3 className="text-3xl font-black">多学科机制动画舱</h3>
                <p className="mt-3 text-sm leading-7 text-blue-100">
                  {videoError
                    ? "课程视频未完成加载。系统仍保留分幕导航、课堂讲解与AI脚本生成模块。"
                    : "课程视频加载中。下方分幕导航与右侧教学工具已就绪。"}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-slate-200 bg-white p-4">
          <div className="grid gap-3 md:grid-cols-6">
            {chapters.map((c, i) => (
              <button
                key={c.title}
                onClick={() => setChapter(i)}
                className={cx(
                  "rounded-2xl p-3 text-left transition",
                  chapter === i ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-700 hover:bg-blue-50"
                )}
              >
                <div className={cx("text-xs font-black", chapter === i ? "text-cyan-200" : "text-blue-700")}>{c.time}</div>
                <div className="mt-1 text-sm font-black">{c.title}</div>
              </button>
            ))}
          </div>
        </div>
      </Card>

      <div className="space-y-5">
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-800 p-6 text-white">
            <Badge tone="dark">Mechanism Cinema</Badge>
            <h3 className="mt-4 text-3xl font-black">多学科机制动画舱</h3>
            <p className="mt-3 text-sm leading-7 text-blue-100">
              动画以“系统定位—局部聚焦—组织基础—生理平衡—麻醉后失衡—临床回归”为主线，将抽象机制转化为连续可视化叙事。
            </p>
          </div>
          <div className="p-5">
            <div className="rounded-3xl bg-slate-50 p-5">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-black text-blue-700">{activeChapter.time}</div>
                  <h4 className="mt-1 text-xl font-black text-slate-950">{activeChapter.title}</h4>
                </div>
                <Badge tone="blue">Chapter {chapter + 1}</Badge>
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-600">{activeChapter.desc}</p>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {["结构识别", "机制解释", "课堂追问", "临床迁移"].map((x) => (
                <div key={x} className="rounded-2xl border border-slate-200 bg-white p-4 text-sm font-black text-slate-700">
                  {x}
                </div>
              ))}
            </div>

            <label className="mt-4 flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white p-4 text-sm font-black text-slate-700 shadow-sm hover:bg-slate-50">
              <Upload size={18} /> 载入课程视频
              <input type="file" accept="video/*" className="hidden" onChange={(e) => chooseLocalVideo(e.target.files?.[0])} />
            </label>
          </div>
        </Card>

        <AIWidget
          title="AI分幕讲解生成"
          mode="讲稿润色助手"
          basePrompt={activeChapter.prompt}
        />
      </div>
    </div>
  );
}

function Framework() {
  const [active, setActive] = useState(0);
  const current = pathway[active];
  return (
    <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
      <Card className="p-5">
        <div className="space-y-3">
          {pathway.map((s, i) => (
            <button key={s[0]} onClick={() => setActive(i)} className={cx("flex w-full items-center gap-3 rounded-2xl p-4 text-left transition", active === i ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-700 hover:bg-slate-100")}>
              <div className={cx("flex h-9 w-9 items-center justify-center rounded-full text-sm font-black", active === i ? "bg-cyan-300 text-slate-950" : "bg-white text-slate-500")}>{i + 1}</div>
              <div>
                <div className="font-black">{s[0]}</div>
                <div className={cx("text-xs", active === i ? "text-slate-200" : "text-slate-500")}>{s[2]}</div>
              </div>
            </button>
          ))}
        </div>
      </Card>
      <Card className="p-6">
        <Badge tone="blue">当前机制节点</Badge>
        <h3 className="mt-3 text-3xl font-black text-slate-900">{current[0]}</h3>
        <p className="mt-3 text-lg font-semibold text-slate-700">{current[1]}</p>
        <p className="mt-4 rounded-2xl bg-slate-50 p-5 text-sm leading-7 text-slate-600">{current[2]}</p>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {["结构识别", "机制解释", "病例迁移", "课堂表达"].map((x) => <div key={x} className="rounded-2xl border border-slate-200 p-4 text-sm font-bold text-slate-700">{x}</div>)}
        </div>
        <AIWidget title="AI深度拓展该节点" mode="机制推理导师" basePrompt={`请围绕“从打鼾到困难气道”的机制节点【${current[0]}：${current[1]}】，生成一段高质量教学解释，并提出两个课堂追问。`} />
      </Card>
    </div>
  );
}

function RiskSimulator() {
  const [bmi, setBmi] = useState(40);
  const [snore, setSnore] = useState(8);
  const [mall, setMall] = useState(4);
  const [tongue, setTongue] = useState(8);
  const [sedation, setSedation] = useState(7);
  const risk = useMemo(() => Math.round(Math.min(100, (bmi - 20) * 1.6 + snore * 4 + mall * 10 + tongue * 4.5 + sedation * 3.5)), [bmi, snore, mall, tongue, sedation]);
  const level = risk < 40 ? "低风险" : risk < 70 ? "中风险" : "高风险";
  const openWidth = Math.max(18, 84 - risk * 0.55);
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
      <Card className="overflow-hidden p-6">
        <div className="relative h-[360px] overflow-hidden rounded-[28px] bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-800 p-6 text-white">
          <div className="mb-4 flex items-center justify-between">
            <div><div className="text-sm text-blue-100">AI Risk Simulation</div><div className="text-3xl font-black">上气道开放度模型</div></div>
            <Badge tone={risk < 40 ? "emerald" : risk < 70 ? "amber" : "rose"}>{level}</Badge>
          </div>
          <div className="absolute left-12 top-32 h-36 w-72 rounded-[60%] border-4 border-cyan-200/80" />
          <div className="absolute left-[205px] top-[145px] h-28 rounded-full bg-cyan-200 shadow-[0_0_28px_rgba(103,232,249,.75)] transition-all" style={{ width: openWidth }} />
          <div className="absolute left-[135px] top-[128px] h-32 w-24 rounded-full bg-rose-300/85 transition-transform" style={{ transform: `translateX(${risk * 0.18}px) scale(${1 + risk / 900})` }} />
          <div className="absolute bottom-5 right-5 w-72 rounded-2xl bg-white/10 p-4 text-sm leading-6 ring-1 ring-white/20">风险越高，舌体相对占位越明显，咽腔开放度越小，全麻后更易出现舌后坠和动态塌陷。</div>
        </div>
      </Card>
      <Card className="p-6">
        <div className="mb-5 flex items-center justify-between">
          <div><Badge tone="amber">Interactive Model</Badge><h3 className="mt-3 text-2xl font-black text-slate-900">智能风险参数面板</h3></div>
          <div className="rounded-2xl bg-slate-950 px-4 py-3 text-center text-white"><div className="text-xs">综合评分</div><div className="text-3xl font-black">{risk}</div></div>
        </div>
        <div className="space-y-4">
          {[["BMI", bmi, setBmi, 20, 48, "kg/m²"], ["打鼾严重度", snore, setSnore, 0, 10, "/10"], ["Mallampati", mall, setMall, 1, 4, "级"], ["舌体占位", tongue, setTongue, 0, 10, "/10"], ["麻醉深度", sedation, setSedation, 0, 10, "/10"]].map(([label, value, setValue, min, max, unit]) => (
            <div key={label}>
              <div className="mb-1 flex justify-between text-sm font-semibold text-slate-700"><span>{label}</span><span>{value}{unit}</span></div>
              <input type="range" min={min} max={max} value={value} onChange={(e) => setValue(Number(e.target.value))} className="w-full accent-slate-950" />
            </div>
          ))}
        </div>
        <AIWidget title="AI深度解读模拟结果" mode="机制推理导师" basePrompt={`请根据以下模拟参数进行教学性解读：BMI ${bmi}，打鼾严重度 ${snore}/10，Mallampati ${mall}级，舌体占位 ${tongue}/10，麻醉深度 ${sedation}/10。要求从解剖、生理、病理生理和临床联系进行讲解。`} />
      </Card>
    </div>
  );
}



function AirwayIllustration({ risk = 48, label = "Airway Dynamics" }) {
  const lumen = Math.max(18, 84 - risk * 0.55);
  return (
    <div className="relative h-72 overflow-hidden rounded-[32px] bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-800 text-white">
      <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(90deg,rgba(255,255,255,.18)_1px,transparent_1px),linear-gradient(rgba(255,255,255,.18)_1px,transparent_1px)] [background-size:28px_28px]" />
      <div className="absolute left-8 top-7">
        <div className="text-xs font-black uppercase tracking-[0.24em] text-cyan-100">{label}</div>
        <div className="mt-2 text-2xl font-black">上气道空间动力学</div>
      </div>
      <div className="absolute left-12 top-32 h-28 w-64 rounded-[60%] border-4 border-cyan-200/80" />
      <div className="absolute left-[182px] top-[142px] h-20 rounded-full bg-cyan-200 shadow-[0_0_28px_rgba(103,232,249,.75)] transition-all" style={{ width: lumen }} />
      <div className="absolute left-[118px] top-[126px] h-28 w-24 rounded-full bg-rose-300/85 transition-transform" style={{ transform: `translateX(${risk * 0.16}px) scale(${1 + risk / 950})` }} />
      <div className="absolute bottom-5 left-5 right-5 grid grid-cols-3 gap-3">
        {[
          ["结构", "舌体/软腭/会厌"],
          ["功能", "肌张力/气流"],
          ["临床", "暴露/通气/处理"],
        ].map(([h, d]) => (
          <div key={h} className="rounded-2xl bg-white/10 p-3 ring-1 ring-white/15">
            <div className="text-sm font-black">{h}</div>
            <div className="mt-1 text-[11px] text-blue-100">{d}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MechanismRibbon() {
  const items = [
    ["01", "临床困境", "肥胖、打鼾、全麻后舌后坠"],
    ["02", "空间结构", "舌体、软腭、咽腔、会厌"],
    ["03", "生理支撑", "扩张肌张力维持气道开放"],
    ["04", "病理失衡", "软组织占位与动态塌陷"],
    ["05", "临床迁移", "评估、预氧合、暴露与处理"],
  ];
  return (
    <div className="mt-6 grid gap-3 md:grid-cols-5">
      {items.map(([n, h, d]) => (
        <div key={n} className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-blue-100/70" />
          <div className="relative text-3xl font-black text-blue-100">{n}</div>
          <div className="relative mt-2 font-black text-slate-950">{h}</div>
          <div className="relative mt-2 text-xs leading-5 text-slate-600">{d}</div>
        </div>
      ))}
    </div>
  );
}

function PremiumVisualGrid() {
  const blocks = [
    { icon: Microscope, title: "组织层机制", desc: "软组织顺应性、脂肪沉积与咽腔可塌陷性共同解释气道动态变化。" },
    { icon: HeartPulse, title: "功能层机制", desc: "扩张肌张力与吸气负压构成上气道开放的动态平衡。" },
    { icon: Stethoscope, title: "临床层机制", desc: "Mallampati、喉镜暴露与术后气道处理均回到同一空间机制。" },
  ];
  return (
    <div className="mt-6 grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
      <AirwayIllustration risk={62} label="3D Medical Concept" />
      <div className="grid gap-4">
        {blocks.map((b) => {
          const Icon = b.icon;
          return (
            <Card key={b.title} className="p-5">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-slate-950 text-white">
                  <Icon size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-950">{b.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{b.desc}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function AIInteractionMatrix() {
  const cells = [
    ["图谱", "识别结构、解释遮挡、生成讲稿", "图像解读教官"],
    ["动画", "生成分镜旁白、提炼机制节点", "讲稿润色助手"],
    ["模拟", "解读风险参数、提示机制变化", "机制推理导师"],
    ["病例", "阶段讲评、处理优先级训练", "虚拟病例教官"],
    ["题库", "错因诊断、拓展追问、变式题", "题库生成官"],
    ["资源", "文献导读、课堂任务、讨论题", "文献导读员"],
  ];
  return (
    <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {cells.map(([h, d, m]) => (
        <Card key={h} className="p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="text-xl font-black text-slate-950">{h}</div>
            <Badge tone="blue">{m}</Badge>
          </div>
          <p className="mt-3 text-sm leading-7 text-slate-600">{d}</p>
          <AIWidget compact title={`${h}模块AI任务生成`} mode={m} basePrompt={`围绕“从打鼾到困难气道”的${h}模块，生成一个高质量教学任务：包括学习目标、操作步骤、AI追问和评价方式。`} />
        </Card>
      ))}
    </div>
  );
}

function SmartAINavigator() {
  const cards = [
    { icon: Compass, title: "快速学习路径", desc: "AI按“现象→机制→临床”为学习者规划最短路径", href: "#pathway", prompt: "请为初学者设计一条从打鼾到困难气道的10分钟学习路径。" },
    { icon: GalleryVerticalEnd, title: "图谱理解路径", desc: "进入图谱舱，用AI逐图解释上气道结构", href: "#atlas", prompt: "请告诉本系统学习这些上气道图谱时应先看什么、再看什么。" },
    { icon: Film, title: "机制动画路径", desc: "进入动画剧场，配合AI生成讲稿和追问", href: "#animation", prompt: "请为机制动画设计一套讲解顺序和课堂追问。" },
    { icon: BarChart3, title: "风险推演路径", desc: "调节BMI、Mallampati、麻醉深度，AI解释结果", href: "#simulator", prompt: "请解释如何用风险模拟器理解困难气道机制。" },
    { icon: Library, title: "资源研读路径", desc: "进入资源页，每个资源都有独立详情页和AI导学", href: "#resources", prompt: "请推荐从文献、指南、图谱中学习困难气道的顺序。" },
    { icon: Bot, title: "AI深度问答", desc: "直接进入AI中枢，学生/教师双模式问答", href: "#aihub", prompt: "请扮演困难气道机制导师，带本系统完成一次问答式学习。" },
  ];
  return (
    <section className="relative mx-auto max-w-7xl px-5 pt-6">
      <Card className="overflow-hidden">
        <div className="grid gap-0 lg:grid-cols-[0.78fr_1.22fr]">
          <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-800 p-6 text-white">
            <Badge tone="dark">AI Navigation</Badge>
            <h2 className="mt-4 text-3xl font-black">智能导学入口</h2>
            <p className="mt-3 text-sm leading-7 text-blue-100">
              该区域为智能导学入口，而是一个智能学习导航台。系统支持按目标进入不同学习路径，也能够让AI自动制定学习路线。
            </p>
            <AIWidget
              compact
              title="AI学习路线规划"
              mode="机制推理导师"
              basePrompt="请根据“肥胖打鼾患者全麻后喉镜仅见会厌”这个主题，为临床医学生生成一条分阶段学习路线：先看什么图、理解什么机制、做什么题、如何迁移到临床。"
            />
          </div>
          <div className="grid gap-3 p-5 md:grid-cols-2 xl:grid-cols-3">
            {cards.map((c) => {
              const Icon = c.icon;
              return (
                <a key={c.title} href={c.href} className="group rounded-3xl border border-slate-200 bg-white p-4 transition hover:-translate-y-1 hover:border-blue-300 hover:bg-blue-50">
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white"><Icon size={20} /></div>
                    <ArrowRight className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-600" size={18} />
                  </div>
                  <h3 className="mt-4 font-black text-slate-950">{c.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{c.desc}</p>
                </a>
              );
            })}
          </div>
        </div>
      </Card>
    </section>
  );
}

function ResourceDetailPage({ resource, onBack }) {
  if (!resource) return null;
  const related = resources.filter((r) => r.title !== resource.title && (r.type === resource.type || r.tags.some((t) => resource.tags.includes(t)))).slice(0, 3);
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#dff6ff,transparent_30%),linear-gradient(180deg,#f8fbff,#ffffff)] text-slate-900">
      <nav className="sticky top-0 z-50 border-b border-white/60 bg-white/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-5 py-3">
          <button onClick={onBack} className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-2 text-sm font-black text-white">
            <ArrowRight className="rotate-180" size={16} /> 返回资源库
          </button>
          <div className="font-black text-slate-900">资源详情页</div>
        </div>
      </nav>

      <div className="mx-auto max-w-7xl px-5 py-10">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-800 p-8 text-white">
              <Badge tone="dark">{resource.type}</Badge>
              <h1 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">{resource.title}</h1>
              <p className="mt-4 max-w-3xl text-base leading-8 text-blue-100">{resource.desc}</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {resource.tags.map((t) => <span key={t} className="rounded-full bg-white/10 px-3 py-1 text-xs font-black text-blue-50 ring-1 ring-white/20">{t}</span>)}
              </div>
              {resource.link && (
                <a href={resource.link} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 font-black text-slate-950">
                  打开原始资源 <ArrowRight size={16} />
                </a>
              )}
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-black text-slate-950">教学化拆解</h2>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {[
                  ["学习目标", "明确该资源对应的结构、机制或临床判断能力。"],
                  ["课堂用法", "可作为导入、机制解释、病例讨论或课后拓展材料。"],
                  ["学生任务", "阅读/观察后完成机制链复述和一个临床迁移问题。"],
                  ["评价方式", "通过口头解释、题库训练或小组讨论进行形成性评价。"],
                ].map(([h, d]) => (
                  <div key={h} className="rounded-2xl bg-slate-50 p-4">
                    <div className="font-black text-slate-900">{h}</div>
                    <div className="mt-1 text-sm leading-6 text-slate-600">{d}</div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <div className="space-y-5">
            <Card className="p-5">
              <h2 className="text-2xl font-black text-slate-950">AI资源导师</h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">
                该区域并非弹窗覆盖，而是独立资源详情页。系统支持自由修改问题，让AI围绕该资源生成学习建议、课堂讲稿、讨论题和考试题。
              </p>
              <AIWidget
                title="AI深度导学"
                mode="文献导读员"
                basePrompt={`请围绕资源《${resource.title}》（类型：${resource.type}，标签：${resource.tags.join("、")}），生成：1）学习目标；2）课堂使用方法；3）三条学生讨论问题；4）一道单选题及解析。资源简介：${resource.desc}`}
              />
            </Card>

            <Card className="p-5">
              <h3 className="text-xl font-black text-slate-950">相关资源</h3>
              <div className="mt-4 space-y-3">
                {related.length > 0 ? related.map((r) => (
                  <button key={r.title} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="w-full rounded-2xl bg-slate-50 p-4 text-left">
                    <Badge tone="slate">{r.type}</Badge>
                    <div className="mt-2 font-black text-slate-900">{r.title}</div>
                    <div className="mt-1 text-sm leading-6 text-slate-600">{r.desc}</div>
                  </button>
                )) : <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">暂无相关资源。</div>}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}

function ResourceLibrary({ onOpenResource }) {
  const [q, setQ] = useState("");
  const [type, setType] = useState("全部");
  const types = ["全部", ...Array.from(new Set(resources.map((r) => r.type)))];
  const list = resources.filter((r) => (type === "全部" || r.type === type) && (r.title + r.desc + r.tags.join("")).toLowerCase().includes(q.toLowerCase()));
  return (
    <>
      <div className="mb-4 grid gap-3 md:grid-cols-4"><div className="rounded-3xl bg-slate-950 p-5 text-white"><div className="text-3xl font-black">{resources.length}</div><div className="mt-1 text-sm font-bold text-slate-300">资源总量</div></div><div className="rounded-3xl bg-blue-50 p-5 text-blue-950"><div className="text-3xl font-black">{types.length - 1}</div><div className="mt-1 text-sm font-bold text-blue-700">资源类型</div></div><div className="rounded-3xl bg-cyan-50 p-5 text-cyan-950"><div className="text-3xl font-black">AI</div><div className="mt-1 text-sm font-bold text-cyan-700">逐条导学</div></div><div className="rounded-3xl bg-indigo-50 p-5 text-indigo-950"><div className="text-3xl font-black">Page</div><div className="mt-1 text-sm font-bold text-indigo-700">独立详情页</div></div></div><div className="mb-5 flex flex-col gap-3 md:flex-row">
        <div className="flex flex-1 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm"><Search size={18} className="text-slate-400" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="搜索文献、指南、图谱、病例、OSCE……" className="w-full bg-transparent text-sm outline-none" /></div>
        <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm"><Filter size={18} className="text-slate-400" /><select value={type} onChange={(e) => setType(e.target.value)} className="bg-transparent text-sm font-bold outline-none">{types.map((t) => <option key={t}>{t}</option>)}</select></div>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {list.map((r) => (
          <Card key={r.title} className="p-5">
            <Badge tone="blue">{r.type}</Badge>
            <h3 className="mt-3 text-lg font-black text-slate-900">{r.title}</h3>
            <p className="mt-2 min-h-[72px] text-sm leading-7 text-slate-600">{r.desc}</p>
            <div className="mt-3 flex flex-wrap gap-2">{r.tags.map((t) => <span key={t} className="rounded-full bg-slate-50 px-2 py-1 text-xs font-bold text-slate-500">{t}</span>)}</div>
            <div className="mt-4 flex flex-wrap gap-2">
              <button onClick={() => onOpenResource(r)} className="rounded-full bg-slate-950 px-3 py-2 text-xs font-black text-white">进入详情页</button>
              {r.link && <a href={r.link} target="_blank" rel="noreferrer" className="rounded-full bg-blue-50 px-3 py-2 text-xs font-black text-blue-700">打开原始资源 ↗</a>}
            </div>
            <AIWidget compact title="AI快速导学" basePrompt={`请围绕资源《${r.title}》，先用100字说明它为什么值得学，再给出一个学生任务。`} />
          </Card>
        ))}
      </div>
    </>
  );
}

function AIHub() {
  const [role, setRole] = useState("学生模式");
  const [mode, setMode] = useState("机制推理导师");
  const [input, setInput] = useState("请用‘现象→解剖→生理→病理生理→临床’的逻辑解释：为什么肥胖打鼾患者全麻后更易舌后坠？");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([{ role: "assistant", text: "欢迎来到 AI 教学中枢。系统能够够读图、生成课堂串词、做病例讲评、出题、改笔记和设计讨论。" }]);
  const modes = ["机制推理导师", "图像解读教官", "虚拟病例教官", "题库生成官", "讲稿润色助手", "OSCE考官"];
  const ask = async () => {
    const query = input.trim();
    if (!query || loading) return;
    const history = messages.map((m) => ({ role: m.role, content: m.text }));
    setMessages((prev) => [...prev, { role: "user", text: `【${role}｜${mode}】${query}` }]);
    setInput("");
    setLoading(true);
    try {
      const data = await callAirwayAI({ message: `当前身份：${role}；当前模式：${mode}。${query}`, mode, model: "deepseek-chat", history });
      setMessages((prev) => [...prev, { role: "assistant", text: data.answer || "AI 已返回，但没有 answer 字段。" }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", text: "AI 接口暂不可用。请确认后端服务和 API 均正常。" }]);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-800 p-6 text-white">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-bold ring-1 ring-white/20"><WandSparkles size={14} /> AI Super Teaching Engine</div>
          <h3 className="mt-3 text-3xl font-black">AI 深度赋能教学中枢</h3>
          <p className="mt-3 text-sm leading-7 text-blue-100">AI 并非外挂，而是内核：图谱、框架、模拟、病例、题库、笔记与讨论都能在这里被统一调度和强化。</p>
        </div>
        <div className="p-6">
          <div className="flex flex-wrap gap-2">{["学生模式", "教师模式"].map((x) => <button key={x} onClick={() => setRole(x)} className={cx("rounded-full px-4 py-2 text-sm font-bold", role === x ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-600")}>{x}</button>)}</div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">{modes.map((m) => <button key={m} onClick={() => setMode(m)} className={cx("rounded-2xl border p-4 text-left text-sm font-bold transition", mode === m ? "border-slate-900 bg-slate-950 text-white" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50")}>{m}</button>)}</div>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {[["AI读图", "点击图谱即可自动结构识别与机制解读"], ["AI导学", "把资源变成清晰的学习建议与课堂串联"], ["AI讲评", "对病例和题目给出有教学味道的解析"], ["AI共创", "辅助润色笔记、生成讨论引导与授课话术"]].map(([t, d]) => <div key={t} className="rounded-2xl bg-slate-50 p-4"><div className="font-black text-slate-900">{t}</div><div className="mt-1 text-sm leading-6 text-slate-600">{d}</div></div>)}
          </div>
        </div>
      </Card>
      <Card className="flex min-h-[680px] flex-col overflow-hidden">
        <div className="border-b border-slate-200 bg-white p-5"><div className="text-sm font-semibold text-slate-500">当前身份与模式</div><div className="text-2xl font-black text-slate-900">{role} · {mode}</div></div>
        <div className="flex-1 space-y-4 overflow-auto bg-slate-50 p-5">
          {messages.map((m, i) => <div key={i} className={cx("max-w-[92%] rounded-3xl p-4 text-sm leading-7 shadow-sm", m.role === "user" ? "ml-auto bg-slate-950 text-white" : "bg-white text-slate-800")}>{m.text}</div>)}
          {loading && <div className="max-w-[92%] rounded-3xl bg-white p-4 text-sm font-bold text-slate-500">AI 正在生成中……</div>}
        </div>
        <div className="border-t border-slate-200 bg-white p-5">
          <div className="mb-3 flex flex-wrap gap-2">{["生成1分钟授课串词", "出一道病例型综合题", "整理成知识框架", "生成OSCE追问"].map((p) => <button key={p} onClick={() => setInput(p)} className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-blue-50 hover:text-blue-800">{p}</button>)}</div>
          <div className="flex gap-3">
            <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); ask(); } }} placeholder="输入AI问题。Enter 发送，Shift+Enter 换行。" className="h-24 flex-1 resize-none rounded-2xl border border-slate-200 p-4 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100" />
            <button onClick={ask} disabled={loading} className="inline-flex w-24 items-center justify-center rounded-2xl bg-slate-950 text-white hover:bg-slate-800 disabled:opacity-60"><Send size={20} /></button>
          </div>
        </div>
      </Card>
    </div>
  );
}

function CaseTrainer() {
  const cases = [
    ["术前评估", "42岁肥胖男性，长期打鼾，口咽结构可见度差。", "请对术前评估阶段进行教学讲评，说明为什么它提示困难气道高风险。"],
    ["诱导前准备", "拟进入全麻诱导阶段，需要制定气道策略。", "请生成该场景下的教学型策略建议，强调评估、预氧合和备用方案。"],
    ["喉镜暴露", "诱导后喉镜仅见会厌。", "请解释‘仅见会厌’的机制基础、临床意义和后续思路。"],
    ["术后处理", "拔管后患者出现舌后坠与上气道阻塞。", "请对术后舌后坠的处理优先级与机制依据做教学讲评。"],
  ];
  const [idx, setIdx] = useState(0);
  const [title, desc, ai] = cases[idx];
  return (
    <div className="grid gap-5 lg:grid-cols-[0.88fr_1.12fr]">
      <Card className="p-6">
        <Badge tone="rose">Virtual Patient</Badge>
        <h3 className="mt-3 text-2xl font-black text-slate-900">虚拟病人操作平台</h3>
        <p className="mt-3 text-sm leading-7 text-slate-600">通过分阶段病例，把“现象—机制—处理”贯穿起来，让学生真正学会将基础医学知识转化为临床判断。</p>
        <div className="mt-5 space-y-3">{cases.map((c, i) => <button key={c[0]} onClick={() => setIdx(i)} className={cx("flex w-full items-center justify-between rounded-2xl p-4 text-left", idx === i ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-700 hover:bg-slate-100")}><span className="font-bold">{i + 1}. {c[0]}</span><ChevronRight size={18} /></button>)}</div>
      </Card>
      <Card className="p-6">
        <Badge tone="blue">当前场景</Badge>
        <h3 className="mt-3 text-2xl font-black text-slate-900">{title}</h3>
        <div className="mt-4 rounded-2xl bg-slate-50 p-5 text-sm leading-7 text-slate-700">{desc}</div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">{["风险识别", "机制拆解", "临床迁移", "课堂追问"].map((x) => <div key={x} className="rounded-2xl border border-slate-200 p-4 text-sm font-semibold text-slate-700">{x}</div>)}</div>
        <AIWidget title="AI教官自由讲评" mode="虚拟病例教官" basePrompt={ai} />
      </Card>
    </div>
  );
}

function QuizPanel() {
  const [answers, setAnswers] = useState({});
  const score = useMemo(() => quiz.reduce((acc, q, i) => acc + (answers[i] === q.answer ? 1 : 0), 0), [answers]);
  return (
    <Card className="p-6">
      <div className="mb-5 flex items-center justify-between">
        <div><Badge tone="amber">Assessment</Badge><h3 className="mt-3 text-2xl font-black text-slate-900">智能题库与 AI 讲题</h3></div>
        <div className="rounded-2xl bg-slate-950 px-4 py-3 text-center text-white"><div className="text-xs">得分</div><div className="text-2xl font-black">{score}/{quiz.length}</div></div>
      </div>
      <div className="space-y-5">
        {quiz.map((item, i) => (
          <div key={item.stem} className="rounded-3xl border border-slate-200 p-5">
            <Badge tone="slate">{item.category}</Badge>
            <h4 className="mt-3 font-black leading-7 text-slate-900">{i + 1}. {item.stem}</h4>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {item.options.map((op, j) => <button key={op} onClick={() => setAnswers((s) => ({ ...s, [i]: j }))} className={cx("rounded-2xl border p-4 text-left text-sm font-semibold", answers[i] === j ? (j === item.answer ? "border-emerald-300 bg-emerald-50 text-emerald-800" : "border-rose-300 bg-rose-50 text-rose-800") : "border-slate-200 bg-white hover:bg-slate-50")}>{String.fromCharCode(65 + j)}. {op}</button>)}
            </div>
            {answers[i] !== undefined && (
              <div className="mt-4 rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-700">
                <b>{answers[i] === item.answer ? "回答正确。" : "回答错误。"}</b> {item.explain}
                <AIWidget compact title="AI深度讲题" mode="题库生成官" basePrompt={`请对题目“${item.stem}”进行教学解析，包含考点、正确答案依据、错误选项错因和一个拓展追问。`} />
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}

function Studio() {
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState(["肥胖→软组织占位增加→打鼾提示上气道稳定性下降→全麻后肌张力下降→舌后坠与咽腔塌陷→喉镜仅见会厌。"]);
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Card className="p-6">
        <div className="flex items-center gap-3"><PenSquare className="text-slate-900" /><h3 className="text-2xl font-black text-slate-900">笔记空间</h3></div>
        <p className="mt-3 text-sm leading-7 text-slate-600">把学习结果沉淀为自己的语言，并让 AI 辅助润色成更适合复习、答题和授课的表达。</p>
        <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="写下本系统的机制总结、临床联系或课堂灵感……" className="mt-4 h-32 w-full resize-none rounded-2xl border border-slate-200 p-4 text-sm outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100" />
        <div className="mt-3 flex flex-wrap gap-3"><button onClick={() => { if (note.trim()) { setNotes([note, ...notes]); setNote(""); } }} className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-bold text-white">保存笔记</button></div>
        <AIWidget title="AI深度润色笔记" mode="讲稿润色助手" basePrompt={`请把以下学习笔记润色为更适合医学生背诵与课堂复述的版本：${note || "请示范性生成一段高质量机制笔记。"}`} />
        <div className="mt-4 space-y-3">{notes.map((n, i) => <div key={i} className="rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-700">{n}</div>)}</div>
      </Card>
      <Card className="p-6">
        <div className="flex items-center gap-3"><MessageCircle className="text-slate-900" /><h3 className="text-2xl font-black text-slate-900">讨论与师生交互</h3></div>
        <p className="mt-3 text-sm leading-7 text-slate-600">AI 可自动设计课堂引导语、递进追问和汇报框架，提升课堂互动质量与深度。</p>
        <div className="mt-4 space-y-4">
          {["为什么打鼾并非普通症状，而是困难气道的机制线索？", "为什么全麻会把潜在狭窄变成实际阻塞？", "为什么仅见会厌是整个机制链的外显终点？"].map((q) => (
            <div key={q} className="rounded-2xl bg-slate-50 p-4">
              <div className="text-sm font-bold leading-7 text-slate-800">{q}</div>
              <AIWidget compact title="AI深度设计讨论" mode="讲稿润色助手" basePrompt={`围绕讨论题“${q}”，请生成：1）教师引导语；2）3个递进追问；3）小组汇报建议框架。`} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

function Dashboard() {
  const cards = [
    ["图谱学习", "6张图", Eye, "高清图谱、热点结构、AI读图与授课转化"],
    ["动画剧场", "视频中枢", Film, "机制动画嵌入、分镜讲解与AI讲稿"],
    ["资源矩阵", "40+条", Library, "原始文献、指南、综述、病例、OSCE与教师工具"],
    ["AI触点", "全站覆盖", Bot, "主中枢与各模块场景化AI协同运行"],
  ];
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map(([title, stat, Icon, desc]) => (
          <Card key={title} className="group overflow-hidden p-5 transition hover:-translate-y-1 hover:shadow-[0_24px_80px_rgba(15,23,42,0.10)]">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white"><Icon size={22} /></div>
              <div className="text-2xl font-black text-slate-900">{stat}</div>
            </div>
            <h3 className="mt-4 text-lg font-black text-slate-900">{title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-600">{desc}</p>
          </Card>
        ))}
      </div>
      <MechanismRibbon />
      <PremiumVisualGrid />
      <AIInteractionMatrix />
    </>
  );
}

export default function App() {
  const [activeResource, setActiveResource] = useState(null);

  if (activeResource) {
    return <ResourceDetailPage resource={activeResource} onBack={() => setActiveResource(null)} />;
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,#dff6ff,transparent_30%),radial-gradient(circle_at_top_right,#e0e7ff,transparent_28%),linear-gradient(180deg,#f8fbff,#ffffff)] text-slate-900">
      <nav className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/88 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center gap-6 px-5 py-4">
          <a href="#home" className="mr-auto flex items-center gap-3">
            <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-700 text-white shadow-lg shadow-blue-950/20">
              <AirVent size={23} />
              <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-cyan-300 ring-2 ring-white" />
            </div>
            <div>
              <div className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400">Airway AI Lab</div>
              <div className="text-base font-black tracking-tight text-slate-950">AI气道机制教学系统</div>
            </div>
          </a>

          <div className="hidden items-center gap-8 lg:flex">
            {[
              ["overview", "总控台"],
              ["pathway", "机制路径"],
              ["atlas", "图谱舱"],
              ["animation", "动画剧场"],
              ["resources", "资源库"],
              ["aihub", "AI中枢"],
            ].map(([id, label]) => (
              <a key={id} href={`#${id}`} className="relative text-sm font-black text-slate-600 transition after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-0 after:bg-blue-700 after:transition-all hover:text-blue-700 hover:after:w-full">
                {label}
              </a>
            ))}
          </div>

          <details className="group relative hidden md:block">
            <summary className="list-none cursor-pointer rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-black text-slate-700 shadow-sm hover:bg-slate-50">
              全部功能
            </summary>
            <div className="absolute right-0 top-12 z-[80] w-72 rounded-3xl border border-slate-200 bg-white p-3 shadow-2xl shadow-slate-900/12">
              {nav.map(([id, label]) => (
                <a key={id} href={`#${id}`} className="block rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-800">
                  {label}
                </a>
              ))}
            </div>
          </details>

          <a href="#aihub" className="hidden items-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-black text-white shadow-lg shadow-slate-950/15 transition hover:-translate-y-0.5 hover:bg-blue-950 md:inline-flex">
            <Bot size={17} /> 启动AI
          </a>
        </div>
      </nav>

      <header id="home" className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(56,189,248,.24),transparent_27%),radial-gradient(circle_at_78%_20%,rgba(99,102,241,.22),transparent_30%),linear-gradient(180deg,rgba(255,255,255,.92),rgba(248,251,255,.78))]" />
        <div className="absolute left-1/2 top-10 h-72 w-72 -translate-x-1/2 rounded-full bg-cyan-200/25 blur-3xl" />
        <div className="absolute right-10 top-40 h-80 w-80 rounded-full bg-blue-300/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 pb-12 pt-14">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <div className="inline-flex flex-wrap items-center gap-2 rounded-full border border-slate-200 bg-white/85 px-3 py-2 shadow-sm backdrop-blur">
                <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-black text-white">AI Teaching System</span>
                <span className="text-xs font-black text-slate-500">基础医学融合课程平台</span>
              </div>

              <h1 className="mt-6 max-w-4xl text-5xl font-black tracking-tight text-slate-950 md:text-7xl">
                从打鼾到
                <span className="block bg-gradient-to-r from-blue-700 via-cyan-600 to-slate-950 bg-clip-text text-transparent">困难气道</span>
              </h1>

              <p className="mt-6 max-w-3xl text-lg leading-9 text-slate-600">
                一套面向课堂教学、课后自学、病例推演与形成性评价的 AI 医学融合教学系统。系统集成图谱解析、机制动画、智能模拟、虚拟病例、资源导学、题库训练与学习工作台，构建完整的“学—练—评—改”闭环。
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#aihub" className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 font-black text-white shadow-xl shadow-slate-950/20 transition hover:-translate-y-0.5 hover:bg-blue-950">
                  <Bot size={18} /> 进入 AI 教学中枢
                </a>
                <a href="#animation" className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 font-black text-slate-900 shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-50">
                  <PlayCircle size={18} /> 进入机制动画剧场
                </a>
                <a href="#atlas" className="inline-flex items-center gap-2 rounded-2xl border border-blue-100 bg-blue-50 px-5 py-3 font-black text-blue-800 shadow-sm transition hover:-translate-y-0.5 hover:bg-blue-100">
                  <GalleryVerticalEnd size={18} /> 浏览图谱舱
                </a>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {[
                  ["6大", "医学图谱模块"],
                  ["7层", "机制推理路径"],
                  ["40+", "教学资源条目"],
                ].map(([v, t]) => (
                  <div key={t} className="rounded-3xl border border-white/80 bg-white/80 p-5 shadow-[0_18px_50px_rgba(15,23,42,.06)] backdrop-blur">
                    <div className="text-3xl font-black text-slate-950">{v}</div>
                    <div className="mt-1 text-sm font-bold text-slate-500">{t}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-6 rounded-[40px] bg-gradient-to-br from-cyan-200/30 via-blue-200/20 to-indigo-200/30 blur-2xl" />
              <Card className="relative overflow-hidden">
                <div className="bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-800 p-6 text-white">
                  <div className="mb-6 flex items-center justify-between gap-4">
                    <div>
                      <div className="text-sm font-bold text-blue-100">System Architecture</div>
                      <h3 className="mt-1 text-3xl font-black">AI医学教学系统架构</h3>
                    </div>
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20">
                      <WandSparkles size={30} />
                    </div>
                  </div>

                  <div className="grid gap-3">
                    {[
                      ["01", "图像图谱", "AI读图、结构识别与授课转化"],
                      ["02", "机制动画", "视频嵌入、分镜讲解与AI讲稿"],
                      ["03", "知识框架", "从现象到临床的推理地图"],
                      ["04", "智能模拟", "风险参数与气道开放度联动"],
                      ["05", "资源矩阵", "文献、指南、病例与评价工具沉淀"],
                    ].map(([n, h, d]) => (
                      <div key={n} className="group flex items-center gap-4 rounded-2xl bg-white/10 p-4 ring-1 ring-white/10 transition hover:bg-white/15">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-300 text-sm font-black text-slate-950">{n}</div>
                        <div>
                          <div className="font-black">{h}</div>
                          <div className="mt-1 text-xs leading-5 text-blue-100">{d}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-0 border-t border-slate-200 bg-white">
                  {[
                    ["导学", Compass],
                    ["交互", Activity],
                    ["评价", BarChart3],
                  ].map(([t, Icon]) => (
                    <div key={t} className="flex items-center justify-center gap-2 border-r border-slate-100 p-4 text-sm font-black text-slate-700 last:border-r-0">
                      <Icon size={16} className="text-blue-700" /> {t}
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </header>

      <SmartAINavigator />

      <div className="mx-auto max-w-7xl px-5 pb-16">
        <Section id="overview" eyebrow="Command Center" title="AI医学融合教学系统总控台" desc="系统以“临床现象—基础机制—智能推演—形成性评价”为主线，整合医学图谱、机制动画、智能模拟、资源导学、虚拟病例、智能题库与学习工作台，形成高密度、可交互、可迁移的课程生态。">
          <Dashboard />
        </Section>
        <Section id="pathway" eyebrow="Mechanism Pathway" title="机制路径：从现象到临床的一条连续推理链" desc="系统串联解剖、组胚、生理、病理生理与麻醉基础，形成一条连续、可复述、可迁移的教学主线。">
          <Framework />
        </Section>
        <Section id="atlas" eyebrow="Visual Atlas" title="图谱舱：可点击、可放大、可AI深度读图" desc="每张图都能够进入详情页，AI问题可个性化改写，不再是固定按钮式问答。">
          <VisualAtlas />
        </Section>
        <Section id="animation" eyebrow="Animation Theater" title="多学科机制动画舱：从结构到临床的连续可视化叙事" desc="支持把本系统的 mp4/webm 视频放进 public/videos，也支持在网页中本地视频预览。">
          <AnimationTheater />
        </Section>
        <Section id="simulator" eyebrow="Interactive Simulation" title="AI 风险模拟器：把抽象风险变成动态模型" desc="滑动参数后，气道开放度动态变化，并由 AI 自由解释当前结果。">
          <RiskSimulator />
        </Section>
        <Section id="resources" eyebrow="Resource Library" title="资源库：文献、指南、图谱、病例、OSCE 与教师工具矩阵" desc="资源库具备搜索筛选、详情页研读、原文链接、AI导学、课堂使用建议与讨论问题生成能力。">
          <ResourceLibrary onOpenResource={setActiveResource} />
        </Section>
        <Section id="aihub" eyebrow="AI Teaching Core" title="AI 教学中枢：学生模式 / 教师模式 / 多角色开放式交互" desc="AI中枢承担全站知识调度，各板块同步配置独立AI互动面板，形成“主中枢+场景化AI”的双层架构。">
          <AIHub />
        </Section>
        <Section id="case" eyebrow="Virtual Patient" title="虚拟病人：机制链进入临床场景" desc="每个病例阶段均可个性化编辑提问并让 AI 教官讲评。">
          <CaseTrainer />
        </Section>
        <Section id="quiz" eyebrow="Assessment" title="智能题库：边练边讲，边错边学" desc="题目、解析、错因、拓展追问都能由 AI 进一步生成。">
          <QuizPanel />
        </Section>
        <Section id="studio" eyebrow="Learning Studio" title="学习工作台：笔记、讨论、师生交互、AI共创" desc="笔记和讨论也能进入 AI 共创流程，而并非孤立文本框。">
          <Studio />
        </Section>
      </div>

      <FloatingCopilot />

      <footer className="border-t border-slate-200 bg-white py-8 text-center text-sm text-slate-500">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-5"><GraduationCap size={18} /> AI医学融合教学系统 ·  Supermax Interactive Edition · 教学训练用途 · 非临床决策工具</div>
      </footer>
    </main>
  );
}
