import { useEffect, useRef } from "react";

export default function Hero() {
  const titleRef = useRef(null);
  const eyebrowRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const els = [eyebrowRef.current, titleRef.current, ctaRef.current];
    els.forEach((el, i) => {
      if (!el) return;
      el.style.opacity = "0";
      el.style.transform = "translateY(32px)";
      setTimeout(() => {
        el.style.transition = "opacity 0.9s ease, transform 0.9s ease";
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      }, 200 + i * 200);
    });
  }, []);

  return (
    <section style={{
      position: "relative",
      height: "100svh",
      minHeight: "580px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
    }}>
      {/* Background image — WebP with JPEG fallback, lazy not on LCP */}
      <picture>
        <source
          type="image/webp"
          srcSet="https://images.unsplash.com/photo-1500622944204-b135684e99fd?w=800&q=75&fm=webp 800w, https://images.unsplash.com/photo-1500622944204-b135684e99fd?w=1400&q=75&fm=webp 1400w, https://images.unsplash.com/photo-1500622944204-b135684e99fd?w=1800&q=80&fm=webp 1800w"
          sizes="100vw"
        />
        <img
          src="https://images.unsplash.com/photo-1500622944204-b135684e99fd?w=1400&q=80"
          alt="Hutan tropis Sumatra dari udara"
          fetchpriority="high"
          decoding="async"
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            objectFit: "cover",
            objectPosition: "center 30%",
          }}
        />
      </picture>

      {/* Gradient overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to bottom, rgba(13,31,23,0.3) 0%, rgba(13,31,23,0.6) 50%, rgba(13,31,23,0.95) 100%)",
      }} />

      {/* Grain texture */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
        opacity: 0.4,
        pointerEvents: "none",
        aria: "hidden",
      }} />

      {/* Content */}
      <div style={{
        position: "relative",
        textAlign: "center",
        padding: "0 clamp(1rem, 5vw, 2rem)",
        maxWidth: "820px",
        width: "100%",
      }}>
        {/* Eyebrow label */}
        <div ref={eyebrowRef} style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          marginBottom: "clamp(1rem, 3vw, 1.5rem)",
          padding: "6px 16px",
          border: "1px solid rgba(90,176,138,0.3)",
          borderRadius: "100px",
          fontSize: "clamp(0.65rem, 1.5vw, 0.75rem)",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          color: "var(--leaf)",
          fontFamily: "var(--font-mono)",
          flexWrap: "wrap",
          justifyContent: "center",
        }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--leaf)", display: "inline-block", flexShrink: 0 }} />
          Ekowisata Berkelanjutan · Pulau Sumatra
        </div>

        {/* Main title */}
        <h1 ref={titleRef} style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(2.2rem, 8vw, 5.5rem)",
          fontWeight: 700,
          lineHeight: 1.08,
          color: "var(--white)",
          marginBottom: "clamp(1rem, 3vw, 1.5rem)",
          letterSpacing: "-0.02em",
        }}>
          Hutan Sumatra<br />
          <em style={{ color: "var(--leaf)", fontStyle: "italic" }}>masih menunggu</em><br />
          untuk dijaga
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: "clamp(0.9rem, 2.5vw, 1.15rem)",
          color: "var(--mist)",
          maxWidth: "560px",
          margin: "0 auto clamp(1.5rem, 4vw, 2.5rem)",
          fontWeight: 300,
          lineHeight: 1.7,
        }}>
          Sembilan destinasi ekowisata dari ujung Aceh hingga Lampung — tempat di mana alam dan komunitas lokal saling menjaga satu sama lain.
        </p>

        {/* CTA buttons */}
        <div ref={ctaRef} style={{
          display: "flex", gap: "clamp(0.6rem, 2vw, 1rem)",
          justifyContent: "center", flexWrap: "wrap",
          padding: "0 1rem",
        }}>
          <a href="#destinasi" style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "clamp(10px, 2vw, 14px) clamp(20px, 4vw, 32px)",
            background: "var(--leaf)",
            color: "var(--forest)",
            borderRadius: "100px",
            fontSize: "clamp(0.82rem, 2vw, 0.9rem)",
            fontWeight: 600,
            letterSpacing: "0.02em",
            transition: "all 0.25s",
            whiteSpace: "nowrap",
          }}
            onMouseEnter={e => { e.currentTarget.style.background = "var(--fern)"; e.currentTarget.style.color = "var(--white)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "var(--leaf)"; e.currentTarget.style.color = "var(--forest)"; }}
          >
            Mulai Jelajahi
            <span aria-hidden="true">↓</span>
          </a>
          <a href="#tentang" style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            padding: "clamp(10px, 2vw, 14px) clamp(20px, 4vw, 32px)",
            background: "transparent",
            color: "var(--mist)",
            borderRadius: "100px",
            border: "1px solid rgba(168,201,184,0.3)",
            fontSize: "clamp(0.82rem, 2vw, 0.9rem)",
            fontWeight: 400,
            letterSpacing: "0.02em",
            transition: "all 0.25s",
            whiteSpace: "nowrap",
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--mist)"; e.currentTarget.style.color = "var(--white)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(168,201,184,0.3)"; e.currentTarget.style.color = "var(--mist)"; }}
          >
            Pelajari Lebih Lanjut
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div aria-hidden="true" style={{
        position: "absolute", bottom: "2rem", left: "50%", transform: "translateX(-50%)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: "8px",
        color: "var(--mist)", fontSize: "0.7rem", letterSpacing: "0.1em",
        textTransform: "uppercase", fontFamily: "var(--font-mono)",
        animation: "salingka-float 2s ease-in-out infinite",
      }}>
        <span>Scroll</span>
        <div style={{
          width: "1px", height: "40px",
          background: "linear-gradient(to bottom, var(--mist), transparent)",
        }} />
      </div>

      <style>{`
        @keyframes salingka-float {
          0%, 100% { transform: translateX(-50%) translateY(0); }
          50% { transform: translateX(-50%) translateY(6px); }
        }
        @media (max-width: 375px) {
          .hero-cta { flex-direction: column; align-items: stretch; }
        }
      `}</style>
    </section>
  );
}
