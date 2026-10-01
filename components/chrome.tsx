"use client";

import gsap from "gsap";
import type { ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Logo } from "@/components/Logo";
import { focusOverlay, usePageMotion } from "@/components/motion";
import { Arrow, Button, SocialIcon, linkProps, reducedMotion } from "@/components/ui";
import { businesses } from "@/lib/content";
import { contact, copyright, footerLinks, mainNav, socials, subNav } from "@/lib/site";

// Menu shortcuts to the homepage's own sections (scrolled through Lenis).
const onPage = [
  { label: "Home", href: "#top" },
  { label: "About us", href: "#about" },
  { label: "Our Businesses", href: "#businesses" },
  { label: "Latest case studies", href: "#work" },
  { label: "Careers", href: "#careers" },
  { label: "Latest News", href: "#news" },
  { label: "Accreditations", href: "#accreditations" },
];

// The live header's main row, in order; "Contact" is the button. Groups with children open the menu at that group.
const groups = [...mainNav, ...subNav].filter((g) => g.links.length);
const singles = [...mainNav, ...subNav].filter((g) => !g.links.length && g.label !== "Contact");
const headerItems = mainNav.filter((g) => g.label !== "Contact");
const contactLink = mainNav.find((g) => g.label === "Contact")?.href ?? contact.page;
const slug = (s: string) => s.toLowerCase().replace(/[^a-z]+/g, "-");

/* Full-screen menu. In: an orange curtain wipes down from the header, a black panel follows it 0.12s behind (the
   two brand grounds, one after the other), then every item rises into place. One GSAP timeline on the reference's
   swipe curve; reverse() plays the exact way out. Focus is trapped, Esc closes, focus returns to the trigger. */
function Menu({ open, close, trigger, focusGroup }: { open: boolean; close: () => void; trigger: HTMLElement | null; focusGroup: string | null }) {
  const root = useRef<HTMLDivElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const el = root.current; if (!el) return;
    const tl = gsap.timeline({ paused: true, defaults: { ease: "ew" }, onReverseComplete: () => { el.style.visibility = "hidden"; } });
    tl.fromTo(el.querySelector(".menu-curtain"), { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: .6, ease: "wipe" }, 0)
      .fromTo(el.querySelector(".menu-panel"), { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: .6, ease: "wipe" }, .12)
      .fromTo(el.querySelectorAll("[data-menu-in]"), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .5, stagger: { amount: .4 } }, .45);
    timeline.current = tl;
    return () => { tl.kill(); timeline.current = null; };
  }, []);

  useEffect(() => {
    const el = root.current, tl = timeline.current; if (!el || !tl) return;
    if (open) {
      el.style.visibility = "visible";
      tl.timeScale(reducedMotion() ? 50 : 1).play();
      const first = focusGroup ? el.querySelector<HTMLElement>(`#menu-${focusGroup} a`) : null;
      return focusOverlay(el, close, trigger, first);
    }
    if (tl.progress() > 0) tl.timeScale(reducedMotion() ? 50 : 1.6).reverse();
  }, [open, close, trigger, focusGroup]);

  return <div className="menu" id="site-menu" ref={root} role="dialog" aria-modal="true" aria-label="Site menu" aria-hidden={!open} inert={!open} data-lenis-prevent data-tone="dark">
    <div className="menu-curtain" aria-hidden="true" />
    <div className="menu-panel">
      <div className="menu-top wrap">
        <a href="#top" className="brand" onClick={close} aria-label="Eric Wright Group, back to the top"><Logo title="" markOnly /></a>
        <button className="menu-close" onClick={close}><span>Close</span><span className="menu-close-x" aria-hidden="true" /></button>
      </div>
      <div className="menu-body wrap">
        <nav className="menu-page" aria-label="On this page">
          <p className="menu-label label" data-menu-in>On this page</p>
          <ul>{onPage.map((l) => <li key={l.href} data-menu-in><a href={l.href} onClick={close}><span>{l.label}</span><Arrow /></a></li>)}</ul>
        </nav>
        <nav className="menu-groups" aria-label="Eric Wright Group site">
          {groups.map((g) => <div key={g.label} className="menu-group" id={`menu-${slug(g.label)}`}>
            <p className="menu-label" data-menu-in><a href={g.href} className="menu-group-link" {...linkProps(g.href)}>{g.label}<Arrow /></a></p>
            <ul>{g.links.map((l) => <li key={l.href} data-menu-in><a href={l.href} {...linkProps(l.href)}>{l.label}</a></li>)}</ul>
          </div>)}
          <div className="menu-group menu-singles" id="menu-more">
            {singles.map((g) => <p key={g.label} className="menu-label" data-menu-in><a href={g.href} className="menu-group-link" {...linkProps(g.href)}>{g.label}<Arrow /></a></p>)}
            <p className="menu-label" data-menu-in><a href={contactLink} className="menu-group-link" {...linkProps(contactLink)}>Contact<Arrow /></a></p>
          </div>
        </nav>
      </div>
      <div className="menu-foot wrap" data-menu-in>
        <a href={contact.tel}>{contact.phone}</a>
        <a href={contact.mailto}>{contact.email}</a>
        <ul className="socials">{socials.map((s) => <li key={s.name}><a href={s.href} {...linkProps(s.href)} aria-label={`Eric Wright Group on ${s.name}`}><SocialIcon icon={s.icon} /></a></li>)}</ul>
      </div>
    </div>
  </div>;
}

