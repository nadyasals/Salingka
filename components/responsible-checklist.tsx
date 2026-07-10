'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { IoLeaf } from 'react-icons/io5'
import { FiCheck, FiTrash2, FiUsers, FiCompass, FiShield, FiGift } from 'react-icons/fi'
import { useLanguage } from '@/components/language-context'

interface ChecklistItem {
  id: string
  title: string
  summary: string
  whyItMatters: string
  icon: React.ReactNode
}

const CHECKLIST_ITEMS: ChecklistItem[] = [
  {
    id: 'plastics',
    title: 'Reduce Single-Use Plastics',
    summary: 'I will bring a reusable water bottle and use solid or biodegradable toiletries.',
    whyItMatters: 'Over 1.5 million tons of plastic waste threaten Indonesian waterways yearly. Refusing plastics protects critical river corridors and downstream marine sanctuaries where Sumatran turtles nest.',
    icon: <FiShield className="h-5 w-5" />,
  },
  {
    id: 'wildlife-distance',
    title: 'Keep Safe Primate Distance',
    summary: 'I will maintain at least 10 meters distance from orangutans and never offer food.',
    whyItMatters: 'Orangutans share 97% of human DNA, making them highly susceptible to human viruses. Domesticating wildlife through feeding also ruins their foraging instincts and survival skills.',
    icon: <IoLeaf className="h-5 w-5" />,
  },
  {
    id: 'no-trace',
    title: 'Strictly Leave No Trace',
    summary: 'I will pack out all my garbage and walk only on marked conservation paths.',
    whyItMatters: 'Stepping off designated trails triggers rapid soil erosion and destroys native canopy saplings. Wild tigers also shift their territory when humans leave behind food waste or establish illegal trails.',
    icon: <FiTrash2 className="h-5 w-5" />,
  },
  {
    id: 'support-local',
    title: 'Hire Indigenous Field Guides',
    summary: 'I will employ certified local guides and book stays in village eco-homestays.',
    whyItMatters: 'Direct community income creates sustainable alternatives to illegal logging and poaching. Purnawirawan (ex-loggers) are now trained as park rangers and guides, funded by tourist visits.',
    icon: <FiUsers className="h-5 w-5" />,
  },
  {
    id: 'jungle-sound',
    title: 'Respect Acoustic Integrity',
    summary: 'I will keep conversations quiet and silence all digital notification alarms.',
    whyItMatters: 'Unnatural sounds cause panic in forest animals. Stress responses disrupt the courtship calls of rare Hornbills and force elephant herds to retreat to dangerous farm borders.',
    icon: <FiCompass className="h-5 w-5" />,
  },
  {
    id: 'local-crafts',
    title: 'Support Indigenous Artisans',
    summary: 'I will buy handmade souvenirs directly from local family workshops.',
    whyItMatters: 'Purchasing Batak woodcarvings or handwoven Ulos textiles directly supports family incomes and ancestral heritage, creating a circular economy that doesn\'t depend on forest logging.',
    icon: <FiGift className="h-5 w-5" />,
  },
  {
    id: 'licensed-tours',
    title: 'Book Licensed Eco-Operators',
    summary: 'I will verify the official guide license badge before booking forest treks.',
    whyItMatters: 'Unregistered operators violate carrying capacity limits, causing overcrowding that stresses orangutan groups and damages fragile forest floors.',
    icon: <FiCheck className="h-5 w-5" />,
  },
  {
    id: 'fire-impact',
    title: 'Avoid Open Campfires',
    summary: 'I will use portable stoves and refrain from building open wood fires.',
    whyItMatters: 'Open campfires can spark catastrophic peatland fires during dry spells. Peat fires burn underground, releasing massive carbon clouds and destroying wide swathes of Sumatran elephant habitats.',
    icon: <FiShield className="h-5 w-5" />,
  },
]

