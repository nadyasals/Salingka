'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { FiShield, FiUsers } from 'react-icons/fi'
import { IoLeaf } from 'react-icons/io5'
import { GiFeather } from 'react-icons/gi'
import { useLanguage } from '@/components/language-context'

// All stats sourced from: WWF Indonesia, IUCN Red List, UNESCO World Heritage, Leuser Conservation Forum
const pillars = [
  {
    icon: (
      <FiShield className="h-8 w-8" />
    ),
    title: 'Critically Endangered Species',
    body: 'Sumatra is home to 4 critically endangered mega-fauna: the Sumatran tiger (~400 wild), orangutan (~13,800), rhino (~47), and elephant (~1,700). Your visit funds their protection. (Source: IUCN Red List 2024)',
    stat: '4',
    statSuffix: '',
    statLabel: 'IUCN Critically Endangered species',
    color: '#4ade80',
    pct: 80,
  },
  {
    icon: (
      <FiUsers className="h-8 w-8" />
    ),
    title: 'Communities Supported',
    body: 'The Leuser Ecosystem sustains over 4 million people across Aceh and North Sumatra — providing clean water, flood control, and livelihoods. Eco-tourism directly channels income back to local guides and villages. (Source: Leuser Conservation Forum)',
    stat: '4M',
    statSuffix: '+',
    statLabel: 'People sustained by Leuser',
    color: '#f59e0b',
    pct: 92,
  },
  {
    icon: (
      <IoLeaf className="h-8 w-8" />
    ),
    title: 'Plant Species in Sumatra',
    body: 'The Tropical Rainforest Heritage of Sumatra hosts over 10,000 plant species, including 17 endemic genera. It is among the most biodiverse forest ecosystems in Southeast Asia. (Source: UNESCO / IUCN 2024)',
    stat: '10K',
    statSuffix: '+',
    statLabel: 'Plant species (UNESCO verified)',
    color: '#22d3ee',
    pct: 75,
  },
  {
    icon: (
      <GiFeather className="h-8 w-8" />
    ),
    title: 'Bird Species Recorded',
    body: 'The Sumatra rainforest records 580 bird species — 465 resident and 21 endemic. Recognised as a global Important Bird Area and critical flyway for migratory species. (Source: UNESCO World Heritage IUCN Evaluation)',
    stat: '580',
    statSuffix: '',
    statLabel: 'Bird species (21 endemic)',
    color: '#a3e635',
    pct: 70,
  },
]

// Bottom bar — all figures from verified sources
const extraStats = [
  { value: '2.6M', label: 'Leuser Ecosystem hectares (UNESCO Biosphere)' },
  { value: '580', label: 'Bird species, 21 endemic (UNESCO / IUCN)' },
  { value: '200+', label: 'Mammal species in Sumatra rainforest' },
  { value: '~400', label: 'Sumatran tigers left in the wild (IUCN 2024)' },
]

const PILLARS_TRANSLATIONS: Record<string, Record<'id' | 'en', { title: string; body: string; statLabel: string }>> = {
  'Critically Endangered Species': {
    id: {
      title: 'Spesies yang Nyaris Punah',
      body: 'Sumatra jadi rumah bagi 4 megafauna yang nyaris punah: harimau sumatra (~400 ekor), orangutan (~13.800), badak (~47), dan gajah (~1.700). Setiap kunjunganmu ikut mendanai perlindungan mereka. (Sumber: Daftar Merah IUCN 2024)',
      statLabel: 'Spesies Kritis IUCN'
    },
    en: {
      title: 'Critically Endangered Species',
      body: 'Sumatra is home to 4 critically endangered mega-fauna: the Sumatran tiger (~400 wild), orangutan (~13,800), rhino (~47), and elephant (~1,700). Your visit funds their protection. (Source: IUCN Red List 2024)',
      statLabel: 'IUCN Critically Endangered species'
    }
  },
  'Communities Supported': {
    id: {
      title: 'Komunitas Lokal yang Terbantu',
      body: 'Ekosistem Leuser menghidupi lebih dari 4 juta orang di Aceh dan Sumatra Utara — lewat air bersih, perlindungan banjir, dan mata pencaharian. Ekowisata menyalurkan pendapatan langsung ke pemandu dan warga desa setempat. (Sumber: Forum Konservasi Leuser)',
      statLabel: 'Warga yang dihidupi Leuser'
    },
    en: {
      title: 'Communities Supported',
      body: 'The Leuser Ecosystem sustains over 4 million people across Aceh and North Sumatra — providing clean water, flood control, and livelihoods. Eco-tourism directly channels income back to local guides and villages. (Source: Leuser Conservation Forum)',
      statLabel: 'People sustained by Leuser'
    }
  },
  'Plant Species in Sumatra': {
    id: {
      title: 'Keanekaragaman Tumbuhan Sumatra',
      body: 'Warisan Hutan Hujan Tropis Sumatra menyimpan lebih dari 10.000 spesies tumbuhan, termasuk 17 genus endemik. Hutan ini jadi salah satu ekosistem paling kaya hayati di Asia Tenggara. (Sumber: UNESCO / IUCN 2024)',
      statLabel: 'Spesies tumbuhan (terverifikasi UNESCO)'
    },
    en: {
      title: 'Plant Species in Sumatra',
      body: 'The Tropical Rainforest Heritage of Sumatra hosts over 10,000 plant species, including 17 endemic genera. It is among the most biodiverse forest ecosystems in Southeast Asia. (Source: UNESCO / IUCN 2024)',
      statLabel: 'Plant species (UNESCO verified)'
    }
  },
  'Bird Species Recorded': {
    id: {
      title: 'Ragam Burung yang Terekam',
      body: 'Hutan hujan Sumatra mencatat 580 spesies burung — 465 spesies menetap dan 21 endemik. Diakui sebagai Kawasan Penting Burung global dan jalur migrasi yang tak tergantikan. (Sumber: Evaluasi IUCN Warisan Dunia UNESCO)',
      statLabel: 'Spesies burung (21 endemik)'
    },
    en: {
      title: 'Bird Species Recorded',
      body: 'The Sumatra rainforest records 580 bird species — 465 resident and 21 endemic. Recognised as a global Important Bird Area and critical flyway for migratory species. (Source: UNESCO World Heritage IUCN Evaluation)',
      statLabel: 'Bird species (21 endemic)'
    }
  }
}

