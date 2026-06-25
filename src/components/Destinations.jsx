import { useState, useRef, useEffect } from "react";
import { destinations } from "../data/destinations";

function DestCard({ dest, index }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <article
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        borderRadius: "16px",
        overflow: "hidden",
        cursor: "pointer",
        aspectRatio: index % 5 === 0 ? "4/3" : "3/4",
        background: dest.color,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
        transition: `opacity 0.7s ease ${(index % 3) * 0.12}s, transform 0.7s ease ${(index % 3) * 0.12}s`,
        gridColumn: index % 5 === 0 ? "span 2" : "span 1",
      }}
    >
      {/* Image */}
      {!imgError ? (
        <img
          src={dest.image}
          alt={dest.name}
          onError={() => setImgError(true)}
          loading="lazy"
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            objectFit: "cover",
            transform: hovered ? "scale(1.06)" : "scale(1)",
            transition: "transform 0.6s ease",
          }}
        />
      ) : (
        <div style={{
          position: "absolute", inset: 0,
          background: `linear-gradient(135deg, ${dest.color}, #0D1F17)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "3rem",
        }}>🌿</div>
      )}

      {/* Gradient overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: hovered
          ? "linear-gradient(to top, rgba(13,31,23,0.95) 0%, rgba(13,31,23,0.3) 60%, rgba(13,31,23,0.1) 100%)"
          : "linear-gradient(to top, rgba(13,31,23,0.85) 0%, rgba(13,31,23,0.1) 60%, transparent 100%)",
        transition: "background 0.4s ease",
      }} />

      {/* Province label */}
      <div style={{
        position: "absolute", top: "1rem", left: "1rem",
        padding: "4px 12px",
        background: "rgba(13,31,23,0.7)",
        backdropFilter: "blur(8px)",
        borderRadius: "100px",
        fontSize: "0.7rem",
        fontFamily: "var(--font-mono)",
        color: "var(--leaf)",
        letterSpacing: "0.08em",
        border: "1px solid rgba(90,176,138,0.2)",
      }}>
        {dest.province}
      </div>

      {/* SDG badges top right */}
      <div style={{
        position: "absolute", top: "1rem", right: "1rem",
        display: "flex", gap: "4px",
      }}>
        {dest.sdg.map(s => (
          <span key={s} style={{
            padding: "3px 8px",
            background: "rgba(13,31,23,0.7)",
            backdropFilter: "blur(8px)",
            borderRadius: "100px",
            fontSize: "0.65rem",
            fontFamily: "var(--font-mono)",
            color: "var(--mist)",
            border: "1px solid rgba(168,201,184,0.15)",
          }}>{s}</span>
        ))}
      </div>

      {/* Content at bottom */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        padding: "1.5rem",
        transform: hovered ? "translateY(0)" : "translateY(4px)",
        transition: "transform 0.4s ease",
      }}>
        <p style={{
          fontSize: "0.7rem",
          fontFamily: "var(--font-mono)",
          color: "var(--leaf)",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          marginBottom: "0.4rem",
          opacity: hovered ? 1 : 0.7,
          transition: "opacity 0.3s ease",
        }}>
          {dest.tagline}
        </p>
        <h3 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(1.1rem, 2.5vw, 1.4rem)",
          fontWeight: 700,
          color: "var(--white)",
          marginBottom: "0.6rem",
          lineHeight: 1.2,
        }}>
          {dest.name}
        </h3>
        <p style={{
          fontSize: "0.82rem",
          color: "var(--mist)",
          lineHeight: 1.6,
          maxHeight: hovered ? "80px" : "0",
          overflow: "hidden",
          opacity: hovered ? 1 : 0,
          transition: "max-height 0.4s ease, opacity 0.3s ease 0.1s",
          marginBottom: hovered ? "0.8rem" : "0",
        }}>
          {dest.description}
        </p>
        <div style={{
          display: "flex", alignItems: "center", gap: "8px",
          opacity: hovered ? 1 : 0,
          transform: hovered ? "translateY(0)" : "translateY(6px)",
          transition: "opacity 0.3s ease 0.15s, transform 0.3s ease 0.15s",
        }}>
          <span style={{ fontSize: "0.7rem", fontFamily: "var(--font-mono)", color: "var(--leaf)" }}>
            📍 {dest.fact}
          </span>
        </div>
      </div>
    </article>
  );
}

export default function Destinations() {
  const [filter, setFilter] = useState("Semua");
  const filters = ["Semua", "SDG 8", "SDG 11", "SDG 13", "SDG 14", "SDG 15"];

  const filtered = filter === "Semua"
    ? destinations
    : destinations.filter(d => d.sdg.includes(filter));

  return (
    <section id="destinasi" style={{
      padding: "6rem 2rem",
      background: "var(--forest)",
    }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "3rem" }}>
          <p style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.7rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--fern)",
            marginBottom: "1rem",
          }}>
            9 destinasi pilihan
          </p>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            flexWrap: "wrap",
            gap: "1.5rem",
          }}>
            <h2 style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 5vw, 3rem)",
              fontWeight: 700,
              color: "var(--white)",
              lineHeight: 1.15,
              maxWidth: "480px",
            }}>
              Dari ujung Aceh<br />
              <em style={{ color: "var(--leaf)", fontStyle: "italic" }}>hingga ujung Lampung</em>
            </h2>

            {/* Filter pills */}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {filters.map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{
                    padding: "7px 16px",
                    borderRadius: "100px",
                    fontSize: "0.75rem",
                    fontFamily: "var(--font-mono)",
                    letterSpacing: "0.05em",
                    border: "1px solid",
                    transition: "all 0.2s",
                    background: filter === f ? "var(--leaf)" : "transparent",
                    borderColor: filter === f ? "var(--leaf)" : "rgba(90,176,138,0.25)",
                    color: filter === f ? "var(--forest)" : "var(--mist)",
                    fontWeight: filter === f ? 600 : 400,
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Masonry-like grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: "16px",
          gridAutoRows: "280px",
        }}>
          {filtered.map((dest, i) => (
            <DestCard key={dest.id} dest={dest} index={i} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{
            textAlign: "center",
            padding: "4rem",
            color: "var(--mist)",
            fontFamily: "var(--font-mono)",
            fontSize: "0.85rem",
          }}>
            Tidak ada destinasi dengan filter ini.
          </div>
        )}
      </div>
    </section>
  );
}
