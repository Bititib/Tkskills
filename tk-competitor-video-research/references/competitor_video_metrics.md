# Competitor Video Metrics

## Video Score Formula

```text
video_score =
  view_score * 0.35
+ engagement_score * 0.25
+ comment_score * 0.10
+ share_save_score * 0.15
+ recency_score * 0.10
+ format_fit_score * 0.05
```

## Derived Metrics

```text
engagement_rate = (likes + comments + shares + saves) / views
comment_rate = comments / views
share_save_rate = (shares + saves) / views
```

## Viral Flags

Use `viral_candidate` when:

- views >= 100000
- or video_score >= 75
- or engagement_rate >= 0.08 and views >= 20000

Use `replicate_candidate` when:

- viral_candidate is true
- hook is specific and reusable
- format is feasible for the seller to film
- product_angle maps to the seller's product or category

## Format Labels

Prefer stable labels:

- before_after
- problem_solution
- demo
- unboxing
- review
- comparison
- tutorial
- listicle
- story
- offer
