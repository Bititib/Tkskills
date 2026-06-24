#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const workspaceRoot = path.resolve(__dirname, "..", "..");

const TASKS = [
  {
    id: "products",
    label: "Product research",
    input: "products.csv",
    output: "product_scores.csv",
    script: path.join(workspaceRoot, "tk-product-research", "scripts", "calculate_product_scores.js"),
  },
  {
    id: "content",
    label: "Content briefs",
    input: "content.csv",
    output: "content_briefs.csv",
    script: path.join(workspaceRoot, "tk-content-generator", "scripts", "build_content_brief.js"),
  },
  {
    id: "ads",
    label: "Ads optimization",
    input: "ads.csv",
    output: "ads_actions.csv",
    script: path.join(workspaceRoot, "tk-ads-optimizer", "scripts", "analyze_ad_performance.js"),
  },
  {
    id: "creators",
    label: "Creator outreach",
    input: "creators.csv",
    output: "creator_scores.csv",
    script: path.join(workspaceRoot, "tk-creator-outreach", "scripts", "score_creator_outreach.js"),
  },
  {
    id: "competitor_collection",
    label: "Competitor collection queue",
    input: "competitor_accounts.csv",
    output: "competitor_collection_queue.csv",
    script: path.join(workspaceRoot, "tk-competitor-video-research", "scripts", "create_competitor_collection_queue.js"),
  },
  {
    id: "competitor_videos",
    label: "Competitor video research",
    input: "competitor_videos.csv",
    output: "competitor_video_scores.csv",
    script: path.join(workspaceRoot, "tk-competitor-video-research", "scripts", "analyze_competitor_videos.js"),
  },
];

function parseArgs(argv) {
  const args = {
    input: path.join(workspaceRoot, "data", "input"),
    output: path.join(workspaceRoot, "data", "output"),
  };
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i] === "--input") args.input = path.resolve(workspaceRoot, argv[++i]);
    else if (argv[i] === "--output") args.output = path.resolve(workspaceRoot, argv[++i]);
    else if (argv[i] === "--run-id") args.runId = argv[++i];
  }
  return args;
}

function timestamp() {
  const now = new Date();
  const pad = (value) => String(value).padStart(2, "0");
  return [
    now.getFullYear(),
    pad(now.getMonth() + 1),
    pad(now.getDate()),
  ].join("-") + "_" + [
    pad(now.getHours()),
    pad(now.getMinutes()),
    pad(now.getSeconds()),
  ].join("");
}

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

function readCsv(file) {
  if (!fs.existsSync(file)) return [];
  return parseCsv(fs.readFileSync(file, "utf8"));
}

