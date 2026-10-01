"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";
import { Logo } from "@/components/Logo";
import "@/components/motion";
import { reducedMotion } from "@/components/ui";

/* The company signing its name, assembled from the logo's own vector parts (lib/logo.ts).
   The EW mark is drawn with flat geometry: three equal bars make the E, three parallel 45° strokes make the W.
   So it is built the way it reads, bar by bar and stroke by stroke:
     Build  0.10–0.95s  the E's three bars slide in from the left, top to bottom (0.45s each, 0.07s apart); the W's
                        three strokes then slide down their own 45° slant into place, left to right; "Eric Wright"
                        clip-wipes open beneath, then "Group" (the reference's swipe curve, .16,.01,.77,1).
     Hold   0.95–1.25s
     Exit   1.25–1.80s  the lock-up glides into the header logo position while the black ground fades off the hero
                        film, whose opening frame sits under a black scrim, so there is no colour jump.
   One GSAP timeline, 1.8s in all; the handover fires at 1.35s so the hero entrance overlaps the landing. */
export default function Preloader() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current; if (!el) return;
    const root = document.documentElement;
    let handed = false;
    const handover = () => {
      if (handed) return; handed = true;
      performance.mark("intro:done");
      root.classList.remove("is-loading");
      root.dataset.intro = "done";
      document.dispatchEvent(new Event("intro:done"));
    };
    // The header logo stays hidden (is-landing) until the travelling logo arrives; then the two swap in one frame.
    const finish = () => { handover(); root.classList.remove("is-landing"); el.style.display = "none"; performance.mark("preloader:end"); };
    delete root.dataset.intro;
    if (reducedMotion()) { finish(); return; }
    root.classList.add("is-loading", "is-landing"); // already set by the boot script in app/layout.tsx

    const part = (id: string) => el.querySelector<SVGElement>(`[data-part="${id}"]`);
    const logo = el.querySelector<SVGSVGElement>(".logo")!;
    const target = document.querySelector<SVGSVGElement>(".site-header .brand .logo-full");

    // performance marks (preloader:start, intro:done, preloader:end) make the timing measurable (README "Verification").
    performance.mark("preloader:start");
    const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: .45 }, onComplete: finish });
    tl.set(el.querySelector(".preloader-sign"), { autoAlpha: 1 })
      .fromTo([part("bar-top"), part("bar-mid"), part("bar-bottom")], { x: -46, opacity: 0 }, { x: 0, opacity: 1, stagger: .07 }, .1)
      .fromTo([part("w-left"), part("w-mid"), part("w-right")], { x: 26, y: -26, opacity: 0 }, { x: 0, y: 0, opacity: 1, stagger: .07 }, .3)
      .fromTo(part("word"), { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: .45, ease: "wipe" }, .5)
      .fromTo(part("group"), { clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)", duration: .4, ease: "wipe" }, .62)
      .addLabel("exit", 1.25)
      .add(() => {
        // Measured at exit time so a late web-font or a resize cannot misplace the landing.
        if (!target || !target.getBoundingClientRect().width) return;
        const from = logo.getBoundingClientRect(), to = target.getBoundingClientRect();
        gsap.to(logo, { x: to.left - from.left + (to.width - from.width) / 2, y: to.top - from.top + (to.height - from.height) / 2, scale: to.width / from.width, transformOrigin: "50% 50%", duration: .55, ease: "power3.inOut" });
      }, "exit")
      .to(el, { backgroundColor: "rgba(0,0,0,0)", duration: .5, ease: "ew" }, "exit+=.05")
      .add(handover, "exit+=.1")
      .set({}, {}, "exit+=.55");

    // Development only: `/?intro=pause` holds the timeline on its first frame and exposes it as window.__intro, so
    // each stage can be inspected with __intro.seek(t) (README "Verification").
    const inspect = process.env.NODE_ENV !== "production" && location.search.includes("intro=pause");
    if (inspect) { tl.pause(0); (window as unknown as { __intro?: gsap.core.Timeline }).__intro = tl; }

    // Never hold the page beyond ~2s, even if a frame stalls.
    const failsafe = inspect ? 0 : window.setTimeout(finish, 2300);
    return () => { window.clearTimeout(failsafe); tl.kill(); gsap.killTweensOf(logo); root.classList.remove("is-loading", "is-landing"); };
  }, []);

  return <div className="preloader" ref={ref} aria-hidden="true">
    <div className="preloader-sign"><Logo parts title="" /></div>
  </div>;
}
