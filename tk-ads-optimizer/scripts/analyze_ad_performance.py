#!/usr/bin/env python3
import argparse
import csv
from pathlib import Path


def as_float(row, key, default=0.0):
    value = row.get(key, default)
    if value in (None, ""):
        return default
    try:
        return float(str(value).strip())
    except ValueError:
        return default


def analyze(row):
    spend = as_float(row, "spend")
    impressions = as_float(row, "impressions")
    clicks = as_float(row, "clicks")
    orders = as_float(row, "orders")
    revenue = as_float(row, "revenue")
    target_cpa = as_float(row, "target_cpa", 20)
    target_roas = as_float(row, "target_roas", 2)

    ctr = clicks / impressions if impressions else 0
    cpc = spend / clicks if clicks else 0
    cvr = orders / clicks if clicks else 0
    cpa = spend / orders if orders else 0
    roas = revenue / spend if spend else 0

    if orders >= 5 and cpa and cpa <= target_cpa * 0.8 and roas >= target_roas * 1.3:
        action = "scale"
        reason = "CPA and ROAS are stronger than target with enough orders."
    elif spend >= target_cpa * 1.5 and orders == 0:
        action = "pause_candidate"
        reason = "Spend exceeded threshold without orders."
    elif impressions >= 3000 and ctr < 0.006:
        action = "refresh_creative"
        reason = "CTR is weak after meaningful impressions."
    elif clicks >= 80 and cvr < 0.005:
        action = "pause_candidate"
        reason = "Clicks are meaningful but conversion rate is too low."
    elif roas and roas < target_roas * 0.7 and spend >= target_cpa:
        action = "reduce_bid"
        reason = "ROAS is below target after meaningful spend."
    else:
        action = "keep_testing"
        reason = "Data is not decisive enough for a stronger action."

    return {
        **row,
        "ctr": round(ctr, 4),
        "cpc": round(cpc, 2),
        "cvr": round(cvr, 4),
        "cpa": round(cpa, 2),
        "roas": round(roas, 2),
        "recommended_action": action,
        "reason": reason,
    }


def main():
    parser = argparse.ArgumentParser(description="Analyze TikTok Ads performance rows.")
    parser.add_argument("input_csv", type=Path)
    parser.add_argument("output_csv", type=Path)
    args = parser.parse_args()

    with args.input_csv.open("r", newline="", encoding="utf-8-sig") as source:
        rows = list(csv.DictReader(source))

    analyzed = [analyze(row) for row in rows]
    fieldnames = list(dict.fromkeys([key for row in analyzed for key in row.keys()]))

    with args.output_csv.open("w", newline="", encoding="utf-8") as target:
        writer = csv.DictWriter(target, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(analyzed)


if __name__ == "__main__":
    main()
