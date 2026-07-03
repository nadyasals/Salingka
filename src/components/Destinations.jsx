import { useState, useRef, useEffect } from "react";
import { destinations } from "../data/destinations";

// Builds a responsive WebP srcset from Unsplash URLs
function buildSrcSet(url) {
  const base = url.split("?")[0];
  return [
    `${base}?w=400&q=70&fm=webp&fit=crop 400w`,
    `${base}?w=700&q=75&fm=webp&fit=crop 700w`,
    `${base}?w=1000&q=80&fm=webp&fit=crop 1000w`,
  ].join(", ");
}

function buildFallbackSrc(url) {
  const base = url.split("?")[0];
  return `${base}?w=700&q=75&fit=crop`;
}

function DestCard({ dest, index }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Wide card every 5th starting at 0 — but only on wider viewports
  const isWide = index % 5 === 0;

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <article
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      tabIndex={0}
      aria-label={`${dest.name} — ${dest.province}`}
      style={{
        position: "relative",
        borderRadius: "16px",
        overflow: "hidden",
        cursor: "pointer",
        background: dest.color,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
        transition: `opacity 0.7s ease ${(index % 3) * 0.1}s, transform 0.7s ease ${(index % 3) * 0.1}s`,
        // Grid placement handled by parent
        gridColumn: isWide ? "span 2" : "span 1",
        // Aspect ratio: wide=4/3, portrait=3/4
        aspectRatio: isWide ? "4/3" : "3/4",
        // Minimum height for very small screens
        minHeight: "240px",
      }}
    >
      {/* Image — lazy loaded with WebP srcset */}
      {!imgError ? (
        <picture>
          <source
            type="image/webp"
            srcSet={buildSrcSet(dest.image)}
            sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 1100px) 33vw, 380px"
          />
          <img
            src={buildFallbackSrc(dest.image)}
            alt={`${dest.name}, ${dest.province}`}
            loading="lazy"
            decoding="async"
            onError={() => setImgError(true)}
            style={{
              position: "absolute", inset: 0,
              width: "100%", height: "100%",
              objectFit: "cover",
              transform: hovered ? "scale(1.06)" : "scale(1)",
              transition: "transform 0.6s ease",
            }}
          />
        </picture>
      ) : (
        <div style={{
          position: "absolute", inset: 0,
          background: `linear-gradient(135deg, ${dest.color}, #0D1F17)`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "3rem",
        }} aria-hidden="true">🌿</div>
      )}

      {/* Gradient overlay */}
      <div aria-hidden="true" style={{
        position: "absolute", inset: 0,
        background: hovered
          ? "linear-gradient(to top, rgba(13,31,23,0.95) 0%, rgba(13,31,23,0.3) 60%, rgba(13,31,23,0.1) 100%)"
          : "linear-gradient(to top, rgba(13,31,23,0.85) 0%, rgba(13,31,23,0.1) 60%, transparent 100%)",
        transition: "background 0.4s ease",
      }} />

      {/* Province label */}
      <div style={{
        position: "absolute", top: "0.875rem", left: "0.875rem",
        padding: "4px 12px",
        background: "rgba(13,31,23,0.7)",
        backdropFilter: "blur(8px)",
        borderRadius: "100px",
        fontSize: "clamp(0.6rem, 1.5vw, 0.7rem)",
        fontFamily: "var(--font-mono)",
        color: "var(--leaf)",
        letterSpacing: "0.08em",
        border: "1px solid rgba(90,176,138,0.2)",
      }}>
        {dest.province}
      </div>

      {/* SDG badges top right */}
      <div style={{
        position: "absolute", top: "0.875rem", right: "0.875rem",
        display: "flex", gap: "4px", flexWrap: "wrap", justifyContent: "flex-end",
        maxWidth: "60%",
      }}>
        {dest.sdg.map(s => (
          <span key={s} style={{
            padding: "3px 8px",
            background: "rgba(13,31,23,0.7)",
            backdropFilter: "blur(8px)",
            borderRadius: "100px",
            fontSize: "clamp(0.58rem, 1.3vw, 0.65rem)",
            fontFamily: "var(--font-mono)",
            color: "var(--mist)",
            border: "1px solid rgba(168,201,184,0.15)",
            whiteSpace: "nowrap",
          }}>{s}</span>
        ))}
      </div>

      {/* Content at bottom */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        padding: "clamp(1rem, 3vw, 1.5rem)",
        transform: hovered ? "translateY(0)" : "translateY(4px)",
        transition: "transform 0.4s ease",
      }}>
        <p style={{
          fontSize: "clamp(0.6rem, 1.4vw, 0.7rem)",
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
          fontSize: "clamp(1rem, 2.5vw, 1.4rem)",
          fontWeight: 700,
          color: "var(--white)",
          marginBottom: "0.6rem",
          lineHeight: 1.2,
        }}>
          {dest.name}
        </h3>
        <p style={{
          fontSize: "clamp(0.76rem, 1.8vw, 0.82rem)",
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
          <span style={{ fontSize: "clamp(0.62rem, 1.4vw, 0.7rem)", fontFamily: "var(--font-mono)", color: "var(--leaf)" }}>
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
      padding: "clamp(3.5rem, 8vw, 6rem) clamp(1rem, 4vw, 2rem)",
      background: "var(--forest)",
    }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "clamp(2rem, 5vw, 3rem)" }}>
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
              fontSize: "clamp(1.8rem, 5vw, 3rem)",
              fontWeight: 700,
              color: "var(--white)",
              lineHeight: 1.15,
              maxWidth: "480px",
            }}>
              Dari ujung Aceh<br />
              <em style={{ color: "var(--leaf)", fontStyle: "italic" }}>hingga ujung Lampung</em>
            </h2>

            {/* Filter pills */}
            <div style={{
              display: "flex", gap: "6px", flexWrap: "wrap",
              // On mobile, center the pills
            }}>
              {filters.map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  aria-pressed={filter === f}
                  style={{
                    padding: "6px 14px",
                    borderRadius: "100px",
                    fontSize: "clamp(0.68rem, 1.5vw, 0.75rem)",
                    fontFamily: "var(--font-mono)",
                    letterSpacing: "0.05em",
                    border: "1px solid",
                    transition: "all 0.2s",
                    background: filter === f ? "var(--leaf)" : "transparent",
                    borderColor: filter === f ? "var(--leaf)" : "rgba(90,176,138,0.25)",
                    color: filter === f ? "var(--forest)" : "var(--mist)",
                    fontWeight: filter === f ? 600 : 400,
                    cursor: "pointer",
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Responsive masonry grid
            - Mobile (≤480px): single column
            - Tablet (481–768px): 2 columns, no wide cards
            - Desktop (≥769px): auto-fill with wide cards
        */}
        <div className="dest-grid">
          {filtered.map((dest, i) => (
            <DestCard key={dest.id} dest={dest} index={i} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div style={{
            textAlign: "center",
            padding: "4rem 2rem",
            color: "var(--mist)",
            fontFamily: "var(--font-mono)",
            fontSize: "0.85rem",
          }}>
            Tidak ada destinasi dengan filter ini.
          </div>
        )}
      </div>

      <style>{`
        /* Mobile first: single column */
        .dest-grid {
          display: grid;
          gap: 12px;
          grid-template-columns: 1fr;
        }
        .dest-grid article {
          grid-column: span 1 !important;
          aspect-ratio: 4/3 !important;
          min-height: 220px;
        }

        /* Tablet (≥ 480px): 2 columns, portrait cards */
        @media (min-width: 480px) {
          .dest-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 14px;
            grid-auto-rows: 280px;
          }
          .dest-grid article {
            aspect-ratio: unset !important;
            min-height: unset;
          }
        }

        /* Tablet-large (≥ 640px): still 2 col but taller */
        @media (min-width: 640px) {
          .dest-grid {
            grid-auto-rows: 320px;
          }
        }

        /* Desktop (≥ 769px): wide cards re-enabled */
        @media (min-width: 769px) {
          .dest-grid {
            grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
            grid-auto-rows: 280px;
            gap: 16px;
          }
          .dest-grid article[style*="span 2"] {
            grid-column: span 2 !important;
          }
        }
      `}</style>
    </section>
  );
}
