/* Homepage copy and media. Everything comes from the live homepage's own module data (content/home.json,
   `npm run scrape`) with local image paths (content/media.json, `npm run media`). Nothing is rewritten; where a
   module's text is split for layout, the comment says how. */
import home from "@/content/home.json";
import media from "@/content/media.json";
import { abs } from "@/lib/site";

const local = (path: string) => {
  const to = (media as Record<string, string>)[path];
  if (!to) throw new Error(`No local copy of ${path}; run npm run media`);
  return to;
};

// WYSIWYG bodies → plain paragraphs (the live HTML is only <p>, <strong> and one link).
const paragraphs = (html: string) => html.split(/<\/p>\s*/).map((p) => p.replace(/<[^>]+>/g, "").trim()).filter(Boolean);

export type Card = { title: string; href: string; image: string; date: string | null; tags: string[] };
type Raw = { title: string; href: string; image: string; date: string | null; tags: string[] };
const card = (c: Raw): Card => ({ ...c, href: abs(c.href), image: local(c.image) });

/* Hero. The live hero is a four-slide photo carousel; every slide carries the subtitle "Eric Wright Group" and a
   "…together." line. Here the Construction division's banner film replaces the photos (the only film on the site)
   and the four lines stay: the first is the H1, the other three rotate beneath it. */
export const hero = {
  subtitle: home.hero[0].subtitle,
  title: home.hero[0].title,
  lines: home.hero.slice(1).map((s) => s.title),
  film: "/media/film.mp4",
  poster: "/media/film-poster.jpg",
};

/* Intro: the first leading strapline, then the "Making real progress together." image-and-text module.
   The strapline's <strong> half is kept as the accent half. */
const [straplineLead, straplineStrong] = home.strapline.split(/<strong>|<\/strong>/).map((s) => s.trim()).filter(Boolean);
export const intro = {
  strapline: [straplineLead, straplineStrong] as const,
  title: home.about.title,
  body: paragraphs(home.about.body),
  image: local(home.about.image),
  cta: { label: home.about.cta.label, href: abs(home.about.cta.href) },
  // Two of the live hero carousel's photographs (Salford Roosters, the Charitable Trust nursery visit) frame the
  // module image as a collage; the other two hero photos show Animate, Preston, which is a case study below.
  collage: [
    { src: local(home.hero[1].image), alt: home.hero[1].title },
    { src: local(home.hero[3].image), alt: home.hero[3].title },
  ],
};

export const businesses = home.businesses.map((b) => ({ title: b.title, href: abs(b.href), image: local(b.image) }));

export const projects = {
  title: home.projects.title,
  items: home.projects.items.map(card),
  more: { label: "More Projects", href: abs("/work") }, // live "More Projects" link
};

export const careers = {
  title: home.careers.title,
  body: paragraphs(home.careers.body),
  image: local(home.careers.image),
  cta: { label: home.careers.cta.label, href: abs(home.careers.cta.href) },
};

export const closing = home.closing;

export const news = {
  title: home.news.title,
  featured: card(home.news.featured),
  items: home.news.items.map(card),
  more: { label: "More news", href: abs("/news") }, // live "More news" link
};

// The lead-in ends with an inline "Our Businesses" link; it is split off and shown as the section's button.
const [accreditationsText] = paragraphs(home.accreditations.body.replace(/<a [^>]*>[^<]*<\/a>/, ""));
export const accreditations = {
  title: home.accreditations.title,
  body: accreditationsText,
  cta: { label: "Our Businesses", href: abs("/businesses") },
  // The ISO 50001 logo has no title on the live site; its file name gives it.
  items: home.accreditations.items.map((a) => ({ title: a.title ?? "ISO 50001", logo: local(a.logo) })),
};

export const scraped = home.scraped;
