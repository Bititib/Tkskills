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

function pick(row, key, fallback) {
  return (row[key] || fallback).trim();
}

function build(row) {
  const product = pick(row, "product", "this product");
  const audience = pick(row, "audience", "busy shoppers");
  const pain = pick(row, "pain", "a common daily problem");
  const benefit = pick(row, "benefit", "make the task easier");
  const proof = pick(row, "proof", "the demo shows the difference");
  const offer = pick(row, "offer", "check the product page");
  const category = pick(row, "category", "shopping").replace(/\s+/g, "");
  const country = pick(row, "country", "targetmarket").replace(/\s+/g, "");
  return {
    ...row,
    hook: `If ${pain} keeps happening, watch what ${product} does.`,
    demo: `Show ${product} solving ${pain} in one clear before-and-after shot.`,
    proof,
    cta: offer,
    shot_list: "hook close-up | pain scene | product demo | result comparison | CTA product shot",
    voiceover: `I got ${product} because ${pain}. Here is the quick test. It helps ${audience} ${benefit}. ${proof}. ${offer}.`,
    captions: `Still dealing with ${pain}? / Testing ${product} / Made for ${audience} / ${benefit} / ${offer}`,
    title: `I tested ${product} for ${pain}`,
    hashtags: `#${category} #${country} #tiktokshop #finds #musthave`,
  };
}

const [input, output] = process.argv.slice(2);
if (!input || !output) {
  console.error("Usage: node build_content_brief.js input.csv output.csv");
  process.exit(1);
}

fs.writeFileSync(output, toCsv(parseCsv(fs.readFileSync(input, "utf8")).map(build)), "utf8");
