import { useState, useEffect } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 640) setMenuOpen(false); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const links = [
    { label: "Tentang", href: "#tentang" },
    { label: "Destinasi", href: "#destinasi" },
    { label: "Panduan", href: "#panduan" },
  ];

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        padding: "0 clamp(1rem, 4vw, 2rem)",
        height: "64px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: scrolled ? "rgba(13,31,23,0.95)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(90,176,138,0.12)" : "none",
        transition: "all 0.4s ease",
      }}>
        <a href="#" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "20px" }} aria-hidden="true">🌿</span>
          <span style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.1rem",
            fontWeight: 700,
            color: "var(--leaf)",
            letterSpacing: "0.02em",
          }}>
            Salingka
          </span>
        </a>

        {/* Desktop links */}
        <div style={{
          display: "flex", gap: "2rem", alignItems: "center",
        }} className="salingka-desktop-nav">
          {links.map(l => (
            <a key={l.label} href={l.href} style={{
              fontSize: "0.85rem",
              fontWeight: 400,
              color: "var(--mist)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              transition: "color 0.2s",
            }}
              onMouseEnter={e => e.target.style.color = "var(--leaf)"}
              onMouseLeave={e => e.target.style.color = "var(--mist)"}
            >{l.label}</a>
          ))}
          <a href="#destinasi" style={{
            fontSize: "0.8rem",
            fontWeight: 500,
            color: "var(--forest)",
            background: "var(--leaf)",
            padding: "8px 20px",
            borderRadius: "100px",
            letterSpacing: "0.05em",
            transition: "background 0.2s",
            whiteSpace: "nowrap",
          }}
            onMouseEnter={e => e.target.style.background = "var(--fern)"}
            onMouseLeave={e => e.target.style.background = "var(--leaf)"}
          >
            Jelajahi
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="salingka-hamburger"
          aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
          aria-expanded={menuOpen}
          style={{ padding: "8px", display: "none", flexDirection: "column", gap: "5px" }}
        >
          {[0, 1, 2].map(i => (
            <span key={i} style={{
              display: "block", width: "22px", height: "1.5px",
              background: "var(--mist)",
              transition: "all 0.3s",
              transformOrigin: "center",
              transform: menuOpen
                ? i === 0 ? "rotate(45deg) translate(4px, 4px)"
                  : i === 2 ? "rotate(-45deg) translate(4px, -4px)"
                  : "scaleX(0)"
                : "none",
            }} />
          ))}
        </button>
      </nav>

      {/* Mobile menu — outside nav so it doesn't inherit overflow:hidden */}
      {menuOpen && (
        <div style={{
          position: "fixed", top: "64px", left: 0, right: 0, zIndex: 99,
          background: "rgba(13,31,23,0.98)",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          padding: "1.5rem clamp(1rem, 4vw, 2rem) 2rem",
          display: "flex", flexDirection: "column", gap: "1.2rem",
          borderBottom: "1px solid rgba(90,176,138,0.15)",
        }}>
          {links.map(l => (
            <a key={l.label} href={l.href}
              onClick={() => setMenuOpen(false)}
              style={{ fontSize: "1rem", color: "var(--cream)", fontWeight: 400 }}
            >{l.label}</a>
          ))}
          <a href="#destinasi"
            onClick={() => setMenuOpen(false)}
            style={{
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              padding: "12px 24px",
              background: "var(--leaf)",
              color: "var(--forest)",
              borderRadius: "100px",
              fontSize: "0.9rem",
              fontWeight: 600,
              marginTop: "0.5rem",
            }}
          >
            Jelajahi Sekarang
          </a>
        </div>
      )}

      <style>{`
        @media (max-width: 640px) {
          .salingka-desktop-nav { display: none !important; }
          .salingka-hamburger { display: flex !important; }
        }
      `}</style>
    </>
  );
}
