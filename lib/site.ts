/* Site structure from the live ericwright.co.uk header and footer props (content/home.json, `npm run scrape`).
   Only the homepage is rebuilt, so every link goes to the real URL on the live site, checked against
   /sitemap.xml (README "Links"). */
import home from "@/content/home.json";
import type { BrandIcon } from "@/lib/brand-icons";

export type Link = { label: string; href: string };
export type NavGroup = { label: string; href: string; links: Link[] };

export const LIVE = "https://www.ericwright.co.uk";
export const abs = (path: string) => (/^(https?:|mailto:|tel:|#)/.test(path) ? path : `${LIVE}${path}`);

type NavNode = { title: string; alias: string; children?: NavNode[] };
const group = (n: NavNode): NavGroup => ({
  label: n.title,
  href: abs(n.alias),
  links: (n.children ?? []).map((c) => ({ label: c.title, href: abs(c.alias) })),
});

// The live header has two rows: the small utility row (About Us, Careers, News) and the main row
// (Our Businesses, Social Value, Our Work, Charitable Trust, Contact). The menu keeps that split.
export const mainNav: NavGroup[] = (home.nav.main as NavNode[]).map(group);
export const subNav: NavGroup[] = (home.nav.sub as NavNode[]).map(group);

// Footer: the live footer's two link columns, in order.
export const footerLinks: Link[][] = home.footer.map((col) => col.map((l) => ({ label: l.title, href: abs(l.link) })));

export const contact = {
  phone: "+44 (0)1772 698822",
  tel: "tel:+441772698822", // live footer: tel:01772 698822
  email: "info@ericwright.co.uk",
  mailto: "mailto:info@ericwright.co.uk",
  page: abs("/contact"),
};

export const socials: { name: string; href: string; icon: BrandIcon }[] = [
  { name: "LinkedIn", href: "https://www.linkedin.com/company/eric-wright-group", icon: "linkedin" },
  { name: "X", href: "https://twitter.com/EricWrightGroup", icon: "x" },
];

export const copyright = "Copyright © Eric Wright Group"; // live footer, verbatim
