#!/usr/bin/env node
const requiredGroups = {
  shop: ["TIKTOK_SHOP_APP_KEY", "TIKTOK_SHOP_APP_SECRET", "TIKTOK_SHOP_ACCESS_TOKEN"],
  ads: ["TIKTOK_BUSINESS_ACCESS_TOKEN", "TIKTOK_BUSINESS_ADVERTISER_ID"],
  affiliate: ["TIKTOK_AFFILIATE_ACCESS_TOKEN"],
  display: ["TIKTOK_DISPLAY_CLIENT_KEY", "TIKTOK_DISPLAY_CLIENT_SECRET"],
};

const result = {};
for (const [group, keys] of Object.entries(requiredGroups)) {
  const missing = keys.filter((key) => !process.env[key]);
  result[group] = {
    ready: missing.length === 0,
    missing,
  };
}

console.log(JSON.stringify(result, null, 2));
if (Object.values(result).some((entry) => !entry.ready)) {
  process.exitCode = 2;
}