const CHECKLIST_TRANSLATIONS: Record<string, Record<'id' | 'en', { title: string; summary: string; whyItMatters: string }>> = {
  plastics: {
    id: {
      title: 'Kurangi Plastik Sekali Pakai',
      summary: 'Saya akan bawa botol minum isi ulang dan pakai perlengkapan mandi padat atau ramah lingkungan.',
      whyItMatters: 'Lebih dari 1,5 juta ton sampah plastik mengancam perairan Indonesia setiap tahun. Menolak plastik melindungi koridor sungai dan suaka laut tempat penyu sumatra bertelur.'
    },
    en: {
      title: 'Reduce Single-Use Plastics',
      summary: 'I will bring a reusable water bottle and use solid or biodegradable toiletries.',
      whyItMatters: 'Over 1.5 million tons of plastic waste threaten Indonesian waterways yearly. Refusing plastics protects critical river corridors and downstream marine sanctuaries where Sumatran turtles nest.'
    }
  },
  'wildlife-distance': {
    id: {
      title: 'Jaga Jarak Aman dengan Primata',
      summary: 'Saya akan jaga jarak minimal 10 meter dari orangutan dan tidak akan memberi makan.',
      whyItMatters: 'Orangutan berbagi 97% DNA manusia, jadi sangat rentan terhadap virus. Memberi makan satwa liar juga mengikis naluri mencari makan dan kemampuan bertahan hidup mereka.'
    },
    en: {
      title: 'Keep Safe Primate Distance',
      summary: 'I will maintain at least 10 meters distance from orangutans and never offer food.',
      whyItMatters: 'Orangutans share 97% of human DNA, making them highly susceptible to human viruses. Domesticating wildlife through feeding also ruins their foraging instincts and survival skills.'
    }
  },
  'no-trace': {
    id: {
      title: 'Patuhi Aturan Tanpa Bekas',
      summary: 'Saya akan bawa pulang semua sampah dan hanya berjalan di jalur konservasi.',
      whyItMatters: 'Keluar dari jalur menimbulkan erosi tanah cepat dan merusak bibit kanopi. Harimau juga memindahkan wilayahnya jika manusia meninggalkan sisa makanan atau membuat jalur ilegal.'
    },
    en: {
      title: 'Strictly Leave No Trace',
      summary: 'I will pack out all my garbage and walk only on marked conservation paths.',
      whyItMatters: 'Stepping off designated trails triggers rapid soil erosion and destroys native canopy saplings. Wild tigers also shift their territory when humans leave behind food waste or establish illegal trails.'
    }
  },
  'support-local': {
    id: {
      title: 'Pekerjakan Pemandu Adat Setempat',
      summary: 'Saya akan memilih pemandu lokal bersertifikat dan menginap di homestay desa.',
      whyItMatters: 'Pendapatan langsung ke komunitas menciptakan alternatif berkelanjutan terhadap penebangan dan perburuan liar. Mantan penebang kini dilatih sebagai ranger dan pemandu, didanai dari kunjungan wisatawan.'
    },
    en: {
      title: 'Hire Indigenous Field Guides',
      summary: 'I will employ certified local guides and book stays in village eco-homestays.',
      whyItMatters: 'Direct community income creates sustainable alternatives to illegal logging and poaching. Purnawirawan (ex-loggers) are now trained as park rangers and guides, funded by tourist visits.'
    }
  },
  'jungle-sound': {
    id: {
      title: 'Hormati Suara Hutan',
      summary: 'Saya akan jaga percakapan tetap pelan dan matikan semua notifikasi digital.',
      whyItMatters: 'Suara tidak alami membuat hewan panik. Respons stres mengganggu panggilan kawin burung Rangkong dan memaksa kawanan gajah mundur ke perbatasan pertanian yang berbahaya.'
    },
    en: {
      title: 'Respect Acoustic Integrity',
      summary: 'I will keep conversations quiet and silence all digital notification alarms.',
      whyItMatters: 'Unnatural sounds cause panic in forest animals. Stress responses disrupt the courtship calls of rare Hornbills and force elephant herds to retreat to dangerous farm borders.'
    }
  },
  'local-crafts': {
    id: {
      title: 'Dukung Perajin Lokal',
      summary: 'Saya akan beli cinderamata buatan tangan langsung dari bengkel keluarga lokal.',
      whyItMatters: 'Membeli ukiran Batak atau kain Ulos langsung mendukung pendapatan keluarga dan warisan leluhur, menciptakan ekonomi sirkular yang tak bergantung pada penebangan hutan.'
    },
    en: {
      title: 'Support Indigenous Artisans',
      summary: 'I will buy handmade souvenirs directly from local family workshops.',
      whyItMatters: 'Purchasing Batak woodcarvings or handwoven Ulos textiles directly supports family incomes and ancestral heritage, creating a circular economy that doesn\'t depend on forest logging.'
    }
  },
  'licensed-tours': {
    id: {
      title: 'Pesan Operator Resmi',
      summary: 'Saya akan cek lencana lisensi pemandu sebelum memesan trek hutan.',
      whyItMatters: 'Operator tidak terdaftar melanggar batas daya dukung, menyebabkan kepadatan berlebih yang membuat stres kelompok orangutan dan merusak lantai hutan.'
    },
    en: {
      title: 'Book Licensed Eco-Operators',
      summary: 'I will verify the official guide license badge before booking forest treks.',
      whyItMatters: 'Unregistered operators violate carrying capacity limits, causing overcrowding that stresses orangutan groups and damages fragile forest floors.'
    }
  },
  'fire-impact': {
    id: {
      title: 'Hindari Api Unggun',
      summary: 'Saya akan pakai kompor portabel dan tidak membuat api unggun di tanah.',
      whyItMatters: 'Api unggun bisa memicu kebakaran lahan gambut saat musim kemarau. Kebakaran gambut membakar di bawah tanah, melepaskan awan karbon besar, dan menghancurkan habitat gajah sumatra.'
    },
    en: {
      title: 'Avoid Open Campfires',
      summary: 'I will use portable stoves and refrain from building open wood fires.',
      whyItMatters: 'Open campfires can spark catastrophic peatland fires during dry spells. Peat fires burn underground, releasing massive carbon clouds and destroying wide swathes of Sumatran elephant habitats.'
    }
  }
}

