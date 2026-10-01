import { closing } from "@/lib/content";

/* The live homepage's second leading strapline, on the live orange band ("primary background colour": black
   Theinhardt Light on #f26400). Text only, between two image-led sections. */
export default function Closing() {
  return <section className="section closing" data-tone="orange" data-late aria-label="Our way of working">
    <div className="wrap">
      <p className="strap closing-text" data-reveal="text">{closing}</p>
    </div>
  </section>;
}
