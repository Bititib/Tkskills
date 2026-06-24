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


def engagement_score(rate):
    normalized = rate / 100 if rate > 1 else rate
    if normalized >= 0.08:
        return 90
    if normalized >= 0.04:
        return 75
    if normalized >= 0.02:
        return 55
    return 35


def score(row):
    category_match = as_float(row, "category_match", 50)
    engagement = engagement_score(as_float(row, "engagement_rate", 0.03))
    sales_signal = as_float(row, "sales_signal", 50)
    audience_country_match = as_float(row, "audience_country_match", 50)
    content_style_match = as_float(row, "content_style_match", 50)
    cost_fit = as_float(row, "cost_fit", 50)

    creator_score = clamp(
        category_match * 0.25
        + engagement * 0.20
        + sales_signal * 0.20
        + audience_country_match * 0.15
        + content_style_match * 0.10
        + cost_fit * 0.10
    )

    if creator_score >= 75:
        priority = "high"
    elif creator_score >= 55:
        priority = "medium"
    else:
        priority = "low"

    creator_name = row.get("creator_name") or row.get("handle") or "there"
    product = row.get("product") or "our product"
    category = row.get("category") or "your category"
    topic = row.get("specific_video_topic") or "your recent content"
    audience = row.get("audience") or "your audience"
    pain = row.get("pain_point") or "a common problem"

    first_dm = (
        f"Hi {creator_name}, I liked your video about {topic}. "
        f"We are looking for creators in {category} to test {product}. "
        f"It helps {audience} with {pain}. Would you be open to a sample collaboration or affiliate offer?"
    )

    return {
        **row,
        "creator_score": round(creator_score, 1),
        "priority": priority,
        "first_dm": first_dm,
        "crm_next_step": "manual_review" if priority == "high" else "nurture",
    }


def main():
    parser = argparse.ArgumentParser(description="Score TikTok creators and draft outreach.")
    parser.add_argument("input_csv", type=Path)
    parser.add_argument("output_csv", type=Path)
    args = parser.parse_args()

    with args.input_csv.open("r", newline="", encoding="utf-8-sig") as source:
        rows = list(csv.DictReader(source))

    scored = [score(row) for row in rows]
    fieldnames = list(dict.fromkeys([key for row in scored for key in row.keys()]))

    with args.output_csv.open("w", newline="", encoding="utf-8") as target:
        writer = csv.DictWriter(target, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(scored)


if __name__ == "__main__":
    main()
