#!/usr/bin/env node
const fs = require("fs");

function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/);
  const headers = parseCsvLine(lines.shift()).map((h) => h.trim());
  return lines.filter(Boolean).map((line) => {
    const values = parseCsvLine(line).map((v) => v.trim());
    return Object.fromEntries(headers.map((h, i) => [h, values[i] ?? ""]));
  });
}

function parseCsvLine(line) {
  const values = [];
  let current = "";
  let quoted = false;
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    const next = line[i + 1];
    if (char === '"' && quoted && next === '"') {
      current += '"';
      i += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      values.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  values.push(current);
  return values;
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
  const raw = row[key];
  if (raw === undefined || raw === "") return fallback;
  const parsed = Number(String(raw).replace("%", ""));
  return Number.isFinite(parsed) ? parsed : fallback;
}

function rate(value) {
  return value > 1 ? value / 100 : value;
}

function marginScore(value) {
  if (value >= 0.55) return 90;
  if (value >= 0.40) return 70;
  if (value >= 0.25) return 50;
  return 25;
}

function priceFit(price) {
  if (price <= 0) return 50;
  if (price <= 20) return 90;
  if (price <= 40) return 75;
  if (price <= 80) return 55;
  return 35;
}

function score(row) {
  const sellingPrice = number(row, "selling_price");
  const productCost = number(row, "product_cost");
  const shippingCost = number(row, "shipping_cost");
  const commissionRate = rate(number(row, "commission_rate", 0.12));
  const grossMargin = sellingPrice - productCost - shippingCost - sellingPrice * commissionRate;
  const grossMarginRate = sellingPrice ? grossMargin / sellingPrice : 0;
  const breakevenRoas = grossMargin > 0 ? sellingPrice / grossMargin : 0;
  const competitionScore = number(row, "competition_score", 50);
  const viralProbability = Math.max(0, Math.min(100,
    number(row, "trend_score", 50) * 0.30 +
    number(row, "content_score", 50) * 0.20 +
    priceFit(sellingPrice) * 0.15 +
    marginScore(grossMarginRate) * 0.15 +
    number(row, "supplier_score", 50) * 0.10 -
    competitionScore * 0.10
  ));
  const recommendation = viralProbability >= 70 && grossMarginRate >= 0.40
    ? "test"
    : viralProbability >= 55 || grossMarginRate >= 0.35 ? "watch" : "avoid";
  return {
    ...row,
    gross_margin: grossMargin.toFixed(2),
    gross_margin_rate: grossMarginRate.toFixed(4),
    breakeven_roas: breakevenRoas.toFixed(2),
    viral_probability: viralProbability.toFixed(1),
    competition_strength: competitionScore.toFixed(1),
    recommendation,
  };
}

const [input, output] = process.argv.slice(2);
if (!input || !output) {
  console.error("Usage: node calculate_product_scores.js input.csv output.csv");
  process.exit(1);
}

fs.writeFileSync(output, toCsv(parseCsv(fs.readFileSync(input, "utf8")).map(score)), "utf8");
