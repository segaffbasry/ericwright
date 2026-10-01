"use client";

import Image from "next/image";
import { useState } from "react";
import { ArrowRing, linkProps } from "@/components/ui";
import { businesses } from "@/lib/content";

/* "Our Businesses": all nine divisions from the live business grid, each with its live grid photograph.
   Laid out as the reference's bordered project rows (jdavisgc `.project-article` header: title left, arrow ring
   right, 1px top rule), with one framed photograph beside the list that follows hover and keyboard focus, so nine
   photos take one screen instead of the live grid's 1,641px. The frame's photos load eagerly (only one is visible
   at a time, so lazy loading never fires for the others). On phones each row carries its own thumbnail. */
export default function Businesses() {
  const [active, setActive] = useState(0);
  return <section className="section biz" id="businesses" tabIndex={-1} aria-labelledby="biz-title">
    <div className="wrap">
      <div className="section-head">
        <h2 className="h2" id="biz-title" data-reveal="heading">Our Businesses</h2>
      </div>
      <div className="biz-grid">
        <ul className="biz-list">
          {businesses.map((b, i) => <li key={b.href} data-reveal="card">
            <a href={b.href} className={`biz-row${i === active ? " is-active" : ""}`} onMouseEnter={() => setActive(i)} onFocus={() => setActive(i)} {...linkProps(b.href)}>
              <span className="biz-thumb" aria-hidden="true"><Image className="photo" src={b.image} alt="" fill sizes="96px" /></span>
              <span className="biz-name h3">{b.title}</span>
              <ArrowRing />
            </a>
          </li>)}
        </ul>
        <div className="biz-frame" data-reveal="image" aria-hidden="true">
          <div className="biz-frame-inner">{businesses.map((b, i) => <Image key={b.href} className={`photo${i === active ? " is-on" : ""}`} src={b.image} alt="" fill sizes="(max-width: 900px) 1px, 40vw" loading="eager" />)}</div>
          <p className="biz-caption">{businesses[active].title}</p>
        </div>
      </div>
    </div>
  </section>;
}
