import { useEffect, useRef, useState } from "react";
import { stats } from "../data/destinations";

function useCountUp(target, duration = 1800, start = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) { setCount(target); return; }

    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    const rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [start, target, duration]);

  return count;
}

function StatItem({ stat, index, started }) {
  const num = useCountUp(stat.value, 1600 + index * 100, started);

  return (
    <div style={{
      textAlign: "center",
      padding: "clamp(1.2rem, 3vw, 2rem) clamp(0.75rem, 2vw, 1rem)",
      borderRight: "1px solid rgba(90,176,138,0.12)",
      opacity: started ? 1 : 0,
      transform: started ? "translateY(0)" : "translateY(20px)",
      transition: `opacity 0.7s ease ${index * 0.15}s, transform 0.7s ease ${index * 0.15}s`,
    }}>
      <div style={{
        fontFamily: "var(--font-display)",
        fontSize: "clamp(2rem, 5vw, 3.8rem)",
        fontWeight: 700,
        color: "var(--leaf)",
        lineHeight: 1,
        marginBottom: "0.4rem",
        letterSpacing: "-0.02em",
      }}>
        {num}{stat.suffix}
      </div>
      <div style={{
        fontSize: "clamp(0.8rem, 2vw, 0.9rem)",
        fontWeight: 500,
        color: "var(--cream)",
        marginBottom: "0.25rem",
      }}>
        {stat.label}
      </div>
      <div style={{
        fontSize: "clamp(0.65rem, 1.5vw, 0.75rem)",
        color: "var(--mist)",
        fontFamily: "var(--font-mono)",
        opacity: 0.7,
      }}>
        {stat.sublabel}
      </div>
    </div>
  );
}

export default function Stats() {
  const ref = useRef(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="tentang" ref={ref} style={{
      padding: "clamp(3rem, 8vw, 5rem) clamp(1rem, 4vw, 2rem)",
      background: "var(--moss)",
      borderTop: "1px solid rgba(90,176,138,0.1)",
      borderBottom: "1px solid rgba(90,176,138,0.1)",
    }}>
      <div style={{ maxWidth: "960px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "clamp(2rem, 5vw, 3rem)" }}>
          <p style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.7rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--fern)",
            marginBottom: "1rem",
          }}>
            Angka yang perlu kamu tahu
          </p>
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.5rem, 4vw, 2.8rem)",
            fontWeight: 700,
            color: "var(--white)",
            lineHeight: 1.2,
          }}>
            Sumatra bukan sekadar pulau.<br />
            <em style={{ color: "var(--leaf)", fontStyle: "italic" }}>Ia adalah ekosistem yang hidup.</em>
          </h2>
        </div>

        {/* Stats grid — stacks to 2-col on mobile */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(160px, 100%), 1fr))",
          border: "1px solid rgba(90,176,138,0.12)",
          borderRadius: "16px",
          overflow: "hidden",
          background: "rgba(13,31,23,0.4)",
        }}>
          {stats.map((stat, i) => (
            <StatItem key={i} stat={stat} index={i} started={started} />
          ))}
        </div>

        {/* SDG badges */}
        <div style={{
          marginTop: "clamp(1.5rem, 4vw, 3rem)",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "8px",
        }}>
          {[
            { code: "SDG 8", label: "Pekerjaan Layak & Pertumbuhan Ekonomi", color: "#A21942" },
            { code: "SDG 11", label: "Kota & Komunitas Berkelanjutan", color: "#FD9D24" },
            { code: "SDG 13", label: "Penanganan Perubahan Iklim", color: "#3F7E44" },
            { code: "SDG 14", label: "Kehidupan Bawah Laut", color: "#0A97D9" },
            { code: "SDG 15", label: "Kehidupan di Darat", color: "#56C02B" },
          ].map(sdg => (
            <div key={sdg.code} style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              padding: "6px 14px",
              borderRadius: "100px",
              background: `${sdg.color}18`,
              border: `1px solid ${sdg.color}40`,
              fontSize: "clamp(0.68rem, 1.5vw, 0.75rem)",
              color: "var(--cream)",
            }}>
              <span style={{
                display: "inline-block", width: "8px", height: "8px",
                borderRadius: "50%", background: sdg.color, flexShrink: 0,
              }} />
              <strong style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", color: sdg.color }}>{sdg.code}</strong>
              <span style={{ color: "var(--mist)", fontSize: "0.72rem" }}>{sdg.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
