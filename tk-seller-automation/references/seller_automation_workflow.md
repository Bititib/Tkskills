# Seller Automation Workflow

## Version 2 Scope

This pipeline automates analysis and report generation, not irreversible account actions.

## Inputs

Place seller exports in `data/input`:

- `products.csv`: product candidates, cost, price, trend, content, and competition scores.
- `content.csv`: products and angles for content brief generation.
- `ads.csv`: TikTok Ads campaign, ad group, spend, impression, click, order, revenue, target CPA, and target ROAS.
- `creators.csv`: creator handles, category fit, engagement, audience fit, and collaboration fit.
- `competitor_accounts.csv`: benchmark accounts to collect in browser-assisted or API mode.
- `competitor_videos.csv`: benchmark account video metrics and content annotations.

## Outputs

Each run creates `data/output/<run-id>`:

- `product_scores.csv`
- `content_briefs.csv`
- `ads_actions.csv`
- `creator_scores.csv`
- `competitor_collection_queue.csv`
- `competitor_video_scores.csv`
- `daily_report.md`
- `pipeline_manifest.json`

## Operating Model

1. Export CSV files from TikTok Shop, TikTok Ads, Affiliate Center, or CRM.
2. Save them to `data/input`.
3. Run the pipeline.
4. Review the report.
5. Manually approve any account-changing action.

## Future API Mode

Official API mode should map API responses into the same four CSV schemas before running analysis. Keep the analysis layer stable even when data sources change.
