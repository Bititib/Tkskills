# Ads Optimization Rules

## Required Metrics

```text
ctr = clicks / impressions
cpc = spend / clicks
cvr = orders / clicks
cpa = spend / orders
roas = revenue / spend
```

## Pause Candidate

Recommend pause candidate when any condition is true:

- spend >= target_cpa * 1.5 and orders = 0
- impressions >= 3000 and ctr < 0.006
- clicks >= 80 and cvr < 0.005
- roas < target_roas * 0.70 with meaningful spend

## Refresh Creative

Recommend creative refresh when:

- impressions are high but CTR is weak
- CTR declines for 2 or more consecutive days
- frequency is high and CVR is falling

## Reduce Bid

Recommend reduce bid when:

- CPA is 20%-50% above target CPA but orders exist
- ROAS is below target but not catastrophic

## Scale

Recommend scale when:

- orders >= 5
- CPA <= target CPA * 0.8
- ROAS >= target ROAS * 1.3
- CTR and CVR are both healthy

## Keep Testing

Use this when data volume is too small for a decision.
