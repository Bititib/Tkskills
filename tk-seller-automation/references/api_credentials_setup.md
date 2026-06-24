# API Credentials Setup

## Supported Seller API Directions

- TikTok Shop Partner API for shop, product, order, inventory, and fulfillment data.
- TikTok Shop Affiliate API for affiliate creator and collaboration data.
- TikTok API for Business for ad reports and campaign management.
- TikTok Display API for videos from creators who explicitly authorize access.

## Environment Variables

Use these names when adding live API sync:

```text
TIKTOK_SHOP_APP_KEY
TIKTOK_SHOP_APP_SECRET
TIKTOK_SHOP_ACCESS_TOKEN
TIKTOK_BUSINESS_ACCESS_TOKEN
TIKTOK_BUSINESS_ADVERTISER_ID
TIKTOK_AFFILIATE_ACCESS_TOKEN
TIKTOK_DISPLAY_CLIENT_KEY
TIKTOK_DISPLAY_CLIENT_SECRET
```

## Guardrail

Do not implement live write operations until read-only imports are verified against exported CSV totals.
