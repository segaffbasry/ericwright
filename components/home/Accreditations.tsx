import Image from "next/image";
import { Button } from "@/components/ui";
import { accreditations } from "@/lib/content";

/* The live accreditations block: its lead-in and all seven certification marks. The marks are the live white artwork
   (made for a dark ground) on black tiles, in greyscale; each keeps its name as alt text. */
export default function Accreditations() {
  return <section className="section accred" id="accreditations" tabIndex={-1} aria-labelledby="accred-title" data-late>
    <div className="wrap accred-grid">
      <div className="accred-copy">
        <h2 className="h2" id="accred-title" data-reveal="heading">{accreditations.title}</h2>
        <p className="copy" data-reveal="text">{accreditations.body}</p>
        <Button href={accreditations.cta.href}>{accreditations.cta.label}</Button>
      </div>
      <ul className="accred-logos">
        {accreditations.items.map((a) => <li key={a.logo} data-reveal="card"><Image src={a.logo} alt={a.title} width={180} height={120} sizes="180px" unoptimized={a.logo.endsWith(".svg")} /></li>)}
      </ul>
    </div>
  </section>;
}
