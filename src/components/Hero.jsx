import { useEffect, useRef } from "react";

export default function Hero() {
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    const els = [titleRef.current, subtitleRef.current, ctaRef.current];
    els.forEach((el, i) => {
      if (!el) return;
      el.style.opacity = "0";
      el.style.transform = "translateY(32px)";
      setTimeout(() => {
        el.style.transition = "opacity 0.9s ease, transform 0.9s ease";
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      }, 300 + i * 200);
    });
  }, []);

  return (
    <section style={{
      position: "relative",
      height: "100vh",
      minHeight: "600px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
    }}>
      {/* Background image with overlay */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "url(https://images.unsplash.com/photo-1500622944204-b135684e99fd?w=1800&q=80)",
        backgroundSize: "cover",
        backgroundPosition: "center 30%",
      }} />
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to bottom, rgba(13,31,23,0.3) 0%, rgba(13,31,23,0.6) 50%, rgba(13,31,23,0.95) 100%)",
      }} />

      {/* Subtle grain texture overlay */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
        opacity: 0.4,
        pointerEvents: "none",
      }} />

      {/* Content */}
      <div style={{
        position: "relative",
        textAlign: "center",
        padding: "0 1.5rem",
        maxWidth: "820px",
      }}>
        {/* Eyebrow label */}
        <div ref={subtitleRef} style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          marginBottom: "1.5rem",
          padding: "6px 16px",
          border: "1px solid rgba(90,176,138,0.3)",
          borderRadius: "100px",
          fontSize: "0.75rem",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "var(--leaf)",
          fontFamily: "var(--font-mono)",
        }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--leaf)", display: "inline-block" }} />
          Ekowisata Berkelanjutan · Pulau Sumatra
        </div>

        {/* Main title */}
        <h1 ref={titleRef} style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(2.8rem, 7vw, 5.5rem)",
          fontWeight: 700,
          lineHeight: 1.08,
          color: "var(--white)",
          marginBottom: "1.5rem",
          letterSpacing: "-0.02em",
        }}>
          Hutan Sumatra<br />
          <em style={{ color: "var(--leaf)", fontStyle: "italic" }}>masih menunggu</em><br />
          untuk dijaga
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: "clamp(1rem, 2vw, 1.15rem)",
          color: "var(--mist)",
          maxWidth: "560px",
          margin: "0 auto 2.5rem",
          fontWeight: 300,
          lineHeight: 1.7,
        }}>
          Sembilan destinasi ekowisata dari ujung Aceh hingga Lampung — tempat di mana alam dan komunitas lokal saling menjaga satu sama lain.
        </p>

        {/* CTA buttons */}
        <div ref={ctaRef} style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <a href="#destinasi" style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "14px 32px",
            background: "var(--leaf)",
            color: "var(--forest)",
            borderRadius: "100px",
            fontSize: "0.9rem",
            fontWeight: 600,
            letterSpacing: "0.02em",
            transition: "all 0.25s",
          }}
            onMouseEnter={e => { e.currentTarget.style.background = "var(--fern)"; e.currentTarget.style.color = "var(--white)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "var(--leaf)"; e.currentTarget.style.color = "var(--forest)"; }}
          >
            Mulai Jelajahi
            <span style={{ fontSize: "1rem" }}>↓</span>
          </a>
          <a href="#tentang" style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "14px 32px",
            background: "transparent",
            color: "var(--mist)",
            borderRadius: "100px",
            border: "1px solid rgba(168,201,184,0.3)",
            fontSize: "0.9rem",
            fontWeight: 400,
            letterSpacing: "0.02em",
            transition: "all 0.25s",
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--mist)"; e.currentTarget.style.color = "var(--white)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(168,201,184,0.3)"; e.currentTarget.style.color = "var(--mist)"; }}
          >
            Pelajari Lebih Lanjut
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: "absolute", bottom: "2rem", left: "50%", transform: "translateX(-50%)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: "8px",
        color: "var(--mist)", fontSize: "0.7rem", letterSpacing: "0.1em",
        textTransform: "uppercase", fontFamily: "var(--font-mono)",
        animation: "float 2s ease-in-out infinite",
      }}>
        <span>Scroll</span>
        <div style={{
          width: "1px", height: "40px",
          background: "linear-gradient(to bottom, var(--mist), transparent)",
        }} />
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(6px); }
        }
      `}</style>
    </section>
  );
}
