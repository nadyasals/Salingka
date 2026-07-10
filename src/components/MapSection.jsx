import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { gsap, EASE } from "../hooks/useScrollReveal";
import { destinations } from "../data/destinations";

// Custom marker — lingkaran warna sesuai warna destinasi, bukan pin default Leaflet
// yang kurang cocok dengan tema dark mode kita
function createMarkerIcon(color, active) {
  const size = active ? 22 : 16;
  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        width: ${size}px; height: ${size}px;
        border-radius: 50%;
        background: ${color};
        border: 2px solid rgba(250,250,248,0.9);
        box-shadow: 0 0 0 4px ${color}33, 0 2px 8px rgba(0,0,0,0.4);
        transition: all 0.2s ease;
      "></div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

// Komponen kecil untuk fly-to saat destinasi dipilih dari luar peta (misal dari list)
function FlyToDestination({ target }) {
  const map = useMap();
  useEffect(() => {
    if (target) {
      map.flyTo([target.coords.lat, target.coords.lng], 8, { duration: 1.1 });
    }
  }, [target, map]);
  return null;
}

export default function MapSection() {
  const sectionRef = useRef(null);
  const headRef = useRef(null);
  const mapWrapRef = useRef(null);
  const [selected, setSelected] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const headItems = headRef.current.querySelectorAll("[data-animate]");
      gsap.set(headItems, { opacity: 0, y: 24 });
      gsap.set(mapWrapRef.current, { opacity: 0, y: 30 });

      gsap.timeline({
        defaults: { ease: EASE },
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%", once: true },
      })
        .to(headItems, { opacity: 1, y: 0, duration: 0.6, stagger: 0.08 })
        .to(mapWrapRef.current, { opacity: 1, y: 0, duration: 0.7 }, "-=0.25");
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} style={{
      padding: "clamp(4rem, 8vw, 6rem) 2rem",
      background: "var(--moss)",
      borderTop: "1px solid rgba(90,176,138,0.08)",
    }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>

        {/* Header */}
        <div ref={headRef} style={{ marginBottom: "2.5rem", maxWidth: "600px" }}>
          <p data-animate style={{
            fontFamily: "var(--font-mono)", fontSize: "0.68rem",
            letterSpacing: "0.22em", textTransform: "uppercase",
            color: "var(--fern)", marginBottom: "1rem",
          }}>
            Peta interaktif
          </p>
          <h2 data-animate style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
            fontWeight: 700, color: "var(--white)",
            lineHeight: 1.15, marginBottom: "1rem",
            letterSpacing: "-0.02em",
          }}>
            Titik-titik yang<br />
            <em style={{ color: "var(--leaf)", fontStyle: "italic" }}>menyusun Sumatra</em>
          </h2>
          <p data-animate style={{ fontSize: "0.9rem", color: "var(--mist)", lineHeight: 1.7, fontWeight: 300 }}>
            Klik titik pada peta untuk melihat detail tiap destinasi.
          </p>
        </div>

        {/* Map + Sidebar layout */}
        <div ref={mapWrapRef} style={{
          display: "grid",
          gridTemplateColumns: "1fr 300px",
          gap: "14px",
          borderRadius: "18px",
          overflow: "hidden",
          border: "1px solid rgba(90,176,138,0.14)",
        }}
          className="map-layout"
        >
          {/* Peta */}
          <div style={{ height: "560px", position: "relative", background: "#0D1F17" }}>
            <MapContainer
              center={[0.5, 101]}
              zoom={6}
              scrollWheelZoom={false}
              style={{ height: "100%", width: "100%", background: "#0D1F17" }}
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
              />
              {destinations.map((dest) => (
                <Marker
                  key={dest.id}
                  position={[dest.coords.lat, dest.coords.lng]}
                  icon={createMarkerIcon(dest.color, hoveredId === dest.id || selected?.id === dest.id)}
                  eventHandlers={{
                    click: () => setSelected(dest),
                    mouseover: () => setHoveredId(dest.id),
                    mouseout: () => setHoveredId(null),
                  }}
                >
                  <Popup>
                    <div style={{ fontFamily: "var(--font-body, sans-serif)", minWidth: "180px" }}>
                      <img
                        src={dest.image}
                        alt={dest.name}
                        style={{ width: "100%", height: "90px", objectFit: "cover", borderRadius: "6px", marginBottom: "8px" }}
                      />
                      <strong style={{ fontSize: "13px", display: "block", marginBottom: "3px" }}>{dest.name}</strong>
                      <span style={{ fontSize: "11px", color: "#666" }}>{dest.province}</span>
                    </div>
                  </Popup>
                </Marker>
              ))}
              {selected && <FlyToDestination target={selected} />}
            </MapContainer>
          </div>

          {/* Sidebar list — klik nama juga bisa pilih destinasi */}
          <div style={{
            background: "rgba(13,31,23,0.5)",
            padding: "1rem",
            height: "560px",
            overflowY: "auto",
          }}>
            <p style={{
              fontFamily: "var(--font-mono)", fontSize: "0.65rem",
              letterSpacing: "0.15em", textTransform: "uppercase",
              color: "var(--fern)", marginBottom: "0.75rem", padding: "0 0.5rem",
            }}>
              9 destinasi
            </p>
            {destinations.map((dest) => (
              <button
                key={dest.id}
                onClick={() => setSelected(dest)}
                onMouseEnter={() => setHoveredId(dest.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  padding: "10px 12px",
                  borderRadius: "10px",
                  marginBottom: "4px",
                  background: selected?.id === dest.id ? "rgba(90,176,138,0.15)" : "transparent",
                  border: "1px solid",
                  borderColor: selected?.id === dest.id ? "rgba(90,176,138,0.3)" : "transparent",
                  cursor: "pointer",
                  transition: "background 0.2s, border-color 0.2s",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "2px" }}>
                  <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: dest.color, flexShrink: 0 }} />
                  <span style={{ fontSize: "0.82rem", fontWeight: 500, color: "var(--cream)" }}>{dest.name}</span>
                </div>
                <span style={{ fontSize: "0.7rem", color: "var(--mist)", fontFamily: "var(--font-mono)", paddingLeft: "15px" }}>
                  {dest.province}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Override styling Leaflet default supaya cocok dark mode */}
      <style>{`
        .leaflet-container {
          font-family: var(--font-body);
        }
        .leaflet-popup-content-wrapper {
          background: #1A3328;
          color: #F0EBE1;
          border-radius: 10px;
        }
        .leaflet-popup-tip {
          background: #1A3328;
        }
        .leaflet-popup-close-button {
          color: #A8C9B8 !important;
        }
        .custom-marker { cursor: pointer; }
        .leaflet-control-zoom a {
          background: #1A3328 !important;
          color: #A8C9B8 !important;
          border-color: rgba(90,176,138,0.2) !important;
        }
        .leaflet-control-attribution {
          background: rgba(13,31,23,0.7) !important;
          color: rgba(168,201,184,0.6) !important;
        }
        .leaflet-control-attribution a {
          color: rgba(90,176,138,0.8) !important;
        }

        @media (max-width: 768px) {
          .map-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
