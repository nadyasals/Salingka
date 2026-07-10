'use client'

import { useRef, useState, useEffect, useId } from 'react'
import { motion, AnimatePresence, usePresence } from 'framer-motion'
import { FiBookOpen, FiX, FiSearch, FiCompass, FiAward } from 'react-icons/fi'
import { IoLeaf } from 'react-icons/io5'
import { useLanguage } from '@/components/language-context'

// ─────────────────────────────────────────────────────────────────────────────
// TYPES & DATA
// ─────────────────────────────────────────────────────────────────────────────

interface ChapterData {
  index: string
  title: string
  body: string
  image: string
  imageAlt: string
}

interface GalleryItem {
  id: string
  title: string
  category: 'Wildlife' | 'Flora' | 'Culture' | 'Conservation'
  image: string
  imageAlt: string
  story: string
  stat: string
  statLabel: string
}

const chapters: ChapterData[] = [
  {
    index: '01',
    title: 'Where the tiger still walks',
    body: 'Fewer than four hundred Sumatran tigers remain in the wild. Our treks pass through their protected corridors — never to chase a sighting, but to fund the rangers and camera traps that keep them alive. Your footsteps pay for their forest.',
    image: '/images/sumatran-tiger.png',
    imageAlt: 'A Sumatran tiger emerging from misty jungle foliage',
  },
  {
    index: '02',
    title: 'Eye to eye with the canopy',
    body: 'High in the fog-wrapped crowns of Gunung Leuser, orangutans build their nests each night. Local guides — many of them former loggers — read the branches like a map, leading you to moments no lens can fully hold.',
    image: '/images/orangutan.png',
    imageAlt: 'An orangutan resting in the misty rainforest canopy',
  },
  {
    index: '03',
    title: 'Rivers that remember',
    body: 'The Alas River has carved this valley for millions of years. Drift its mist-covered bends by traditional boat, sleep in village homestays along its banks, and leave nothing behind but the sound of your paddle.',
    image: '/images/jungle-river.png',
    imageAlt: 'A misty river winding through dense Sumatran rainforest',
  },
  {
    index: '04',
    title: 'The Bloom of Rafflesia',
    body: 'Sumatra’s rainforests are the native sanctuary of Rafflesia arnoldii, the largest individual flower on Earth. Blooming without roots, stems, or leaves, its giant red petals appear mysteriously and last for only a few short days.',
    image: '/images/rafflesia-arnoldii.jpg',
    imageAlt: 'A giant red Rafflesia arnoldii flower blooming on the rainforest floor',
  },
  {
    index: '05',
    title: 'The Silent Giants',
    body: 'In the swamp grasslands of Way Kambas, the critically endangered Sumatran elephant migrates along ancient corridors. Eco-tourism funds community patrols that mitigate human-wildlife conflict and protect their habitat.',
    image: '/images/way-kambas.jpg',
    imageAlt: 'A herd of Sumatran elephants walking through a misty wetland forest',
  },
]

