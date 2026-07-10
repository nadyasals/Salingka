'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { IoLeaf } from 'react-icons/io5'
import { FiSun, FiMoon, FiArrowRight, FiVolume2, FiVolumeX } from 'react-icons/fi'
import { useLanguage } from '@/components/language-context'
import { useTheme } from '@/components/theme-context'

type NavbarProps = {
  floating?: boolean
}

export function Navbar({ floating = false }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [audioPlaying, setAudioPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const fadeRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const { lang, toggleLang } = useLanguage()
  const { theme, toggleTheme } = useTheme()

  // Initialise audio element once on client
  useEffect(() => {
    const audio = new Audio('/audio/ambient-forest.mp3')
    audio.loop = true
    audio.volume = 0
    audioRef.current = audio
    return () => {
      audio.pause()
      audio.src = ''
    }
  }, [])

  const fadeTo = (target: number, onDone?: () => void) => {
    const audio = audioRef.current
    if (!audio) return
    if (fadeRef.current) clearInterval(fadeRef.current)
    const step = target > audio.volume ? 0.01 : -0.01
    fadeRef.current = setInterval(() => {
      if (!audioRef.current) return
      const next = Math.min(Math.max(audioRef.current.volume + step, 0), 0.22)
      audioRef.current.volume = next
      if ((step > 0 && next >= target) || (step < 0 && next <= target)) {
        clearInterval(fadeRef.current!)
        onDone?.()
      }
    }, 40)
  }

  const toggleAudio = () => {
    const audio = audioRef.current
    if (!audio) return
    if (audioPlaying) {
      fadeTo(0, () => audio.pause())
      setAudioPlaying(false)
    } else {
      audio.play().then(() => fadeTo(0.22))
      setAudioPlaying(true)
    }
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navLinks = [
    { href: '#orbital', label: lang === 'id' ? 'Destinasi' : 'Explore' },
    { href: '#journey', label: lang === 'id' ? 'Cerita' : 'Journey' },
    { href: '#impact', label: lang === 'id' ? 'Dampak' : 'Impact' },
    { href: '#packages', label: lang === 'id' ? 'Paket' : 'Packages' },
  ]

  const isFloating = floating || scrolled

  if (floating && !scrolled) {
    return null
  }

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={`z-[60] transition-all duration-500 ${
          floating
            ? 'fixed left-1/2 top-6 w-[min(96vw,1120px)] -translate-x-1/2 py-0 flex items-center gap-3'
            : 'fixed left-0 right-0 top-0 py-5'
        } ${isFloating ? '' : 'bg-transparent'}`}
      >
        <div
          className={`flex items-center justify-between ${
            floating
              ? 'liquid-glass-strong flex-1 rounded-full px-5 py-3 shadow-2xl shadow-black/30'
              : 'mx-auto max-w-7xl px-6 md:px-10 w-full'
          }`}
        >
          <a href="#" className="group flex items-center gap-3" aria-label="Salingka Home">
            <span
              className="relative flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300 group-hover:scale-105"
              style={{ background: 'oklch(0.82 0.14 85 / 15%)' }}
            >
              <IoLeaf className="h-4.5 w-4.5 text-primary transition-transform duration-500 group-hover:rotate-12" style={{ color: 'oklch(0.82 0.14 85)' }} />
            </span>
            <span className="font-serif text-xl tracking-wide text-foreground transition-colors group-hover:text-primary">
              Salingka
            </span>
          </a>

          <nav className="hidden items-center gap-6 lg:gap-8 md:flex" aria-label="Main navigation">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="group relative text-[11px] uppercase tracking-[0.25em] text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 h-px w-0 bg-primary transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <a
              href="#packages"
              className="hidden items-center gap-2.5 rounded-full px-5 py-2 text-[11px] font-medium uppercase tracking-[0.2em] transition-all md:inline-flex"
              style={{
                border: '1px solid oklch(0.82 0.14 85 / 40%)',
                background: 'oklch(0.82 0.14 85 / 10%)',
                color: 'oklch(0.82 0.14 85)',
              }}
              onMouseEnter={(event) => {
                const element = event.currentTarget as HTMLElement
                element.style.background = 'oklch(0.82 0.14 85)'
                element.style.color = 'oklch(0.15 0.05 85)'
              }}
              onMouseLeave={(event) => {
                const element = event.currentTarget as HTMLElement
                element.style.background = 'oklch(0.82 0.14 85 / 10%)'
                element.style.color = 'oklch(0.82 0.14 85)'
              }}
            >
              {lang === 'id' ? 'Pesan Sekarang' : 'Book a Journey'}
              <FiArrowRight className="h-3.5 w-3.5" />
            </a>

            <button
              id="mobile-menu-btn"
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex flex-col gap-1.5 p-2 md:hidden"
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              <span className={`block h-px w-6 bg-foreground/70 transition-all duration-300 ${menuOpen ? 'translate-y-2.5 rotate-45' : ''}`} />
              <span className={`block h-px w-6 bg-foreground/70 transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`block h-px w-6 bg-foreground/70 transition-all duration-300 ${menuOpen ? '-translate-y-2.5 -rotate-45' : ''}`} />
            </button>
          </div>
        </div>

        {/* Elegant Utilities Capsule (Language & Theme Toggle) */}
        {floating && (
          <div className="hidden md:flex items-center gap-3 liquid-glass-strong rounded-full px-4 py-2.5 shadow-2xl shadow-black/30 border border-white/10 shrink-0">
            {/* Language Switcher */}
            <button
              onClick={toggleLang}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-mono tracking-wider rounded-full border border-white/10 bg-white/[0.02] hover:bg-white/[0.06] text-white transition-all cursor-pointer"
              aria-label="Switch Language"
            >
              <span className={lang === 'id' ? 'text-emerald-400 font-bold' : 'text-white/40'}>ID</span>
              <span className="text-white/20">|</span>
              <span className={lang === 'en' ? 'text-emerald-400 font-bold' : 'text-white/40'}>EN</span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center h-8 w-8 rounded-full border border-white/10 bg-white/[0.02] hover:bg-white/[0.06] text-white transition-all cursor-pointer"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <FiSun className="h-4 w-4 text-amber-400 animate-[spin_10s_linear_infinite]" />
              ) : (
                <FiMoon className="h-4 w-4 text-emerald-600" />
              )}
            </button>

            {/* Audio Toggle */}
            <button
              onClick={toggleAudio}
              className="flex items-center justify-center h-8 w-8 rounded-full border border-white/10 bg-white/[0.02] hover:bg-white/[0.06] transition-all cursor-pointer relative"
              aria-label={audioPlaying ? 'Mute ambient sound' : 'Play ambient sound'}
            >
              {audioPlaying ? (
                <FiVolume2 className="h-4 w-4 text-emerald-400" />
              ) : (
                <FiVolumeX className="h-4 w-4 text-white/50" />
              )}
              {/* Pulse ring when playing */}
              {audioPlaying && (
                <span className="absolute inset-0 rounded-full animate-ping border border-emerald-400/30" />
              )}
            </button>
          </div>
        )}
      </motion.header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 200 }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-8 md:hidden backdrop-blur-2xl"
            style={{ 
              background: theme === 'dark' 
                ? 'oklch(0.13 0.022 175 / 95%)' 
                : 'oklch(0.95 0.02 105 / 95%)'
            }}
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="font-serif text-4xl text-foreground transition-colors hover:text-primary"
              >
                {link.label}
              </a>
            ))}

            {/* Mobile language & theme switcher row */}
            <div className="mt-2 flex items-center gap-3">
              {/* Language switcher */}
              <button
                onClick={() => {
                  toggleLang()
                  setMenuOpen(false)
                }}
                className={`flex items-center gap-2 px-5 py-2.5 text-xs font-mono tracking-widest rounded-full border transition-all cursor-pointer ${
                  theme === 'dark'
                    ? 'border-white/10 bg-white/[0.04] text-white'
                    : 'border-foreground/10 bg-foreground/[0.04] text-foreground'
                }`}
              >
                <span className={lang === 'id' ? 'text-emerald-400 font-bold' : theme === 'dark' ? 'text-white/40' : 'text-foreground/40'}>ID</span>
                <span className={theme === 'dark' ? 'text-white/20' : 'text-foreground/20'}>|</span>
                <span className={lang === 'en' ? 'text-emerald-400 font-bold' : theme === 'dark' ? 'text-white/40' : 'text-foreground/40'}>EN</span>
              </button>

              {/* Theme Toggle */}
              <button
                onClick={() => {
                  toggleTheme()
                  setMenuOpen(false)
                }}
                className={`flex items-center justify-center h-10 w-10 rounded-full border transition-all cursor-pointer ${
                  theme === 'dark'
                    ? 'border-white/10 bg-white/[0.04] text-white'
                    : 'border-foreground/10 bg-foreground/[0.04] text-foreground'
                }`}
                aria-label="Toggle Theme"
              >
                {theme === 'dark' ? (
                  <FiSun className="h-4 w-4 text-amber-400" />
                ) : (
                  <FiMoon className="h-4 w-4 text-emerald-600" />
                )}
              </button>

              {/* Audio Toggle — mobile */}
              <button
                onClick={toggleAudio}
                className={`relative flex items-center justify-center h-10 w-10 rounded-full border transition-all cursor-pointer ${
                  theme === 'dark'
                    ? 'border-white/10 bg-white/[0.04]'
                    : 'border-foreground/10 bg-foreground/[0.04]'
                }`}
                aria-label={audioPlaying ? 'Mute ambient sound' : 'Play ambient sound'}
              >
                {audioPlaying ? (
                  <FiVolume2 className="h-4 w-4 text-emerald-400" />
                ) : (
                  <FiVolumeX className={`h-4 w-4 ${theme === 'dark' ? 'text-white/50' : 'text-foreground/50'}`} />
                )}
                {audioPlaying && (
                  <span className="absolute inset-0 rounded-full animate-ping border border-emerald-400/30" />
                )}
              </button>
            </div>

            <a
              href="#packages"
              onClick={() => setMenuOpen(false)}
              className="mt-4 inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-medium uppercase tracking-[0.2em] text-primary-foreground"
              style={{ background: 'oklch(0.82 0.14 85)' }}
            >
              {lang === 'id' ? 'Pesan Sekarang' : 'Book a Journey'}
              <FiArrowRight className="h-4 w-4" />
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
