// Refreshes content/home.json from the live homepage.
// ericwright.co.uk is a Laravel + Vue site: every homepage module, the header navigation and the footer links are
// server-rendered as JSON props (`modules="…"`, `:mainnavigationlinks="…"`, `:footerlinks="…"`). This script reads
// those props straight from the HTML, so no headless browser is needed. Run: npm run scrape
import { writeFile } from "node:fs/promises";

const SITE = "https://www.ericwright.co.uk";
const UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36";

const decode = (s) => s
  .replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");

// Entities left inside the module bodies (WYSIWYG HTML).
const text = (s) => (s ?? "")
  .replace(/&rsquo;|&lsquo;/g, "’").replace(/&ldquo;|&rdquo;/g, '"').replace(/&nbsp;/g, " ").replace(/&amp;/g, "&")
  .replace(/\r\n/g, "\n").trim();

const prop = (html, tag, name) => {
  const open = html.match(new RegExp(`<${tag}([\\s\\S]*?)>`));
  if (!open) throw new Error(`no <${tag}>`);
  const attr = open[1].match(new RegExp(`${name}="([^"]*)"`));
  if (!attr) throw new Error(`no ${name} on <${tag}>`);
  return JSON.parse(decode(attr[1]));
};

const res = await fetch(`${SITE}/`, { headers: { "user-agent": UA } });
if (!res.ok) throw new Error(`homepage ${res.status}`);
const html = await res.text();

const modulesAttr = html.match(/:modules="([^"]*)"/);
if (!modulesAttr) throw new Error("no modules prop");
const modules = JSON.parse(decode(modulesAttr[1]));
const byType = (type) => modules.filter((m) => m.type === type).map((m) => m.data);

const [hero] = byType("hero_header");
const [strapline, closing] = byType("leading_strapline");
const [about, careers] = byType("image_and_text");
const [businesses] = byType("business_grid");
const [projects] = byType("projects_carousel");
const [news] = byType("news_carousel");
const [accreditations] = byType("accreditations_block");

const card = (a) => ({ title: text(a.title), href: a.alias, image: a.image, date: a.date ?? null, tags: [...new Set(a.tags.map((t) => text(t.title)))] });

const out = {
  scraped: new Date().toISOString().slice(0, 10),
  // Order of the live modules, kept for the README's content count table.
  order: modules.map((m) => m.type),
  hero: hero.hero_header.map((s) => ({ title: text(s.title), subtitle: text(s.subtitle), image: s.image, video: s.video })),
  strapline: text(strapline.body),
  about: { title: text(about.title), body: text(about.body), image: about.image, cta: { label: about.cta_title, href: about.cta_link } },
  businesses: businesses.businesses.map((b) => ({ title: text(b.title), href: b.link, image: b.image })),
  projects: { title: text(projects.title), items: projects.projects.map(card) },
  careers: { title: text(careers.title), body: text(careers.body), image: careers.image, cta: { label: careers.cta_title, href: careers.cta_link } },
  closing: text(closing.body),
  news: { title: text(news.title), featured: card(news.featuredArticle), items: news.articles.map(card) },
  accreditations: {
    title: text(accreditations.title),
    body: text(accreditations.leadin),
    items: accreditations.accreditations_block.map((a) => ({ title: a.title, logo: a.logo })),
  },
  nav: {
    main: prop(html, "header-component", ":mainnavigationlinks"),
    sub: prop(html, "header-component", ":subnavigationlinks"),
  },
  footer: prop(html, "footer-component", ":footerlinks"),
};

await writeFile(new URL("../content/home.json", import.meta.url), JSON.stringify(out, null, 2) + "\n");
console.log(`home.json: ${out.hero.length} hero slides, ${out.businesses.length} businesses, ${out.projects.items.length} case studies, ${1 + out.news.items.length} news, ${out.accreditations.items.length} accreditations`);
