export default function Footer() {
  return (
    <footer style={{
      padding: "4rem 2rem 2.5rem",
      background: "var(--forest)",
      borderTop: "1px solid rgba(90,176,138,0.1)",
    }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        {/* Top row */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "2rem",
          marginBottom: "3rem",
          paddingBottom: "3rem",
          borderBottom: "1px solid rgba(90,176,138,0.1)",
        }}>
          {/* Brand */}
          <div style={{ maxWidth: "320px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1rem" }}>
              <span style={{ fontSize: "24px" }}>🌿</span>
              <span style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.3rem",
                fontWeight: 700,
                color: "var(--leaf)",
              }}>Salingka</span>
            </div>
            <p style={{
              fontSize: "0.83rem",
              color: "var(--mist)",
              lineHeight: 1.7,
              fontWeight: 300,
            }}>
              Platform ekowisata berkelanjutan yang menghubungkan wisatawan dengan keajaiban alam Sumatra, sekaligus mendukung komunitas lokal dan pelestarian lingkungan.
            </p>
          </div>

          {/* SDG Commitment */}
          <div>
            <p style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.65rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "var(--fern)",
              marginBottom: "1rem",
            }}>
              Komitmen SDGs
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {[
                { code: "SDG 8", label: "Pertumbuhan Ekonomi", color: "#A21942" },
                { code: "SDG 13", label: "Iklim", color: "#3F7E44" },
                { code: "SDG 14", label: "Bawah Laut", color: "#0A97D9" },
                { code: "SDG 15", label: "Di Darat", color: "#56C02B" },
              ].map(s => (
                <div key={s.code} style={{
                  display: "flex", alignItems: "center", gap: "8px",
                  fontSize: "0.78rem",
                }}>
                  <span style={{
                    width: "6px", height: "6px", borderRadius: "50%",
                    background: s.color, flexShrink: 0,
                  }} />
                  <span style={{ fontFamily: "var(--font-mono)", color: s.color, fontSize: "0.7rem" }}>{s.code}</span>
                  <span style={{ color: "var(--mist)" }}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Nav links */}
          <div>
            <p style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.65rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              color: "var(--fern)",
              marginBottom: "1rem",
            }}>
              Navigasi
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {[
                { label: "Tentang Salingka", href: "#tentang" },
                { label: "Destinasi Ekowisata", href: "#destinasi" },
                { label: "Panduan Wisatawan", href: "#panduan" },
              ].map(l => (
                <a key={l.label} href={l.href} style={{
                  fontSize: "0.83rem",
                  color: "var(--mist)",
                  transition: "color 0.2s",
                }}
                  onMouseEnter={e => e.target.style.color = "var(--leaf)"}
                  onMouseLeave={e => e.target.style.color = "var(--mist)"}
                >
                  {l.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
        }}>
          <p style={{
            fontSize: "0.75rem",
            color: "rgba(168,201,184,0.4)",
            fontFamily: "var(--font-mono)",
          }}>
            © 2026 Salingka · SDGs Creative Web Competition · BytesFest 2026
          </p>
          <p style={{
            fontSize: "0.75rem",
            color: "rgba(168,201,184,0.4)",
            fontFamily: "var(--font-mono)",
          }}>
            Foto: Unsplash · Dibuat dengan ❤️ untuk alam Sumatra
          </p>
        </div>
      </div>
    </footer>
  );
}
