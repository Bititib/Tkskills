#!/usr/bin/env python3
import argparse
import csv
from pathlib import Path


def value(row, key, default=""):
    return (row.get(key) or default).strip()


def build_brief(row):
    product = value(row, "product", "this product")
    audience = value(row, "audience", "busy shoppers")
    pain = value(row, "pain", "a common daily problem")
    benefit = value(row, "benefit", "make the task easier")
    proof = value(row, "proof", "the demo shows the difference")
    offer = value(row, "offer", "check the product page")
    category = value(row, "category", "shopping")
    country = value(row, "country", "target market")

    hook = f"If {pain} keeps happening, watch what {product} does."
    demo = f"Show {product} solving {pain} in one clear before-and-after shot."
    voiceover = (
        f"I got {product} because {pain}. Here is the quick test. "
        f"It helps {audience} {benefit}. {proof}. {offer}."
    )
    captions = [
        f"Still dealing with {pain}?",
        f"Testing {product}",
        f"Made for {audience}",
        f"{benefit}",
        offer,
    ]
    hashtags = [
        f"#{category.replace(' ', '')}",
        f"#{country.replace(' ', '')}",
        "#tiktokshop",
        "#finds",
        "#musthave",
    ]

    return {
        **row,
        "hook": hook,
        "pain": pain,
        "demo": demo,
        "proof": proof,
        "cta": offer,
        "shot_list": "hook close-up | pain scene | product demo | result comparison | CTA product shot",
        "voiceover": voiceover,
        "captions": " / ".join(captions),
        "title": f"I tested {product} for {pain}",
        "hashtags": " ".join(hashtags),
    }


def main():
    parser = argparse.ArgumentParser(description="Build TikTok content briefs from product rows.")
    parser.add_argument("input_csv", type=Path)
    parser.add_argument("output_csv", type=Path)
    args = parser.parse_args()

    with args.input_csv.open("r", newline="", encoding="utf-8-sig") as source:
        rows = list(csv.DictReader(source))

    briefs = [build_brief(row) for row in rows]
    fieldnames = list(dict.fromkeys([key for row in briefs for key in row.keys()]))

    with args.output_csv.open("w", newline="", encoding="utf-8") as target:
        writer = csv.DictWriter(target, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(briefs)


if __name__ == "__main__":
    main()
