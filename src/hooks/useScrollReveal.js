import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Satu konfigurasi ease & durasi dipakai di semua section — biar konsisten
export const EASE = "power3.out";
export const DUR = 0.7;

// Reveal standar: dipakai di semua heading section
// once:true supaya tidak retrigger dan tidak numpuk animasi
export function revealOnScroll(targets, opts = {}) {
  const {
    y = 26,
    stagger = 0.08,
    start = "top 85%",
    trigger = null,
  } = opts;

  gsap.set(targets, { opacity: 0, y });

  return gsap.to(targets, {
    opacity: 1,
    y: 0,
    duration: DUR,
    ease: EASE,
    stagger,
    scrollTrigger: {
      trigger: trigger || targets,
      start,
      once: true,
    },
  });
}

export { gsap, ScrollTrigger };
