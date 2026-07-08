'use client'

/**
 * CinematicHero — 2.5D multi-layer parallax hero
 *
 * Layers (back → front):
 *  0. Sky / mountains (background)  – slowest parallax
 *  1. Misty mid-forest              – medium-slow
 *  2. Typography ("Salingka")       – medium
 *  3. Wildlife (eagle)              – medium-fast
 *  4. Foreground vines/leaves       – fastest
 *
 * Animations:
 *  · Mouse-tracking parallax via useMotionValue + useSpring
 *  · Scroll-driven Z-axis zoom via useScroll + useTransform
 *  · CSS fireflies, drifting mist, falling leaves
 *  · Scroll-driven fade/blur exit gate between sections
 */

import {
  useRef,
  useEffect,
  useState,
  useMemo,
} from 'react'
import {
  motion,
  useMotionValue,
  useSpring,
  useScroll,
  useTransform,
  AnimatePresence,
} from 'framer-motion'

// ─── Firefly particle ────────────────────────────────────────────────────────

function Firefly({
  x,
  y,
  size,
  duration,
  delay,
  driftX,
  driftY,
}: {
  x: string
  y: string
  size: number
  duration: number
  delay: number
  driftX: number
  driftY: number
}) {
  return (
    <motion.span
      className="pointer-events-none absolute rounded-full"
      style={{
        left: x,
        top: y,
        width: size,
        height: size,
        background: 'oklch(0.88 0.22 155)',
        boxShadow: `0 0 ${size * 2}px ${size}px oklch(0.88 0.22 155 / 70%)`,
        willChange: 'transform, opacity',
      }}
      initial={{ opacity: 0, x: 0, y: 0 }}
      animate={{
        opacity: [0, 0.9, 0.6, 1, 0],
        x: [0, driftX * 0.4, driftX, driftX * 0.6, 0],
        y: [0, driftY * 0.3, driftY * 0.7, driftY, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  )
}

function Fireflies({ count = 28 }: { count?: number }) {
  const flies = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: `${5 + Math.random() * 90}%`,
      y: `${5 + Math.random() * 88}%`,
      size: 2 + Math.random() * 3,
      duration: 4 + Math.random() * 7,
      delay: Math.random() * 8,
      driftX: (Math.random() - 0.5) * 80,
      driftY: (Math.random() - 0.5) * 60,
    })), [count])

  return (
    <>
      {flies.map((f) => <Firefly key={f.id} {...f} />)}
    </>
  )
}

// ─── Drifting mist layer ─────────────────────────────────────────────────────

function MistLayer({
  opacity = 0.4,
  duration = 40,
  yStart = '60%',
}: {
  opacity?: number
  duration?: number
  yStart?: string
}) {
  return (
    <motion.div
      className="pointer-events-none absolute inset-x-[-20%] h-[50%]"
      style={{
        top: yStart,
        background:
          'radial-gradient(ellipse 120% 60% at 50% 50%, oklch(0.88 0.03 175 / 45%), transparent 70%)',
        willChange: 'transform',
        filter: 'blur(24px)',
      }}
      animate={{
        x: ['-10%', '12%', '-10%'],
        scaleX: [1, 1.08, 1],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  )
}

// ─── Falling leaf ────────────────────────────────────────────────────────────

function FallingLeaf({ x, delay, duration }: { x: string; delay: number; duration: number }) {
  return (
    <motion.div
      className="pointer-events-none absolute top-[-5%] text-base select-none"
      style={{ left: x, willChange: 'transform, opacity' }}
      initial={{ y: '-5vh', x: 0, rotate: 0, opacity: 0 }}
      animate={{
        y: '105vh',
        x: [0, 30, -20, 40, -10, 20, 0],
        rotate: [0, 45, -30, 60, -45, 30, 0],
        opacity: [0, 0.7, 0.7, 0.7, 0.5, 0.3, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'linear',
        times: [0, 0.1, 0.3, 0.5, 0.7, 0.9, 1],
      }}
    >
      🍃
    </motion.div>
  )
}

function FallingLeaves({ count = 6 }: { count?: number }) {
  const leaves = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: `${10 + (i / count) * 80}%`,
      delay: i * 2.5,
      duration: 10 + Math.random() * 8,
    })), [count])

  return (
    <>
      {leaves.map((l) => <FallingLeaf key={l.id} {...l} />)}
    </>
  )
}

