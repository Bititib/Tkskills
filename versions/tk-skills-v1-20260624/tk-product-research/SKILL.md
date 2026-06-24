---
name: tk-product-research
description: TikTok Shop跨境AI选品分析。用于根据类目、国家、预算、成本、售价、物流、佣金、竞品或趋势数据，输出爆品概率评分、竞争强度、利润结构、盈亏平衡ROAS、可复制素材角度和结构化选品表。
---

# TK Product Research

Use this skill to turn TikTok Shop product inputs into a ranked product research report.

## Workflow

1. Collect the user's category, target country, launch budget, expected selling price, product cost, shipping cost, commission rate, and any competitor or trend data.
2. If the user provides a CSV, run `scripts/calculate_product_scores.js` and use the generated table as the factual base. Use `scripts/calculate_product_scores.py` only when Python is available.
3. If fields are missing, make conservative assumptions and label them clearly in the output.
4. Score each product using `references/product_scoring_rules.md`.
5. Output a concise table with:
   - Product
   - Viral probability score
   - Competition strength
   - Gross margin
   - Breakeven ROAS
   - Launch budget fit
   - Replicable material angles
   - Recommendation

## Input CSV

Prefer these columns when available:

```text
product,category,country,selling_price,product_cost,shipping_cost,commission_rate,trend_score,content_score,competition_score,supplier_score
```

`commission_rate` may be `0.12` or `12`.

## Output Rules

- Treat scoring as a decision aid, not a guarantee.
- Flag products with weak margin even when the viral score is high.
- Recommend "test", "watch", or "avoid" instead of overclaiming certainty.
- Always include the reason behind the top 3 recommendations.