const EXTRA_STATS_TRANSLATIONS: Record<string, Record<'id' | 'en', string>> = {
  'Leuser Ecosystem hectares (UNESCO Biosphere)': {
    id: 'Hektar Ekosistem Leuser (Biosfer UNESCO)',
    en: 'Leuser Ecosystem hectares (UNESCO Biosphere)'
  },
  'Bird species, 21 endemic (UNESCO / IUCN)': {
    id: 'Spesies burung, 21 endemik (UNESCO / IUCN)',
    en: 'Bird species, 21 endemic (UNESCO / IUCN)'
  },
  'Mammal species in Sumatra rainforest': {
    id: 'Spesies mamalia di hutan hujan Sumatra',
    en: 'Mammal species in Sumatra rainforest'
  },
  'Sumatran tigers left in the wild (IUCN 2024)': {
    id: 'Harimau sumatra tersisa di alam liar (IUCN 2024)',
    en: 'Sumatran tigers left in the wild (IUCN 2024)'
  }
}


// SVG circular progress ring
function RingProgress({ pct, color, size = 72 }: { pct: number; color: string; size?: number }) {
  const r = (size - 8) / 2
  const circ = 2 * Math.PI * r
  const dash = (pct / 100) * circ
  return (
    <svg width={size} height={size} className="absolute inset-0 m-auto" style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeOpacity={0.12} strokeWidth={3} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke={color} strokeOpacity={0.7} strokeWidth={3}
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
      />
    </svg>
  )
}

