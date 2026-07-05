import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, EASE } from "../hooks/useScrollReveal";

export default function Hero() {
  const sectionRef = useRef(null);
  const bgRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const content = contentRef.current;
      // Semua elemen yang perlu animasi masuk ditandai data-animate
      // Urutan DOM = urutan animasi, jadi tidak perlu atur index manual
      const items = gsap.utils.toArray(content.querySelectorAll("[data-animate]"));

      // Set kondisi awal SEKALI di sini — bukan lewat inline style
      // supaya tidak ada flash konten sebelum JS jalan
      gsap.set(items, { opacity: 0, y: 24 });

      // --- Timeline tunggal untuk load-in, tidak ada timeline lain yang tabrakan ---
      gsap.timeline({ defaults: { ease: EASE } })
        .to(items, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.09, // jarak antar elemen dipangkas, biar tidak berasa lama
        });

      // --- Parallax background, terpisah dari load-in timeline ---
      // scrub murni mengikuti posisi scroll, tidak ada delay/duration
      gsap.to(bgRef.current, {
        yPercent: 18,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // --- Fade saat scroll keluar hero ---
      // Range digeser lebih jauh (40%–100%) supaya tidak overlap
      // dengan animasi load-in yang baru selesai di awal
      gsap.to(content, {
        opacity: 0,
        y: -24,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "40% top",
          end: "95% top",
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} style={{
      position: "relative",
      height: "100vh",
      minHeight: "620px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
    }}>
      {/* Background — ukuran dilebihkan supaya parallax tidak menyisakan celah */}
      <div ref={bgRef} style={{
        position: "absolute",
        inset: "-15% 0",
        backgroundImage: "url(https://images.unsplash.com/photo-1500622944204-b135684e99fd?w=1800&q=80)",
        backgroundSize: "cover",
        backgroundPosition: "center 40%",
        willChange: "transform",
      }} />

      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(180deg, rgba(13,31,23,0.25) 0%, rgba(13,31,23,0.55) 45%, rgba(13,31,23,0.97) 100%)",
        pointerEvents: "none",
      }} />

      {/* Konten */}
      <div ref={contentRef} style={{
        position: "relative",
        textAlign: "center",
        padding: "0 1.5rem",
        maxWidth: "840px",
        width: "100%",
      }}>
        <div data-animate style={{
          display: "inline-flex", alignItems: "center", gap: "10px",
          marginBottom: "1.75rem",
          padding: "6px 18px",
          border: "1px solid rgba(90,176,138,0.28)",
          borderRadius: "100px",
          fontSize: "0.72rem",
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "var(--leaf)",
          fontFamily: "var(--font-mono)",
          background: "rgba(13,31,23,0.3)",
        }}>
          <span style={{
            width: "5px", height: "5px", borderRadius: "50%",
            background: "var(--leaf)", display: "inline-block",
          }} />
          Ekowisata Berkelanjutan · Pulau Sumatra
        </div>

        {/* Judul — satu blok, tidak dipecah per baris supaya tidak ada
            perbedaan tinggi yang bikin layout "loncat" saat animasi jalan */}
        <h1 data-animate style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(2.8rem, 7vw, 5.6rem)",
          fontWeight: 700,
          lineHeight: 1.06,
          color: "var(--white)",
          marginBottom: "1.6rem",
          letterSpacing: "-0.025em",
        }}>
          Hutan Sumatra<br />
          <em style={{ color: "var(--leaf)", fontStyle: "italic" }}>masih menunggu</em><br />
          untuk dijaga
        </h1>

        <p data-animate style={{
          fontSize: "clamp(0.95rem, 2vw, 1.12rem)",
          color: "var(--mist)",
          maxWidth: "540px",
          margin: "0 auto 2.5rem",
          fontWeight: 300,
          lineHeight: 1.75,
        }}>
          Sembilan destinasi ekowisata dari ujung Aceh hingga Lampung — tempat di mana alam dan komunitas lokal saling menjaga satu sama lain.
        </p>

        <div data-animate style={{
          display: "flex", gap: "1rem",
          justifyContent: "center", flexWrap: "wrap",
        }}>
          <a href="#destinasi" className="btn-primary">Mulai Jelajahi →</a>
          <a href="#tentang" className="btn-ghost">Pelajari Lebih Lanjut</a>
        </div>
      </div>

      <style>{`
        .btn-primary {
          display: inline-flex; align-items: center;
          padding: 13px 30px;
          background: var(--leaf);
          color: var(--forest);
          border-radius: 100px;
          font-size: 0.88rem;
          font-weight: 600;
          letter-spacing: 0.03em;
          transition: background 0.2s ease, color 0.2s ease, transform 0.2s ease;
          text-decoration: none;
        }
        .btn-primary:hover { background: var(--fern); color: var(--white); transform: translateY(-2px); }
        .btn-ghost {
          display: inline-flex; align-items: center;
          padding: 13px 30px;
          background: transparent;
          color: var(--mist);
          border-radius: 100px;
          border: 1px solid rgba(168,201,184,0.25);
          font-size: 0.88rem;
          font-weight: 400;
          letter-spacing: 0.03em;
          transition: border-color 0.2s, color 0.2s, transform 0.2s;
          text-decoration: none;
        }
        .btn-ghost:hover { border-color: var(--mist); color: var(--white); transform: translateY(-2px); }
      `}</style>
    </section>
  );
}
