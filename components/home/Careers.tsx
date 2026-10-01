import Image from "next/image";
import { Button } from "@/components/ui";
import { careers } from "@/lib/content";

/* The live careers module ("Outstanding opportunities for young people."), image and text 50/50 as on the live
   page, on the black ground so the page alternates light and dark. */
export default function Careers() {
  return <section className="section careers" id="careers" tabIndex={-1} data-tone="dark" aria-labelledby="careers-title">
    <div className="wrap careers-grid">
      <figure className="careers-image" data-reveal="image" data-parallax><Image className="photo" src={careers.image} alt="Two Eric Wright colleagues in hard hats and hi-vis walking through a bright, newly finished building" fill sizes="(max-width: 900px) 100vw, 50vw" /></figure>
      <div className="careers-copy">
        <h2 className="h2" id="careers-title" data-reveal="heading">{careers.title}</h2>
        <div className="copy lead">{careers.body.map((p) => <p key={p} data-reveal="text">{p}</p>)}</div>
        <Button href={careers.cta.href} tone="solid">{careers.cta.label}</Button>
      </div>
    </div>
  </section>;
}
