'use client'

/**
 * HeroScene — Cinematic 2.5D parallax hero
 *
 * Ported from jungle-depth-voyage-main and adapted for Next.js.
 *
 * Layers (back → front):
 *  0. bg-mountains.jpg      — slowest parallax + scroll zoom
 *  1. mid-forest.jpg        — medium, masked at top
 *  2. midground-eagle.png   — wildlife, drifts up on scroll
 *  3. Typography "Salingka" — text-glow, fades early on scroll
 *  4. branch-topleft.png    — cinematic frame, rushes toward camera
 *  5. branch-bottomright.png — cinematic frame, rushes toward camera
 *
 * Atmosphere (fixed overlay, always visible):
 *  → Imported <Atmosphere /> component renders fireflies + mist on top of everything
 */

import { useRef } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  type MotionValue,
} from 'framer-motion'
import { BlurText } from '@/components/blur-text'
import { useLanguage } from '@/components/language-context'

/** Parallax helper: maps –0.5…+0.5 pointer value to ±distance px */
function useParallax(value: MotionValue<number>, distance: number) {
  return useTransform(value, [-0.5, 0.5], [distance, -distance])
}

export function HeroScene() {
  const sceneRef = useRef<HTMLDivElement>(null)
  const { lang } = useLanguage()

  // ── Scroll-driven zoom ──────────────────────────────────────────────────────
  const { scrollYProgress } = useScroll({
    target: sceneRef,
    offset: ['start start', 'end start'],
  })
  const smoothScroll = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 24,
    mass: 0.6,
  })

  // Each layer scales at a different rate — foreground rushes past camera
  const bgScale      = useTransform(smoothScroll, [0, 1], [1.05, 1.35])
  const midScale     = useTransform(smoothScroll, [0, 1], [1.05, 1.8])
  const eagleScale   = useTransform(smoothScroll, [0, 1], [1,    2.4])
  const fgScale      = useTransform(smoothScroll, [0, 1], [1,    3.2])
  const contentScale = useTransform(smoothScroll, [0, 1], [1,    1.6])

  // Whole-scene exit: fade + blur
  const sceneOpacity   = useTransform(smoothScroll, [0, 0.65, 1], [1, 1, 0])
  const sceneBlurRaw   = useTransform(smoothScroll, [0, 0.7,  1], [0, 0, 12])
  const sceneBlur      = useTransform(sceneBlurRaw, (b) => `blur(${b}px)`)

  // Text exits earlier
  const contentOpacity = useTransform(smoothScroll, [0, 0.4], [1, 0])
  const contentY       = useTransform(smoothScroll, [0, 1],   [0, -80])

  // ── Mouse-tracking parallax ─────────────────────────────────────────────────
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const mx = useSpring(px, { stiffness: 90, damping: 20, mass: 0.4 })
  const my = useSpring(py, { stiffness: 90, damping: 20, mass: 0.4 })

  const bgX   = useParallax(mx, 14)
  const bgY   = useParallax(my, 10)
  const midX  = useParallax(mx, 34)
  const midY  = useParallax(my, 22)
  const eagleX = useParallax(mx, 64)
  const eagleY = useParallax(my, 42)
  const fgX   = useParallax(mx, 96)
  const fgY   = useParallax(my, 60)
  const textX = useParallax(mx, 24)
  const textY = useParallax(my, 16)

  function handlePointer(e: React.PointerEvent) {
    const nx = e.clientX / window.innerWidth - 0.5
    const ny = e.clientY / window.innerHeight - 0.5
    px.set(nx)
    py.set(ny)
  }

  return (
    <section
      id="hero"
      ref={sceneRef}
      className="relative"
      style={{ height: '220vh' }}
      onPointerMove={handlePointer}
    >
      <motion.div
        style={{ opacity: sceneOpacity, filter: sceneBlur }}
        className="sticky top-0 h-screen w-full overflow-hidden"
      >
        {/* ── LAYER 0: Background — misty mountains ─────────────────────────── */}
        <motion.img
          src="/images/bg-mountains.jpg"
          alt="Misty mountain ranges of the Sumatran rainforest at dawn"
          style={{ scale: bgScale, x: bgX, y: bgY, willChange: 'transform' }}
          className="absolute inset-0 h-full w-full scale-110 object-cover"
        />

        {/* Dark colour-grade vignette */}
        <div
          className="pointer-events-none absolute inset-0 z-[5]"
          style={{
            background:
              'radial-gradient(120% 90% at 50% 20%, transparent 40%, oklch(0.13 0.022 175 / 0.85))',
          }}
        />

        {/* ── LAYER 1: Midground forest ──────────────────────────────────────── */}
        <motion.img
          src="/images/mid-forest.jpg"
          alt=""
          aria-hidden="true"
          style={{ scale: midScale, x: midX, y: midY, willChange: 'transform' }}
          className="absolute inset-0 z-[8] h-full w-full scale-110 object-cover opacity-90"
          // Mask — forest reveals from bottom, fades to transparent at top
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          {...({ style: { scale: midScale, x: midX, y: midY, willChange: 'transform', maskImage: 'linear-gradient(to top, black 35%, transparent 95%)', WebkitMaskImage: 'linear-gradient(to top, black 35%, transparent 95%)' } } as any)}
        />

        {/* ── LAYER 2: Wildlife — eagle ──────────────────────────────────────── */}
        <motion.img
          src="/images/midground-eagle.png"
          alt="An eagle soaring over the rainforest"
          style={{
            scale: eagleScale,
            x: eagleX,
            y: eagleY,
            willChange: 'transform',
          }}
          className="absolute right-[4%] top-[6%] z-[35] w-[34vw] max-w-[420px] drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)] md:left-[8%] md:right-auto md:top-[16%] md:w-[34vw]"
        />

        {/* ── LAYER 3: Typography ────────────────────────────────────────────── */}
        <motion.div
          style={{
            scale: contentScale,
            opacity: contentOpacity,
            x: textX,
            y: contentY,
          }}
          className="absolute inset-0 z-[50] flex flex-col items-center justify-center px-6 text-center"
        >
          {/* Legibility scrim behind headline */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-[70vh] w-[130vw] -translate-x-1/2 -translate-y-1/2 [background:radial-gradient(50%_45%_at_50%_50%,oklch(0.1_0.02_200/0.72),transparent_75%)]" />

          {/* Eyebrow */}
          <motion.p
            style={{ y: textY }}
            initial={{ opacity: 0, letterSpacing: '0.2em', y: 20 }}
            animate={{ opacity: 1, letterSpacing: '0.45em', y: 0 }}
            transition={{ duration: 1.4, delay: 0.3 }}
            className="relative mb-5 font-sans text-[11px] uppercase tracking-[0.4em] text-primary md:text-xs md:tracking-[0.5em]"
          >
            {lang === 'id' ? 'Ekowisata Bertanggung Jawab · Sumatra' : 'Sustainable Ecotourism · Sumatra'}
          </motion.p>

          {/* Hero title — massively oversized with teal glow */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="text-glow relative select-none font-serif leading-none tracking-tight text-white"
            style={{
              fontSize: 'clamp(5.5rem, 16vw, 15rem)',
              willChange: 'transform',
            }}
          >
            Salingka
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 0.9 }}
            className="relative mt-6 max-w-xl text-center text-sm leading-relaxed text-white/60 md:text-base"
          >
            <BlurText
              key={lang}
              text={lang === 'id' 
                ? "Langkahkan kakimu menembus kabut, masuk ke jantung hutan yang masih hidup. Ini bukan soal jarak — ini soal momen yang tak terlupakan."
                : "Step through the mist and into the living heart of the wild jungle. A journey measured not in miles, but in moments."
              }
              staggerMs={35}
              duration={0.65}
              threshold={0.05}
            />
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 1.2 }}
            className="mt-10 flex items-center gap-4"
          >
            <a
              href="#orbital"
              id="hero-cta-explore"
              className="liquid-glass-strong group flex items-center gap-3 rounded-full px-7 py-3.5 text-[11px] font-medium uppercase tracking-[0.25em] text-white/90 transition-all duration-300 hover:text-white hover:scale-105"
            >
              {lang === 'id' ? 'Mulai Jelajah' : 'Explore Destinations'}
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.4, repeat: Infinity }}
              >
                →
              </motion.span>
            </a>
          </motion.div>

          {/* Location hotspot pins removed for a cleaner hero focus */}
        </motion.div>

        {/* ── LAYER 4: Foreground branch — top-left (cinematic frame) ─────────── */}
        <motion.img
          src="/images/branch-topleft.png"
          alt=""
          aria-hidden="true"
          style={{ scale: fgScale, x: fgX, y: fgY, willChange: 'transform' }}
          className="pointer-events-none absolute -left-[6%] -top-[8%] z-[30] w-[52vw] max-w-[760px] origin-top-left drop-shadow-[0_30px_60px_rgba(0,0,0,0.7)]"
        />

        {/* ── LAYER 5: Foreground branch — bottom-right (cinematic frame) ──────── */}
        <motion.img
          src="/images/branch-bottomright.png"
          alt=""
          aria-hidden="true"
          style={{ scale: fgScale, x: fgX, y: fgY, willChange: 'transform' }}
          className="pointer-events-none absolute -bottom-[10%] -right-[6%] z-[30] w-[52vw] max-w-[760px] origin-bottom-right drop-shadow-[0_30px_60px_rgba(0,0,0,0.7)]"
        />

        {/* ── Cinematic scan-line bars removed for a cleaner lower edge ───────── */}

        {/* ── Scroll cue ────────────────────────────────────────────────────────── */}
        <motion.div
          style={{ opacity: contentOpacity }}
          className="absolute bottom-14 left-1/2 z-[45] flex -translate-x-1/2 flex-col items-center gap-2 text-foreground/60"
        >
          <span className="text-[9px] uppercase tracking-[0.45em] text-white/40">
            Venture Deeper
          </span>
          <span className="flex h-9 w-5 items-start justify-center rounded-full border border-foreground/30 p-1">
            <motion.span
              className="h-2 w-1 rounded-full bg-primary"
              animate={{ y: [0, 10, 0], opacity: [1, 0.2, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            />
          </span>
        </motion.div>
      </motion.div>
    </section>
  )
}
