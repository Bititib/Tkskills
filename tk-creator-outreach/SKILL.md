---
name: tk-creator-outreach
description: TikTok Shop达人建联和联盟运营。用于根据订单、产品、国家、达人画像、粉丝数、互动率、内容匹配度、受众国家、带货能力和合作成本，评分达人质量，生成个性化私信、跟进话术、合作优先级、报价建议和CRM表。
---

# TK Creator Outreach

Use this skill to score TikTok creators and draft compliant outreach for affiliate or sample collaboration.

## Workflow

1. Collect product, category, country, creator handle, follower count, engagement rate, category match, audience country match, sales proof, content style, and estimated collaboration cost.
2. Run `scripts/score_creator_outreach.js` when creator data is in CSV form. Use `scripts/score_creator_outreach.py` only when Python is available.
3. Apply `references/creator_scoring_and_messages.md` for scoring, prioritization, and message style.
4. Output:
   - Creator score
   - Priority
   - Match reason
   - Suggested offer
   - First DM
   - Follow-up message
   - CRM next step

## Compliance Rules

- Personalize messages with a real content reference when available.
- Do not generate deceptive claims, fake scarcity, or fake prior relationship wording.
- Include a clear collaboration intent.
- Use frequency caps and respect opt-outs when sending messages through any external tool.
