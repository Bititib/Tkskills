# Product Scoring Rules

## Core Formula

```text
viral_probability =
  trend_score * 0.30
+ content_score * 0.20
+ price_fit_score * 0.15
+ margin_score * 0.15
+ supplier_score * 0.10
- competition_score * 0.10
```

All component scores use a 0-100 scale.

## Derived Scores

Price fit:

```text
80-100: impulse-buy price for target country
60-79: acceptable price but needs proof or bundle
40-59: high friction purchase
0-39: unlikely without strong brand or proof
```

Margin score:

```text
gross_margin = selling_price - product_cost - shipping_cost - platform_fee
gross_margin_rate = gross_margin / selling_price

80-100: gross margin rate >= 55%
60-79: 40%-54%
40-59: 25%-39%
0-39: below 25%
```

Breakeven ROAS:

```text
breakeven_roas = selling_price / gross_margin
```

## Recommendation

```text
test: viral_probability >= 70 and gross_margin_rate >= 0.40
watch: viral_probability >= 55 or gross_margin_rate >= 0.35
avoid: weak demand, severe competition, or gross_margin_rate < 0.25
```

## Material Angles

Prefer angles that can be filmed quickly:

- Before/after
- Problem/solution
- Side-by-side comparison
- Stress test
- Unboxing plus first reaction
- Three reasons to try
- Mistake correction
