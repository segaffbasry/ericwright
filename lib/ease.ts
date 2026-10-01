/* One easing family for the whole site. Every curve is measured on jdavisgc.com (Nuxt + Tailwind build CSS);
   the CSS twins live in app/globals.css as --ease-* custom properties. */

// Reveals: jdavisgc `.from-bottom` / `.from-left` / `.fade-in-up`: `transition: transform .65s ease-out, opacity .65s ease-out`.
// CSS `ease-out` is cubic-bezier(0, 0, .58, 1).
export const EASE = "0,0,0.58,1";
// Wipes (menu curtain, preloader wordmark, image clip): jdavisgc `.red-swipe::before`, `transition: width .5s cubic-bezier(.16,.01,.77,1)`.
export const EASE_WIPE = "0.16,0.01,0.77,1";
// Hovers and the copied interaction: Tailwind's default `transition` timing on jdavisgc, cubic-bezier(.4, 0, .2, 1).
export const EASE_UI = "0.4,0,0.2,1";

export const timing = {
  // jdavisgc runs every reveal at 0.65s. Headings and text get a little longer here because they travel further.
  label: 0.65,
  heading: 0.8,
  text: 0.8,
  lineStagger: 0.08,
  card: 0.65,
  image: 1, // the clip-open; jdavisgc's image zoom is also 1s (`duration-1000`)
  late: 0.75, // multiplier for sections marked data-late (shorter moves further down the page)
};
