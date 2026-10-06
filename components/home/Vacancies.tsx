"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Arrow, Button, linkProps, reducedMotion } from "@/components/ui";
import { vacancies } from "@/lib/content";

/* "Want to work for us?": every live vacancy in one horizontal row of cards. The pattern is the approved Girling
   Jones jobs row (client feedback 2026-10-06: add a careers section from an approved template): count pill, heading,
   filter chips, arrow buttons, a snapping card track and a progress rule. It scrolls sideways by trackpad, touch,
   shift-wheel, the arrows or the keyboard, and can be narrowed by business. Each card links to its live job page. */
const departments = Object.entries(vacancies.items.reduce<Record<string, number>>((acc, v) => { acc[v.department] = (acc[v.department] ?? 0) + 1; return acc; }, {}))
  .sort((a, b) => b[1] - a[1]);

export default function Vacancies() {
  const [dept, setDept] = useState<string | null>(null);
  const [edge, setEdge] = useState({ start: true, end: false, progress: 0 });
  const track = useRef<HTMLUListElement>(null);
  const list = useMemo(() => (dept ? vacancies.items.filter((v) => v.department === dept) : vacancies.items), [dept]);

  useEffect(() => {
    const el = track.current; if (!el) return;
    el.scrollTo({ left: 0 });
    const update = () => {
      const max = el.scrollWidth - el.clientWidth;
      setEdge({ start: el.scrollLeft < 4, end: el.scrollLeft > max - 4, progress: max > 0 ? el.scrollLeft / max : 1 });
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => { el.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, [list]);

  const step = (dir: number) => {
    const el = track.current; if (!el) return;
    const card = el.querySelector<HTMLElement>("li");
    const by = card ? (card.offsetWidth + 16) * Math.max(1, Math.floor(el.clientWidth / (card.offsetWidth + 16))) : el.clientWidth;
    el.scrollBy({ left: dir * by, behavior: reducedMotion() ? "auto" : "smooth" });
  };

  return <section className="section vac" id="vacancies" tabIndex={-1} aria-labelledby="vac-title">
    <div className="wrap">
      <div className="vac-head">
        <div>
          <p className="count-pill" data-reveal="label"><span className="dot" aria-hidden="true" />{vacancies.items.length} live vacancies</p>
          <h2 className="h2" id="vac-title" data-reveal="heading">{vacancies.title}</h2>
        </div>
        <div className="vac-head-side">
          <p className="copy" data-reveal="text">{vacancies.body}</p>
          <Button href={vacancies.cta.href}>{vacancies.cta.label}</Button>
        </div>
      </div>
      <div className="vac-bar" data-reveal="label">
        <div className="chips" role="group" aria-label="Filter vacancies by business">
          <button className="chip" aria-pressed={dept === null} onClick={() => setDept(null)}>All <span>{vacancies.items.length}</span></button>
          {departments.map(([name, count]) => <button key={name} className="chip" aria-pressed={dept === name} onClick={() => setDept(name)}>{name} <span>{count}</span></button>)}
        </div>
        <div className="vac-nav">
          <button className="arrow-ring" onClick={() => step(-1)} disabled={edge.start} aria-label="Previous vacancies" aria-controls="vac-track"><Arrow className="arrow arrow-back" /></button>
          <button className="arrow-ring" onClick={() => step(1)} disabled={edge.end} aria-label="More vacancies" aria-controls="vac-track"><Arrow /></button>
        </div>
      </div>
    </div>
    <div className="vac-rail" data-reveal="card">
      <ul className="vac-track" id="vac-track" ref={track} tabIndex={0} aria-label={`${list.length} vacancies${dept ? ` in ${dept}` : ""}, scroll sideways`} data-lenis-prevent-horizontal>
        {list.map((v, i) => <li key={v.href} className={`vac-card${i % 3 === 1 ? " vac-card-dark" : ""}`}>
          <article aria-labelledby={`vac-${v.href.split("-").pop()}`}>
            <p className="vac-meta"><span>{v.city}</span><span className="tag">{v.contract}</span></p>
            <h3 className="vac-title" id={`vac-${v.href.split("-").pop()}`}><a href={v.href} {...linkProps(v.href)}>{v.title}</a></h3>
            <p className="vac-location">{v.location}</p>
            <div className="vac-foot">
              <p className="vac-pay">{v.salary}</p>
              <p className="vac-small">{v.department} · Closes {v.closing}</p>
              <span className="vac-more" aria-hidden="true">Read more <Arrow /></span>
            </div>
          </article>
        </li>)}
      </ul>
    </div>
    <div className="wrap">
      <div className="vac-progress" aria-hidden="true"><span style={{ transform: `scaleX(${Math.max(.04, edge.progress)})` }} /></div>
    </div>
  </section>;
}
