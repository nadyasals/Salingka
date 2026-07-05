import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, EASE } from "../hooks/useScrollReveal";
import { stats } from "../data/destinations";

function useCountUp(target, duration, start) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf;
    let startTime = null;
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [start, target, duration]);
  return count;
}

// Durasi counter SAMA untuk semua, tidak pakai index*100 lagi
// supaya semua angka selesai menghitung di waktu yang sama — terasa lebih rapi
const COUNT_DURATION = 1400;

function StatItem({ stat, started }) {
  const num = useCountUp(stat.value, COUNT_DURATION, started);

  return (
    <div style={{
      textAlign: "center",
      padding: "2.2rem 1rem",
      borderRight: "1px solid rgba(90,176,138,0.1)",
      // Card sendiri tidak fade-in terpisah — cukup ikut parent reveal
      // supaya tidak ada 2 lapis animasi yang saling tunggu
    }}>
      <div style={{
        fontFamily: "var(--font-display)",
        fontSize: "clamp(2.6rem, 5vw, 3.8rem)",
        fontWeight: 700,
        color: "var(--leaf)",
        lineHeight: 1,
        marginBottom: "0.45rem",
        letterSpacing: "-0.025em",
        // Lebar minimum dikunci supaya angka tidak bikin layout goyang
        // saat count-up dari 1 digit ke banyak digit
        fontVariantNumeric: "tabular-nums",
      }}>
        {num}{stat.suffix}
      </div>
      <div style={{ fontSize: "0.88rem", fontWeight: 500, color: "var(--cream)", marginBottom: "0.3rem" }}>
        {stat.label}
      </div>
      <div style={{ fontSize: "0.72rem", color: "var(--mist)", fontFamily: "var(--font-mono)", opacity: 0.6, letterSpacing: "0.05em" }}>
        {stat.sublabel}
      </div>
    </div>
  );
}

export default function Stats() {
  const sectionRef = useRef(null);
  const headRef = useRef(null);
  const gridRef = useRef(null);
  const badgesRef = useRef(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const headItems = headRef.current.querySelectorAll("[data-animate]");
      gsap.set(headItems, { opacity: 0, y: 24 });
      gsap.set(gridRef.current, { opacity: 0, y: 24 });
      gsap.set(badgesRef.current.children, { opacity: 0, y: 12 });

      // Satu timeline berurutan: heading → grid → badges
      // Tidak ada scrollTrigger terpisah per elemen, jadi tidak akan tumpang tindih
      const tl = gsap.timeline({
        defaults: { ease: EASE },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          once: true,
          onEnter: () => setStarted(true), // counter mulai bareng animasi grid
        },
      });

      tl.to(headItems, { opacity: 1, y: 0, duration: 0.6, stagger: 0.08 })
        .to(gridRef.current, { opacity: 1, y: 0, duration: 0.6 }, "-=0.25")
        .to(badgesRef.current.children, { opacity: 1, y: 0, duration: 0.4, stagger: 0.04 }, "-=0.2");

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="tentang" ref={sectionRef} style={{
      padding: "5.5rem 2rem",
      background: "var(--moss)",
      borderTop: "1px solid rgba(90,176,138,0.08)",
      borderBottom: "1px solid rgba(90,176,138,0.08)",
    }}>
      <div style={{ maxWidth: "960px", margin: "0 auto" }}>

        <div ref={headRef} style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <p data-animate style={{
            fontFamily: "var(--font-mono)", fontSize: "0.68rem",
            letterSpacing: "0.22em", textTransform: "uppercase",
            color: "var(--fern)", marginBottom: "1rem",
          }}>
            Angka yang perlu kamu tahu
          </p>
          <h2 data-animate style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
            fontWeight: 700, color: "var(--white)",
            lineHeight: 1.18, marginBottom: "0.75rem",
            letterSpacing: "-0.02em",
          }}>
            Sumatra bukan sekadar pulau.<br />
            <em style={{ color: "var(--leaf)", fontStyle: "italic" }}>Ia adalah ekosistem yang hidup.</em>
          </h2>
          <p data-animate style={{ fontSize: "0.9rem", color: "var(--mist)", fontWeight: 300 }}>
            Data nyata dari lapangan, bukan sekadar angka di atas kertas.
          </p>
        </div>

        <div ref={gridRef} style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          border: "1px solid rgba(90,176,138,0.1)",
          borderRadius: "18px",
          overflow: "hidden",
          background: "rgba(13,31,23,0.35)",
          marginBottom: "3rem",
        }}>
          {stats.map((stat, i) => (
            <StatItem key={i} stat={stat} started={started} />
          ))}
        </div>

        <div ref={badgesRef} style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "8px" }}>
          {[
            { code: "SDG 8", label: "Pertumbuhan Ekonomi", color: "#A21942" },
            { code: "SDG 11", label: "Komunitas Berkelanjutan", color: "#FD9D24" },
            { code: "SDG 13", label: "Perubahan Iklim", color: "#3F7E44" },
            { code: "SDG 14", label: "Kehidupan Bawah Laut", color: "#0A97D9" },
            { code: "SDG 15", label: "Kehidupan di Darat", color: "#56C02B" },
          ].map(sdg => (
            <div key={sdg.code} style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              padding: "6px 14px", borderRadius: "100px",
              background: `${sdg.color}15`, border: `1px solid ${sdg.color}35`,
              fontSize: "0.75rem",
            }}>
              <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: sdg.color, flexShrink: 0 }} />
              <strong style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: sdg.color }}>{sdg.code}</strong>
              <span style={{ color: "var(--mist)", fontSize: "0.72rem" }}>{sdg.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
