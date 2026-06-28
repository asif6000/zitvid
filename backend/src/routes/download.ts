import { Router } from "express";
import { spawn } from "child_process";
import { prisma } from "../config/prisma.js";
import { optionalAuth } from "../middleware/auth.js";
import path from "path";
import fs from "fs";
import os from "os";

const ytTmpDir = path.join(os.homedir(), "tmp");
process.env["TMPDIR"] = process.env["TMPDIR"] || ytTmpDir;
try { fs.mkdirSync(ytTmpDir, { recursive: true }); } catch {}

const router = Router();
const infoCache = new Map<string, any>();

const YT_CLIENTS = ["web_safari", "web_creator", "mweb", "android", "web"];

function getCookiesPath(): string | null {
  const envPath = process.env["YOUTUBE_COOKIES_FILE"] || process.env["YT_DLP_COOKIES"] || "";
  if (envPath && fs.existsSync(envPath)) return envPath;
  const searchPaths = [
    path.join(os.homedir(), "cookies.txt"),
    path.join(process.cwd(), "cookies.txt"),
    path.join(process.cwd(), "..", "cookies.txt"),
    path.join(os.tmpdir(), "cookies.txt"),
  ];
  for (const p of searchPaths) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

function detectPlatform(url: string): string {
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "youtube";
  if (url.includes("instagram.com")) return "instagram";
  if (url.includes("tiktok.com")) return "tiktok";
  if (url.includes("facebook.com") || url.includes("fb.com")) return "facebook";
  if (url.includes("twitter.com") || url.includes("x.com")) return "twitter";
  if (url.includes("vimeo.com")) return "vimeo";
  return "unknown";
}

function getFormatArgs(format: string, quality: string): string[] {
  if (format === "mp3") return ["-x", "--audio-format", "mp3", "--audio-quality", "0"];
  if (/^\d+p$/.test(quality)) {
    const h = quality.replace("p", "");
    return ["-f", `bestvideo[height<=${h}]+bestaudio/best[height<=${h}]/best`];
  }
  if (quality === "4K") return ["-f", "bestvideo[height<=2160]+bestaudio/best[height<=2160]/best"];
  return ["-f", "bestvideo+bestaudio/best"];
}

function parseFormats(info: any): { quality: string; format: string; size: string; formatId: string }[] {
  const result: { quality: string; format: string; size: string; formatId: string }[] = [];
  if (!info?.formats) return result;

  const groups: Record<string, any> = {};
  for (const f of info.formats) {
    if (!f.ext) continue;
    let label: string;
    let type: "video" | "audio" | "combined";

    if (f.vcodec === "none" && f.acodec !== "none") {
      label = "MP3";
      type = "audio";
    } else if (f.vcodec !== "none" && f.acodec !== "none") {
      type = "combined";
      const fn = (f.format_note || "").toLowerCase();
      if (fn.includes("4k") || fn.includes("2160")) label = "4K";
      else if (fn.includes("1440")) label = "1440p";
      else if (fn.includes("1080")) label = "1080p";
      else if (fn.includes("720")) label = "720p";
      else if (fn.includes("480")) label = "480p";
      else if (fn.includes("360")) label = "360p";
      else if (fn.includes("240")) label = "240p";
      else if (fn.includes("144")) label = "144p";
      else if (f.height && f.height >= 1440) label = "4K";
      else if (f.height && f.height >= 1080) label = "1080p";
      else if (f.height && f.height >= 720) label = "720p";
      else if (f.height && f.height >= 480) label = "480p";
      else if (f.height && f.height >= 360) label = "360p";
      else label = f.format_note || `${f.height || "?"}p`;
    } else if (f.vcodec !== "none") {
      type = "video";
      const fn = (f.format_note || "").toLowerCase();
      if (fn.includes("4k") || fn.includes("2160")) label = "4K";
      else if (fn.includes("1440")) label = "1440p";
      else if (fn.includes("1080")) label = "1080p";
      else if (fn.includes("720")) label = "720p";
      else if (fn.includes("480")) label = "480p";
      else if (fn.includes("360")) label = "360p";
      else if (fn.includes("240")) label = "240p";
      else if (fn.includes("144")) label = "144p";
      else if (f.height && f.height >= 1440) label = "4K";
      else if (f.height && f.height >= 1080) label = "1080p";
      else if (f.height && f.height >= 720) label = "720p";
      else if (f.height && f.height >= 480) label = "480p";
      else if (f.height && f.height >= 360) label = "360p";
      else label = f.format_note || `${f.height || "?"}p`;
    } else continue;

    if (type === "video" && !["mp4", "webm"].includes(f.ext)) continue;
    const groupKey = type === "audio" ? "MP3" : `${label}_mp4`;
    const size = f.filesize || f.filesize_approx || 0;
    const existing = groups[groupKey];
    if (!existing || size > (existing.filesize || existing.filesize_approx || 0)) {
      groups[groupKey] = { ...f, qualityLabel: label, type };
    }
  }

  for (const key of Object.keys(groups)) {
    const g = groups[key];
    const sizeBytes = g.filesize || g.filesize_approx || 0;
    let sizeStr: string;
    if (sizeBytes > 1_000_000_000) sizeStr = `~${(sizeBytes / 1_000_000_000).toFixed(1)} GB`;
    else if (sizeBytes > 1_000_000) sizeStr = `~${(sizeBytes / 1_000_000).toFixed(0)} MB`;
    else if (sizeBytes > 0) sizeStr = `~${(sizeBytes / 1000).toFixed(0)} KB`;
    else sizeStr = "Unknown";

    const displayFormat = g.qualityLabel === "MP3" ? "mp3" : "mp4";
    result.push({ quality: g.qualityLabel, format: displayFormat, size: sizeStr, formatId: g.format_id });
  }

  const resolutionOrder = ["4K", "2160p", "1440p", "1080p", "720p", "480p", "360p", "240p", "144p", "MP3"];
  result.sort((a, b) => {
    const ia = resolutionOrder.indexOf(a.quality);
    const ib = resolutionOrder.indexOf(b.quality);
    return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
  });

  const seen = new Set<string>();
  return result.filter((r) => {
    if (seen.has(r.quality)) return false;
    seen.add(r.quality);
    return true;
  });
}

function runYtDlp(args: string[], timeout = 120000): Promise<{ stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    const proc = spawn("yt-dlp", args, { timeout });
    let stdout = "";
    let stderr = "";
    proc.stdout.on("data", (d) => { stdout += d.toString(); });
    proc.stderr.on("data", (d) => { stderr += d.toString(); });
    proc.on("error", (err) => reject(new Error(`yt-dlp not found: ${err.message}`)));
    proc.on("close", (code) => {
      if (code === 0) resolve({ stdout, stderr });
      else reject(new Error(stderr.slice(0, 1000) || `yt-dlp exited with code ${code}`));
    });
  });
}