const galleryItems: GalleryItem[] = [
  {
    id: 'hornbill',
    title: "The Helmeted Hornbill's Flight",
    category: 'Wildlife',
    image: '/images/rangkong-gading.jpg',
    imageAlt: 'A majestic bird flying through Sumatran canopy',
    story: 'The Helmeted Hornbill is a critical seed disperser in the high canopy of Leuser. Feared by poachers for its solid keratin casque, it now relies on indigenous anti-poaching patrols funded by Salingka visitors. Every trek keeps these guardians of the sky safe.',
    stat: 'CRITICALLY ENDANGERED',
    statLabel: 'IUCN Red List status due to poaching'
  },
  {
    id: 'mangrove',
    title: 'Mangrove Coastal Protection',
    category: 'Conservation',
    image: '/images/hutan-mangrove-sumatera.jpg',
    imageAlt: 'Mangrove forest roots in Sumatra coastline',
    story: 'Sumatra’s coastal mangroves form a natural shield against tsunamis and sequester ten times more carbon than terrestrial forests. We support community-led replanting programs, turning degraded aquaculture ponds back into thriving fish nurseries.',
    stat: '4,200 HECTARES',
    statLabel: 'Of coastal mangroves targeted for local community restoration'
  },
  {
    id: 'alas-raft',
    title: 'Surveying the Alas River',
    category: 'Conservation',
    image: '/images/sungai-alas.jpg',
    imageAlt: 'Rafting boat navigating rapids of Alas River',
    story: 'Drifting down the rapids of Alas River inside the Gunung Leuser National Park is not just an adventure. Tourism rafts function as observation platforms, supporting researchers tracking forest health, water cleanliness, and animal corridors.',
    stat: '100% MONITORING',
    statLabel: 'Of river routes checked monthly by guide associations'
  },
  {
    id: 'titan-arum',
    title: 'The Titan Arum Bloom',
    category: 'Flora',
    image: '/images/titan-arum.png',
    imageAlt: 'Sumatran volcanic mountain ranges',
    story: 'Endemic to Sumatra, the Amorphophallus titanum (Titan Arum) is the tallest flower structure in the world, growing up to three meters high. It blooms only once every few years for a single 48-hour period, releasing a strong scent to attract pollinators.',
    stat: '3 METERS',
    statLabel: 'Maximum height of this Sumatran endemic bloom'
  },
  {
    id: 'nias-stone',
    title: 'Megalithic Stone Jumping of Nias',
    category: 'Culture',
    image: '/images/lompat-batu-nias.jpg',
    imageAlt: 'Ancient megalithic site in Sumatra',
    story: 'In Nias Island, the traditional Hombo Batu (stone jumping) ritual sees young men leap over two-meter stone towers. Salingka works directly with village elders to sustain Nias megalithic traditions, keeping heritage alive through cultural homestays.',
    stat: '2 METERS',
    statLabel: 'Height of the solid stone obelisks jumped by youth'
  },
  {
    id: 'canopy-trek',
    title: 'Leuser Canopy Trekking',
    category: 'Wildlife',
    image: '/images/trekking-gunung-leuser.jpg',
    imageAlt: 'Pristine rainforest canopy of Gunung Leuser',
    story: 'Trekking deep inside Gunung Leuser requires strict ethical rules: zero physical contact with wildlife, minimal noise, and strict packing out of waste. By hiring local rangers, we turn former illegal loggers into passionate protectors of the forest.',
    stat: '150 RANGERS',
    statLabel: 'Former loggers now employed as wildlife guides'
  }
]

const CHAPTERS_TRANSLATIONS: Record<string, Record<'id' | 'en', { title: string; body: string }>> = {
  '01': {
    id: {
      title: 'Di Mana Harimau Masih Berkeliaran',
      body: 'Hanya tersisa kurang dari 400 harimau sumatra di alam liar. Trek kami melewati koridor perlindungan mereka — bukan untuk memburu, tapi mendanai para rangers dan kamera jebak yang menjaga mereka tetap hidup. Setiap langkahmu mendanai hutan mereka.'
    },
    en: {
      title: 'Where the tiger still walks',
      body: 'Fewer than four hundred Sumatran tigers remain in the wild. Our treks pass through their protected corridors — never to chase a sighting, but to fund the rangers and camera traps that keep them alive. Your footsteps pay for their forest.'
    }
  },
  '02': {
    id: {
      title: 'Bertatap Langsung dengan Kanopi',
      body: 'Tinggi di mahkota Gunung Leuser yang berkabut, orangutan membangun sarangnya setiap malam. Pemandu lokal — banyak mantan penebang hutan — membaca dahan seperti peta, menuntunmu ke momen yang tak terlupakan.'
    },
    en: {
      title: 'Eye to eye with the canopy',
      body: 'High in the fog-wrapped crowns of Gunung Leuser, orangutans build their nests each night. Local guides — many of them former loggers — read the branches like a map, leading you to moments no lens can fully hold.'
    }
  },
  '03': {
    id: {
      title: 'Sungai yang Bicara',
      body: 'Sungai Alas telah mengukir lembah ini jutaan tahun. Hanyutlah di kelokan berkabutnya dengan perahu tradisional, menginap di homestay desa di tepinya, dan tinggalkan hanya suara dayungmu.'
    },
    en: {
      title: 'Rivers that remember',
      body: 'The Alas River has carved this valley for millions of years. Drift its mist-covered bends by traditional boat, sleep in village homestays along its banks, and leave nothing behind but the sound of your paddle.'
    }
  },
  '04': {
    id: {
      title: 'Mekarnya Sang Rafflesia',
      body: 'Hutan hujan Sumatra adalah cagar alam asli Rafflesia arnoldii, bunga tunggal terbesar di Bumi. Mekar tanpa akar, batang, atau daun — kelopak merah raksasanya muncul secara misterius dan bertahan hanya beberapa hari.'
    },
    en: {
      title: 'The Bloom of Rafflesia',
      body: 'Sumatra’s rainforests are the native sanctuary of Rafflesia arnoldii, the largest individual flower on Earth. Blooming without roots, stems, or leaves, its giant red petals appear mysteriously and last for only a few short days.'
    }
  },
  '05': {
    id: {
      title: 'Raksasa yang Senyap',
      body: 'Di rawa-rawa rumput Way Kambas, gajah sumatra yang terancam punah bermigrasi di koridor purba. Ekowisata mendanai patroli komunitas yang mencegah konflik manusia-gajah dan melindungi habitat mereka.'
    },
    en: {
      title: 'The Silent Giants',
      body: 'In the swamp grasslands of Way Kambas, the critically endangered Sumatran elephant migrates along ancient corridors. Eco-tourism funds community patrols that mitigate human-wildlife conflict and protect their habitat.'
    }
  }
}

