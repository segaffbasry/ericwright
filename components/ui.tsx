import Image from "next/image";
import type { ReactNode } from "react";
import { brandIcons, type BrandIcon } from "@/lib/brand-icons";
import type { Card } from "@/lib/content";

export const reducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Links that leave the page open in a new tab with rel="noopener" (brief); motion.tsx keeps them from navigating at all.
export const linkProps = (href: string) => (href.startsWith("http") ? { target: "_blank", rel: "noopener" } : {});

// jdavisgc's own arrow (the `.the-button` and `.arrow-button` glyph), 15×15.
export function Arrow({ className = "arrow" }: { className?: string }) {
  return <svg className={className} width="15" height="15" viewBox="0 0 15 15" aria-hidden="true" focusable="false">
    <path d="M0 8.25H12.127L6.43075 13.9463L7.5 15L15 7.5L7.5 0L6.43075 1.05375L12.127 6.75H0V8.25Z" fill="currentColor" />
  </svg>;
}

// jdavisgc `.arrow-button`: a 40px ring with a 1px border and the arrow inside (32px on phones).
export function ArrowRing() {
  return <span className="arrow-ring" aria-hidden="true"><Arrow /></span>;
}

/* Pill button in the reference's shape (jdavisgc `.the-button`: rounded-full, 1px border, medium weight, -0.03em).
   Hover: the fill changes over 0.3s on --ease-ui and the arrow moves 5px over 0.5s, as on the reference. */
export function Button({ href, children, tone = "line", className = "", reveal = true, onClick }: {
  href: string; children: ReactNode; tone?: "solid" | "line"; className?: string; reveal?: boolean; onClick?: () => void;
}) {
  return <a href={href} className={`btn btn-${tone} ${className}`} data-reveal={reveal ? "label" : undefined} onClick={onClick} {...linkProps(href)}>
    <span>{children}</span><Arrow />
  </a>;
}

export function Tags({ tags, className = "" }: { tags: string[]; className?: string }) {
  if (!tags.length) return null;
  return <ul className={`tags ${className}`} aria-label="Tags">{tags.map((t) => <li key={t} className="tag">{t}</li>)}</ul>;
}

/* THE COPIED INTERACTION (README "Copied interaction"): jdavisgc.com's featured-project card, `.project-article`.
   Its markup is a bordered row (title, location, market tag chip, arrow ring) over a cropped image, and the whole
   article is one link. The hover, from the reference's compiled CSS:
     .project-article:hover h3, .project-article:hover .arrow-button { color: <accent> }
     .project-article:hover .arrow-button { border-color: <accent> }
     .project-article:hover img { transform: scale(1.1) }      img: transition-transform duration-1000 (1s, cubic-bezier(.4,0,.2,1))
   The colour change has no transition on the reference (it snaps), and neither does it here. The scale, duration and
   curve are CSS custom properties (--zoom-scale, --zoom-dur, --zoom-ease in globals.css). Keyboard focus triggers
   the same state. Here the "location" slot carries the business, and the tag chips carry the sectors. */
export function WorkCard({ item, sizes, priority = false }: { item: Card; sizes: string; priority?: boolean }) {
  const [business, ...sectors] = item.tags;
  return <a href={item.href} className="work-card" data-reveal="card" {...linkProps(item.href)}>
    <div className="work-head">
      <h3 className="work-title h3">{item.title}</h3>
      {business && <p className="work-business">{business}</p>}
      <div className="work-meta"><Tags tags={sectors} /><ArrowRing /></div>
    </div>
    <div className="work-image">
      <Image className="photo" src={item.image} alt="" fill sizes={sizes} priority={priority} />
    </div>
  </a>;
}

export function SocialIcon({ icon, size = 18 }: { icon: BrandIcon; size?: number }) {
  return <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" focusable="false"><path d={brandIcons[icon]} fill="currentColor" /></svg>;
}
