#!/usr/bin/env node
const fs = require("fs");

function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/);
  const headers = lines.shift().split(",").map((h) => h.trim());
  return lines.filter(Boolean).map((line) => {
    const values = line.split(",").map((v) => v.trim());
    return Object.fromEntries(headers.map((h, i) => [h, values[i] ?? ""]));
  });
}

function toCsv(rows) {
  const headers = [...new Set(rows.flatMap((row) => Object.keys(row)))];
  const escape = (value) => {
    const text = String(value ?? "");
    return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  };
  return [headers.join(","), ...rows.map((row) => headers.map((h) => escape(row[h])).join(","))].join("\n");
}

function number(row, key, fallback = 0) {
  const parsed = Number(row[key]);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function analyze(row) {
  const spend = number(row, "spend");
  const impressions = number(row, "impressions");
  const clicks = number(row, "clicks");
  const orders = number(row, "orders");
  const revenue = number(row, "revenue");
  const targetCpa = number(row, "target_cpa", 20);
  const targetRoas = number(row, "target_roas", 2);
  const ctr = impressions ? clicks / impressions : 0;
  const cpc = clicks ? spend / clicks : 0;
  const cvr = clicks ? orders / clicks : 0;
  const cpa = orders ? spend / orders : 0;
  const roas = spend ? revenue / spend : 0;
  let recommendedAction = "keep_testing";
  let reason = "Data is not decisive enough for a stronger action.";
  if (orders >= 5 && cpa && cpa <= targetCpa * 0.8 && roas >= targetRoas * 1.3) {
    recommendedAction = "scale";
    reason = "CPA and ROAS are stronger than target with enough orders.";
  } else if (spend >= targetCpa * 1.5 && orders === 0) {
    recommendedAction = "pause_candidate";
    reason = "Spend exceeded threshold without orders.";
  } else if (impressions >= 3000 && ctr < 0.006) {
    recommendedAction = "refresh_creative";
    reason = "CTR is weak after meaningful impressions.";
  } else if (clicks >= 80 && cvr < 0.005) {
    recommendedAction = "pause_candidate";
    reason = "Clicks are meaningful but conversion rate is too low.";
  } else if (roas && roas < targetRoas * 0.7 && spend >= targetCpa) {
    recommendedAction = "reduce_bid";
    reason = "ROAS is below target after meaningful spend.";
  }
  return {
    ...row,
    ctr: ctr.toFixed(4),
    cpc: cpc.toFixed(2),
    cvr: cvr.toFixed(4),
    cpa: cpa.toFixed(2),
    roas: roas.toFixed(2),
    recommended_action: recommendedAction,
    reason,
  };
}

const [input, output] = process.argv.slice(2);
if (!input || !output) {
  console.error("Usage: node analyze_ad_performance.js input.csv output.csv");
  process.exit(1);
}

fs.writeFileSync(output, toCsv(parseCsv(fs.readFileSync(input, "utf8")).map(analyze)), "utf8");