async function ytDlpGetInfo(url: string): Promise<any> {
  const isYouTube = url.includes("youtube.com") || url.includes("youtu.be");
  const cookiesPath = getCookiesPath();

  if (!isYouTube) {
    const args = ["--dump-single-json", "--no-playlist", "--no-warnings"];
    if (cookiesPath && fs.existsSync(cookiesPath)) args.push("--cookies", cookiesPath);
    args.push(url);
    const { stdout } = await runYtDlp(args);
    return JSON.parse(stdout);
  }

  let lastErr: string | null = null;
  for (const client of YT_CLIENTS) {
    const args = [
      "--dump-single-json", "--no-playlist", "--no-warnings",
      "--extractor-args", `youtube:player_client=${client};player_skip=webpage,configs`,
    ];
    if (cookiesPath && fs.existsSync(cookiesPath)) args.push("--cookies", cookiesPath);
    args.push(url);
    try {
      const { stdout } = await runYtDlp(args);
      return JSON.parse(stdout);
    } catch (err: any) {
      const msg = err.message || "";
      if (msg.includes("Sign in") || msg.includes("bot") || msg.includes("429") || msg.includes("confirm")) {
        console.warn(`[yt-dlp] Client '${client}' blocked, trying next...`);
        lastErr = cookiesPath
          ? "YouTube blocked all clients. Refresh cookies or update yt-dlp."
          : "YouTube bot detection. Export cookies and set YOUTUBE_COOKIES_FILE.";
        continue;
      }
      throw err;
    }
  }
  throw new Error(lastErr || "yt-dlp info fetch failed");
}

router.get("/info/:id", async (req, res) => {
  const id = req.params.id as string;
  const cached = infoCache.get(id);
  if (cached) { res.json(cached); return; }
  const download = await prisma.download.findUnique({ where: { id } });
  if (!download) { res.status(404).json({ error: "Download not found" }); return; }
  if (download.status === "FAILED") { res.json({ error: "Failed to fetch video info" }); return; }
  res.status(202).json({ status: "PROCESSING", message: "Fetching video information..." });
});

