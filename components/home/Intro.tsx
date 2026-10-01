import Image from "next/image";
import { Button } from "@/components/ui";
import { intro } from "@/lib/content";

/* The live homepage's opening statement and its "Making real progress together." module, restaged on the
   reference's second section (jdavisgc "General Contracting the Right Way": a staggered photo collage beside the
   copy). The strapline keeps the live split: plain first sentence, emphasised second sentence. */
export default function Intro() {
  return <section className="section intro" id="about" tabIndex={-1} aria-labelledby="intro-title">
    <div className="wrap">
      <p className="strap intro-strap" data-reveal="text">{intro.strapline[0]} <span className="accent">{intro.strapline[1]}</span></p>
      <div className="intro-grid">
        <div className="collage">
          <figure className="collage-main" data-reveal="image" data-parallax><Image className="photo" src={intro.image} alt="Four Eric Wright colleagues in hard hats and hi-vis on site in front of a new steel frame" fill sizes="(max-width: 900px) 70vw, 34vw" /></figure>
          {intro.collage.map((c, i) => <figure key={c.src} className={`collage-${i ? "low" : "high"}`} data-reveal="image" data-parallax><Image className="photo" src={c.src} alt={c.alt} fill sizes="(max-width: 900px) 40vw, 20vw" /></figure>)}
        </div>
        <div className="intro-copy">
          <h2 className="h2" id="intro-title" data-reveal="heading">{intro.title}</h2>
          <div className="copy lead">
            <p data-reveal="text">{intro.body[0]}</p>
          </div>
          <p className="intro-sign h4" data-reveal="label">{intro.body[1]}</p>
          <Button href={intro.cta.href}>{intro.cta.label}</Button>
        </div>
      </div>
    </div>
  </section>;
}
