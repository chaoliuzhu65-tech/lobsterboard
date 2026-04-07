# 🦞 德胧 AI 任务指挥中心 - LobsterBoard 部署指南

**部署时间**: 2026-04-07 09:51  
**部署人**: claw 分析官（小小）  
**OPEN ID**: ou_f7653f0ada5ad48a78ca303cc6f289f9

---

## 📍 访问地址

**本地访问**: http://localhost:3000  
**远程访问**: 待配置 Nginx 反向代理（建议 https://ai.delon.com/lobsterboard）

---

## 🎯 核心功能

### 1. 四只龙虾状态监控
- 指挥龙虾（腾讯云 OpenClaw）- 🟢 运行中
- 宾客质量龙虾（WorkBuddy）- ⏳ 待登记
- 数据龙虾（ArkClaw）- ⏳ 待登记
- 营销龙虾（妙搭龙虾）- ⏳ 待登记

### 2. 任务看板
- 今日任务列表
- 任务状态（待领取/处理中/已完成/已超时）
- 任务优先级（P0🔴/P1🟡/P2🟢）
- 响应时限追踪

### 3. 成本追踪
- Token 消耗统计
- API 调用次数
- 日/周/月成本预测

### 4. 实时监控
- HEARTBEAT 执行状态
- Cron 定时任务历史
- 错误日志告警

### 5. 记忆系统
- Dreaming 记忆状态
- 记忆文件浏览
- 上下文调试

---

## 🛠️ 管理命令

```bash
# 查看服务状态
pm2 list lobsterboard

# 查看日志
tail -f /root/.openclaw/lobsterboard/lobsterboard.log

# 重启服务
cd /root/.openclaw/lobsterboard && npm restart

# 停止服务
cd /root/.openclaw/lobsterboard && npm stop
```

---

## 📋 下一步配置

### 1. 配置 Nginx 反向代理（推荐）
```nginx
server {
    listen 443 ssl;
    server_name ai.delon.com;
    
    location /lobsterboard {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 2. 配置开机自启动
```bash
# 创建 systemd 服务
sudo nano /etc/systemd/system/lobsterboard.service

# 启用服务
sudo systemctl enable lobsterboard
sudo systemctl start lobsterboard
```

### 3. 配置告警通知
- 飞书 webhook 集成
- 任务超时自动通知
- 成本超预算告警

---

## 🎨 德胧专属布局建议

```
┌─────────────────────────────────────────────────────┐
│ 🦞 德胧 AI 任务指挥中心                    2026-04-07 │
├─────────────────────────────────────────────────────┤
│  [四只龙虾状态]  [今日任务]  [成本追踪]  [告警]    │
├──────────────┬──────────────────────────────────────┤
│ 🦞 龙虾状态   │ 📋 今日任务看板                    │
│ 指挥龙虾 🟢  │ ┌────────────────────────────────┐ │
│ 质量龙虾 🟡  │ │ TASK-001 晨间巡检    06:00 ✅  │ │
│ 数据龙虾 🟢  │ │ TASK-002 差评监控    09:00 ⏳  │ │
│ 营销龙虾 ⚪  │ │ TASK-003 数据巡检    15:00 ⏸️  │ │
│              │ │ TASK-004 周度摘要    周一  ⏸️  │ │
│ 响应时间：   │ └────────────────────────────────┘ │
│ P0: <30s ✅  │                                      │
│ P1: <5m  ✅  │ 📊 成本统计（今日）                │
│ P2: <30m ✅  │ Token: 12,450 | 成本：¥3.6         │
├──────────────┴──────────────────────────────────────┤
│ 📝 实时日志 | 🧠 记忆状态 | ⏰ Cron 历史            │
└─────────────────────────────────────────────────────┘
```

---

## 📞 技术支持

- LobsterBoard 官方文档：https://lobsterboard.com/
- GitHub 仓库：https://github.com/igounton/lobsterboard
- 德胧 AI 内部支持：claw 分析官（OPEN ID: ou_f7653f0ada5ad48a78ca303cc6f289f9）

---

**版本**: v1.0  
**最后更新**: 2026-04-07 09:51
