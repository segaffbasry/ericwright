import { Button, WorkCard } from "@/components/ui";
import { projects } from "@/lib/content";

/* "Latest case studies": the four projects in the live carousel, in the live order, as the reference's featured
   project cards (the copied interaction, components/ui.tsx WorkCard). A 2×2 grid instead of the reference's sticky
   stack keeps the section to about one and a half screens. */
export default function Work() {
  return <section className="section work" id="work" tabIndex={-1} aria-labelledby="work-title">
    <div className="wrap">
      <div className="section-head">
        <h2 className="h2" id="work-title" data-reveal="heading">{projects.title}</h2>
        <Button href={projects.more.href}>{projects.more.label}</Button>
      </div>
      <div className="work-grid">
        {projects.items.map((p) => <WorkCard key={p.href} item={p} sizes="(max-width: 760px) 100vw, 50vw" />)}
      </div>
    </div>
  </section>;
}