/* Frameless header: no bar or box. Its colour follows the section underneath (motion.tsx sets html[data-header]);
   it slides away on the way down and returns on the way up. Like the live header, the full lock-up sits at the top
   of the page and the compact EW mark takes over once the page scrolls (the live "sticky-logo"). */
function Header() {
  const [open, setOpen] = useState(false);
  const [trigger, setTrigger] = useState<HTMLElement | null>(null);
  const [focusGroup, setFocusGroup] = useState<string | null>(null);
  const bar = useRef<HTMLElement>(null);
  const close = useCallback(() => setOpen(false), []);
  const show = (el: HTMLElement, group: string | null) => { setTrigger(el); setFocusGroup(group); setOpen(true); };

  useEffect(() => {
    const el = bar.current; if (!el) return;
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY, delta = y - last;
      if (y < 120) { el.classList.remove("is-hidden"); last = y; return; }
      if (Math.abs(delta) < 6) return;
      el.classList.toggle("is-hidden", delta > 0 && !document.documentElement.classList.contains("overlay-open"));
      last = y;
    };
    const reveal = () => el.classList.remove("is-hidden");
    el.addEventListener("focusin", reveal);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => { el.removeEventListener("focusin", reveal); window.removeEventListener("scroll", onScroll); };
  }, []);

  return <>
    <header className="site-header" ref={bar}>
      <div className="wrap site-header-inner">
        <a href="#top" className="brand" aria-label="Eric Wright Group, back to the top">
          <Logo title="" className="logo-full" /><Logo title="" markOnly className="logo-compact" />
        </a>
        <nav className="header-nav" aria-label="Main" data-hero-part>
          {headerItems.map((g) => g.links.length
            ? <button key={g.label} aria-haspopup="dialog" aria-expanded={open && focusGroup === slug(g.label)} aria-controls="site-menu" onClick={(e) => show(e.currentTarget, slug(g.label))}>{g.label}</button>
            : <a key={g.label} href={g.href} {...linkProps(g.href)}>{g.label}</a>)}
        </nav>
        <div className="header-actions" data-hero-part>
          <a href={contactLink} className="btn btn-solid btn-sm header-contact" {...linkProps(contactLink)}><span>Contact</span><Arrow /></a>
          <button className="menu-toggle" aria-haspopup="dialog" aria-expanded={open && !focusGroup} aria-controls="site-menu" onClick={(e) => show(e.currentTarget, null)}>
            <span>Menu</span><span className="menu-toggle-lines" aria-hidden="true"><i /><i /></span>
          </button>
        </div>
      </div>
    </header>
    <Menu open={open} close={close} trigger={trigger} focusGroup={focusGroup} />
  </>;
}

/* The live footer's own content: its two link columns (site, then legal), the phone number, email, socials and the
   copyright line, plus the businesses from the header's "Our Businesses" dropdown. The agency credit is dropped. */
function Footer() {
  const [site, legal] = footerLinks;
  return <footer className="site-footer" data-tone="dark" data-late>
    <div className="wrap">
      <div className="footer-top">
        {/* The closing line of the live "Making real progress together." module. */}
        <p className="strap footer-line" data-reveal="heading">Because together, <span className="accent">we make a difference.</span></p>
        <Button href={contactLink} tone="solid">Get in touch</Button>
      </div>
      <div className="footer-grid">
        <div className="footer-col footer-logo-col" data-reveal="card">
          <a href="#top" className="footer-logo" aria-label="Eric Wright Group, back to the top"><Logo title="" /></a>
        </div>
        <div className="footer-col" data-reveal="card">
          <h2 className="footer-head">Our Businesses</h2>
          <ul>{businesses.map((b) => <li key={b.href}><a href={b.href} {...linkProps(b.href)}>{b.title}</a></li>)}</ul>
        </div>
        <div className="footer-col" data-reveal="card">
          <h2 className="footer-head">Eric Wright Group</h2>
          <ul>{site.map((l) => <li key={l.href}><a href={l.href} {...linkProps(l.href)}>{l.label}</a></li>)}</ul>
        </div>
        <div className="footer-col" data-reveal="card">
          <h2 className="footer-head">Contact</h2>
          <ul>
            <li><a href={contact.tel}>{contact.phone}</a></li>
            <li><a href={contact.mailto}>{contact.email}</a></li>
          </ul>
          <ul className="socials">{socials.map((s) => <li key={s.name}><a href={s.href} {...linkProps(s.href)} aria-label={`Eric Wright Group on ${s.name}`}><SocialIcon icon={s.icon} /></a></li>)}</ul>
        </div>
      </div>
      <div className="footer-bar">
        <ul className="footer-legal">{legal.map((l) => <li key={l.href}><a href={l.href} {...linkProps(l.href)}>{l.label}</a></li>)}</ul>
        <p>{copyright}</p>
      </div>
    </div>
  </footer>;
}

/* Everything around the page: header and menu, footer, smooth scroll and reveals. */
export function Shell({ children }: { children: ReactNode }) {
  usePageMotion();
  return <>
    <a className="skip-link" href="#main">Skip to content</a>
    <div id="top" tabIndex={-1} />
    <Header />
    <main id="main" tabIndex={-1}>{children}</main>
    <Footer />
  </>;
}
