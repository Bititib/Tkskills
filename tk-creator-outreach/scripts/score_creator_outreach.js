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

function engagementScore(rate) {
  const normalized = rate > 1 ? rate / 100 : rate;
  if (normalized >= 0.08) return 90;
  if (normalized >= 0.04) return 75;
  if (normalized >= 0.02) return 55;
  return 35;
}

function score(row) {
  const creatorScore = Math.max(0, Math.min(100,
    number(row, "category_match", 50) * 0.25 +
    engagementScore(number(row, "engagement_rate", 0.03)) * 0.20 +
    number(row, "sales_signal", 50) * 0.20 +
    number(row, "audience_country_match", 50) * 0.15 +
    number(row, "content_style_match", 50) * 0.10 +
    number(row, "cost_fit", 50) * 0.10
  ));
  const priority = creatorScore >= 75 ? "high" : creatorScore >= 55 ? "medium" : "low";
  const creatorName = row.creator_name || row.handle || "there";
  const product = row.product || "our product";
  const category = row.category || "your category";
  const topic = row.specific_video_topic || "your recent content";
  const audience = row.audience || "your audience";
  const pain = row.pain_point || "a common problem";
  return {
    ...row,
    creator_score: creatorScore.toFixed(1),
    priority,
    first_dm: `Hi ${creatorName}, I liked your video about ${topic}. We are looking for creators in ${category} to test ${product}. It helps ${audience} with ${pain}. Would you be open to a sample collaboration or affiliate offer?`,
    crm_next_step: priority === "high" ? "manual_review" : "nurture",
  };
}

const [input, output] = process.argv.slice(2);
if (!input || !output) {
  console.error("Usage: node score_creator_outreach.js input.csv output.csv");
  process.exit(1);
}

fs.writeFileSync(output, toCsv(parseCsv(fs.readFileSync(input, "utf8")).map(score)), "utf8");
