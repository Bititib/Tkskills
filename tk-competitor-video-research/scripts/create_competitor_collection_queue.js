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

function normalizeHandle(value) {
  const text = String(value || "").trim();
  if (!text) return "";
  if (text.includes("tiktok.com/@")) {
    const match = text.match(/@([^/?#]+)/);
    return match ? `@${match[1]}` : text;
  }
  return text.startsWith("@") ? text : `@${text}`;
}

function accountUrl(row) {
  if (row.account_url) return row.account_url;
  const handle = normalizeHandle(row.handle);
  return handle ? `https://www.tiktok.com/${handle}` : "";
}

function buildQueue(row, index) {
  const handle = normalizeHandle(row.handle || row.account_url);
  const url = accountUrl({ ...row, handle });
  return {
    queue_id: `competitor_${String(index + 1).padStart(3, "0")}`,
    handle,
    account_url: url,
    country: row.country || "",
    category: row.category || "",
    target_recent_videos: row.target_recent_videos || "20",
    collection_status: "pending",
    collection_mode: "browser_assisted_or_api",
    notes: row.notes || "",
  };
}

const [input, output] = process.argv.slice(2);
if (!input || !output) {
  console.error("Usage: node create_competitor_collection_queue.js competitor_accounts.csv competitor_collection_queue.csv");
  process.exit(1);
}

const rows = parseCsv(fs.readFileSync(input, "utf8"));
fs.writeFileSync(output, toCsv(rows.map(buildQueue)), "utf8");
