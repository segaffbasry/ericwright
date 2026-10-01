"use client";

import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import { Arrow, reducedMotion } from "@/components/ui";
import { hero } from "@/lib/content";
import { splitLines } from "@/lib/split";

/* Hero, on the reference's pattern (jdavisgc.com: a full-bleed muted film, the headline set bottom-left at display
   size, a short line under it and one button). The film is the Construction division's banner film; the live
   carousel's four lines stay: the H1, then the other three turning over beneath it every 3.6s.
   Entrance waits for `intro:done`: the headline's lines rise out of their masks, then the rest fades up.
   The film is muted, has a pause control, pauses when off-screen, and keeps a local poster as fallback. */
export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);
  const [line, setLine] = useState(0);
  const userPaused = useRef(false);

  // Entrance.
  useEffect(() => {
    const el = root.current; if (!el) return;
    const title = el.querySelector<HTMLElement>(".hero-title")!;
    const parts = [el.querySelectorAll("[data-hero-in]"), document.querySelectorAll(".site-header [data-hero-part]")];
    if (reducedMotion()) return;
    const split = splitLines(title);
    gsap.set(split.words, { yPercent: 110 });
    gsap.set(parts, { opacity: 0, y: 16 });
    const play = () => {
      const tl = gsap.timeline();
      split.lines.forEach((words, i) => tl.to(words, { yPercent: 0, duration: 1, ease: "power3.out" }, i * .1));
      tl.to(parts, { opacity: 1, y: 0, duration: .65, ease: "ew", stagger: .06, clearProps: "transform" }, .3);
    };
    if (document.documentElement.dataset.intro === "done") play();
    else document.addEventListener("intro:done", play, { once: true });
    return () => { document.removeEventListener("intro:done", play); gsap.killTweensOf([split.words, ...parts]); split.revert(); gsap.set(parts, { clearProps: "all" }); };
  }, []);

  // The three other carousel lines turn over, unless reduced motion is on or the film is paused.
  useEffect(() => {
    if (paused || reducedMotion()) return;
    const id = window.setInterval(() => setLine((n) => (n + 1) % hero.lines.length), 3600);
    return () => window.clearInterval(id);
  }, [paused]);

  // Pause off-screen; resume on return unless the visitor paused it.
  useEffect(() => {
    const v = video.current; if (!v) return;
    if (reducedMotion()) { v.pause(); setPaused(true); userPaused.current = true; return; }
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !userPaused.current) void v.play().catch(() => {});
      else if (!entry.isIntersecting) v.pause();
    }, { threshold: .1 });
    io.observe(v);
    return () => io.disconnect();
  }, []);

  const toggle = () => {
    const v = video.current; if (!v) return;
    if (v.paused) { userPaused.current = false; void v.play().catch(() => {}); setPaused(false); }
    else { userPaused.current = true; v.pause(); setPaused(true); }
  };

  return <section className="hero" ref={root} data-tone="dark" data-hero aria-labelledby="hero-title">
    <div className="hero-media" aria-hidden="true">
      <video ref={video} className="photo" autoPlay muted loop playsInline preload="auto" poster={hero.poster}>
        <source src={hero.film} type="video/mp4" />
      </video>
    </div>
    <div className="hero-scrim" aria-hidden="true" />
    <div className="wrap hero-inner">
      <p className="hero-sub" data-hero-in>{hero.subtitle}</p>
      <h1 className="hero-title h-hero" id="hero-title">{hero.title}</h1>
      <div className="hero-foot">
        <p className="hero-line" data-hero-in aria-hidden="true">
          {hero.lines.map((l, i) => <span key={l} className={i === line ? "is-on" : undefined}>{l}</span>)}
        </p>
        <ul className="sr-only">{hero.lines.map((l) => <li key={l}>{l}</li>)}</ul>
        <a href="#businesses" className="btn btn-light" data-hero-in><span>Our Businesses</span><Arrow /></a>
      </div>
    </div>
    <button className="hero-pause" onClick={toggle} aria-pressed={paused} data-hero-in>
      <span className={`hero-pause-icon${paused ? " is-paused" : ""}`} aria-hidden="true" />
      <span>{paused ? "Play film" : "Pause film"}</span>
    </button>
  </section>;
}