// ─── Scroll indicator ────────────────────────────────────────────────────────

function ScrollIndicator() {
  return (
    <motion.div
      className="pointer-events-none flex flex-col items-center gap-3"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2, duration: 1 }}
    >
      <span className="text-[9px] uppercase tracking-[0.45em] text-white/40">
        Venture Deeper
      </span>
      <div className="relative h-12 w-6 overflow-hidden rounded-full border border-white/20">
        <motion.div
          className="absolute left-1/2 top-1.5 h-2 w-1 -translate-x-1/2 rounded-full bg-primary"
          animate={{ y: [0, 28, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>
    </motion.div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export function HeroParallax() {
  const outerRef = useRef<HTMLDivElement>(null)

  // ── Mouse tracking ──────────────────────────────────────────────────────────
  const rawX = useMotionValue(0)   // –0.5 … +0.5 (normalized)
  const rawY = useMotionValue(0)

  // Spring smoothing — feels "weighty", like camera on gimbal
  const smoothX = useSpring(rawX, { damping: 32, stiffness: 90, mass: 1.2 })
  const smoothY = useSpring(rawY, { damping: 32, stiffness: 90, mass: 1.2 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) - 0.5
      const ny = (e.clientY / window.innerHeight) - 0.5
      rawX.set(nx)
      rawY.set(ny)
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [rawX, rawY])

  // Per-layer parallax offsets (faster = more foreground)
  const bgX  = useTransform(smoothX, [-0.5, 0.5], ['-1.5%', '1.5%'])
  const bgY  = useTransform(smoothY, [-0.5, 0.5], ['-0.8%', '0.8%'])

  const midX = useTransform(smoothX, [-0.5, 0.5], ['-3%', '3%'])
  const midY = useTransform(smoothY, [-0.5, 0.5], ['-1.8%', '1.8%'])

  const eagleX = useTransform(smoothX, [-0.5, 0.5], ['-5%', '5%'])
  const eagleY = useTransform(smoothY, [-0.5, 0.5], ['-3%', '3%'])

  const textX  = useTransform(smoothX, [-0.5, 0.5], ['-2%', '2%'])
  const textY  = useTransform(smoothY, [-0.5, 0.5], ['-1.2%', '1.2%'])

  const fgX  = useTransform(smoothX, [-0.5, 0.5], ['-7%', '7%'])
  const fgY  = useTransform(smoothY, [-0.5, 0.5], ['-4.5%', '4.5%'])

  // Tiger parallax (extracted from JSX — hooks can't be called inline in style)
  const tigerX = useTransform(smoothX, [-0.5, 0.5], ['-4%', '4%'])
  const tigerY = useTransform(smoothY, [-0.5, 0.5], ['-2.5%', '2.5%'])

  // ── Scroll-driven Z-axis zoom ───────────────────────────────────────────────
  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ['start start', 'end start'],
  })

  // Background zooms slow
  const bgScale  = useTransform(scrollYProgress, [0, 1], [1, 1.18])
  // Mid zooms medium
  const midScale = useTransform(scrollYProgress, [0, 1], [1, 1.28])
  // Foreground zooms fast (comes toward camera)
  const fgScale  = useTransform(scrollYProgress, [0, 1], [1, 1.45])
  // Eagle drifts up a bit
  const eagleScrollY = useTransform(scrollYProgress, [0, 1], ['0%', '-12%'])

  // Exit fade + blur gate at end of scroll
  const overallOpacity = useTransform(scrollYProgress, [0.6, 0.95], [1, 0])
  const overallBlurRaw = useTransform(scrollYProgress, [0.6, 0.95], [0, 18])
  const overallBlur    = useTransform(overallBlurRaw, (v: number) => `blur(${v}px)`)
  const overallScale   = useTransform(scrollYProgress, [0, 1], [1, 1.06])

  // Text exits earlier
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const textScrollY = useTransform(scrollYProgress, [0, 1], ['0%', '-20%'])

  return (
    /*
     * Outer scroll container — taller than viewport to provide scroll range.
     * Inner sticky panel stays fixed until user scrolls past the outer height.
     */
    <div
      ref={outerRef}
      id="hero"
      className="relative"
      style={{ height: '220vh' }}
    >
      {/* ── Sticky viewport panel ──────────────────────────────────────────── */}
      <motion.div
        className="sticky top-0 h-[100svh] w-full overflow-hidden"
        style={{
          opacity: overallOpacity,
          filter: overallBlur,
          scale: overallScale,
          willChange: 'transform, opacity, filter',
        }}
      >

        {/* ── LAYER 0: Background — misty mountains & sky ─────────────────── */}
        <motion.div
          className="absolute inset-[-8%]"
          style={{
            x: bgX,
            y: bgY,
            scale: bgScale,
            willChange: 'transform',
          }}
        >
          <img
            src="/images/jungle-bg.png"
            alt="Misty Sumatran jungle background"
            className="h-full w-full object-cover object-center"
            style={{ filter: 'brightness(0.72) saturate(1.1)' }}
          />
          {/* Dark vignette overlay */}
          <div className="absolute inset-0"
            style={{
              background: `
                radial-gradient(ellipse 100% 80% at 50% 50%, transparent 30%, oklch(0.13 0.022 175 / 55%) 100%),
                linear-gradient(to bottom, oklch(0.13 0.022 175 / 60%) 0%, transparent 30%, transparent 60%, oklch(0.13 0.022 175 / 80%) 100%)
              `,
            }}
          />
        </motion.div>

        {/* ── Drifting mist layers ─────────────────────────────────────────── */}
        <div className="pointer-events-none absolute inset-0 z-[5]">
          <MistLayer opacity={0.5} duration={45} yStart="55%" />
          <MistLayer opacity={0.3} duration={30} yStart="30%" />
        </div>

        {/* ── Falling leaves ────────────────────────────────────────────────── */}
        <div className="pointer-events-none absolute inset-0 z-[6]">
          <FallingLeaves count={5} />
        </div>

        {/* ── LAYER 1: Midground trees & atmosphere ────────────────────────── */}
        <motion.div
          className="pointer-events-none absolute inset-[-10%]"
          style={{
            x: midX,
            y: midY,
            scale: midScale,
            willChange: 'transform',
          }}
        >
          <img
            src="/images/jungle-foreground.png"
            alt=""
            className="absolute bottom-[-5%] left-[-5%] right-[-5%] w-[110%] object-contain object-bottom"
            style={{
              filter: 'brightness(0.8) saturate(1.15)',
              opacity: 0.75,
            }}
          />
        </motion.div>

        {/* ── LAYER 2: TYPOGRAPHY — partially hidden by foreground ─────────── */}
        <motion.div
          className="absolute inset-0 z-[50] flex flex-col items-center justify-center"
          style={{
            x: textX,
            y: textScrollY,
            opacity: textOpacity,
            willChange: 'transform, opacity',
          }}
        >
          {/* Eyebrow badge */}
          <motion.p
            initial={{ opacity: 0, letterSpacing: '0.2em', y: 20 }}
            animate={{ opacity: 1, letterSpacing: '0.45em', y: 0 }}
            transition={{ duration: 1.4, delay: 0.3 }}
            className="mb-6 text-[11px] font-medium uppercase text-primary/80 md:text-[13px]"
          >
            Sustainable Ecotourism · Sumatra
          </motion.p>

          {/* Hero title — massively oversized */}
          <motion.h1
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              duration: 1.6,
              delay: 0.5,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="select-none text-center font-serif leading-none tracking-tight text-white mix-blend-luminosity"
            style={{
              fontSize: 'clamp(5.5rem, 16vw, 15rem)',
              textShadow: '0 4px 80px oklch(0.13 0.022 175 / 60%)',
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
            className="mt-6 max-w-[480px] text-center text-sm leading-relaxed text-white/55 md:text-base"
          >
            Step through the mist and into the living heart of the wild jungle.
            A journey measured not in miles, but in moments.
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
              className="group flex items-center gap-3 rounded-full border px-7 py-3.5 text-[11px] font-medium uppercase tracking-[0.25em] text-white/80 transition-all duration-300 hover:bg-white/8 hover:text-white"
              style={{ borderColor: 'oklch(0.82 0.14 85 / 35%)' }}
            >
              Explore Destinations
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.4, repeat: Infinity }}
              >
                →
              </motion.span>
            </a>
          </motion.div>
        </motion.div>

        {/* ── LAYER 3: Wildlife — eagle ─────────────────────────────────────── */}
        <motion.div
          className="pointer-events-none absolute z-[20]"
          style={{
            top: '8%',
            right: '6%',
            width: 'clamp(180px, 25vw, 380px)',
            x: eagleX,
            y: eagleScrollY,
            willChange: 'transform',
          }}
          initial={{ opacity: 0, scale: 0.85, x: 40 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 2, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Subtle flight motion */}
          <motion.div
            animate={{
              y: [0, -14, 0],
              rotate: [-1, 1.5, -1],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <img
              src="/images/jungle-eagle.png"
              alt="Sumatran eagle soaring"
              className="h-auto w-full drop-shadow-2xl"
              style={{
                filter: 'brightness(1.05) saturate(0.9) drop-shadow(0 0 24px oklch(0.78 0.14 195 / 50%))',
                willChange: 'transform',
              }}
            />
          </motion.div>
        </motion.div>

        {/* ── LAYER 4: Foreground — hanging vines (overlaps text) ───────────── */}
        <motion.div
          className="pointer-events-none absolute z-[30]"
          style={{
            top: '-5%',
            left: '-3%',
            width: 'clamp(240px, 38vw, 560px)',
            x: fgX,
            y: fgY,
            scale: fgScale,
            transformOrigin: 'top left',
            willChange: 'transform',
          }}
          initial={{ opacity: 0, x: -40, y: -20 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          transition={{ duration: 1.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <img
            src="/images/jungle-foreground.png"
            alt=""
            className="h-auto w-full object-contain object-top"
            style={{
              filter: 'brightness(0.88) saturate(1.2)',
              willChange: 'transform',
            }}
          />
        </motion.div>

        {/* ── Tiger (lower right, partially hidden) ─────────────────────────── */}
        <motion.div
          className="pointer-events-none absolute z-[25]"
          style={{
            bottom: '-2%',
            right: '-2%',
            width: 'clamp(200px, 28vw, 420px)',
            x: tigerX,
            y: tigerY,
            willChange: 'transform',
          }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2.2, delay: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <img
            src="/images/sumatran-tiger.png"
            alt="Sumatran tiger emerging from the undergrowth"
            className="h-auto w-full object-contain object-bottom"
            style={{
              filter: 'brightness(0.75) saturate(1.1)',
              maskImage: 'linear-gradient(to top, transparent 0%, oklch(0 0 0) 30%)',
              WebkitMaskImage: 'linear-gradient(to top, transparent 0%, black 30%)',
              willChange: 'transform',
            }}
          />
        </motion.div>

        {/* ── Atmospheric overlay (depth haze) ─────────────────────────────── */}
        <div
          className="pointer-events-none absolute inset-0 z-[28]"
          style={{
            background: 'linear-gradient(to top, oklch(0.13 0.022 175 / 70%) 0%, transparent 40%)',
          }}
        />

        {/* ── Fireflies ─────────────────────────────────────────────────────── */}
        <div className="pointer-events-none absolute inset-0 z-[32]">
          <Fireflies count={26} />
        </div>

        {/* ── Scan-line cinematic bars ──────────────────────────────────────── */}
        <div className="pointer-events-none absolute inset-0 z-[40]">
          <div className="absolute inset-x-0 bottom-0 h-10 bg-[#050505]/90" />
        </div>

        {/* ── Navbar slot (top UI) ──────────────────────────────────────────── */}
        {/* Navbar is rendered globally above, so we just ensure the content sits below it */}

        {/* ── Bottom UI: Scroll indicator ───────────────────────────────────── */}
        <motion.div
          className="absolute bottom-14 inset-x-0 z-[45] flex justify-center"
          style={{
            opacity: textOpacity,
          }}
        >
          <ScrollIndicator />
        </motion.div>

        {/* ── Hotspot pins removed for a cleaner hero focus ─────────────────── */}

      </motion.div>
    </div>
  )
}