function number(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function runTask(task, inputDir, runDir) {
  const inputPath = path.join(inputDir, task.input);
  const outputPath = path.join(runDir, task.output);
  if (!fs.existsSync(inputPath)) {
    return {
      ...task,
      status: "skipped",
      inputPath,
      outputPath,
      reason: `Missing ${task.input}`,
    };
  }
  if (!fs.existsSync(task.script)) {
    return {
      ...task,
      status: "failed",
      inputPath,
      outputPath,
      reason: `Missing script ${task.script}`,
    };
  }
  const result = spawnSync(process.execPath, [task.script, inputPath, outputPath], {
    cwd: workspaceRoot,
    encoding: "utf8",
  });
  if (result.status !== 0) {
    return {
      ...task,
      status: "failed",
      inputPath,
      outputPath,
      reason: result.stderr || result.stdout || `Exit ${result.status}`,
    };
  }
  return {
    ...task,
    status: "completed",
    inputPath,
    outputPath,
    rows: readCsv(outputPath).length,
  };
}

function topRows(rows, field, limit = 3) {
  return [...rows]
    .sort((a, b) => number(b[field]) - number(a[field]))
    .slice(0, limit);
}

function countBy(rows, field) {
  return rows.reduce((acc, row) => {
    const key = row[field] || "unknown";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
}

function renderReport(runId, manifest, outputs) {
  const lines = [];
  lines.push(`# TK Seller Daily Report`);
  lines.push("");
  lines.push(`Run ID: ${runId}`);
  lines.push(`Generated: ${new Date().toISOString()}`);
  lines.push("");
  lines.push("## Pipeline Status");
  lines.push("");
  for (const task of manifest.tasks) {
    lines.push(`- ${task.label}: ${task.status}${task.rows !== undefined ? ` (${task.rows} rows)` : ""}${task.reason ? ` - ${task.reason}` : ""}`);
  }

  if (outputs.products.length) {
    lines.push("");
    lines.push("## Product Priorities");
    for (const row of topRows(outputs.products, "viral_probability")) {
      lines.push(`- ${row.product || "Unknown product"}: score ${row.viral_probability}, margin ${row.gross_margin_rate}, recommendation ${row.recommendation}`);
    }
  }

  if (outputs.ads.length) {
    lines.push("");
    lines.push("## Ads Action Queue");
    const actions = countBy(outputs.ads, "recommended_action");
    for (const [action, count] of Object.entries(actions)) {
      lines.push(`- ${action}: ${count}`);
    }
    const reviewAds = outputs.ads.filter((row) => ["pause_candidate", "reduce_bid", "scale"].includes(row.recommended_action));
    for (const row of reviewAds.slice(0, 5)) {
      lines.push(`- Manual review: ${row.campaign || "campaign"} / ${row.adgroup || "adgroup"} -> ${row.recommended_action} (${row.reason || "no reason"})`);
    }
  }

  if (outputs.creators.length) {
    lines.push("");
    lines.push("## Creator Outreach Queue");
    for (const row of topRows(outputs.creators, "creator_score")) {
      lines.push(`- ${row.creator_name || row.handle || "Creator"}: score ${row.creator_score}, priority ${row.priority}, next step ${row.crm_next_step}`);
    }
  }

  if (outputs.content.length) {
    lines.push("");
    lines.push("## Content Briefs Ready");
    for (const row of outputs.content.slice(0, 5)) {
      lines.push(`- ${row.product || "Product"}: ${row.hook || "hook ready"}`);
    }
  }

  if (outputs.competitorVideos.length) {
    lines.push("");
    lines.push("## Competitor Video Research");
    const viralCount = outputs.competitorVideos.filter((row) => row.viral_candidate === "yes").length;
    const replicateCount = outputs.competitorVideos.filter((row) => row.replicate_candidate === "yes").length;
    lines.push(`- Viral candidates: ${viralCount}`);
    lines.push(`- Replicate candidates: ${replicateCount}`);
    for (const row of topRows(outputs.competitorVideos, "video_score", 5)) {
      lines.push(`- ${row.handle || "account"}: score ${row.video_score}, format ${row.format || "unknown"}, hook "${row.hook || "missing"}"`);
    }
  }

  if (outputs.competitorQueue.length) {
    lines.push("");
    lines.push("## Competitor Collection Queue");
    for (const row of outputs.competitorQueue.slice(0, 5)) {
      lines.push(`- ${row.handle || "account"}: ${row.account_url || "missing URL"} (${row.collection_status || "pending"})`);
    }
  }

  lines.push("");
  lines.push("## Safety");
  lines.push("");
  lines.push("- No ads were paused.");
  lines.push("- No creator messages were sent.");
  lines.push("- Budget and bid changes remain manual-review actions.");
  return `${lines.join("\n")}\n`;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const runId = args.runId || timestamp();
  const runDir = path.join(args.output, runId);
  fs.mkdirSync(runDir, { recursive: true });

  const tasks = TASKS.map((task) => runTask(task, args.input, runDir));
  const outputs = {
    products: readCsv(path.join(runDir, "product_scores.csv")),
    content: readCsv(path.join(runDir, "content_briefs.csv")),
    ads: readCsv(path.join(runDir, "ads_actions.csv")),
    creators: readCsv(path.join(runDir, "creator_scores.csv")),
    competitorQueue: readCsv(path.join(runDir, "competitor_collection_queue.csv")),
    competitorVideos: readCsv(path.join(runDir, "competitor_video_scores.csv")),
  };
  const manifest = {
    runId,
    workspaceRoot,
    inputDir: args.input,
    outputDir: runDir,
    createdAt: new Date().toISOString(),
    tasks,
    safety: {
      writeActionsExecuted: false,
      adsPaused: false,
      creatorMessagesSent: false,
    },
  };
  fs.writeFileSync(path.join(runDir, "pipeline_manifest.json"), JSON.stringify(manifest, null, 2), "utf8");
  fs.writeFileSync(path.join(runDir, "daily_report.md"), renderReport(runId, manifest, outputs), "utf8");
  console.log(`Pipeline complete: ${runDir}`);
  for (const task of tasks) {
    console.log(`${task.status}: ${task.label}${task.rows !== undefined ? ` (${task.rows} rows)` : ""}`);
  }
}

main();
