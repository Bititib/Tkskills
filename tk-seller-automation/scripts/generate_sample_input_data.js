#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const workspaceRoot = path.resolve(__dirname, "..", "..");
const inputDir = path.join(workspaceRoot, "data", "input");

function writeIfMissing(filename, text) {
  const target = path.join(inputDir, filename);
  if (fs.existsSync(target)) return false;
  fs.writeFileSync(target, text.trimStart(), "utf8");
  return true;
}

fs.mkdirSync(inputDir, { recursive: true });

const created = [];

if (writeIfMissing("products.csv", `
product,category,country,selling_price,product_cost,shipping_cost,commission_rate,trend_score,content_score,competition_score,supplier_score
Mini Blender,Kitchen,US,29.99,8,4,12,82,78,45,70
Pet Hair Remover,Pet Supplies,US,19.99,4.5,3.2,12,75,84,58,68
Travel Makeup Bag,Beauty,UK,24.99,6.2,3.8,12,70,72,50,74
`)) created.push("products.csv");

if (writeIfMissing("content.csv", `
product,category,country,audience,pain,benefit,proof,offer
Mini Blender,Kitchen,US,busy moms,messy breakfast prep,make smoothies fast,blends fruit in 20 seconds,Shop today
Pet Hair Remover,Pet Supplies,US,pet owners,fur stuck on sofas,clean fabric quickly,before and after sofa demo,Try the bundle
Travel Makeup Bag,Beauty,UK,frequent travelers,makeup spilling in luggage,organize products neatly,opens flat on the table,Get the launch deal
`)) created.push("content.csv");

if (writeIfMissing("ads.csv", `
campaign,adgroup,spend,impressions,clicks,orders,revenue,target_cpa,target_roas
Kitchen Test,A1,120,10000,200,8,360,20,2
Pet Angle Test,A2,45,5200,28,0,0,18,2
Beauty Broad,A3,80,7600,110,2,95,22,2
`)) created.push("ads.csv");

if (writeIfMissing("creators.csv", `
creator_name,handle,product,category,engagement_rate,category_match,sales_signal,audience_country_match,content_style_match,cost_fit,specific_video_topic,audience,pain_point
Amy,@amyhome,Mini Blender,Kitchen,6,88,75,90,80,70,smoothie prep,busy moms,messy breakfast prep
Ben,@petben,Pet Hair Remover,Pet Supplies,4.5,92,70,85,82,76,sofa cleaning,pet owners,fur stuck on sofas
Cara,@travelcara,Travel Makeup Bag,Beauty,2.2,68,50,72,75,64,packing routine,frequent travelers,makeup spilling in luggage
`)) created.push("creators.csv");

if (writeIfMissing("competitor_accounts.csv", `
handle,account_url,country,category,target_recent_videos,notes
@kitchenbench,,US,Kitchen,20,blender and kitchen gadget benchmark
@petcleanhome,,US,Pet Supplies,20,pet cleaning benchmark
@beautytravelkit,,UK,Beauty,20,travel organizer benchmark
`)) created.push("competitor_accounts.csv");

if (writeIfMissing("competitor_videos.csv", `
handle,video_url,caption,hook,format,category,country,posted_at,views,likes,comments,shares,saves,duration_seconds,hashtags,product_angle
@kitchenbench,https://www.tiktok.com/@kitchenbench/video/1,The fastest smoothie test,Stop making breakfast harder than it needs to be,demo,Kitchen,US,2026-06-10,240000,18000,640,2100,3400,22,#kitchen #smoothie #tiktokshop,20 second breakfast prep
@petcleanhome,https://www.tiktok.com/@petcleanhome/video/2,Pet hair sofa before and after,If your sofa looks like this after one day,before_after,Pet Supplies,US,2026-06-08,180000,12500,520,1600,2200,18,#petsoftiktok #cleaning #home,fur removal proof
@beautytravelkit,https://www.tiktok.com/@beautytravelkit/video/3,Pack makeup without spills,This bag saved my makeup during travel,problem_solution,Beauty,UK,2026-05-20,68000,4200,130,390,510,27,#travelhack #makeupbag #packing,travel organization
`)) created.push("competitor_videos.csv");

console.log(created.length
  ? `Created sample files: ${created.join(", ")}`
  : "Sample input files already exist.");
console.log(inputDir);
