'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useLanguage } from '@/components/language-context'
import { FadingVideo } from './fading-video'

const stats = [
  { value: '2.6M', label: 'Hectares of protected Leuser rainforest' },
  { value: '92%', label: 'Of trip revenue stays with local communities' },
  { value: 'ZERO', label: 'Single-use plastics allowed on treks' },
]

const STATS_TRANSLATIONS: Record<string, Record<'id' | 'en', string>> = {
  'Hectares of protected Leuser rainforest': {
    id: 'Hektar hutan hujan Leuser yang dilindungi',
    en: 'Hectares of protected Leuser rainforest'
  },
  'Of trip revenue stays with local communities': {
    id: 'Dari pendapatan perjalanan disalurkan ke komunitas lokal',
    en: 'Of trip revenue stays with local communities'
  },
  'Single-use plastics allowed on treks': {
    id: 'Plastik sekali pakai yang diizinkan dalam perjalanan',
    en: 'Single-use plastics allowed on treks'
  }
}


export function Expedition() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.25, 1])
  const bgY = useTransform(scrollYProgress, [0, 1], ['-10%', '10%'])
  const { lang } = useLanguage()

  const displayStats = stats.map((s) => {
    return {
      ...s,
      label: STATS_TRANSLATIONS[s.label]?.[lang] || s.label
    }
  })

  return (
    <section
      ref={ref}
      className="relative overflow-hidden"
      aria-label="Join an expedition"
    >
      <div className="absolute inset-0">
        <motion.div
          style={{ scale: bgScale, y: bgY }}
          className="h-full w-full"
        >
          <FadingVideo
            src="/videos/lake-toba.mp4"
            className="h-full w-full object-cover"
          />
        </motion.div>
        <div className="absolute inset-0 bg-background/60" />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-background to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="relative mx-auto flex max-w-4xl flex-col items-center px-6 py-32 text-center md:py-48">
        <motion.h2
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1.1 }}
          className="font-serif text-5xl font-medium leading-tight text-foreground md:text-7xl text-balance"
        >
          {lang === 'id' ? 'Hutan sedang menunggumu' : 'The forest is waiting'}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1, delay: 0.2 }}
          className="mt-6 max-w-xl leading-relaxed text-muted-foreground text-pretty"
        >
          {lang === 'id' 
            ? 'Grup kecil. Pemandu lokal. Ekspedisi 3–14 hari, dirancang agar hutan mendapat manfaat lebih besar dari kunjunganmu.'
            : 'Small groups. Local guides. Expeditions from three to fourteen days, designed so the jungle gains more from your visit than you take from it.'
          }
        </motion.p>
        <motion.a
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 1, delay: 0.35 }}
          href="#packages"
          className="mt-10 inline-flex items-center gap-3 rounded-full bg-primary px-8 py-4 text-sm font-medium uppercase tracking-[0.2em] text-primary-foreground transition-transform hover:scale-105"
        >
          {lang === 'id' ? 'Mulai Ekspedisi' : 'Begin your expedition'}
        </motion.a>

        <div className="mt-24 grid w-full grid-cols-1 gap-10 border-t border-border pt-12 sm:grid-cols-3">
          {displayStats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.8, delay: i * 0.15 }}
              className="flex flex-col items-center gap-2"
            >
              <span className="font-serif text-5xl text-primary">{s.value}</span>
              <span className="max-w-[220px] text-xs leading-relaxed text-muted-foreground">
                {s.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
