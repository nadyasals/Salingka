import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, EASE } from "../hooks/useScrollReveal";
import { guidelines } from "../data/destinations";

function GuideCard({ item }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    // Hover pakai GSAP quickTo — lebih ringan daripada gsap.to() dipanggil ulang tiap event
    const liftUp = gsap.quickTo(el, "y", { duration: 0.3, ease: "power2.out" });
    const onEnter = () => liftUp(-6);
    const onLeave = () => liftUp(0);
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <div ref={ref} data-animate style={{
      padding: "1.75rem",
      borderRadius: "14px",
      border: "1px solid rgba(90,176,138,0.1)",
      background: "rgba(26,51,40,0.4)",
      cursor: "default",
    }}>
      <div style={{
        width: "28px", height: "2px",
        background: "var(--fern)",
        marginBottom: "1.1rem",
}} />
      <h3 style={{
        fontFamily: "var(--font-display)", fontSize: "1.05rem", fontWeight: 700,
        color: "var(--cream)", marginBottom: "0.5rem", lineHeight: 1.3,
      }}>
        {item.title}
      </h3>
      <p style={{ fontSize: "0.82rem", color: "var(--mist)", lineHeight: 1.7, fontWeight: 300 }}>
        {item.desc}
      </p>
    </div>
  );
}

export default function Guidelines() {
  const sectionRef = useRef(null);
  const headRef = useRef(null);
  const gridRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const headItems = headRef.current.querySelectorAll("[data-animate]");
      const cards = gridRef.current.querySelectorAll("[data-animate]");

      gsap.set(headItems, { opacity: 0, y: 24 });
      gsap.set(cards, { opacity: 0, y: 22 });

      // Satu timeline: heading dulu, lanjut ke kartu dengan overlap kecil
      // supaya transisinya terasa menyambung, bukan dua gerakan terpisah
      gsap.timeline({
        defaults: { ease: EASE },
        scrollTrigger: { trigger: sectionRef.current, start: "top 78%", once: true },
      })
        .to(headItems, { opacity: 1, y: 0, duration: 0.6, stagger: 0.08 })
        .to(cards, { opacity: 1, y: 0, duration: 0.5, stagger: 0.06 }, "-=0.3");

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="panduan" ref={sectionRef} style={{
      padding: "clamp(4rem, 8vw, 7rem) 2rem",
      background: "var(--moss)",
      borderTop: "1px solid rgba(90,176,138,0.07)",
    }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        <div ref={headRef} style={{ marginBottom: "3.5rem", maxWidth: "580px" }}>
          <p data-animate style={{
            fontFamily: "var(--font-mono)", fontSize: "0.68rem",
            letterSpacing: "0.22em", textTransform: "uppercase",
            color: "var(--fern)", marginBottom: "1rem",
          }}>
            Sebelum kamu berangkat
          </p>
          <h2 data-animate style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
            fontWeight: 700, color: "var(--white)",
            lineHeight: 1.14, marginBottom: "1rem",
            letterSpacing: "-0.02em",
          }}>
            Berwisata yang baik<br />
            <em style={{ color: "var(--leaf)", fontStyle: "italic" }}>bukan soal foto yang indah</em>
          </h2>
          <p data-animate style={{ fontSize: "0.88rem", color: "var(--mist)", lineHeight: 1.75, fontWeight: 300 }}>
            Ekowisata yang bertanggung jawab berarti meninggalkan alam dalam kondisi yang lebih baik dari saat kamu datang.
          </p>
        </div>

        <div ref={gridRef} style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "12px",
        }}>
          {guidelines.map((item, i) => (
            <GuideCard key={i} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
