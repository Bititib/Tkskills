# TK Skills

TikTok Shop seller skills and automation workflows for product research, content planning, ads optimization, creator outreach, and competitor video research.

## Skills

| Skill | Purpose |
| --- | --- |
| `tk-product-research` | Score product candidates, competition, margin, breakeven ROAS, and launch recommendations. |
| `tk-content-generator` | Generate TikTok hooks, scripts, shot lists, captions, titles, and hashtags. |
| `tk-ads-optimizer` | Analyze TikTok Ads CSV exports and produce scale, reduce bid, refresh creative, and pause-candidate recommendations. |
| `tk-creator-outreach` | Score creators and generate outreach queues, first DMs, and CRM next steps. |
| `tk-competitor-video-research` | Build competitor account collection queues and score benchmark videos for viral and replicable patterns. |
| `tk-seller-automation` | Run the daily seller pipeline across all analysis skills and generate a review-ready report. |

## Quick Start

Generate sample input files:

```powershell
npm.cmd run tk:sample
```

Run the full daily pipeline:

```powershell
npm.cmd run tk:daily
```

Check API credential readiness:

```powershell
npm.cmd run tk:api-check
```

Run competitor video tasks only:

```powershell
npm.cmd run tk:competitor-queue
npm.cmd run tk:competitor-analyze
```

Use `npm.cmd` on Windows PowerShell if `npm.ps1` is blocked by execution policy.

## Input Files

Place CSV exports in `data/input`:

```text
products.csv
content.csv
ads.csv
creators.csv
competitor_accounts.csv
competitor_videos.csv
```

The pipeline writes generated reports and scored CSV files to `data/output/<run-id>`.

## Safety Model

This project is analysis-first:

- It does not auto-pause ads.
- It does not auto-send creator messages.
- It does not bypass TikTok login, rate limits, or account privacy controls.
- It treats budget, bid, outreach, and publishing actions as manual-review steps.

## Version Archive

`versions/tk-skills-v1-20260624` stores the first CSV-analysis version of the initial four skills.
