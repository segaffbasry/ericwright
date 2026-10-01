import Image from "next/image";
import { ArrowRing, Button, Tags, linkProps } from "@/components/ui";
import { news, type Card } from "@/lib/content";

/* "Latest News": the live module's featured article plus its four carousel articles (all five live items), with
   their dates and tags. The featured story leads as a large card; the other four are compact rows. Both use the
   copied hover (title and ring turn orange, the photo eases to 1.1 over 1s). */
function Row({ item }: { item: Card }) {
  return <li data-reveal="card">
    <a href={item.href} className="news-row" {...linkProps(item.href)}>
      <span className="news-thumb"><Image className="photo" src={item.image} alt="" fill sizes="(max-width: 760px) 30vw, 180px" /></span>
      <span className="news-text">
        <time className="news-date">{item.date}</time>
        <span className="news-title">{item.title}</span>
      </span>
      <ArrowRing />
    </a>
  </li>;
}

export default function News() {
  const f = news.featured;
  return <section className="section news" id="news" tabIndex={-1} aria-labelledby="news-title" data-late>
    <div className="wrap">
      <div className="section-head">
        <h2 className="h2" id="news-title" data-reveal="heading">{news.title}</h2>
        <Button href={news.more.href}>{news.more.label}</Button>
      </div>
      <div className="news-grid">
        <a href={f.href} className="news-feature" data-reveal="card" {...linkProps(f.href)}>
          <span className="news-feature-image"><Image className="photo" src={f.image} alt="" fill sizes="(max-width: 900px) 100vw, 50vw" /></span>
          <span className="news-feature-meta"><time className="news-date">{f.date}</time><Tags tags={f.tags} /></span>
          <span className="news-feature-title h3">{f.title}</span>
          <ArrowRing />
        </a>
        <ul className="news-list">{news.items.map((n) => <Row key={n.href} item={n} />)}</ul>
      </div>
    </div>
  </section>;
}
