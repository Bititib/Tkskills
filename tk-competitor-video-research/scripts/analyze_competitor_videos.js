#!/usr/bin/env node
const fs = require("fs");

function parseCsv(text) {
  const trimmed = text.trim();
  if (!trimmed) return [];
  const lines = trimmed.split(/\r?\n/);
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
  const parsed = Number(String(raw).replace(/[,%]/g, ""));
  return Number.isFinite(parsed) ? parsed : fallback;
}

function clamp(value, low = 0, high = 100) {
  return Math.max(low, Math.min(high, value));
}

function logScore(value, floor, ceiling) {
  if (value <= 0) return floor;
  const score = Math.log10(value + 1) * 18;
  return clamp(score, floor, ceiling);
}

function recencyScore(postedAt) {
  if (!postedAt) return 55;
  const date = new Date(postedAt);
  if (Number.isNaN(date.getTime())) return 55;
  const ageDays = (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24);
  if (ageDays <= 14) return 90;
  if (ageDays <= 45) return 75;
  if (ageDays <= 90) return 60;
  return 40;
}

function formatFitScore(format) {
  const reusable = new Set(["before_after", "problem_solution", "demo", "review", "comparison", "tutorial", "listicle"]);
  return reusable.has(String(format || "").trim()) ? 85 : 60;
}

function scoreVideo(row) {
  const views = number(row, "views");
  const likes = number(row, "likes");
  const comments = number(row, "comments");
  const shares = number(row, "shares");
  const saves = number(row, "saves");
  const engagementRate = views ? (likes + comments + shares + saves) / views : 0;
  const commentRate = views ? comments / views : 0;
  const shareSaveRate = views ? (shares + saves) / views : 0;
  const videoScore = clamp(
    logScore(views, 10, 95) * 0.35 +
    clamp(engagementRate * 900, 0, 100) * 0.25 +
    clamp(commentRate * 2000, 0, 100) * 0.10 +
    clamp(shareSaveRate * 1400, 0, 100) * 0.15 +
    recencyScore(row.posted_at) * 0.10 +
    formatFitScore(row.format) * 0.05
  );
  const viralCandidate = views >= 100000 || videoScore >= 75 || (engagementRate >= 0.08 && views >= 20000);
  const reusableHook = String(row.hook || "").trim().length >= 12;
  const replicateCandidate = viralCandidate && reusableHook && formatFitScore(row.format) >= 75;
  return {
    ...row,
    engagement_rate: engagementRate.toFixed(4),
    comment_rate: commentRate.toFixed(4),
    share_save_rate: shareSaveRate.toFixed(4),
    video_score: videoScore.toFixed(1),
    viral_candidate: viralCandidate ? "yes" : "no",
    replicate_candidate: replicateCandidate ? "yes" : "no",
    insight: buildInsight(row, viralCandidate, replicateCandidate),
  };
}

function buildInsight(row, viral, replicate) {
  const format = row.format || "video";
  const angle = row.product_angle || row.category || "category angle";
  if (replicate) return `Replicate the ${format} structure around ${angle}; keep the hook specific and demo visible.`;
  if (viral) return `Study the ${format} hook and pacing before adapting the angle.`;
  return `Use as reference, but prioritize stronger proof or a clearer first 2 seconds.`;
}

const [input, output] = process.argv.slice(2);
if (!input || !output) {
  console.error("Usage: node analyze_competitor_videos.js competitor_videos.csv competitor_video_scores.csv");
  process.exit(1);
}

const rows = parseCsv(fs.readFileSync(input, "utf8"));
fs.writeFileSync(output, toCsv(rows.map(scoreVideo)), "utf8");