export function ResponsibleChecklist() {
  const sectionRef = useRef<HTMLElement>(null)
  const inView = useInView(sectionRef, { once: true, margin: '-80px' })
  const { lang } = useLanguage()
  
  const [displayItems, setDisplayItems] = useState<ChecklistItem[]>([])
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({})
  const [activeExplain, setActiveExplain] = useState<string | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  // Localize items on the fly
  const localizedDisplayItems = displayItems.map((item) => {
    const trans = CHECKLIST_TRANSLATIONS[item.id]?.[lang] || {}
    return {
      ...item,
      title: trans.title || item.title,
      summary: trans.summary || item.summary,
      whyItMatters: trans.whyItMatters || item.whyItMatters
    }
  })

  useEffect(() => {
    // Shuffle and pick 5 random items from the 8-item bank
    const shuffled = [...CHECKLIST_ITEMS].sort(() => 0.5 - Math.random())
    const selected = shuffled.slice(0, 5)
    setDisplayItems(selected)
    
    // Initialize checked states
    const initialChecked: Record<string, boolean> = {}
    selected.forEach((item) => {
      initialChecked[item.id] = false
    })
    setCheckedItems(initialChecked)
    setIsMounted(true)
  }, [])

  const handleToggle = (id: string) => {
    setCheckedItems((prev) => {
      const next = { ...prev, [id]: !prev[id] }
      // Expand details if item is checked and details are not yet showing
      if (next[id]) {
        setActiveExplain(id)
      } else if (activeExplain === id) {
        setActiveExplain(null)
      }
      return next
    })
  }

  const checkedCount = Object.values(checkedItems).filter(Boolean).length
  const progressPercent = localizedDisplayItems.length > 0 ? (checkedCount / localizedDisplayItems.length) * 100 : 0
  const isComplete = localizedDisplayItems.length > 0 && checkedCount === localizedDisplayItems.length

  if (!isMounted) {
    return (
      <section
        id="checklist"
        className="relative overflow-hidden py-28 md:py-40 bg-transparent border-t border-b border-foreground/5 dark:border-white/5"
      >
        <div className="relative mx-auto max-w-7xl px-6 md:px-10 text-center">
          <span className="liquid-glass mb-6 inline-block rounded-full px-4 py-1.5 text-[10px] uppercase tracking-[0.4em] text-foreground/20">
            {lang === 'id' ? 'Wisata Bertanggung Jawab' : 'Responsible Travel'}
          </span>
          <h2 className="font-serif text-4xl font-medium leading-tight text-foreground/20 md:text-5xl">
            {lang === 'id' ? 'Memuat Eco-Checklist...' : 'Loading Eco-Checklist...'}
          </h2>
        </div>
      </section>
    )
  }

  return (
    <section
      id="checklist"
      ref={sectionRef}
      className="relative overflow-hidden py-28 md:py-40 bg-transparent border-t border-b border-foreground/5 dark:border-white/5"
      aria-label="Eco-Traveler Responsible Checklist"
    >
      {/* Background glowing ambient blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute right-0 top-1/4 h-[500px] w-[500px] rounded-full blur-[140px]"
          style={{ background: 'oklch(0.35 0.08 160 / 0.06)' }} />
        <div className="absolute left-10 bottom-0 h-[450px] w-[450px] rounded-full blur-[120px]"
          style={{ background: 'oklch(0.30 0.10 180 / 0.05)' }} />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 md:px-10">
        {/* Header */}
        <div className="mb-16 text-center md:mb-24">
          <motion.span
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7 }}
            className="liquid-glass mb-6 inline-block rounded-full px-4 py-1.5 text-[10px] uppercase tracking-[0.4em]"
            style={{ color: 'oklch(0.82 0.14 85)' }}
          >
            {lang === 'id' ? 'Wisata Bertanggung Jawab' : 'Responsible Travel'}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="font-serif text-4xl font-medium leading-tight text-foreground md:text-5xl"
          >
            {lang === 'id' ? 'Apakah Anda siap untuk alam liar?' : 'Are you ready for the wild?'}
            <br />
            <span className="bg-gradient-to-br from-primary to-teal-500 dark:to-teal-400 bg-clip-text text-transparent">
              {lang === 'id' ? 'Uji Kesiapan Hutan Anda' : 'Test Your Jungle Readiness'}
            </span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="mt-6 mx-auto max-w-xl text-sm leading-relaxed text-muted-foreground"
          >
            {lang === 'id'
              ? 'Perjalanan di hutan hujan Sumatra membutuhkan rasa hormat yang mendalam terhadap satwa liar dan warisan budaya. Selesaikan 5 poin eco-traveler checklist untuk membuka sertifikasi dan hadiah pemesanan Anda.'
              : 'Travel in the Sumatran rainforest requires a deep respect for wildlife and heritage. Complete the 5-point eco-traveler checklist to unlock your certification and booking reward.'
            }
          </motion.p>
        </div>

        {/* Interactive Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT: Checklist Items (8 columns on lg) */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            
            {/* Progress Bar Container */}
            <div className="liquid-glass rounded-2xl p-5 border border-foreground/10 flex flex-col gap-3">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-foreground/40">
                  {lang === 'id' ? 'INDEKS KESIAPAN HUTAN' : 'JUNGLE PREPAREDNESS INDEX'}
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                  {lang === 'id'
                    ? `${checkedCount} dari 5 Tersertifikasi (${Math.round(progressPercent)}%)`
                    : `${checkedCount} of 5 Certified (${Math.round(progressPercent)}%)`
                  }
                </span>
              </div>
              <div className="h-2 w-full bg-foreground/5 rounded-full overflow-hidden relative">
                <motion.div
                  className="h-full bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-500 dark:to-teal-400 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ type: 'spring', stiffness: 80, damping: 15 }}
                />
              </div>
            </div>

            {/* Checklist Items list */}
            {localizedDisplayItems.map((item, index) => {
              const isChecked = !!checkedItems[item.id]
              
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  onClick={() => handleToggle(item.id)}
                  className={`group rounded-2xl border p-5 transition-all duration-300 cursor-pointer flex gap-4 ${
                    isChecked 
                      ? 'border-emerald-600/40 dark:border-emerald-500/40 bg-emerald-100/50 dark:bg-emerald-950/20' 
                      : 'border-foreground/10 bg-foreground/[0.04] hover:border-foreground/20 hover:bg-foreground/[0.07]'
                  }`}
                >
                  {/* Custom Checkbox */}
                  <div className="flex-shrink-0 mt-0.5">
                    <div
                      className={`h-5 w-5 rounded-md border flex items-center justify-center transition-all ${
                        isChecked 
                          ? 'bg-emerald-500 border-emerald-500 dark:border-emerald-400 text-white dark:text-black' 
                          : 'border-foreground/30 group-hover:border-foreground/60'
                      }`}
                    >
                      {isChecked && <FiCheck className="h-3.5 w-3.5 stroke-[3]" />}
                    </div>
                  </div>

                  {/* Icon */}
                  <div className={`flex-shrink-0 mt-0.5 transition-colors ${isChecked ? 'text-emerald-600 dark:text-emerald-400' : 'text-foreground/30'}`}>
                    {item.icon}
                  </div>

                  {/* Text Content */}
                  <div className="flex-1 flex flex-col gap-1.5">
                    <div className="flex justify-between items-center">
                      <h4 className={`text-sm font-semibold tracking-wide transition-colors ${
                        isChecked ? 'text-emerald-600 dark:text-emerald-400' : 'text-foreground'
                      }`}>
                        {item.title}
                      </h4>
                      <span className={`text-[10px] font-mono hidden sm:inline-block transition-colors ${
                        isChecked ? 'text-emerald-600/80 dark:text-emerald-400/60' : 'text-foreground/25'
                      }`}>
                        {isChecked 
                          ? (lang === 'id' ? 'TERKUNCI ✓' : 'LOCKED IN ✓') 
                          : (lang === 'id' ? 'BELUM DIVERIFIKASI' : 'UNVERIFIED')
                        }
                      </span>
                    </div>
                    <p className="text-[11px] text-foreground/55 leading-relaxed max-w-xl">
                      {item.summary}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>

          {/* RIGHT: Detail Drawers & Success Badge (5 columns on lg) */}
          <div className="lg:col-span-5 h-full lg:sticky lg:top-24">
            <AnimatePresence mode="wait">
              {isComplete ? (
                /* SUCCESS REWARD CONTAINER */
                <motion.div
                  key="success-box"
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 100, damping: 15 }}
                  className="rounded-3xl border border-dashed border-emerald-500/30 bg-emerald-100/30 dark:bg-emerald-950/10 p-8 flex flex-col items-center justify-center text-center shadow-2xl relative overflow-hidden"
                  style={{ minHeight: '380px' }}
                >
                  {/* Confetti Shimmer */}
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(0.82_0.14_85_/_5%)_0%,transparent_70%)] pointer-events-none" />

                  {/* Certified badge icon */}
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
                    className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 mb-6"
                  >
                    <IoLeaf className="h-8 w-8" />
                  </motion.div>

                  <h3 className="font-serif text-2xl text-foreground tracking-wide leading-tight">
                    {lang === 'id' ? 'Sertifikasi Ekologis Tercapai' : 'Eco-Certification Achieved'}
                  </h3>
                  <p className="text-[9px] uppercase tracking-widest text-emerald-600 dark:text-emerald-400 font-bold mt-1.5">
                    {lang === 'id' ? '100% Siap untuk Sumatra' : '100% Prepared for Sumatra'}
                  </p>

                  <div className="h-px bg-foreground/10 w-full my-5" />

                  <p className="text-xs text-foreground/60 leading-relaxed max-w-sm mb-6">
                    {lang === 'id'
                      ? 'Anda telah berkomitmen untuk mendukung fauna hutan, meminimalkan sampah, dan meningkatkan mata pencaharian warga asli. Kode tanda tangan wisatawan Anda telah terbuka:'
                      : 'You have committed to supporting forest fauna, minimizing waste, and boosting native livelihoods. Your traveler signature code is unlocked:'
                    }
                  </p>

                  {/* Promo Code Box */}
                  <div className="rounded-xl border border-foreground/10 bg-background/60 px-5 py-4 w-full flex items-center justify-between font-mono text-xs relative group/code">
                    <div className="flex flex-col text-left gap-0.5">
                      <span className="text-[8px] tracking-widest text-foreground/30 uppercase">
                        {lang === 'id' ? 'KODE ECO-UPGRADE' : 'ECO-UPGRADE CODE'}
                      </span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold tracking-wider text-sm select-all">LEUSERGREEN</span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] text-foreground/50">
                      <FiGift className="h-4.5 w-4.5 text-emerald-600 dark:text-emerald-400" />
                      <span>{lang === 'id' ? 'Gratis Penyeimbangan Karbon' : 'Complimentary Carbon Offset'}</span>
                    </div>
                  </div>

                  <p className="text-[10px] text-foreground/30 italic mt-4 font-mono">
                    {lang === 'id'
                      ? 'Masukkan kode ini pada email permintaan pemesanan atau formulir checkout.'
                      : 'Enter this code in the booking request email or check out form.'
                    }
                  </p>
                </motion.div>
              ) : activeExplain ? (
                /* DETAILED EXPLANATION DRAWER */
                <motion.div
                  key={activeExplain}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.3 }}
                  className="liquid-glass rounded-3xl p-8 border border-white/5 flex flex-col justify-center shadow-xl text-left"
                  style={{ minHeight: '380px' }}
                >
                  <div className="flex items-center gap-3 text-emerald-600 dark:text-emerald-400 mb-6">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                      {localizedDisplayItems.find((it) => it.id === activeExplain)?.icon}
                    </div>
                    <div className="text-left flex flex-col">
                      <span className="text-[9px] uppercase tracking-wider text-foreground/40 font-mono">
                        {lang === 'id' ? 'ALASAN DAMPAK EKOLOGIS' : 'ECO-IMPACT RATIONALE'}
                      </span>
                      <h4 className="font-semibold text-foreground tracking-wide text-sm leading-tight">
                        {localizedDisplayItems.find((it) => it.id === activeExplain)?.title}
                      </h4>
                    </div>
                  </div>

                  <div className="h-px bg-foreground/10 w-full mb-6" />

                  <h5 className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest text-left mb-2.5">
                    {lang === 'id' ? 'Mengapa Ini Penting' : 'Why This Matters'}
                  </h5>
                  <p className="text-xs text-foreground/70 leading-relaxed text-left font-light mb-5">
                    {localizedDisplayItems.find((it) => it.id === activeExplain)?.whyItMatters}
                  </p>

                  <div className="mt-auto pt-4 flex items-center gap-2 text-[10px] font-mono text-emerald-600/90 dark:text-emerald-400/80">
                    <IoLeaf className="h-3.5 w-3.5" />
                    <span>
                      {lang === 'id' ? 'Terkait dengan Target SDG 15.5 & 8.9' : 'Linked to SDG Target 15.5 & 8.9'}
                    </span>
                  </div>
                </motion.div>
              ) : (
                /* IDLE STATE INSTRUCTIONS */
                <motion.div
                  key="idle-box"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.85 }}
                  exit={{ opacity: 0 }}
                  className="liquid-glass rounded-3xl p-8 border border-foreground/5 flex flex-col items-center justify-center text-center text-foreground/40 shadow-sm"
                  style={{ minHeight: '380px' }}
                >
                  <div className="h-12 w-12 rounded-full border border-dashed border-foreground/10 flex items-center justify-center text-foreground/20 mb-5">
                    <FiCheck className="h-5 w-5" />
                  </div>
                  <h4 className="font-serif text-lg font-medium text-foreground/60 mb-2">
                    {lang === 'id' ? 'Periksa daftar' : 'Check the list'}
                  </h4>
                  <p className="text-xs leading-relaxed max-w-xs font-light">
                    {lang === 'id'
                      ? 'Centang poin apa pun di sebelah kiri. Kami akan menunjukkan sains ekologis atau alasan komunitas yang mendukungnya.'
                      : 'Check off any point on the left. We will show you the exact ecological science or community rationale supporting it.'
                    }
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  )
}
