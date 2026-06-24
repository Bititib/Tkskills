#!/usr/bin/env python3
import argparse
import csv
from pathlib import Path


def as_float(row, key, default=0.0):
    value = row.get(key, default)
    if value in (None, ""):
        return default
    try:
        return float(str(value).strip().rstrip("%"))
    except ValueError:
        return default


def clamp(value, low=0.0, high=100.0):
    return max(low, min(high, value))


def margin_score(rate):
    if rate >= 0.55:
        return 90
    if rate >= 0.40:
        return 70
    if rate >= 0.25:
        return 50
    return 25


def price_fit_score(price):
    if price <= 0:
        return 50
    if price <= 20:
        return 90
    if price <= 40:
        return 75
    if price <= 80:
        return 55
    return 35


def normalize_rate(value):
    return value / 100 if value > 1 else value


def score_row(row):
    selling_price = as_float(row, "selling_price")
    product_cost = as_float(row, "product_cost")
    shipping_cost = as_float(row, "shipping_cost")
    commission_rate = normalize_rate(as_float(row, "commission_rate", 0.12))
    platform_fee = selling_price * commission_rate
    gross_margin = selling_price - product_cost - shipping_cost - platform_fee
    gross_margin_rate = gross_margin / selling_price if selling_price else 0
    breakeven_roas = selling_price / gross_margin if gross_margin > 0 else 0

    trend_score = as_float(row, "trend_score", 50)
    content_score = as_float(row, "content_score", 50)
    competition_score = as_float(row, "competition_score", 50)
    supplier_score = as_float(row, "supplier_score", 50)

    viral_probability = (
        trend_score * 0.30
        + content_score * 0.20
        + price_fit_score(selling_price) * 0.15
        + margin_score(gross_margin_rate) * 0.15
        + supplier_score * 0.10
        - competition_score * 0.10
    )
    viral_probability = clamp(viral_probability)

    if viral_probability >= 70 and gross_margin_rate >= 0.40:
        recommendation = "test"
    elif viral_probability >= 55 or gross_margin_rate >= 0.35:
        recommendation = "watch"
    else:
        recommendation = "avoid"

    return {
        **row,
        "gross_margin": round(gross_margin, 2),
        "gross_margin_rate": round(gross_margin_rate, 4),
        "breakeven_roas": round(breakeven_roas, 2),
        "viral_probability": round(viral_probability, 1),
        "competition_strength": round(competition_score, 1),
        "recommendation": recommendation,
    }


def main():
    parser = argparse.ArgumentParser(description="Score TikTok Shop product candidates.")
    parser.add_argument("input_csv", type=Path)
    parser.add_argument("output_csv", type=Path)
    args = parser.parse_args()

    with args.input_csv.open("r", newline="", encoding="utf-8-sig") as source:
        rows = list(csv.DictReader(source))

    scored = [score_row(row) for row in rows]
    fieldnames = list(dict.fromkeys([key for row in scored for key in row.keys()]))

    with args.output_csv.open("w", newline="", encoding="utf-8") as target:
        writer = csv.DictWriter(target, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(scored)


if __name__ == "__main__":
    main()
