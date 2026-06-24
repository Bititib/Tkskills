# Creator Scoring and Messages

## Creator Quality Formula

```text
creator_score =
  category_match * 0.25
+ engagement_score * 0.20
+ sales_signal * 0.20
+ audience_country_match * 0.15
+ content_style_match * 0.10
+ cost_fit * 0.10
```

All component scores use a 0-100 scale.

## Priority

```text
high: creator_score >= 75
medium: creator_score >= 55
low: creator_score < 55
```

## First DM Template

```text
Hi {creator_name}, I liked your video about {specific_video_topic}.
We are looking for creators in {category} to test {product_name}.
It helps {audience} with {pain_point}, and your content style feels like a strong fit.
Would you be open to a sample collaboration or affiliate offer?
```

## Follow-Up Template

```text
Hi {creator_name}, quick follow-up on {product_name}.
I think it could fit your audience because {match_reason}.
Happy to send the details if you are open to reviewing it.
```

## Offer Guidance

- Sample only: suitable for smaller creators or early testing.
- Affiliate commission: suitable when margin supports variable payout.
- Flat fee plus commission: suitable for creators with proven sales signals.
- Long-term code: suitable when content performance is repeatable.