router.post("/", optionalAuth, async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) { res.status(400).json({ error: "URL is required" }); return; }

    const platform = detectPlatform(url);
    const download = await prisma.download.create({
      data: {
        url, platform,
        title: "Processing...",
        quality: "auto", format: "mp4",
        status: "PENDING",
        userId: req.user?.userId || null,
      },
    });

    res.json({
      success: true, downloadId: download.id, platform,
      title: "Processing...", formats: [],
      thumbnail: null, duration: null,
      status: "PROCESSING", message: "Fetching video information...",
    });

    ytDlpGetInfo(url).then((info) => {
      const title = info?.title || "Video";
      const formats = parseFormats(info);
      prisma.download.update({ where: { id: download.id }, data: { title, status: "COMPLETED" } }).catch(() => {});
      infoCache.set(download.id, { title, formats, thumbnail: info?.thumbnail || null, duration: info?.duration || null, platform });
    }).catch((err) => {
      console.error("Info fetch error:", err);
      prisma.download.update({ where: { id: download.id }, data: { status: "FAILED" } }).catch(() => {});
      infoCache.set(download.id, { error: err?.message || "Failed to fetch video info" });
    });
  } catch (err: any) {
    console.error("Download error:", err);
    res.status(500).json({ error: err?.message || "Failed to process download" });
  }
});

router.get("/trending", optionalAuth, async (req, res) => {
  try {
    const userId = (req as any).user?.userId || null;
    const downloads = await prisma.download.findMany({
      where: { status: "COMPLETED" },
      orderBy: { createdAt: "desc" }, take: 12,
    });

    const platformColors: Record<string, string> = {
      youtube: "from-red-500 to-red-600",
      instagram: "from-purple-500 to-pink-500",
      tiktok: "from-gray-900 to-gray-800",
      facebook: "from-blue-600 to-blue-700",
      twitter: "from-gray-800 to-gray-700",
      vimeo: "from-blue-500 to-blue-600",
    };

    const fallbackPlatforms = ["youtube", "instagram", "tiktok", "facebook", "twitter", "vimeo"];
    const fallbackTitles = [
      "Amazing Nature 4K", "Funny Cat Compilation", "Best of 2026",
      "Learn React in 1 Hour", "Epic Music Mix", "Travel Destinations 2026",
      "Top 10 Gadgets 2026", "Workout Motivation", "Cooking Masterclass",
      "AI Revolution", "Game Highlights", "Street Dance Battle",
    ];
    const fallbackGradients = [
      "from-emerald-400 to-teal-500", "from-pink-400 to-rose-500",
      "from-purple-400 to-indigo-500", "from-cyan-400 to-blue-500",
      "from-orange-400 to-red-500", "from-green-400 to-emerald-500",
      "from-amber-400 to-yellow-500", "from-rose-400 to-pink-500",
      "from-sky-400 to-indigo-500", "from-violet-400 to-purple-500",
      "from-red-400 to-rose-500", "from-teal-400 to-cyan-500",
    ];
    const fallbackDurations = ["12:45", "3:22", "15:30", "60:00", "45:10", "8:15", "10:30", "20:00", "25:15", "18:40", "5:55", "35:20"];

    const formatDur = (sec: number | null | undefined): string => {
      if (sec == null || sec <= 0) return "0:00";
      const m = Math.floor(sec / 60);
      const s = Math.floor(sec % 60);
      return `${m}:${s.toString().padStart(2, "0")}`;
    };

    const items: any[] = [];
    for (const d of downloads) {
      const cached = infoCache.get(d.id);
      const duration = formatDur(cached?.duration);
      const thumbnail = cached?.thumbnail || `https://picsum.photos/seed/${d.id}/320/180`;
      const platform = d.platform || "youtube";
      const title = d.title !== "Processing..." ? d.title : "Video Download";
      const isUserDownload = userId && d.userId === userId;
      items.push({
        id: d.id, title, platform, url: d.url, duration, thumbnail,
        gradient: platformColors[platform] || fallbackGradients[items.length % fallbackGradients.length],
        downloads: Math.floor(Math.random() * 80000) + 5000,
        isUserDownload: !!isUserDownload,
        createdAt: d.createdAt.toISOString(),
      });
    }

    if (userId) {
      items.sort((a, b) => {
        if (a.isUserDownload && !b.isUserDownload) return -1;
        if (!a.isUserDownload && b.isUserDownload) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    }

    while (items.length < 12) {
      const i = items.length;
      const seed = `trending-fallback-${i}`;
      items.push({
        id: seed, title: fallbackTitles[i % fallbackTitles.length],
        platform: fallbackPlatforms[i % fallbackPlatforms.length],
        url: `https://www.${fallbackPlatforms[i % fallbackPlatforms.length]}.com/watch?v=example${i}`,
        duration: fallbackDurations[i % fallbackDurations.length],
        gradient: fallbackGradients[i % fallbackGradients.length],
        thumbnail: `https://picsum.photos/seed/${seed}/320/180`,
        downloads: Math.floor(Math.random() * 80000) + 5000,
        isUserDownload: false, createdAt: new Date(0).toISOString(),
      });
    }

    res.json({ trending: items });
  } catch (err) {
    console.error("Trending error:", err);
    res.status(500).json({ error: "Failed to fetch trending" });
  }
});

router.get("/history", async (req, res) => {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) { res.status(401).json({ error: "Unauthorized" }); return; }
    const jwt = await import("jsonwebtoken");
    const JWT_SECRET = process.env["JWT_SECRET"] || "supersecretjwtkey123";
    const token = header.slice(7);
    const payload = jwt.default.verify(token, JWT_SECRET) as { userId: string };
    const downloads = await prisma.download.findMany({
      where: { userId: payload.userId },
      orderBy: { createdAt: "desc" }, take: 50,
    });
    res.json({ downloads });
  } catch { res.status(401).json({ error: "Invalid token" }); }
});

