---
name: tk-competitor-video-research
description: TikTok competitor account video research for sellers. Use when collecting and analyzing benchmark account videos, public TikTok account handles, recent video metrics, hooks, captions, hashtags, views, likes, comments, shares, saves, posting cadence, content formats, viral rate, replicable angles, and competitor video reports from CSV or browser-assisted collection.
---

# TK Competitor Video Research

Use this skill to build a review-ready competitor video research report from account handles and video metrics.

## Workflow

1. Put account handles in `data/input/competitor_accounts.csv`.
2. Run `scripts/create_competitor_collection_queue.js` to generate a browser/API collection queue.
3. Fill `data/input/competitor_videos.csv` with public video metrics from TikTok pages, authorized APIs, or a third-party data export.
4. Run `scripts/analyze_competitor_videos.js` to score videos.
5. Use the scored output to identify:
   - Benchmark accounts
   - Viral videos
   - High-frequency hooks
   - Repeatable content formats
   - Hashtags and topics worth testing
   - Scripts or angles that can be adapted for the seller's own products

## Input Files

`competitor_accounts.csv`:

```text
handle,account_url,country,category,notes
```

`competitor_videos.csv`:

```text
handle,video_url,caption,hook,format,category,country,posted_at,views,likes,comments,shares,saves,duration_seconds,hashtags,product_angle
```

## Collection Modes

- CSV mode: analyze manually exported or prepared video rows.
- Browser-assisted mode: open each public account URL and fill the video metrics table from visible data.
- API mode: map authorized API or third-party data into the same CSV schema before analysis.

## Guardrails

- Do not bypass login, rate limits, or platform access controls.
- Do not collect private account data.
- Do not treat competitor content as copy-paste material; extract structure, angle, and testing hypotheses.
