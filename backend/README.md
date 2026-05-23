# DeepSeek 困难气道专科AI真实接入包

这个包用于把网站里的“DeepSeek 专科AI”从演示版改成真实可调用的大模型系统。

## 正确架构

```text
浏览器前端
  ↓ fetch("/api/deepseek-airway")
你的后端服务器
  ↓ 使用环境变量 DEEPSEEK_API_KEY
DeepSeek API
```

前端不要直接写 API Key。密钥必须放在服务器端环境变量中。

## 本地运行

```bash
cd deepseek_airway_real_integration_package
npm install
cp .env.example .env
# 编辑 .env，填入你的 DEEPSEEK_API_KEY
npm run dev
```

测试接口：

```bash
curl http://localhost:8787/health
```

测试问答：

```bash
curl -X POST http://localhost:8787/api/deepseek-airway \
  -H "Content-Type: application/json" \
  -d '{"message":"为什么肥胖打鼾患者全麻后容易舌后坠？","mode":"机制推理导师","model":"deepseek-chat"}'
```

## 前端连接

当前 Canvas 网站已经改成真实接口优先：

```js
fetch("/api/deepseek-airway", ...)
```

如果前端和后端不同端口，本地可临时改成：

```js
fetch("http://localhost:8787/api/deepseek-airway", ...)
```

正式部署建议前后端同域，例如：

```text
https://your-site.com
https://your-site.com/api/deepseek-airway
```

## 顶级平台升级建议

- 学生账号与班级管理
- 教师端学情仪表盘
- 错题本与薄弱点追踪
- 文献向量检索 RAG
- 资源收藏与学习路径推荐
- OSCE评分自动汇总
- 微课观看进度记录