const GALLERY_TRANSLATIONS: Record<string, Record<'id' | 'en', { title: string; story: string; statLabel: string }>> = {
  'hornbill': {
    id: {
      title: 'Terbangnya Rangkong Gading',
      story: 'Rangkong Gading adalah penyebar benih penting di kanopi tinggi Leuser. Diteror oleh pemburu karena paruhnya yang keras seperti gading, burung ini sekarang bergantung pada patroli anti-perburuan adat yang didanai oleh pengunjung Salingka. Setiap penjelajahan menjaga para pelindung langit ini tetap aman.',
      statLabel: 'Status Daftar Merah IUCN akibat perburuan liar'
    },
    en: {
      title: "The Helmeted Hornbill's Flight",
      story: 'The Helmeted Hornbill is a critical seed disperser in the high canopy of Leuser. Feared by poachers for its solid keratin casque, it now relies on indigenous anti-poaching patrols funded by Salingka visitors. Every trek keeps these guardians of the sky safe.',
      statLabel: 'IUCN Red List status due to poaching'
    }
  },
  'mangrove': {
    id: {
      title: 'Perlindungan Pesisir Mangrove',
      story: 'Hutan mangrove pesisir Sumatra membentuk perisai alami terhadap tsunami dan menyerap karbon sepuluh kali lebih banyak daripada hutan daratan. Kami mendukung program penanaman kembali oleh masyarakat setempat, mengembalikan tambak budidaya yang rusak menjadi pembibitan ikan yang subur.',
      statLabel: 'Mangrove pesisir ditargetkan untuk restorasi komunitas'
    },
    en: {
      title: 'Mangrove Coastal Protection',
      story: 'Sumatra’s coastal mangroves form a natural shield against tsunamis and sequester ten times more carbon than terrestrial forests. We support community-led replanting programs, turning degraded aquaculture ponds back into thriving fish nurseries.',
      statLabel: 'Of coastal mangroves targeted for local community restoration'
    }
  },
  'alas-raft': {
    id: {
      title: 'Survei Aliran Sungai Alas',
      story: 'Mengarungi jeram Sungai Alas di dalam Taman Nasional Gunung Leuser bukan sekadar petualangan. Perahu karet wisata berfungsi sebagai platform pengamatan, membantu para peneliti melacak kesehatan hutan, kebersihan air, dan koridor lintasan satwa.',
      statLabel: 'Rute sungai dipantau bulanan oleh pemandu lokal'
    },
    en: {
      title: 'Surveying the Alas River',
      story: 'Drifting down the rapids of Alas River inside the Gunung Leuser National Park is not just an adventure. Tourism rafts function as observation platforms, supporting researchers tracking forest health, water cleanliness, and animal corridors.',
      statLabel: 'Of river routes checked monthly by guide associations'
    }
  },
  'titan-arum': {
    id: {
      title: 'Mekarnya Titan Arum',
      story: 'Endemik di Sumatra, Amorphophallus titanum (Titan Arum) adalah bunga tertinggi di dunia, tumbuh hingga setinggi tiga meter. Bunga ini mekar hanya beberapa tahun sekali selama 48 jam saja, mengeluarkan bau menyengat untuk menarik serangga penyerbuk.',
      statLabel: 'Tinggi maksimal mekarnya bunga endemik Sumatra ini'
    },
    en: {
      title: 'The Titan Arum Bloom',
      story: 'Endemic to Sumatra, the Amorphophallus titanum (Titan Arum) is the tallest flower structure in the world, growing up to three meters high. It blooms only once every few years for a single 48-hour period, releasing a strong scent to attract pollinators.',
      statLabel: 'Maximum height of this Sumatran endemic bloom'
    }
  },
  'nias-stone': {
    id: {
      title: 'Tradisi Lompat Batu di Nias',
      story: 'Di Pulau Nias, ritual adat Hombo Batu (lompat batu) menampilkan para pemuda melompati tugu batu setinggi dua meter. Salingka bekerja sama dengan para sesepuh desa untuk melestarikan tradisi megalitik Nias, menjaga warisan leluhur tetap hidup melalui homestay budaya.',
      statLabel: 'Tinggi obelisk batu kokoh yang dilompati pemuda'
    },
    en: {
      title: 'Megalithic Stone Jumping of Nias',
      story: 'In Nias Island, the traditional Hombo Batu (stone jumping) ritual sees young men leap over two-meter stone towers. Salingka works directly with village elders to sustain Nias megalithic traditions, keeping heritage alive through cultural homestays.',
      statLabel: 'Height of the solid stone obelisks jumped by youth'
    }
  },
  'canopy-trek': {
    id: {
      title: 'Trekking Kanopi Leuser',
      story: 'Menjelajah jauh di dalam Gunung Leuser membutuhkan aturan etika yang ketat: tidak ada kontak fisik dengan satwa liar, meminimalisir suara, dan wajib membawa kembali sampah. Dengan mempekerjakan pemandu lokal, kami mengubah mantan penebang liar menjadi pelindung hutan.',
      statLabel: 'Mantan penebang liar kini menjadi pemandu konservasi'
    },
    en: {
      title: 'Leuser Canopy Trekking',
      story: 'Trekking deep inside Gunung Leuser requires strict ethical rules: zero physical contact with wildlife, minimal noise, and strict packing out of waste. By hiring local rangers, we turn former illegal loggers into passionate protectors of the forest.',
      statLabel: 'Former loggers now employed as wildlife guides'
    }
  }
}

