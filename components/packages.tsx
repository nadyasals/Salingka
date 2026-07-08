'use client'

import { useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { IoLeaf, IoLeafOutline } from 'react-icons/io5'
import { FiCheck, FiArrowRight, FiX, FiMinus, FiPlus, FiCalendar, FiUser, FiMail, FiUsers, FiAward, FiShield } from 'react-icons/fi'
import { useLanguage } from '@/components/language-context'

interface PackageData {
  id: string
  tier: string
  days: string
  tagline: string
  price: string
  numericPrice: number
  highlights: string[]
  ecoRating: number
  badge: string | null
  accentColor: string
  accentAlpha: string
  bgImage: string
  featured: boolean
}

const packages: PackageData[] = [
  {
    id: 'explorer',
    tier: 'Explorer',
    days: '3 Days',
    tagline: 'Your first step into the canopy',
    price: 'IDR 4,800,000',
    numericPrice: 4800000,
    highlights: [
      'Gunung Leuser forest trek',
      'Orangutan observation at dawn',
      'Village homestay (2 nights)',
      'All meals · local cuisine',
      'Expert naturalist guide',
    ],
    ecoRating: 4,
    badge: null,
    accentColor: '#4ade80',
    accentAlpha: 'rgba(74,222,128,0.18)',
    bgImage: '/images/trekking-gunung-leuser.jpg',
    featured: false,
  },
  {
    id: 'ranger',
    tier: 'Ranger',
    days: '7 Days',
    tagline: 'Deep forest immersion',
    price: 'IDR 9,600,000',
    numericPrice: 9600000,
    highlights: [
      'Everything in Explorer',
      'Tiger corridor night trek',
      'Alas River rafting (2 days)',
      'Camera trap monitoring',
      'Ranger station overnight',
      'Carbon offset certificate',
    ],
    ecoRating: 5,
    badge: 'Most Popular',
    accentColor: 'oklch(0.82 0.14 85)',
    accentAlpha: 'oklch(0.82 0.14 85 / 20%)',
    bgImage: '/images/sungai-alas.jpg',
    featured: true,
  },
  {
    id: 'expedition',
    tier: 'Expedition',
    days: '14 Days',
    tagline: 'The full wild Sumatra odyssey',
    price: 'IDR 18,500,000',
    numericPrice: 18500000,
    highlights: [
      'Everything in Ranger',
      'Cross Leuser to Sinabung',
      'Sea turtle nesting site',
      'Coastal mangrove restoration',
      'Private research base camp',
      'Personalized impact report',
    ],
    ecoRating: 5,
    badge: 'Premium',
    accentColor: '#22d3ee',
    accentAlpha: 'rgba(34,211,238,0.18)',
    bgImage: '/images/hutan-mangrove-sumatera.jpg',
    featured: false,
  },
]

const PACKAGES_TRANSLATIONS: Record<string, Record<'id' | 'en', { tier: string; days: string; tagline: string; highlights: string[]; badge: string | null }>> = {
  explorer: {
    id: {
      tier: 'Penjelajah',
      days: '3 Hari',
      tagline: 'Langkah pertamamu masuk ke kanopi',
      highlights: [
        'Trekking hutan Gunung Leuser',
        'Pengamatan orangutan di fajar hari',
        'Menginap di homestay desa (2 malam)',
        'Semua makanan · masakan lokal',
        'Pemandu naturalis berpengalaman',
      ],
      badge: null
    },
    en: {
      tier: 'Explorer',
      days: '3 Days',
      tagline: 'Your first step into the canopy',
      highlights: [
        'Gunung Leuser forest trek',
        'Orangutan observation at dawn',
        'Village homestay (2 nights)',
        'All meals · local cuisine',
        'Expert naturalist guide',
      ],
      badge: null
    }
  },
  ranger: {
    id: {
      tier: 'Ranger',
      days: '7 Hari',
      tagline: 'Imersi dalam hutan yang dalam',
      highlights: [
        'Sudah termasuk semua di Penjelajah',
        'Trekking malam di koridor harimau',
        'Rafting Sungai Alas (2 hari)',
        'Pemantauan kamera jebak',
        'Menginap di pos ranger',
        'Sertifikat penyeimbang karbon',
      ],
      badge: 'Paling Populer'
    },
    en: {
      tier: 'Ranger',
      days: '7 Days',
      tagline: 'Deep forest immersion',
      highlights: [
        'Everything in Explorer',
        'Tiger corridor night trek',
        'Alas River rafting (2 days)',
        'Camera trap monitoring',
        'Ranger station overnight',
        'Carbon offset certificate',
      ],
      badge: 'Most Popular'
    }
  },
  expedition: {
    id: {
      tier: 'Ekspedisi',
      days: '14 Hari',
      tagline: 'Perjalanan liar Sumatra sepenuhnya',
      highlights: [
        'Termasuk semua di Ranger',
        'Lintas Leuser ke Gunung Sinabung',
        'Situs penyu bertelur di pesisir',
        'Restorasi hutan mangrove pesisir',
        'Kamp penelitian privat',
        'Laporan dampak ekologis personal',
      ],
      badge: 'Premium'
    },
    en: {
      tier: 'Expedition',
      days: '14 Days',
      tagline: 'The full wild Sumatra odyssey',
      highlights: [
        'Everything in Ranger',
        'Cross Leuser to Sinabung',
        'Sea turtle nesting site',
        'Coastal mangrove restoration',
        'Private research base camp',
        'Personalized impact report',
      ],
      badge: 'Premium'
    }
  }
}


function EcoLeaf({ filled, color }: { filled: boolean; color: string }) {
  return filled ? (
    <IoLeaf className="h-3.5 w-3.5" style={{ color }} />
  ) : (
    <IoLeafOutline className="h-3.5 w-3.5 text-white/20" />
  )
}

export function Packages() {
  const ref = useRef<HTMLElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const { lang } = useLanguage()

  // Localize package options
  const displayPackages = packages.map((pkg) => {
    const trans = PACKAGES_TRANSLATIONS[pkg.id]?.[lang] || {}
    return {
      ...pkg,
      tier: trans.tier || pkg.tier,
      days: trans.days || pkg.days,
      tagline: trans.tagline || pkg.tagline,
      highlights: trans.highlights || pkg.highlights,
      badge: trans.badge !== undefined ? trans.badge : pkg.badge
    }
  })

  // Booking Simulation States
  const [bookingPkg, setBookingPkg] = useState<PackageData | null>(null)
  const [travelers, setTravelers] = useState(1)
  const [travelDate, setTravelDate] = useState('')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [bookingId, setBookingId] = useState('')
  // Promo code — purely client-side React state, no DB/localStorage
  const [promoCode, setPromoCode] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)
  const [promoError, setPromoError] = useState(false)
  const VALID_PROMO = 'LEUSERGREEN'

  const handleOpenBooking = (pkg: PackageData) => {
    setBookingPkg(pkg)
    setTravelers(1)
    setTravelDate('')
    setFullName('')
    setEmail('')
    setIsSuccess(false)
    setPromoCode('')
    setPromoApplied(false)
    setPromoError(false)
  }

  const handleCloseBooking = () => {
    setBookingPkg(null)
  }

  const handleApplyPromo = () => {
    if (promoCode.trim().toUpperCase() === VALID_PROMO) {
      setPromoApplied(true)
      setPromoError(false)
    } else {
      setPromoError(true)
      setPromoApplied(false)
    }
  }

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault()
    if (!fullName || !email || !travelDate) return
    
    // Generate a beautiful mock booking ID
    const randomNum = Math.floor(1000 + Math.random() * 9000)
    const code = bookingPkg ? bookingPkg.tier.substring(0, 3).toUpperCase() : 'SLK'
    setBookingId(`SLK-${code}-${randomNum}`)
    setIsSuccess(true)
  }

  // Format IDR number back into standard format
  const formatIDR = (num: number) => {
    return 'IDR ' + num.toLocaleString('id-ID')
  }

  // Get tomorrow's date for date picker min limit
  const getTomorrowString = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  }

  return (
    <section
      id="packages"
      ref={ref}
      className="relative overflow-hidden py-28 md:py-40 bg-background"
      aria-label="Expedition packages"
    >
      {/* Atmospheric glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-0 h-[600px] w-[600px] rounded-full blur-[150px]"
          style={{ background: 'oklch(0.82 0.14 85 / 5%)' }} />
        <div className="absolute bottom-0 right-1/4 h-[400px] w-[400px] rounded-full blur-[120px]"
          style={{ background: 'oklch(0.38 0.07 190 / 6%)' }} />
      </div>

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
            {lang === 'id' ? 'Pilih Perjalanan Anda' : 'Choose Your Journey'}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="font-serif text-4xl font-medium leading-tight text-foreground md:text-6xl"
          >
            {lang === 'id' ? (
              <>
                Setiap ekspedisi
                <br />dimulai dengan satu langkah
              </>
            ) : (
              <>
                Every expedition
                <br />begins with a step
              </>
            )}
          </motion.h2>
        </div>

        {/* Grid cards */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {displayPackages.map((pkg, i) => {
            const isHovered = hoveredCard === pkg.id
            const isAnyHovered = hoveredCard !== null

            return (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 40 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: i * 0.15 }}
                onMouseEnter={() => setHoveredCard(pkg.id)}
                onMouseLeave={() => setHoveredCard(null)}
                className={`relative flex flex-col rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-8 transition-all duration-500 md:p-10 ${
                  pkg.featured ? 'md:-translate-y-4' : ''
                }`}
                style={{
                  boxShadow: pkg.featured
                    ? '0 20px 40px -15px rgba(0,0,0,0.7), 0 0 50px -10px oklch(0.82 0.14 85 / 15%)'
                    : 'none',
                  borderColor: pkg.featured ? 'oklch(0.82 0.14 85 / 30%)' : 'rgba(255,255,255,0.1)',
                  opacity: isAnyHovered && !isHovered ? 0.45 : 1,
                  transform: isHovered
                    ? `scale(1.025) ${pkg.featured ? 'translateY(-18px)' : 'translateY(-4px)'}`
                    : '',
                }}
              >
                {/* Background image preview on hover */}
                <div
                  className="absolute inset-0 z-0 rounded-3xl bg-cover bg-center opacity-0 transition-opacity duration-700 pointer-events-none"
                  style={{
                    backgroundImage: `url(${pkg.bgImage})`,
                    opacity: isHovered ? 0.08 : 0,
                  }}
                />

                <div className="relative z-10 flex flex-1 flex-col h-full">
                  {/* Badge */}
                  {pkg.badge && (
                    <div className="mb-6">
                      <span
                        className="rounded-full px-3.5 py-1 text-[9px] font-semibold uppercase tracking-[0.2em] shadow-sm"
                        style={{
                          background: pkg.featured ? 'oklch(0.82 0.14 85 / 15%)' : 'rgba(255,255,255,0.08)',
                          color: pkg.featured ? 'oklch(0.82 0.14 85)' : '#fff',
                          border: pkg.featured
                            ? '1px solid oklch(0.82 0.14 85 / 25%)'
                            : '1px solid rgba(255,255,255,0.15)',
                        }}
                      >
                        {pkg.badge}
                      </span>
                    </div>
                  )}

                  {/* Tier / Title info */}
                  <div className="mb-8">
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-[10px] font-mono tracking-widest text-white/40 uppercase mb-1">
                          {pkg.days}
                        </p>
                        <h3
                          className={`font-serif leading-none ${pkg.featured ? 'text-4xl' : 'text-3xl'} text-white`}
                        >
                          {pkg.tier}
                        </h3>
                      </div>
                      {/* Eco rating leaves */}
                      <div className="mt-1 flex gap-0.5">
                        {Array.from({ length: 5 }, (_, j) => (
                          <EcoLeaf
                            key={j}
                            filled={j < pkg.ecoRating}
                            color={pkg.featured ? 'oklch(0.82 0.14 85)' : (pkg.id === 'expedition' ? '#22d3ee' : '#4ade80')}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm italic text-white/70 mt-3">{pkg.tagline}</p>
                  </div>

                  {/* Highlights list */}
                  <ul className={`flex flex-1 flex-col gap-3 ${pkg.featured ? 'mb-10' : 'mb-8'}`}>
                    {pkg.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-3 text-sm text-white/80">
                        <span
                          className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full"
                          style={{ background: `${pkg.accentColor}25` }}
                        >
                          <FiCheck className="h-3.5 w-3.5" style={{ color: pkg.accentColor }} strokeWidth={3.2} />
                        </span>
                        {h}
                      </li>
                    ))}
                  </ul>

                  {/* Price + CTA */}
                  <div className="border-t pt-6" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                    <div className="mb-5">
                      <p className={`font-serif text-white ${pkg.featured ? 'text-3xl' : 'text-2xl'}`}>
                        {pkg.price}
                      </p>
                      <p className="mt-1 text-[10px] uppercase tracking-wider text-white/40">
                        {lang === 'id' ? 'per orang · semua termasuk' : 'per person · all inclusive'}
                      </p>
                    </div>

                    {pkg.featured ? (
                      // Featured card — prominent solid CTA
                      <button
                        type="button"
                        onClick={() => handleOpenBooking(pkg)}
                        className="inline-flex w-full items-center justify-center gap-2.5 rounded-full px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.22em] transition-all duration-300 hover:opacity-90 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                        style={{ background: 'oklch(0.82 0.14 85)', color: 'oklch(0.12 0.04 85)' }}
                      >
                        {lang === 'id' ? 'Pesan Tempat' : 'Reserve a Spot'}
                        <FiArrowRight className="h-3.5 w-3.5" />
                      </button>
                    ) : (
                      // Non-featured — liquid glass outline CTA
                      <button
                        type="button"
                        onClick={() => handleOpenBooking(pkg)}
                        className="liquid-glass inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-[11px] font-medium uppercase tracking-[0.2em] transition-all duration-300 hover:scale(1.02) active:scale-[0.98] cursor-pointer"
                        style={{ color: pkg.accentColor }}
                      >
                        {lang === 'id' ? 'Pesan Tempat' : 'Reserve a Spot'}
                        <FiArrowRight className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>

                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Fine print */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.7 }}
          className="mt-12 text-center text-[11px] text-muted-foreground/50"
        >
          {lang === 'id' 
            ? 'Harga sudah termasuk semua tiket masuk taman, retribusi konservasi & penyeimbangan karbon. '
            : 'Prices include all park fees, conservation levies & carbon offsetting. '
          }
          <a href="#" className="text-primary/60 transition-colors hover:text-primary">
            {lang === 'id' ? 'Itinerary kustom tersedia' : 'Custom itineraries available'}
          </a>{' '}
          {lang === 'id' ? 'untuk grup berisi 4+ orang.' : 'for groups of 4+.'}
        </motion.p>
      </div>

      {/* ───────────────────────────────────────────────────────────────────────────── */}
      {/* INTERACTIVE BOOKING SIMULATOR MODAL */}
      {/* ───────────────────────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {bookingPkg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-center justify-center bg-background/95 backdrop-blur-[20px] p-4 md:p-6 pointer-events-auto"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="liquid-glass-strong relative flex h-full max-h-[620px] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-white/10 md:flex-row shadow-2xl"
            >
              
              {/* LEFT SIDE: Package Hero Info Panel */}
              <div className="relative hidden w-2/5 flex-shrink-0 md:flex flex-col p-8 z-10">
                <img
                  src={bookingPkg.bgImage}
                  alt={bookingPkg.tier}
                  className="absolute inset-0 h-full w-full object-cover"
                  crossOrigin="anonymous"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-background/95" />
                
                <div className="relative z-20 flex h-full flex-col text-white">
                  <div className="flex items-center gap-2 text-[10px] font-mono tracking-widest text-primary uppercase">
                    <IoLeaf className="h-3.5 w-3.5" style={{ color: bookingPkg.accentColor }} />
                    <span>Sumatra Expedition</span>
                  </div>
                  
                  <h3 className="font-serif text-3xl mt-4 leading-tight">{bookingPkg.tier}</h3>
                  <p className="text-xs text-white/50 font-mono tracking-widest uppercase mt-1">
                    {bookingPkg.days} Voyage
                  </p>
                  
                  <div className="h-px bg-white/10 my-6" />

                  <p className="text-xs text-white/60 italic leading-relaxed mb-6">
                    "{bookingPkg.tagline}"
                  </p>

                  <ul className="flex flex-col gap-2.5 mt-auto">
                    {bookingPkg.highlights.slice(0, 3).map((item) => (
                      <li key={item} className="flex items-center gap-2 text-[11px] text-white/80">
                        <FiCheck className="h-3.5 w-3.5 text-primary" style={{ color: bookingPkg.accentColor }} />
                        <span>{item}</span>
                      </li>
                    ))}
                    {bookingPkg.highlights.length > 3 && (
                      <li className="text-[10px] text-white/40 tracking-wider uppercase ml-5">
                        + {bookingPkg.highlights.length - 3} more highlights
                      </li>
                    )}
                  </ul>
                </div>
              </div>

              {/* RIGHT SIDE: Booking Form / Success State */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col justify-center">
                
                {/* Close Button */}
                <button
                  type="button"
                  onClick={handleCloseBooking}
                  className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/60 hover:border-white hover:text-white cursor-pointer z-20"
                >
                  <FiX className="h-5 w-5" />
                </button>

                {!isSuccess ? (
                  /* BOOKING FORM STATE */
                  <form onSubmit={handleConfirmBooking} className="flex flex-col gap-5 pr-1">
                    <div>
                      <h4 className="font-serif text-2xl text-white leading-tight">
                        {lang === 'id' ? 'Pesan Tempat Anda' : 'Secure Your Spot'}
                      </h4>
                      <p className="text-[10px] uppercase tracking-wider text-white/40 mt-1">
                        {lang === 'id' ? 'Simulasi Permintaan Ekspedisi' : 'Expedition Request Sandbox'}
                      </p>
                    </div>

                    <div className="h-px bg-white/10" />

                    {/* Full Name */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] uppercase tracking-widest text-white/50 font-semibold pl-1">
                        {lang === 'id' ? 'Nama Lengkap' : 'Full Name'}
                      </label>
                      <div className="relative">
                        <FiUser className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                        <input
                          required
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder={lang === 'id' ? 'contoh: Alexander Mercer' : 'e.g. Alexander Mercer'}
                          className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-xs tracking-wider text-white placeholder-white/20 outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] uppercase tracking-widest text-white/50 font-semibold pl-1">
                        {lang === 'id' ? 'Alamat Email' : 'Email Address'}
                      </label>
                      <div className="relative">
                        <FiMail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                        <input
                          required
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder={lang === 'id' ? 'contoh: alex@example.com' : 'e.g. alex@example.com'}
                          className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-xs tracking-wider text-white placeholder-white/20 outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
                        />
                      </div>
                    </div>

                    {/* Row: Date + Travelers */}
                    <div className="grid grid-cols-2 gap-4">
                      
                      {/* Date Picker */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] uppercase tracking-widest text-white/50 font-semibold pl-1">
                          {lang === 'id' ? 'Tanggal Keberangkatan' : 'Departure Date'}
                        </label>
                        <div className="relative">
                          <input
                            required
                            type="date"
                            min={getTomorrowString()}
                            value={travelDate}
                            onChange={(e) => setTravelDate(e.target.value)}
                            className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 px-3 text-xs tracking-wider text-white outline-none focus:border-primary/50 focus:bg-white/10 transition-all custom-date-input"
                          />
                        </div>
                      </div>

                      {/* Travelers Selector */}
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[9px] uppercase tracking-widest text-white/50 font-semibold pl-1">
                          {lang === 'id' ? 'Jumlah Wisatawan' : 'Travelers'}
                        </label>
                        <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 py-1 px-1.5 w-full">
                          <button
                            type="button"
                            disabled={travelers <= 1}
                            onClick={() => setTravelers(t => Math.max(1, t - 1))}
                            className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-white/10 text-white disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer"
                          >
                            <FiMinus className="h-3.5 w-3.5" />
                          </button>
                          <span className="text-xs font-mono font-bold text-white px-2">
                            {travelers}
                          </span>
                          <button
                            type="button"
                            onClick={() => setTravelers(t => t + 1)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-white/10 text-white transition-all cursor-pointer"
                          >
                            <FiPlus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>

                    </div>

                    {/* Pricing Calculator Summary Card */}
                    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4 flex flex-col gap-2 mt-1">
                      <div className="flex justify-between text-[11px] text-white/40">
                        <span>{lang === 'id' ? 'Tarif per orang:' : 'Rate per person:'}</span>
                        <span>{bookingPkg.price}</span>
                      </div>
                      <div className="flex justify-between text-[11px] text-white/40 border-b border-white/5 pb-2">
                        <span>{lang === 'id' ? 'Total Wisatawan:' : 'Total Travelers:'}</span>
                        <span>{travelers} {lang === 'id' ? 'Orang' : 'Pax'}</span>
                      </div>
                      <div className="flex justify-between text-xs font-bold text-white pt-1">
                        <span className="flex items-center gap-1.5">
                          {lang === 'id' ? 'Total Estimasi:' : 'Total Estimate:'}
                        </span>
                        <span style={{ color: bookingPkg.accentColor }}>
                          {formatIDR(bookingPkg.numericPrice * travelers)}
                        </span>
                      </div>
                    </div>

                    {/* Interactive Eco-Impact Calculator Summary Card */}
                    <div className="rounded-xl border border-dashed border-emerald-500/30 bg-emerald-100/40 dark:border-emerald-500/20 dark:bg-emerald-950/20 p-4 flex flex-col gap-2.5">
                      <div className="flex items-center text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                        <span>{lang === 'id' ? 'Kontribusi Eco-Impact Dinamis' : 'Dynamic Eco-Impact Contribution'}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[10px]">
                        <div className="rounded-lg bg-emerald-50 dark:bg-black/30 p-2 border border-emerald-200/50 dark:border-white/5 flex flex-col gap-0.5">
                          <span className="text-emerald-700/70 dark:text-white/40 text-[9px] uppercase tracking-wider flex items-center gap-1">
                            <IoLeaf className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                            {lang === 'id' ? 'Pohon Ditanam' : 'Trees Planted'}
                          </span>
                          <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400 text-xs">
                            {travelers * (bookingPkg.id === 'explorer' ? 2 : bookingPkg.id === 'ranger' ? 5 : 10)} {lang === 'id' ? 'Pohon' : 'Trees'}
                          </span>
                        </div>
                        <div className="rounded-lg bg-emerald-50 dark:bg-black/30 p-2 border border-emerald-200/50 dark:border-white/5 flex flex-col gap-0.5">
                          <span className="text-emerald-700/70 dark:text-white/40 text-[9px] uppercase tracking-wider flex items-center gap-1">
                            <FiShield className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                            {lang === 'id' ? 'Patroli Ranger' : 'Ranger Patrol'}
                          </span>
                          <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400 text-xs">
                            {travelers * (bookingPkg.id === 'explorer' ? 12 : bookingPkg.id === 'ranger' ? 24 : 48)} {lang === 'id' ? 'Jam' : 'Hours'}
                          </span>
                        </div>
                        <div className="rounded-lg bg-emerald-50 dark:bg-black/30 p-2 border border-emerald-200/50 dark:border-white/5 flex flex-col gap-0.5 col-span-2">
                          <span className="text-emerald-700/70 dark:text-white/40 text-[9px] uppercase tracking-wider flex items-center gap-1">
                            <FiUsers className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                            {lang === 'id' ? 'Dukungan Ekonomi Lokal' : 'Local Economy Support'}
                          </span>
                          <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400 text-xs">
                            {travelers * (bookingPkg.id === 'explorer' ? 2 : bookingPkg.id === 'ranger' ? 4 : 7)} {lang === 'id' ? 'Hari Pendanaan Upah Layak Pemandu' : 'Days of Fair-Wage Guide Funding'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* ── Promo Code Field ───────────────────────── */}
                    <div className="flex flex-col gap-2">
                      <label className="text-[9px] uppercase tracking-widest text-white/50 font-semibold pl-1">
                        {lang === 'id' ? 'Kode Promo (Opsional)' : 'Promo Code (Optional)'}
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={promoCode}
                          onChange={(e) => {
                            setPromoCode(e.target.value.toUpperCase())
                            setPromoError(false)
                          }}
                          disabled={promoApplied}
                          placeholder={lang === 'id' ? 'contoh: LEUSERGREEN' : 'e.g. LEUSERGREEN'}
                          className={`flex-1 rounded-xl border py-2.5 px-3 text-xs tracking-wider text-white placeholder-white/20 outline-none transition-all
                            ${promoApplied
                              ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-400'
                              : promoError
                              ? 'bg-red-950/20 border-red-500/40'
                              : 'bg-white/5 border-white/10 focus:border-primary/50 focus:bg-white/10'
                            }`}
                        />
                        {!promoApplied && (
                          <button
                            type="button"
                            onClick={handleApplyPromo}
                            className="rounded-xl border border-white/10 px-4 text-[10px] font-semibold uppercase tracking-wider text-white/60 hover:border-white/30 hover:text-white transition-all cursor-pointer whitespace-nowrap"
                          >
                            {lang === 'id' ? 'Terapkan' : 'Apply'}
                          </button>
                        )}
                      </div>

                      {/* Applied badge */}
                      <AnimatePresence>
                        {promoApplied && (
                          <motion.div
                            initial={{ opacity: 0, y: -6, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                            className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-950/30 px-3 py-2"
                          >
                            <IoLeaf className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                            <div className="flex flex-col">
                              <span className="text-[11px] font-semibold text-emerald-400">
                                {lang === 'id' ? '+1 Pohon Carbon Offset 🌱 Diterapkan!' : '+1 Carbon Offset Tree 🌱 Applied!'}
                              </span>
                              <span className="text-[9px] text-emerald-400/60">
                                {lang === 'id' ? 'Kode LEUSERGREEN valid · Bonus terkunci di e-ticket' : 'LEUSERGREEN valid · Bonus locked into your e-ticket'}
                              </span>
                            </div>
                          </motion.div>
                        )}
                        {promoError && (
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-[10px] text-red-400/80 pl-1"
                          >
                            {lang === 'id' ? '✕ Kode tidak valid. Selesaikan Eco-Checklist untuk mendapatkan kode.' : '✕ Invalid code. Complete the Eco-Checklist to unlock your code.'}
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="w-full inline-flex items-center justify-center gap-2.5 rounded-xl py-3.5 text-xs font-semibold uppercase tracking-[0.2em] transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                      style={{
                        background: bookingPkg.featured ? 'oklch(0.82 0.14 85)' : bookingPkg.accentColor,
                        color: bookingPkg.featured ? 'oklch(0.12 0.04 85)' : '#000'
                      }}
                    >
                      {lang === 'id' ? 'Konfirmasi Permintaan Pemesanan' : 'Confirm Booking Request'}
                      <FiArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </form>
                ) : (
                  /* SUCCESS BOOKING STATE */
                  <div className="flex flex-col items-center justify-center text-center p-2 pr-4">
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                      className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400 mb-5"
                    >
                      <FiAward className="h-8 w-8" />
                    </motion.div>

                    <h4 className="font-serif text-2xl text-white">
                      {lang === 'id' ? 'Ekspedisi Terkunci' : 'Expedition Locked'}
                    </h4>
                    <p className="text-[10px] uppercase tracking-wider text-emerald-400 mt-1 font-semibold">
                      {lang === 'id' ? 'Reservasi Berhasil' : 'Reservation Successful'}
                    </p>

                    <div className="h-px bg-white/10 w-full my-4" />

                    {/* E-Ticket display */}
                    <div
                      className="rounded-2xl border border-dashed p-5 w-full bg-black/30 flex flex-col gap-3 text-left font-mono text-[11px] relative mb-6"
                      style={{ borderColor: bookingPkg.accentColor + '40' }}
                    >
                      {/* Ticket side cutouts */}
                      <div className="absolute -left-2.5 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-background/95 border-r border-white/10" />
                      <div className="absolute -right-2.5 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-background/95 border-l border-white/10" />

                      <div className="flex justify-between">
                        <span className="text-white/30">{lang === 'id' ? 'ID PEMESANAN:' : 'BOOKING ID:'}</span>
                        <span className="text-white font-bold">{bookingId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/30">{lang === 'id' ? 'KATEGORI:' : 'TIER:'}</span>
                        <span className="text-white uppercase font-bold">{bookingPkg.tier} ({bookingPkg.days})</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/30">{lang === 'id' ? 'TANGGAL:' : 'DATE:'}</span>
                        <span className="text-white">{travelDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-white/30">{lang === 'id' ? 'WISATAWAN:' : 'PASSENGERS:'}</span>
                        <span className="text-white">{travelers} {lang === 'id' ? 'Wisatawan' : 'Traveler(s)'}</span>
                      </div>
                      <div className="h-px border-t border-dashed border-white/10 my-1" />
                      <div className="flex justify-between text-xs">
                        <span className="text-white/30 font-bold">{lang === 'id' ? 'TOTAL ESTIMASI:' : 'TOTAL ESTIMATE:'}</span>
                        <span className="font-bold" style={{ color: bookingPkg.accentColor }}>
                          {formatIDR(bookingPkg.numericPrice * travelers)}
                        </span>
                      </div>
                      <div className="h-px border-t border-dashed border-white/10 my-1" />
                      <div className="flex flex-col gap-1 text-[10px]">
                        <span className="text-emerald-400 font-bold tracking-wider uppercase flex items-center gap-1.5">
                          <IoLeaf className="h-3 w-3 text-emerald-400" />
                          {lang === 'id' ? 'Eco-Impact Terkunci:' : 'Eco-Impact Locked:'}
                        </span>
                        <div className="flex justify-between pl-1">
                          <span className="text-white/30">{lang === 'id' ? 'Pohon Ditanam:' : 'Trees Planted:'}</span>
                          <span className="text-white">{travelers * (bookingPkg.id === 'explorer' ? 2 : bookingPkg.id === 'ranger' ? 5 : 10)} {lang === 'id' ? 'Pohon' : 'Trees'}</span>
                        </div>
                        <div className="flex justify-between pl-1">
                          <span className="text-white/30">{lang === 'id' ? 'Patroli Ranger:' : 'Ranger Patrols:'}</span>
                          <span className="text-white">{travelers * (bookingPkg.id === 'explorer' ? 12 : bookingPkg.id === 'ranger' ? 24 : 48)} {lang === 'id' ? 'Jam' : 'Hours'}</span>
                        </div>
                        <div className="flex justify-between pl-1">
                          <span className="text-white/30">{lang === 'id' ? 'Upah Layak Pemandu:' : 'Fair Guide Wage:'}</span>
                          <span className="text-white">{travelers * (bookingPkg.id === 'explorer' ? 2 : bookingPkg.id === 'ranger' ? 4 : 7)} {lang === 'id' ? 'Hari' : 'Days'}</span>
                        </div>

                        {/* Promo bonus row — only visible if LEUSERGREEN was applied */}
                        {promoApplied && (
                          <motion.div
                            initial={{ opacity: 0, x: 8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
                            className="flex justify-between pl-1 mt-0.5 pt-1.5 border-t border-dashed border-emerald-500/20"
                          >
                            <span className="text-emerald-400/70 flex items-center gap-1">
                              🌱 {lang === 'id' ? 'Bonus Promo LEUSERGREEN:' : 'Promo LEUSERGREEN Bonus:'}
                            </span>
                            <span style={{ color: 'oklch(0.82 0.14 85)' }} className="font-bold">
                              +1 {lang === 'id' ? 'Pohon' : 'Tree'}
                            </span>
                          </motion.div>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-white/50 leading-relaxed max-w-sm mb-6">
                      {lang === 'id' ? (
                        <>
                          Terima kasih, <span className="text-white font-semibold">{fullName}</span>! Permintaan ekspedisi Sumatra Anda telah terdaftar. Penjaga hutan ekologis lokal kami akan mengirimkan email ke <span className="text-white font-semibold">{email}</span> dalam waktu 24 jam untuk koordinasi pemandu.
                        </>
                      ) : (
                        <>
                          Thank you, <span className="text-white font-semibold">{fullName}</span>! Your Sumatran expedition inquiry has been registered. Our local eco-rangers will email you at <span className="text-white font-semibold">{email}</span> within 24 hours to coordinate guide assignments.
                        </>
                      )}
                    </p>

                    <button
                      type="button"
                      onClick={handleCloseBooking}
                      className="liquid-glass inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-[10px] font-semibold uppercase tracking-wider text-white hover:bg-white/10 transition-all cursor-pointer"
                    >
                      {lang === 'id' ? 'Kembali ke Ekspedisi' : 'Back to Expeditions'}
                    </button>
                  </div>
                )}

              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  )
}
