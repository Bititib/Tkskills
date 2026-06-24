---
name: tk-seller-automation
description: TikTok Shop seller automation pipeline. Use for seller-side daily automation that reads Shop, Ads, Affiliate, creator, product, and content CSV exports, runs the TK product research, content generation, ads optimizer, and creator outreach scripts, and produces dated seller reports with manual-review action queues.
---

# TK Seller Automation

Use this skill to run the seller-side automation pipeline across the four TK skills in this workspace.

## Workflow

1. Put exported seller files in `data/input`.
2. Use these default filenames when possible:
   - `products.csv`
   - `content.csv`
   - `ads.csv`
   - `creators.csv`
   - `competitor_accounts.csv`
   - `competitor_videos.csv`
3. Run `scripts/run_daily_pipeline.js`.
4. Review `data/output/<run-id>/daily_report.md`.
5. Treat all scale, pause, outreach, and API execution items as manual-review actions unless the user explicitly asks for a controlled execution step.

## Commands

Create sample input files:

```bash
node tk-seller-automation/scripts/generate_sample_input_data.js
```

Run the daily pipeline:

```bash
node tk-seller-automation/scripts/run_daily_pipeline.js
```

Use custom directories:

```bash
node tk-seller-automation/scripts/run_daily_pipeline.js --input data/input --output data/output
```

## Seller Guardrails

- Do not auto-pause ads.
- Do not auto-send creator messages.
- Do not bypass TikTok login, rate limits, or account privacy controls.
- Do not modify budgets without explicit confirmation.
- Output action queues for review first.
- Prefer CSV exports until official API credentials and scopes are confirmed.
