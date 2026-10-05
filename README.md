# Eric Wright Group: homepage redesign (private prospect demo)

A one-page rebuild of [ericwright.co.uk](https://www.ericwright.co.uk/). It uses Eric Wright Group's own logo, brand film, photography and copy, and restages them on the layout of the reference site [jdavisgc.com](https://jdavisgc.com/). **Scope: homepage only.** Every other link points at the real page on ericwright.co.uk.

Stack: Next.js 16 (App Router, TypeScript), GSAP + ScrollTrigger + CustomEase, and Lenis. No UI kit, no CSS framework and no other animation library. Plain CSS lives in `app/globals.css` and `styles/*.css`.

```bash
npm install
npm run dev        # http://127.0.0.1:3030
npm run build      # static build of the single route
npm run typecheck
npm run scrape     # refresh content/home.json from the live homepage
npm run media      # re-download photography, the brand film and the logos (needs ffmpeg and macOS sips)
npm run logo       # re-split the live logo into lib/logo.ts + app/icon.svg
```

## Routes

| Route | What |
|---|---|
| `/` | The homepage. Statically generated. |
| `/icon.svg` | Favicon: the orange EW mark on a black tile. |

`next build` generates 4 static pages. The route table lists `/`, `/_not-found` and `/icon.svg`. There are no archive or detail pages.

## Recon (Phase 1)

**How the live site is built:** Laravel with Vue. The homepage HTML is an empty shell, but every module is server-rendered as a JSON prop (`<component-wrapper-module :modules="…">`). The header's navigation (`:mainnavigationlinks`, `:subnavigationlinks`) and the footer's links (`<footer-component :footerlinks>`) are embedded the same way. `scripts/scrape.mjs` reads those props directly, so no headless browser is needed.

**Live homepage, module by module** (counts are live vs this build):

| # | Live module | Live items | Here | Notes |
|---|---|---|---|---|
| 1 | `hero_header`: 4-slide photo carousel, subtitle "Eric Wright Group" | 4 slides | 4 lines + film | The H1 stays. The other three lines turn over beneath it. The photos are replaced by the brand film; two of them appear in the intro collage, and the other two show Animate, Preston, which is a case study below. |
| 2 | `leading_strapline` "At the Eric Wright Group…" | 1 | 1 | The `<strong>` half is set as the orange half. |
| 3 | `image_and_text` "Making real progress together." + "More about us" | 1 | 1 | |
| 4 | `business_grid` "Our Businesses" | 9 | 9 | Every business with its live grid photo. |
| 5 | `projects_carousel` "Latest case studies" + "More Projects" | 4 | 4 | Live order, with business and sector tags. |
| 6 | `image_and_text` "Outstanding opportunities for young people." + "Current Vacancies" | 1 | 1 | |
| 7 | `leading_strapline` (orange band) "For us together isn't just a word…" | 1 | 1 | |
| 8 | `news_carousel` "Latest News": featured + carousel + "More news" | 1 + 4 | 1 + 4 | Dates and tags kept. |
| 9 | `accreditations_block` | 7 marks | 7 | Lead-in kept. Its inline "Our Businesses" link becomes the button. |

Nothing was cut for pacing. The live page is already short, so every item fits within the page-length target.

**Brand:**
- **Logo:** `/images/eric-wright/header/transparent-logo.svg` is true vector, 180×129, made of 26 paths. These split into the EW mark (6 orange shapes: three bars for the E, three 45° strokes for the W), "Eric Wright" (15 white shapes) and "Group" (5 orange shapes). `scripts/logo.py` checks each group's bounding box and writes `lib/logo.ts`. `sticky-logo.svg` is the same six mark shapes; the compact header uses them.
- **Favicon:** the live favicons are PNGs. Here `app/icon.svg` is generated from the mark.
- **Brand film:** the site's only film is the Construction division banner, `/media/divisions/construction/banner-video.mp4` (23s, 1920×1080, 6.5 MB). It shows aerial and street footage of New Little Mill, Dispensary, Atelier and Greenhaus, with the EW mark burned in. The video stream is copied unchanged and the audio is dropped.
- **Fonts:** Theinhardt (Optimo, commercial; served from `/build/assets/*.woff2`) in Light 300, Regular 400 and Bold 700. It can't be self-hosted under its licence, so **Inter Tight** (OFL, self-hosted from `@fontsource-variable/inter-tight`) stands in. It is the closest open neo-grotesk, with a true Light for the brand's light straplines.

**Structure:**
- **Header:** utility row (About Us, Careers → `/culture`, News, search) and main row (Our Businesses, Social Value, Our Work, Charitable Trust, Contact). It becomes a compact sticky bar with the mark only.
- **Footer:** two link columns (About Us, Careers, News, Contact, Accessibility | Privacy Notice, Site Usage Policy, Cookie Policy, Modern Slavery Statement PDF), the phone, the email, the copyright and an agency credit (dropped here).
- **Socials:** X (twitter.com/EricWrightGroup) and LinkedIn.

## Decisions (brief brackets left open)

| Bracket | Decision |
|---|---|
| [PALETTE] | **Orange `#f26400`** (logo and brand colour; 213 uses in the live `default.css`), **Black `#000000`** (live text and footer), **White**, **Mist `#f7f7f8`** (the live light ground). Orange text under 24px uses `#bf4f00`, the live stylesheet's own darker orange, which passes AA on white (4.9:1). No other hue anywhere. |
| Look / motion reference | One reference was given (jdavisgc.com), so it decides both. It scrolls natively; Lenis is added as the brief requires and tuned close to native. |
| Copied interaction | Not named, so jdavisgc's **featured-project card hover** (`.project-article`) was chosen. The jdavisgc pill button was the copied interaction on an earlier demo, so it was not reused for that role. |
| UI/body [x], display [y] | Both Inter Tight. Display = 300 for straplines (as live) and 500 at -0.02em for headlines (as jdavisgc). |
| [ONCE?] | The preloader plays on every homepage load. |
| Photography | **Full colour**, except the hero film, which stays black and white. Client feedback (2026-10-05): "the header being in b&w is fine but the rest of the website should be in colour". The palette rule applies to the UI (type, grounds, buttons, hovers), not to the photographs. |
| Accreditation marks | The live files are white artwork for a dark ground, so they sit on black tiles. |
| Section grounds | jdavisgc doesn't recolour on scroll, so there is no blended backdrop. Each section has its own ground (`data-tone`), alternating white / mist / black / orange. |
| Header CTA | "Contact", in the reference's "Build with Us" slot. The live main nav also sets Contact apart. |

## Page structure

| # | Section | Ground | Reference pattern |
|---|---|---|---|
| 1 | Hero: brand film, subtitle, H1, three turning lines, "Our Businesses" | film | Full-bleed muted film, headline bottom-left, one pill button |
| 2 | Intro: strapline, then a collage of 3 photos beside "Making real progress together." | white | "General Contracting the Right Way": staggered photo collage beside copy |
| 3 | Our Businesses: 9 bordered rows + one framed photo that follows hover/focus | mist | Project-row header (title, arrow ring, 1px rule) |
| 4 | Latest case studies: 4 cards, 2×2 (a swipe row on phones) | white | Featured projects (the copied interaction) |
| 5 | Careers: image + text | black | |
| 6 | Closing strapline | orange | Live orange band (text only) |
| 7 | Latest News: featured card + 4 rows | white | |
| 8 | Accreditations: lead-in + 7 marks | mist | |
| | Footer: closing line, businesses, site links, contact, legal | black | |

Imagery leads the first sections: film, then the collage, then the business photos.

**Page height** (measured in headless Chrome after scrolling through, production build):

| Width | Height | Viewports |
|---|---|---|
| 375 × 812 | 7,311px | 9.0 |
| 768 × 1024 | 8,230px | 8.0 |
| 1440 × 900 | 7,228px | 8.0 |

Phones run slightly long because nine business rows and five news items stack. Both are already compact rows, and cutting items would drop live content.

## How it works

### Preloader (`components/Preloader.tsx`)
It is built from the logo's own vector parts and matches the mark's geometry: flat bars and parallel strokes, so it assembles bar by bar and stroke by stroke.

| Time | Stage |
|---|---|
| 0.10–0.59s | The E's three bars slide in from the left, top to bottom (0.45s each, 0.07s apart) |
| 0.30–0.89s | The W's three strokes slide down their own 45° slant into place, left to right |
| 0.50–1.02s | "Eric Wright", then "Group", clip-wipe open on the reference's swipe curve |
| 1.02–1.25s | Hold |
| 1.25–1.80s | The lock-up glides into the header logo position while the black ground fades off the film |

It runs on one GSAP timeline lasting 1.8s. At 1.35s it hands over: it removes `is-loading`, sets `data-intro="done"` and dispatches `intro:done`. The hero's line-by-line headline rise and the header items start on that event, so the exit and the entrance overlap. The background is black, the hero's opening scene (the film under a dark scrim), so there is no colour jump. Lenis is stopped until handover. A 2.3s timeout guarantees the page is never held. The overlay is `aria-hidden`. It is skipped instantly with reduced motion and hidden by `<noscript>`. The effect cleans up after itself (kills the timeline and tweens, removes the classes).

### Motion system (`components/motion.tsx`, `lib/ease.ts`)
Lenis runs on the GSAP ticker and is synced with ScrollTrigger. Anchors scroll through Lenis and move focus. The menu and preloader stop it.

| Move | Targets | Motion | Duration |
|---|---|---|---|
| `label` | buttons, small lines | 14px rise + fade | 0.65s |
| `heading` | section headlines, the whole phrase | 28px rise + fade | 0.8s |
| `text` | paragraphs, straplines | words rise out of a line mask, 0.08s between lines | 0.8s |
| `card` | rows, cards, logos | batched 24px rise + fade, 0.08s apart | 0.65s |
| `image` | photography | clip opens from the bottom (swipe curve); `[data-parallax]` adds ±5% drift (10% travel) | 1s |

Each move plays once. All use jdavisgc's ease-out family (`.from-bottom`: `.65s ease-out`; `.red-swipe`: `cubic-bezier(.16,.01,.77,1)`; hovers: `cubic-bezier(.4,0,.2,1)`). Inside `[data-late]` sections (closing, news, accreditations, footer) they run at 75% length. No per-character effects anywhere; the hero headline splits by line only.

### Copied interaction: jdavisgc `.project-article` (`components/ui.tsx` WorkCard)
These values come from the reference's compiled CSS:
```
.project-article:hover h3, .project-article:hover .arrow-button { color: <accent> }   /* no transition: it snaps */
.project-article:hover .arrow-button { border-color: <accent> }
.project-article:hover img { transform: scale(1.1) }      /* img: transition-transform duration-1000 → 1s cubic-bezier(.4,0,.2,1) */
```
The card keeps the structure: a 1px top rule, title, the "location" slot (here the business), tag chips (`.market-tag`: 14px, 1px border, 6px radius), a 40px arrow ring, then the cropped image, with the whole card as one link. The scale, duration and curve are CSS variables (`--zoom-scale`, `--zoom-dur`, `--zoom-ease`). Keyboard focus triggers the same state. Measured side by side in headless Chrome, the computed values are identical: h3 and ring colour switch to the accent, `matrix(1.1…)`, `transform 1s cubic-bezier(0.4, 0, 0.2, 1)`. The only difference is the accent: jdavisgc red there, Eric Wright orange here. The business rows and news cards reuse the same hover so the page has one hover language.

### Header and menu (`components/chrome.tsx`)
- **Header:** frameless. Its colour follows the section under it (`data-tone` → `html[data-header]`). It hides on scroll down and returns on scroll up. The full lock-up sits at the top; the EW mark alone takes over once you scroll (the live sticky logo). Main-nav items with children open the menu focused on that group.
- **Menu:** an orange curtain wipes down, the black panel follows 0.12s behind, then the items rise. It is one GSAP timeline, and `reverse()` plays the way out. It holds on-page anchors plus every live nav group (Our Businesses, Social Value, Charitable Trust, About Us, Careers) and the single links. Focus is trapped, Esc closes it, and focus returns to the trigger.

### Hero film
The film is muted and loops. It has a pause/play control that also stops the line rotation. It pauses when off-screen and resumes unless the visitor paused it. It has a local poster, and under reduced motion it stays paused.

### Fallbacks
- **Reduced motion:** no preloader, no Lenis, no reveals, no line rotation, film paused. Verified: 0 hidden reveal targets.
- **No JS:** the `js` class is never added, so nothing starts hidden, and `<noscript>` hides the preloader. Verified: 0 hidden reveal targets.
- Contrast: white on the scrimmed film, black on orange (6.6:1), orange large type only on white, `#bf4f00` for small orange text.

## Links
- Every card, row and menu/footer link points at the real URL on ericwright.co.uk, and opens in a new tab with `rel="noopener"`. Per the standing demo rule, a capture-phase guard in `motion.tsx` stops links that leave the page from navigating; the hrefs stay real.
- **Click-tested 2026-10-02:** all 52 unique external links return 200 (twitter.com redirects to x.com). The exception is the live footer's own **Site Usage Policy** (`/site-usage-policy`, listed in the sitemap): it redirects to `/site-policy`, which returns 404 on the live site. The live href is kept as-is.
- `/careers` (live footer and "Current Vacancies") is the live site's own 301 to `/culture`.
- The 8 in-page anchors (`#top`, `#main`, `#about`, `#businesses`, `#work`, `#careers`, `#news`, `#accreditations`) all resolve.

## Private-demo settings
- `robots: noindex, nofollow` (`app/layout.tsx`). No sitemap.
- PostHog EU (`lib/posthog.ts`): key from `NEXT_PUBLIC_POSTHOG_KEY` with the standing fallback, pageview/pageleave/autocapture, session recording, surveys disabled, `site` registered, UTM capture, and `scroll_depth` at 25/50/75/100 (each fires once). No visible UI.

## Images
Every image is downloaded from ericwright.co.uk by `npm run media` (map in `content/media.json`). Photos published as PNG are re-saved as JPEG and capped at 2000px. Sources: hero carousel (2 used in the collage), the "image split" module, the business grid (9), the case studies (4), careers, news (5), and the accreditation marks (7). The film and its poster come from the Construction division page.

## Verification
- `npm run typecheck` and `npm run build` pass: 4 static pages (`/`, `/_not-found`, `/icon.svg`).
- Preloader timing (performance marks `preloader:start`, `intro:done`, `preloader:end`): handover at +1.34s, removed at +1.81s. In development, `/?intro=pause` holds the timeline on frame 0 and exposes `window.__intro`, so each stage can be screenshotted with `__intro.seek(t)`.
- At 375, 768 and 1440: no console errors, no failed requests, no broken images, no horizontal page scroll.
- Keyboard: tab order runs skip link → logo → nav → Contact → Menu; the menu traps focus (60 tabs), Esc returns focus to the trigger, and anchors scroll through Lenis.
