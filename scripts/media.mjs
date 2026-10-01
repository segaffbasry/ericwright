// Downloads every image content/home.json references into public/media, plus the brand film and the logo files.
// Photos are capped at 2000px on the long edge (macOS `sips`); the film is re-encoded with ffmpeg (no audio, faststart)
// and a poster is cut from its opening frame. Writes content/media.json: live path → local path.
// Run after `npm run scrape`: npm run media
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";

const SITE = "https://www.ericwright.co.uk";
const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36";
const root = new URL("..", import.meta.url).pathname;
const home = JSON.parse(await readFile(`${root}content/home.json`, "utf8"));

// The Construction division's banner film (/businesses/construction hero): 23s of aerial and street footage of
// New Little Mill, Dispensary, Atelier and Greenhaus. It is the only film on the site.
const FILM = "/media/divisions/construction/banner-video.mp4";

const get = async (path) => {
  const res = await fetch(SITE + path, { headers: { "user-agent": UA } });
  if (!res.ok) throw new Error(`${path} ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
};

const isLogo = (path) => path.includes("/accreditations/");

// /media/divisions/maple-grove/case-studies/Animate%2C%20Preston/argento1.jpg → animate-preston-argento1.jpg
const local = (path) => {
  const parts = decodeURIComponent(path).split("/").filter(Boolean);
  const file = parts.pop().toLowerCase();
  const parent = parts.pop()?.toLowerCase() ?? "";
  const slug = `${parent}-${file}`.replace(/[^a-z0-9.]+/g, "-").replace(/^-+/, "");
  // Photographs published as PNG are re-saved as JPEG (a fifth of the size); logos stay PNG/SVG.
  return `/media/${isLogo(path) ? slug : slug.replace(/\.(png|jpeg)$/, ".jpg")}`;
};

const paths = new Set();
const add = (p) => p && paths.add(p);
home.hero.forEach((s) => add(s.image));
add(home.about.image);
home.businesses.forEach((b) => add(b.image));
home.projects.items.forEach((p) => add(p.image));
add(home.careers.image);
[home.news.featured, ...home.news.items].forEach((n) => add(n.image));
home.accreditations.items.forEach((a) => add(a.logo));

await mkdir(`${root}public/media`, { recursive: true });
const map = {};
for (const path of paths) {
  const to = local(path);
  map[path] = to;
  const file = `${root}public${to}`;
  if (existsSync(file)) continue;
  const body = await get(path);
  if (isLogo(path)) {
    await writeFile(file, body);
    if (file.endsWith(".png")) execFileSync("sips", ["-Z", "360", file], { stdio: "ignore" });
  } else {
    const tmp = `${root}_scrape/${to.split("/").pop()}.src`;
    await writeFile(tmp, body);
    execFileSync("sips", ["-Z", "2000", "-s", "format", "jpeg", "-s", "formatOptions", "78", tmp, "--out", file], { stdio: "ignore" });
  }
  console.log("↓", path);
}

// Brand film: the live 1080p H.264 file is already efficient (6.5 MB), so the video stream is copied as-is and only
// the audio track is dropped (the hero plays muted). The poster is cut from its opening frame.
const raw = `${root}_scrape/banner-video.mp4`;
await mkdir(`${root}_scrape`, { recursive: true });
if (!existsSync(raw)) await writeFile(raw, await get(FILM));
const ff = (...args) => execFileSync("ffmpeg", ["-v", "error", "-y", ...args], { stdio: "inherit" });
if (!existsSync(`${root}public/media/film.mp4`)) {
  ff("-i", raw, "-an", "-c:v", "copy", "-movflags", "+faststart", `${root}public/media/film.mp4`);
  ff("-ss", "0.2", "-i", raw, "-frames:v", "1", "-vf", "scale=1600:-2", "-q:v", "4", "-strict", "unofficial", `${root}public/media/film-poster.jpg`);
}
map[FILM] = "/media/film.mp4";

// Logos: the header's two-tone lock-up and the compact mark used once the live header turns sticky.
await mkdir(`${root}_scrape/brand`, { recursive: true });
for (const f of ["header/transparent-logo.svg", "header/sticky-logo.svg", "favicons/safari-pinned-tab.svg"]) {
  await writeFile(`${root}_scrape/brand/${f.split("/").pop()}`, await get(`/images/eric-wright/${f}`));
}

await writeFile(`${root}content/media.json`, JSON.stringify(map, null, 2) + "\n");
console.log(`media.json: ${Object.keys(map).length} files`);
