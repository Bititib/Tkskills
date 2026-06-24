# TK Skills

面向 TikTok Shop 跨境卖家的 Codex / OpenClaw Skills 项目，用于选品分析、内容生成、广告优化、达人建联、对标账号视频分析，以及卖家日报自动化。

## 已实现的 Skills

| Skill | 功能 |
| --- | --- |
| `tk-product-research` | AI 选品分析：爆品概率评分、竞争强度、利润结构、盈亏平衡 ROAS、测试建议。 |
| `tk-content-generator` | TikTok 内容生成：hook、脚本、分镜、口播、字幕、标题、标签。 |
| `tk-ads-optimizer` | TikTok 广告优化：分析广告 CSV，输出放量、降价、换素材、关停候选建议。 |
| `tk-creator-outreach` | 达人建联：达人评分、合作优先级、私信话术、CRM 下一步。 |
| `tk-competitor-video-research` | 对标账号视频分析：账号采集队列、视频评分、爆款候选、可复刻内容结构。 |
| `tk-seller-automation` | 卖家自动化：串联所有分析 Skill，生成每日复盘报告。 |

## 快速开始

生成样例输入数据：

```powershell
npm.cmd run tk:sample
```

运行完整卖家日报流水线：

```powershell
npm.cmd run tk:daily
```

检查 TikTok 官方 API 凭证是否准备好：

```powershell
npm.cmd run tk:api-check
```

只运行对标账号视频分析：

```powershell
npm.cmd run tk:competitor-queue
npm.cmd run tk:competitor-analyze
```

在 Windows PowerShell 中，如果 `npm.ps1` 被执行策略拦截，请使用 `npm.cmd`。

## 输入文件

把 TikTok Shop、TikTok Ads、Affiliate、达人或对标账号数据导出为 CSV，放到：

```text
data/input
```

默认支持这些文件：

```text
products.csv
content.csv
ads.csv
creators.csv
competitor_accounts.csv
competitor_videos.csv
```

运行后会在下面目录生成报告和评分结果：

```text
data/output/<run-id>
```

常见输出包括：

```text
product_scores.csv
content_briefs.csv
ads_actions.csv
creator_scores.csv
competitor_collection_queue.csv
competitor_video_scores.csv
daily_report.md
pipeline_manifest.json
```

## 项目安全边界

当前版本是“分析优先”的安全实现：

- 不自动关停广告。
- 不自动发送达人私信。
- 不绕过 TikTok 登录、访问限制、频率限制或账号隐私设置。
- 不要求保存 TikTok 账号密码。
- 广告预算、出价、关停、私信、发布等动作都只生成候选建议，需要人工确认。

## API 接入方向

后续可以接入这些更符合卖家身份的官方能力：

- TikTok Shop Partner API：订单、商品、库存、履约。
- TikTok Shop Affiliate API：达人、联盟、佣金、合作表现。
- TikTok API for Business：广告账户、广告报表、投放数据。
- TikTok Display API：读取已授权达人账号的公开视频数据。

API 凭证检查脚本：

```powershell
npm.cmd run tk:api-check
```

## 版本归档

第一版已归档在：

```text
versions/tk-skills-v1-20260624
```

这个目录保留了最早的 4 个 CSV 分析型 Skill，方便回滚或对比。
