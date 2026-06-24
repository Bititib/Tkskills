---
name: tk-content-generator
description: TikTok跨境短视频内容生成。用于根据产品、国家、受众、痛点、卖点、价格和素材类型，生成TikTok视频脚本、hook、pain、demo、CTA、分镜、口播、字幕、标题、标签、UGC拍摄清单和素材复用方案。
---

# TK Content Generator

Use this skill to create TikTok-ready content briefs for cross-border products.

## Workflow

1. Gather product name, target country, audience, pain point, key benefit, proof, price, offer, and desired video length.
2. Choose a structure from `references/video_script_frameworks.md`.
3. Generate 3-5 distinct creative angles instead of minor wording variants.
4. Use `scripts/build_content_brief.js` when the user provides a product CSV and wants batch briefs. Use `scripts/build_content_brief.py` only when Python is available.
5. Output each brief with:
   - Hook
   - Pain
   - Demo
   - Proof
   - CTA
   - Shot list
   - Voiceover
   - On-screen captions
   - Title
   - Hashtags

## Style Rules

- Keep hooks short and visually filmable.
- Avoid unsupported medical, income, or guaranteed-result claims.
- Prefer UGC language over polished brand copy.
- Make the first 2 seconds specific enough to guide the shot.
