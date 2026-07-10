import { useState, useRef, useEffect } from "react";
import { destinations } from "../data/destinations";

function DestCard({ dest, index, tall = false }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.08 }
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
        height: tall ? "520px" : "320px",
        background: dest.color,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.65s ease ${(index % 4) * 0.08}s, transform 0.65s ease ${(index % 4) * 0.08}s`,
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
            transform: hovered ? "scale(1.05)" : "scale(1)",
            transition: "transform 0.7s ease",
          }}
        />
      ) : (
        <div style={{
          position: "absolute", inset: 0,
          background: `linear-gradient(135deg, ${dest.color}, #0D1F17)`,
          display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: "3rem",
        }}>🌿</div>
      )}

      {/* Gradient overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: hovered
          ? "linear-gradient(to top, rgba(13,31,23,0.96) 0%, rgba(13,31,23,0.4) 55%, rgba(13,31,23,0.05) 100%)"
          : "linear-gradient(to top, rgba(13,31,23,0.88) 0%, rgba(13,31,23,0.15) 55%, transparent 100%)",
        transition: "background 0.4s ease",
      }} />

      {/* Province */}
      <div style={{
        position: "absolute", top: "1rem", left: "1rem",
        padding: "4px 12px",
        background: "rgba(13,31,23,0.65)",
        backdropFilter: "blur(8px)",
        borderRadius: "100px",
        fontSize: "0.68rem",
        fontFamily: "var(--font-mono)",
        color: "var(--leaf)",
        letterSpacing: "0.08em",
        border: "1px solid rgba(90,176,138,0.2)",
      }}>
        {dest.province}
      </div>

      {/* SDG badges */}
      <div style={{
        position: "absolute", top: "1rem", right: "1rem",
        display: "flex", gap: "4px", flexWrap: "wrap", justifyContent: "flex-end",
        maxWidth: "60%",
      }}>
        {dest.sdg.map(s => (
          <span key={s} style={{
            padding: "3px 8px",
            background: "rgba(13,31,23,0.65)",
            backdropFilter: "blur(8px)",
            borderRadius: "100px",
            fontSize: "0.62rem",
            fontFamily: "var(--font-mono)",
            color: "var(--mist)",
            border: "1px solid rgba(168,201,184,0.15)",
            whiteSpace: "nowrap",
          }}>{s}</span>
        ))}
      </div>

      {/* Content */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        padding: "1.25rem 1.25rem 1.25rem",
      }}>
        {/* Tagline — selalu tampil */}
        <p style={{
          fontSize: "0.65rem",
          fontFamily: "var(--font-mono)",
          color: "var(--leaf)",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          marginBottom: "0.35rem",
          lineHeight: 1.4,
        }}>
          {dest.tagline}
        </p>

        {/* Nama — selalu tampil */}
        <h3 style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(1rem, 2vw, 1.3rem)",
          fontWeight: 700,
          color: "var(--white)",
          marginBottom: "0",
          lineHeight: 1.2,
        }}>
          {dest.name}
        </h3>

        {/* Deskripsi — muncul saat hover */}
        <div style={{
          overflow: "hidden",
          maxHeight: hovered ? "120px" : "0",
          opacity: hovered ? 1 : 0,
          transition: "max-height 0.45s ease, opacity 0.3s ease 0.1s",
          marginTop: hovered ? "0.6rem" : "0",
        }}>
          <p style={{
            fontSize: "0.78rem",
            color: "var(--mist)",
            lineHeight: 1.65,
            fontWeight: 300,
            marginBottom: "0.6rem",
          }}>
            {dest.description}
          </p>
          <span style={{
            fontSize: "0.68rem",
            fontFamily: "var(--font-mono)",
            color: "var(--leaf)",
            opacity: 0.8,
          }}>
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

  // Layout: baris 1 = 3 kolom, baris 2 = 2 kolom (tall), baris 3 = 4 kolom, dst
  const renderGrid = () => {
    if (filtered.length === 0) return null;

    const rows = [];
    let i = 0;

    while (i < filtered.length) {
      const rowIndex = rows.length;

      if (rowIndex % 3 === 1) {
        // Baris tall — 2 kartu tinggi berdampingan
        const items = filtered.slice(i, i + 2);
        rows.push(
          <div key={`row-${rowIndex}`} style={{
            display: "grid",
            gridTemplateColumns: `repeat(${items.length}, 1fr)`,
            gap: "14px",
          }}>
            {items.map((dest, j) => (
              <DestCard key={dest.id} dest={dest} index={i + j} tall={true} />
            ))}
          </div>
        );
        i += items.length;
      } else if (rowIndex % 3 === 2) {
        // Baris 4 kolom
        const items = filtered.slice(i, i + 4);
        rows.push(
          <div key={`row-${rowIndex}`} style={{
            display: "grid",
            gridTemplateColumns: `repeat(${Math.min(items.length, 4)}, 1fr)`,
            gap: "14px",
          }}>
            {items.map((dest, j) => (
              <DestCard key={dest.id} dest={dest} index={i + j} tall={false} />
            ))}
          </div>
        );
        i += items.length;
      } else {
        // Baris 3 kolom (default)
        const items = filtered.slice(i, i + 3);
        rows.push(
          <div key={`row-${rowIndex}`} style={{
            display: "grid",
            gridTemplateColumns: `repeat(${Math.min(items.length, 3)}, 1fr)`,
            gap: "14px",
          }}>
            {items.map((dest, j) => (
              <DestCard key={dest.id} dest={dest} index={i + j} tall={false} />
            ))}
          </div>
        );
        i += items.length;
      }
    }

    return rows;
  };

  return (
    <section id="destinasi" style={{
      padding: "6rem 2rem",
      background: "var(--forest)",
    }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: "2.5rem" }}>
          <p style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.68rem",
            letterSpacing: "0.22em",
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
              fontSize: "clamp(1.9rem, 4.5vw, 2.8rem)",
              fontWeight: 700,
              color: "var(--white)",
              lineHeight: 1.15,
              maxWidth: "480px",
              letterSpacing: "-0.02em",
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
                    fontSize: "0.72rem",
                    fontFamily: "var(--font-mono)",
                    letterSpacing: "0.05em",
                    border: "1px solid",
                    cursor: "pointer",
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

        {/* Grid */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {renderGrid()}
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

      <style>{`
        @media (max-width: 640px) {
          #destinasi .dest-row {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