router.get("/:id", optionalAuth, async (req, res) => {
  try {
    const download = await prisma.download.findUnique({ where: { id: req.params.id as string } });
    if (!download) { res.status(404).json({ error: "Download not found" }); return; }

    const quality = (req.query.quality as string) || download.quality;
    const format = (req.query.format as string) || download.format;
    const formatId = req.query.formatId as string;
    const ext = format === "mp3" ? "mp3" : "mp4";
    const safeName = (download.title || "video").replace(/[^a-zA-Z0-9_-]/g, "_");
    const downloadName = `${safeName}.${ext}`;

    await prisma.download.update({ where: { id: download.id }, data: { status: "COMPLETED", quality, format } }).catch(() => {});

    const tmpFile = path.join(os.tmpdir(), `savetube_${download.id}_${Date.now()}.${ext}`);
    const actualExt = format === "mp3" ? "mp3" : ext;
    const actualFile = tmpFile.replace(/\.(mp4|mp3)$/, `.${actualExt}`);
    const webmFile = tmpFile.replace(/\.(mp4|mp3)$/, ".webm");
    const mkvFile = tmpFile.replace(/\.(mp4|mp3)$/, ".mkv");

    const cookiesPath = getCookiesPath();
    const isYouTube = download.url.includes("youtube.com") || download.url.includes("youtu.be");

    let lastErr: Error | null = null;
    const clientsToTry = isYouTube ? [...YT_CLIENTS, ""] : [""];

    for (const client of clientsToTry) {
      const baseArgs = [
        "--output", tmpFile.replace(/\.(mp4|mp3)$/, ".%(ext)s"),
        "--no-playlist", "--no-progress", "--no-warnings",
        "--no-write-subs", "--embed-metadata",
      ];
      if (cookiesPath && fs.existsSync(cookiesPath)) baseArgs.push("--cookies", cookiesPath);
      if (client) {
        baseArgs.push("--extractor-args", `youtube:player_client=${client};player_skip=webpage,configs`);
      }
      if (format === "mp3") {
        baseArgs.push("-x", "--audio-format", "mp3", "--audio-quality", "0");
      } else if (formatId) {
        baseArgs.push("-f", `${formatId}+bestaudio/best`);
      } else {
        baseArgs.push(...getFormatArgs(format, quality));
      }
      baseArgs.push(download.url);

      try {
        await runYtDlp(baseArgs, 600000);
        lastErr = null;
        break;
      } catch (err: any) {
        lastErr = err;
        const msg = err.message || "";
        if (msg.includes("Sign in") || msg.includes("bot") || msg.includes("429") || msg.includes("confirm")) {
          console.warn(`[yt-dlp] Download client '${client || "default"}' blocked, trying next...`);
          continue;
        }
        break;
      }
    }

    if (lastErr) {
      if (!res.headersSent) res.status(500).json({ error: "Download failed", details: lastErr.message });
      [tmpFile, actualFile, webmFile, mkvFile].forEach((f) => { if (f) try { fs.unlinkSync(f); } catch {} });
      return;
    }

    let finalFile: string | null = null;
    if (fs.existsSync(actualFile)) finalFile = actualFile;
    else if (fs.existsSync(webmFile)) finalFile = webmFile;
    else if (fs.existsSync(mkvFile)) finalFile = mkvFile;
    else if (fs.existsSync(tmpFile)) finalFile = tmpFile;
    else {
      res.status(500).json({ error: "Download failed", details: "No output file created" });
      return;
    }

    const contentType = format === "mp3" ? "audio/mpeg" : "video/mp4";
    res.setHeader("Content-Type", contentType);
    res.setHeader("Content-Disposition", `attachment; filename="${downloadName}"`);

    const stream = fs.createReadStream(finalFile);
    stream.pipe(res);
    stream.on("error", () => { if (!res.headersSent) res.status(500).json({ error: "Download failed" }); });

    const cleanup = () => { [tmpFile, actualFile, webmFile, mkvFile, finalFile].forEach((f) => { if (f) try { fs.unlinkSync(f); } catch {} }); };
    res.on("finish", cleanup);
    res.on("close", cleanup);
  } catch (err: any) {
    console.error("Download error:", err);
    if (!res.headersSent) res.status(500).json({ error: "Failed to process download" });
  }
});

export default router;
