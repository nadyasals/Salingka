import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, EASE } from "../hooks/useScrollReveal";

const facts = [
  {
    number: "01",
    title: "Paru-paru yang Tersisa",
    body: "Sumatra menyimpan salah satu hutan hujan tropis terakhir di Asia. Setiap tahun, luasnya terus menyusut — namun komunitas lokal yang tinggal di tepi hutan masih terus berjuang untuk mempertahankannya.",
    accent: "var(--leaf)",
    image: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=900&q=80",
  },
  {
    number: "02",
    title: "Empat Spesies di Ujung Tanduk",
    body: "Orangutan, harimau, gajah, dan badak Sumatra — keempat spesies ikonik ini hanya bisa ditemukan di satu pulau yang sama di seluruh dunia. Keberadaan mereka bergantung pada keputusan yang kita buat hari ini.",
    accent: "#C4622D",
    image: "https://images.unsplash.com/photo-1594128795553-44001c769b9d?w=900&q=80",
  },
  {
    number: "03",
    title: "Wisata sebagai Solusi",
    body: "Ekowisata yang dikelola dengan baik terbukti menjadi cara paling efektif untuk menjaga hutan tetap berdiri. Ketika hutan bernilai lebih dalam keadaan hidup, masyarakat punya alasan kuat untuk melindunginya.",
    accent: "#D4A847",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&q=80",
  },
];

function StoryBlock({ fact, index }) {
  const blockRef = useRef(null);
  const imgWrapRef = useRef(null);
  const imgRef = useRef(null);
  const textRef = useRef(null);
  const isEven = index % 2 === 0;

  useEffect(() => {
    const ctx = gsap.context(() => {
      const textItems = textRef.current.querySelectorAll("[data-animate]");

      gsap.set(textItems, { opacity: 0, y: 22 });
      gsap.set(imgWrapRef.current, { clipPath: "inset(100% 0% 0% 0%)" });
      gsap.set(imgRef.current, { scale: 1.08 });

      // Satu timeline untuk load-in blok ini — teks dan gambar jalan bersamaan
      // (bukan menunggu satu sama lain), jadi terasa cepat & serentak
      gsap.timeline({
        defaults: { ease: EASE },
        scrollTrigger: {
          trigger: blockRef.current,
          start: "top 75%",
          once: true,
        },
      })
        .to(textItems, { opacity: 1, y: 0, duration: 0.65, stagger: 0.08 }, 0)
        .to(imgWrapRef.current, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, ease: "power4.out" }, 0)
        .to(imgRef.current, { scale: 1, duration: 0.9, ease: "power4.out" }, 0);

      // Parallax halus — scrub murni, terpisah total dari timeline di atas
      // supaya tidak ada dua animasi yang berebut properti transform yang sama
      gsap.to(imgRef.current, {
        yPercent: 8,
        ease: "none",
        scrollTrigger: {
          trigger: blockRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, blockRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={blockRef}
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "clamp(2rem, 5vw, 5rem)",
        alignItems: "center",
        marginBottom: "clamp(4rem, 10vw, 7rem)",
      }}
      className="story-row"
    >
      {/* Teks — order diatur lewat CSS order, bukan direction:rtl,
          supaya alignment teks tidak pernah terganggu */}
      <div ref={textRef} style={{ order: isEven ? 1 : 2 }}>
        <div data-animate style={{ width: "40px", height: "2px", background: fact.accent, marginBottom: "1.2rem" }} />

        <span data-animate style={{
          fontFamily: "var(--font-mono)", fontSize: "0.72rem",
          letterSpacing: "0.2em", color: fact.accent,
          display: "block", marginBottom: "0.75rem",
        }}>
          {fact.number}
        </span>

        <h3 data-animate style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(1.6rem, 3.5vw, 2.4rem)",
          fontWeight: 700, color: "var(--white)",
          lineHeight: 1.15, marginBottom: "1.2rem",
          letterSpacing: "-0.02em",
        }}>
          {fact.title}
        </h3>

        <p data-animate style={{
          fontSize: "clamp(0.9rem, 1.5vw, 1rem)",
          color: "var(--mist)", lineHeight: 1.8, fontWeight: 300,
          maxWidth: "420px",
        }}>
          {fact.body}
        </p>
      </div>

      {/* Gambar */}
      <div ref={imgWrapRef} style={{
        order: isEven ? 2 : 1,
        borderRadius: "16px",
        overflow: "hidden",
        aspectRatio: "4/3",
        position: "relative",
      }}>
        <img
          ref={imgRef}
          src={fact.image}
          alt={fact.title}
          loading="lazy"
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
        <div style={{
          position: "absolute", inset: 0,
          background: `linear-gradient(135deg, ${fact.accent}15, transparent 60%)`,
          pointerEvents: "none",
        }} />
      </div>
    </div>
  );
}

export default function Storytelling() {
  const sectionRef = useRef(null);
  const headRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const items = headRef.current.querySelectorAll("[data-animate]");
      gsap.set(items, { opacity: 0, y: 24 });
      gsap.to(items, {
        opacity: 1, y: 0, duration: 0.65, ease: EASE, stagger: 0.08,
        scrollTrigger: { trigger: headRef.current, start: "top 82%", once: true },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} style={{
      padding: "clamp(4rem, 10vw, 8rem) 2rem",
      background: "var(--forest)",
      borderTop: "1px solid rgba(90,176,138,0.08)",
    }}>
      <div style={{ maxWidth: "1060px", margin: "0 auto" }}>

        <div ref={headRef} style={{ marginBottom: "clamp(3rem, 7vw, 6rem)", maxWidth: "560px" }}>
          <p data-animate style={{
            fontFamily: "var(--font-mono)", fontSize: "0.68rem",
            letterSpacing: "0.22em", textTransform: "uppercase",
            color: "var(--fern)", marginBottom: "1rem",
          }}>
            Kenapa ini penting
          </p>
          <h2 data-animate style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(1.9rem, 4.5vw, 3rem)",
            fontWeight: 700, color: "var(--white)",
            lineHeight: 1.12, marginBottom: "1rem",
            letterSpacing: "-0.02em",
          }}>
            Sumatra bukan destinasi.<br />
            <em style={{ color: "var(--leaf)", fontStyle: "italic" }}>Ia adalah tanggung jawab.</em>
          </h2>
          <p data-animate style={{ fontSize: "0.95rem", color: "var(--mist)", lineHeight: 1.75, fontWeight: 300 }}>
            Tiga hal yang perlu kamu pahami sebelum melangkah ke dalam rimba Sumatra.
          </p>
        </div>

        {facts.map((fact, i) => (
          <StoryBlock key={i} fact={fact} index={i} />
        ))}
      </div>

      <style>{`
        @media (max-width: 680px) {
          .story-row {
            grid-template-columns: 1fr !important;
          }
          .story-row > div { order: unset !important; }
        }
      `}</style>
    </section>
  );
}
