import { useRef, useEffect, useState } from "react";
import { guidelines } from "../data/destinations";

function GuideCard({ item, index }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        padding: "1.75rem",
        borderRadius: "14px",
        border: "1px solid rgba(90,176,138,0.12)",
        background: "rgba(26,51,40,0.5)",
        backdropFilter: "blur(8px)",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.6s ease ${index * 0.08}s, transform 0.6s ease ${index * 0.08}s`,
      }}
    >
      <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>{item.icon}</div>
      <h3 style={{
        fontFamily: "var(--font-display)",
        fontSize: "1rem",
        fontWeight: 700,
        color: "var(--cream)",
        marginBottom: "0.5rem",
        lineHeight: 1.3,
      }}>
        {item.title}
      </h3>
      <p style={{
        fontSize: "0.83rem",
        color: "var(--mist)",
        lineHeight: 1.65,
        fontWeight: 300,
      }}>
        {item.desc}
      </p>
    </div>
  );
}

export default function Guidelines() {
  return (
    <section id="panduan" style={{
      padding: "6rem 2rem",
      background: "var(--moss)",
      borderTop: "1px solid rgba(90,176,138,0.08)",
    }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "3.5rem", maxWidth: "600px" }}>
          <p style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.7rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--fern)",
            marginBottom: "1rem",
          }}>
            Sebelum kamu berangkat
          </p>
          <h2 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
            fontWeight: 700,
            color: "var(--white)",
            lineHeight: 1.15,
            marginBottom: "1rem",
          }}>
            Berwisata yang baik<br />
            <em style={{ color: "var(--leaf)", fontStyle: "italic" }}>bukan soal foto yang indah</em>
          </h2>
          <p style={{
            fontSize: "0.9rem",
            color: "var(--mist)",
            lineHeight: 1.7,
            fontWeight: 300,
          }}>
            Ekowisata yang bertanggung jawab berarti meninggalkan alam dalam kondisi yang lebih baik dari saat kamu datang. Ikuti panduan sederhana ini.
          </p>
        </div>

        {/* Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "14px",
        }}>
          {guidelines.map((item, i) => (
            <GuideCard key={i} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