function AnimatedCounter({ target, suffix, inView }: { target: string; suffix: string; inView: boolean }) {
  const ref = useRef<HTMLSpanElement>(null)
  const [displayed, setDisplayed] = useState(target.match(/^\d+$/) ? '0' : target)

  useEffect(() => {
    if (!inView) return
    const numeric = parseInt(target, 10)
    // If not a plain integer (e.g. '4M', '10K', '~400'), show as-is immediately
    if (isNaN(numeric) || target !== String(numeric)) {
      setDisplayed(target)
      return
    }
    const duration = 1600
    const start = performance.now()
    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayed(Math.round(eased * numeric).toString())
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [inView, target])

  return <span ref={ref}>{displayed}{suffix}</span>
}

export function EcoImpact() {
  const sectionRef = useRef<HTMLElement>(null)
  const inView = useInView(sectionRef, { once: true, margin: '-80px' })
  const { lang } = useLanguage()

  // Localized pillars
  const displayPillars = pillars.map((p) => {
    const trans = PILLARS_TRANSLATIONS[p.title]?.[lang] || {}
    return {
      ...p,
      title: trans.title || p.title,
      body: trans.body || p.body,
      statLabel: trans.statLabel || p.statLabel
    }
  })

  // Localized extra stats
  const displayExtraStats = extraStats.map((s) => {
    return {
      ...s,
      label: EXTRA_STATS_TRANSLATIONS[s.label]?.[lang] || s.label
    }
  })

  return (
    <section
      id="impact"
      ref={sectionRef}
      className="relative overflow-hidden py-28 md:py-40"
      aria-label="Our sustainable impact"
    >
      {/* Atmospheric background glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-1/4 h-[500px] w-[500px] rounded-full blur-[140px]"
          style={{ background: 'oklch(0.30 0.09 155 / 0.10)' }} />
        <div className="absolute right-0 bottom-1/4 h-[500px] w-[500px] rounded-full blur-[140px]"
          style={{ background: 'oklch(0.38 0.07 190 / 0.08)' }} />
      </div>

      {/* Subtle grid */}
      <div className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          backgroundImage: 'linear-gradient(oklch(0.78 0.14 195 / 5%) 1px, transparent 1px), linear-gradient(90deg, oklch(0.78 0.14 195 / 5%) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 md:px-10">
        {/* Header */}
        <div className="mb-16 text-center md:mb-24">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            className="liquid-glass mb-6 inline-block rounded-full px-4 py-1.5 text-[10px] uppercase tracking-[0.4em]"
            style={{ color: 'oklch(0.82 0.14 85)' }}
          >
            {lang === 'id' ? 'Komitmen Kami' : 'Our Commitment'}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="font-serif text-4xl font-medium leading-tight text-foreground md:text-6xl"
          >
            {lang === 'id' ? (
              <>
                Perjalanan yang{' '}
                <span style={{
                  background: 'linear-gradient(135deg, oklch(0.82 0.14 85) 0%, oklch(0.78 0.14 195) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  memberi lebih banyak
                </span>
                <br />dari yang diambil
              </>
            ) : (
              <>
                Travel that{' '}
                <span style={{
                  background: 'linear-gradient(135deg, oklch(0.82 0.14 85) 0%, oklch(0.78 0.14 195) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>
                  gives back
                </span>
                <br />more than it takes
              </>
            )}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="mt-6 mx-auto max-w-xl text-sm leading-relaxed text-muted-foreground"
          >
            {lang === 'id' 
              ? 'Setiap ekspedisi Salingka dibangun di atas satu prinsip: wisata berkelanjutan bukan sebuah kompromi — ini satu-satunya cara bepergian yang benar.'
              : "Every Salingka expedition is designed from the ground up around one principle: sustainable tourism is not a compromise — it's the only way to travel."
            }
          </motion.p>
        </div>

        {/* Pillar Cards — 4-col with liquid glass + progress ring */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {displayPillars.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.15 + i * 0.1 }}
              className="liquid-glass group relative cursor-default rounded-2xl p-7 transition-all duration-500 hover:scale-[1.02]"
              style={{
                boxShadow: `0 0 0 1px ${p.color}15, inset 0 1px 0 ${p.color}20`,
              }}
            >
              {/* Top colour shimmer */}
              <div className="absolute inset-x-0 top-0 h-px rounded-t-2xl"
                style={{ background: `linear-gradient(90deg, transparent, ${p.color}60, transparent)` }}
              />

              {/* Stat + ring in a circle layout */}
              <div className="relative mb-6 flex h-[72px] w-[72px] items-center justify-center">
                {inView && <RingProgress pct={p.stat === '0' ? 100 : p.pct} color={p.color} size={72} />}
                <div className="relative z-10 flex flex-col items-center" style={{ color: p.color }}>
                  {p.icon}
                </div>
              </div>

              <p className="font-serif text-4xl font-medium mb-0.5" style={{ color: p.color }}>
                <AnimatedCounter target={p.stat} suffix={p.statSuffix} inView={inView} />
              </p>
              <p className="text-[9px] uppercase tracking-[0.28em] text-muted-foreground mb-4">
                {p.statLabel}
              </p>
              <h3 className="text-sm font-semibold text-foreground mb-2">{p.title}</h3>
              <p className="text-xs leading-relaxed text-muted-foreground">{p.body}</p>

              {/* Bottom reveal line on hover */}
              <div className="absolute bottom-0 inset-x-0 h-px scale-x-0 rounded-b-2xl transition-transform duration-500 group-hover:scale-x-100"
                style={{ background: `linear-gradient(90deg, transparent, ${p.color}50, transparent)` }}
              />
            </motion.div>
          ))}
        </div>

        {/* Stats bar — liquid glass */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.65 }}
          className="liquid-glass mt-10 grid grid-cols-2 gap-8 rounded-2xl p-8 text-center md:grid-cols-4"
        >
          {displayExtraStats.map((s, i) => (
            <div key={s.label} className="flex flex-col items-center gap-2">
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.7 + i * 0.08 }}
                className="font-serif text-3xl text-primary md:text-4xl"
              >
                {s.value}
              </motion.span>
              <span className="max-w-[120px] text-center text-[10px] uppercase leading-tight tracking-[0.2em] text-muted-foreground">
                {s.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
