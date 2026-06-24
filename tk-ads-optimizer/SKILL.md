---
name: tk-ads-optimizer
description: TikTok Ads广告优化。用于分析TikTok广告系列、广告组、素材、关键词、花费、CTR、CPC、CVR、CPA、ROAS、GMV和ROI，输出广告组拆分、关键词结构、出价策略、预算调整、ROI监控和低效广告关停建议。
---

# TK Ads Optimizer

Use this skill to analyze TikTok Ads performance and produce operator-ready optimization actions.

## Workflow

1. Collect campaign, ad group, ad, spend, impressions, clicks, orders, revenue, target CPA, target ROAS, and gross margin.
2. Run `scripts/analyze_ad_performance.js` for CSV-based analysis. Use `scripts/analyze_ad_performance.py` only when Python is available.
3. Apply `references/ads_optimization_rules.md` to classify each row.
4. Output recommended action:
   - Scale
   - Keep testing
   - Reduce bid
   - Refresh creative
   - Pause candidate
5. Separate "recommended action" from "auto-execute action". Default to recommendation only unless the user explicitly provides API credentials and asks to execute.

## Guardrails

- Do not auto-pause campaigns without a clear user request.
- Avoid strong conclusions when spend, clicks, or orders are statistically thin.
- Consider breakeven ROAS from margin before recommending scale.
