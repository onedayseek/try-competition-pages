# 前端连接说明

Canvas 里的 React 组件已预留：

```js
fetch("/api/deepseek-airway", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ message, mode, model, history })
})
```

后端部署成功后，网站状态会显示“已接入”。后端不存在时，自动进入“离线演示”。