const CAT_TRANSLATIONS: Record<string, Record<'id' | 'en', string>> = {
  All: { id: 'Semua', en: 'All' },
  Wildlife: { id: 'Satwa Liar', en: 'Wildlife' },
  Flora: { id: 'Flora', en: 'Flora' },
  Culture: { id: 'Budaya', en: 'Culture' },
  Conservation: { id: 'Konservasi', en: 'Conservation' }
}


// ─────────────────────────────────────────────────────────────────────────────
// SAND DISINTEGRATION IMAGE COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

function SandTransitionImage({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [isPresent, safeToRemove] = usePresence()
  const [progress, setProgress] = useState(0)
  const baseId = useId()
  const filterId = `sand-filter-${baseId.replace(/:/g, '')}`
  const animationRef = useRef<number | null>(null)
  const startTimeRef = useRef<number | null>(null)

  useEffect(() => {
    startTimeRef.current = null
    const duration = 850 // snappy 850ms transition

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp
      const elapsed = timestamp - startTimeRef.current
      const t = Math.min(elapsed / duration, 1)

      // Easing: entering is quartic ease-out, exiting is cubic ease-in
      const easeVal = isPresent
        ? 1 - Math.pow(1 - t, 4)
        : Math.pow(t, 3)

      setProgress(easeVal)

      if (t < 1) {
        animationRef.current = requestAnimationFrame(animate)
      } else {
        if (!isPresent) {
          safeToRemove?.()
        }
      }
    }

    animationRef.current = requestAnimationFrame(animate)
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [isPresent, safeToRemove])

  // Map progress to filter coefficients
  const dispScale = isPresent ? (1 - progress) * 130 : progress * 130
  const blurVal = isPresent ? (1 - progress) * 5 : progress * 5
  const opacityVal = isPresent ? progress : 1 - progress * 1.25
  const dyVal = isPresent ? (progress - 1) * 70 : progress * 100
  const dxVal = isPresent ? (progress - 1) * 25 : progress * 25

  return (
    <>
      <svg className="absolute h-0 w-0" aria-hidden="true">
        <defs>
          <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="1.8"
              numOctaves="4"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={dispScale}
              xChannelSelector="R"
              yChannelSelector="G"
              result="displaced"
            />
            <feOffset
              in="displaced"
              dx={dxVal}
              dy={dyVal}
              result="offset"
            />
            <feGaussianBlur
              in="offset"
              stdDeviation={blurVal}
              result="blur"
            />
            <feColorMatrix
              in="blur"
              type="matrix"
              values={`
                1 0 0 0 0
                0 1 0 0 0
                0 0 1 0 0
                0 0 0 ${opacityVal} 0
              `}
            />
          </filter>
        </defs>
      </svg>
      <img
        src={src}
        alt={alt}
        className={className}
        style={{ filter: `url(#${filterId})` }}
        crossOrigin="anonymous"
        referrerPolicy="no-referrer"
      />
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN JOURNEY COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export function Journey() {
  const [activeChapter, setActiveChapter] = useState(0)
  const [galleryOpen, setGalleryOpen] = useState(false)
  const [galleryCategory, setGalleryCategory] = useState<'All' | 'Wildlife' | 'Flora' | 'Culture' | 'Conservation'>('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedArticle, setSelectedArticle] = useState<GalleryItem | null>(null)
  const { lang } = useLanguage()

  const handleChapterClick = (index: number) => {
    setActiveChapter(index)
  }

  // Localize chapters
  const displayChapters = chapters.map((ch) => {
    const trans = CHAPTERS_TRANSLATIONS[ch.index]?.[lang] || {}
    return {
      ...ch,
      title: trans.title || ch.title,
      body: trans.body || ch.body
    }
  })

  // Localize gallery items
  const displayGallery = galleryItems.map((item) => {
    const trans = GALLERY_TRANSLATIONS[item.id]?.[lang] || {}
    return {
      ...item,
      title: trans.title || item.title,
      story: trans.story || item.story,
      statLabel: trans.statLabel || item.statLabel
    }
  })

  // Filter gallery items based on search query and category
  const filteredGallery = displayGallery.filter((item) => {
    const matchesCategory = galleryCategory === 'All' || item.category === galleryCategory
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.story.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <section className="relative bg-background py-24 md:py-40" id="journey" aria-label="The journey deeper">
      {/* Sumatran nature ambient glow — jungle green left, river teal right */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Kanopi hutan — deep emerald green */}
        <div
          className="absolute top-1/4 left-0 w-[500px] h-[500px] rounded-full blur-[130px] animate-pulse"
          style={{ background: 'oklch(0.30 0.09 155 / 0.13)' }}
        />
        {/* Sungai Alas — deep river teal */}
        <div
          className="absolute bottom-1/4 right-0 w-[500px] h-[500px] rounded-full blur-[130px] animate-pulse [animation-delay:2.5s]"
          style={{ background: 'oklch(0.38 0.07 190 / 0.10)' }}
        />
        {/* Top fade from orbital section */}
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-background to-transparent" />
      </div>

      <div className="mx-auto max-w-6xl px-6 relative z-10">
        {/* Section Heading */}
        <div className="mb-20 md:mb-32 text-center md:text-left">
          <motion.h2
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-serif text-4xl md:text-6xl font-medium leading-tight max-w-3xl text-balance text-foreground"
          >
            {lang === 'id' 
              ? 'Setiap langkah membawamu lebih dalam ke dunia yang lebih tua dari ingatan'
              : 'Every step takes you deeper into a world older than memory'
            }
          </motion.h2>
        </div>

        {/* Two-Column Split Screen layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-20">
          
          {/* LEFT SIDE: Sticky Image + Counter */}
          <div className="md:col-span-5 flex flex-col gap-6 sticky top-24 md:top-32 self-start z-20">
            {/* Image frame wrapper */}
            <div className="liquid-glass-strong relative aspect-[4/3] md:aspect-[4/5] w-full overflow-hidden rounded-2xl shadow-2xl">
              <AnimatePresence mode="wait">
                <SandTransitionImage
                  key={activeChapter}
                  src={displayChapters[activeChapter].image}
                  alt={displayChapters[activeChapter].imageAlt}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </AnimatePresence>
              
              {/* Vignette overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-transparent to-background/25 pointer-events-none" />
            </div>

            {/* Counter bar */}
            <div className="flex items-center justify-between text-[10px] font-mono tracking-[0.2em] text-foreground/40 uppercase px-1">
              <span>{lang === 'id' ? 'Spektrum Bab' : 'Chapter Spectrum'}</span>
              <div className="flex items-center gap-1">
                <div className="relative h-4 overflow-hidden w-6 text-right">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeChapter}
                      initial={{ y: 12, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -12, opacity: 0 }}
                      transition={{ duration: 0.35, ease: 'easeOut' }}
                      className="absolute right-0 text-foreground font-semibold"
                    >
                      {String(activeChapter + 1).padStart(2, '0')}
                    </motion.div>
                  </AnimatePresence>
                </div>
                <span>/</span>
                <span>{String(displayChapters.length).padStart(2, '0')}</span>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Scrollable Narration List */}
          <div className="md:col-span-7 flex flex-col gap-4">
            <div className="text-[10px] font-mono tracking-[0.25em] text-foreground/30 uppercase mb-4 hidden md:block">
              {lang === 'id' ? 'Jelajah · Lindungi · Hubungkan' : 'Traverse · Protect · Reconnect'}
            </div>

            {displayChapters.map((ch, idx) => {
              const isActive = activeChapter === idx
              return (
                <div
                  key={ch.index}
                  onClick={() => handleChapterClick(idx)}
                  className="group cursor-pointer border-b border-foreground/5 py-10 transition-all duration-500 last:border-0"
                >
                  {/* Category marker */}
                  <div className="flex items-center gap-3 text-[10px] font-mono tracking-widest text-primary uppercase">
                    <span>{lang === 'id' ? `Bab ${ch.index}` : `Chapter ${ch.index}`}</span>
                    {isActive && (
                      <motion.span
                        layoutId="active-indicator"
                        className="h-[1.5px] w-12 rounded-full bg-primary"
                        transition={{ type: 'spring', stiffness: 180, damping: 22 }}
                      />
                    )}
                  </div>

                  {/* Title & Arrow */}
                  <div className="mt-4 flex items-start justify-between gap-4">
                    <h3
                      className={`font-serif text-2xl md:text-[2.2rem] leading-tight font-medium tracking-tight transition-colors duration-500 ${
                        isActive ? 'text-foreground' : 'text-foreground/25 group-hover:text-foreground/55'
                      }`}
                    >
                      {ch.title}
                    </h3>
                    
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.7, rotate: -45 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        className="text-primary mt-1 flex-shrink-0"
                      >
                        <svg
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
                          />
                        </svg>
                      </motion.div>
                    )}
                  </div>

                  {/* Expandable description body */}
                  <AnimatePresence initial={false}>
                    {isActive && (
                      <motion.div
                        initial={{ height: 0, opacity: 0, marginTop: 0 }}
                        animate={{ height: 'auto', opacity: 1, marginTop: 20 }}
                        exit={{ height: 0, opacity: 0, marginTop: 0 }}
                        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="max-w-xl text-[14px] leading-[1.8] text-foreground/60 text-pretty font-light">
                           {ch.body}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}

            {/* OPEN INTERACTIVE GALLERY BUTTON */}
            <motion.button
              onClick={() => setGalleryOpen(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="liquid-glass mt-8 inline-flex w-fit items-center gap-3.5 rounded-full px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.2em] transition-all cursor-pointer"
              style={{
                border: '1px solid oklch(0.82 0.14 85 / 30%)',
                color: 'oklch(0.82 0.14 85)',
              }}
            >
              <FiBookOpen className="h-4.5 w-4.5" />
              {lang === 'id' ? 'Buka Jurnal-E & Galeri' : 'Open Eco-Journal & Gallery'}
            </motion.button>
          </div>

        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────────────────────── */}
      {/* ECO-JOURNAL GALLERY FULLSCREEN MODAL */}
      {/* ───────────────────────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {galleryOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col bg-background/95 backdrop-blur-[24px] pointer-events-auto select-none"
          >
            {/* Gallery Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-6 py-5 md:px-12">
              <div className="flex items-center gap-3">
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-full"
                  style={{ background: 'oklch(0.82 0.14 85 / 15%)' }}
                >
                  <IoLeaf className="h-4 w-4" style={{ color: 'oklch(0.82 0.14 85)' }} />
                </span>
                <div>
                  <h3 className="font-serif text-lg md:text-xl text-white">
                    {lang === 'id' ? 'Jurnal-E Salingka' : 'Salingka Eco-Journal'}
                  </h3>
                  <p className="text-[9px] uppercase tracking-widest text-white/40 mt-0.5">
                    {lang === 'id' ? 'Repositori Konservasi Sumatra' : 'Sumatran Conservation Repository'}
                  </p>
                </div>
              </div>
              
              <button
                onClick={() => {
                  setGalleryOpen(false)
                  setSelectedArticle(null)
                }}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white/60 transition-colors hover:border-white hover:text-white cursor-pointer"
                aria-label="Close Gallery"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            {/* Gallery Content Area */}
            <div className="flex-1 overflow-y-auto px-6 py-8 md:px-12 info-panel-scroll">
              <div className="mx-auto max-w-7xl">
                
                {/* Search & Categories Bar */}
                <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  {/* Category Buttons */}
                  <div className="flex flex-wrap gap-2.5">
                    {(['All', 'Wildlife', 'Flora', 'Culture', 'Conservation'] as const).map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setGalleryCategory(cat)}
                        className={`rounded-full px-5 py-2.5 text-[10px] font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                          galleryCategory === cat
                            ? 'bg-primary text-black'
                            : 'liquid-glass text-white/60 hover:text-white'
                        }`}
                      >
                        {CAT_TRANSLATIONS[cat]?.[lang] || cat}
                      </button>
                    ))}
                  </div>

                  {/* Search Bar */}
                  <div className="relative w-full max-w-sm">
                    <FiSearch className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
                    <input
                      type="text"
                      placeholder={lang === 'id' ? 'Cari kisah, spesies, wilayah...' : 'Search stories, species, regions...'}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full rounded-full border border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-xs tracking-wider text-white placeholder-white/30 outline-none focus:border-primary/50 focus:bg-white/10 transition-all"
                    />
                  </div>
                </div>

                {/* Cards Grid */}
                {filteredGallery.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredGallery.map((item) => (
                      <motion.div
                        key={item.id}
                        layoutId={`card-${item.id}`}
                        onClick={() => setSelectedArticle(item)}
                        whileHover={{ y: -6 }}
                        className="liquid-glass group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 cursor-pointer aspect-[4/3] shadow-lg shadow-black/20"
                      >
                        {/* Card Image */}
                        <img
                          src={item.image}
                          alt={item.imageAlt}
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          crossOrigin="anonymous"
                          referrerPolicy="no-referrer"
                        />
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent opacity-85 transition-opacity duration-300 group-hover:opacity-95" />

                        {/* Card Meta Content */}
                        <div className="relative mt-auto flex flex-col p-6 z-10">
                          <span className="text-[8px] font-semibold uppercase tracking-[0.25em] text-primary w-fit rounded bg-primary/10 px-2 py-0.5 mb-2.5">
                            {CAT_TRANSLATIONS[item.category as keyof typeof CAT_TRANSLATIONS]?.[lang] || item.category}
                          </span>
                          <h4 className="font-serif text-lg md:text-xl text-white group-hover:text-primary transition-colors leading-tight">
                            {item.title}
                          </h4>
                          <p className="mt-2 text-[10px] uppercase tracking-widest text-white/40 group-hover:text-white/60 transition-colors flex items-center gap-1.5 font-semibold">
                            {lang === 'id' ? 'Baca Kisah' : 'Read Story'} <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 text-center text-white/40">
                    <FiCompass className="h-10 w-10 animate-spin opacity-50 mb-4" />
                    <p className="text-sm tracking-wider uppercase font-semibold">
                      {lang === 'id' ? 'Tidak ada entri jurnal yang cocok dengan pencarian' : 'No journal entries found matching search'}
                    </p>
                  </div>
                )}

              </div>
            </div>

            {/* Detail View Overlay (National Geographic style inside modal) */}
            <AnimatePresence>
              {selectedArticle && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-[110] flex items-center justify-center bg-background/95 p-4 md:p-10 pointer-events-auto"
                >
                  <motion.div
                    layoutId={`card-${selectedArticle.id}`}
                    className="liquid-glass-strong relative flex h-full max-h-[720px] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-white/10 md:flex-row shadow-2xl"
                  >
                    {/* Left Column: Cover Image */}
                    <div className="relative h-48 w-full md:h-full md:w-1/2 flex-shrink-0">
                      <img
                        src={selectedArticle.image}
                        alt={selectedArticle.imageAlt}
                        className="absolute inset-0 h-full w-full object-cover"
                        crossOrigin="anonymous"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/30 md:bg-gradient-to-r md:from-transparent md:to-background" />
                    </div>

                    {/* Right Column: Narrative Panel */}
                    <div className="flex-1 overflow-y-auto p-6 md:p-10 info-panel-scroll flex flex-col gap-6">
                      
                      {/* Close detail button */}
                      <button
                        onClick={() => setSelectedArticle(null)}
                        className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/45 text-white/70 hover:border-white hover:text-white cursor-pointer z-20"
                        aria-label="Back to grid"
                      >
                        <FiX className="h-4.5 w-4.5" />
                      </button>

                      {/* Meta & Category */}
                      <div className="flex items-center gap-3">
                        <span className="text-[9px] font-semibold uppercase tracking-[0.25em] text-primary rounded bg-primary/15 px-2.5 py-1">
                          {CAT_TRANSLATIONS[selectedArticle.category as keyof typeof CAT_TRANSLATIONS]?.[lang] || selectedArticle.category}
                        </span>
                        <span className="text-[9px] font-mono tracking-widest text-white/30 uppercase">
                          {lang === 'id' ? 'Entri Jurnal Salingka' : 'Salingka Journal Entry'}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="font-serif text-2xl md:text-[2rem] leading-tight text-white pr-8">
                        {selectedArticle.title}
                      </h3>

                      <div className="h-px bg-gradient-to-r from-primary/45 to-transparent w-2/3" />

                      {/* Core Narrative */}
                      <p className="text-[13.5px] leading-[1.8] text-white/60 font-light text-justify text-pretty">
                        {selectedArticle.story}
                      </p>

                      {/* Conservation Info Stat Card */}
                      <div className="liquid-glass mt-auto rounded-2xl p-5 border border-white/5 flex gap-4 items-center">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <FiAward className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-[12px] font-bold tracking-wider text-primary uppercase leading-none">
                            {selectedArticle.stat}
                          </p>
                          <p className="text-[10px] text-white/40 mt-1 leading-normal">
                            {selectedArticle.statLabel}
                          </p>
                        </div>
                      </div>

                    </div>

                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

          </motion.div>
        )}
      </AnimatePresence>

    </section>
  )
}
