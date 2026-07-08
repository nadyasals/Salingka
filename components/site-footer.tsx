'use client'

import { IoLeaf, IoTrendingUp } from 'react-icons/io5'
import { GiPineTree } from 'react-icons/gi'
import { FiInstagram, FiYoutube, FiTwitter, FiMail, FiMapPin } from 'react-icons/fi'
import { useLanguage } from '@/components/language-context'

export function SiteFooter() {
  const { lang } = useLanguage()

  return (
    <footer className="relative border-t border-foreground/10 dark:border-white/10 bg-transparent dark:bg-background/50 dark:backdrop-blur-md">
      {/* Main Footer Grid */}
      <div className="mx-auto max-w-7xl px-6 py-20 md:px-10">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          
          {/* Column 1: Brand & About */}
          <div className="flex flex-col gap-5">
            <a href="#" className="group flex items-center gap-3 w-fit" aria-label="Salingka Home">
              <span
                className="relative flex h-8 w-8 items-center justify-center rounded-full"
                style={{ background: 'oklch(0.82 0.14 85 / 15%)' }}
              >
                <IoLeaf className="h-4.5 w-4.5 text-primary" style={{ color: 'oklch(0.82 0.14 85)' }} />
              </span>
              <span className="font-serif text-2xl tracking-wide text-white transition-colors group-hover:text-primary">
                Salingka
              </span>
            </a>
            <p className="text-[13px] leading-relaxed text-foreground/70 dark:text-white/50 max-w-xs">
              {lang === 'id'
                ? 'Platform ekowisata yang berfokus pada konservasi, berdedikasi melestarikan hutan hujan yang alami, megafauna purba, dan warisan budaya adat Sumatra.'
                : 'A pioneering conservation-first ecotourism platform dedicated to preserving the pristine rainforests, ancient mega-fauna, and rich indigenous heritage of Sumatra.'
              }
            </p>
          </div>

          {/* Column 2: Navigation */}
          <div className="flex flex-col gap-5">
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-foreground/80 dark:text-white/80">
              {lang === 'id' ? 'Jelajah' : 'Explore'}
            </h4>
            <nav className="flex flex-col gap-3 text-xs tracking-wider text-foreground/70 dark:text-white/50">
              <a href="#orbital" className="transition-colors hover:text-primary">
                {lang === 'id' ? 'Ringkasan' : 'Overview'}
              </a>
              <a href="#journey" className="transition-colors hover:text-primary">
                {lang === 'id' ? 'Perjalanan' : 'Our Journey'}
              </a>
              <a href="#impact" className="transition-colors hover:text-primary">
                {lang === 'id' ? 'Dampak Lingkungan' : 'Eco Impact'}
              </a>
              <a href="#packages" className="transition-colors hover:text-primary">
                {lang === 'id' ? 'Paket Ekspedisi' : 'Expedition Packages'}
              </a>
            </nav>
          </div>

          {/* Column 3: SDG Commitments */}
          <div className="flex flex-col gap-5">
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-foreground/80 dark:text-white/80">
              {lang === 'id' ? 'Komitmen SDG' : 'SDG Commitments'}
            </h4>
            <div className="flex flex-col gap-3.5">
              
              {/* SDG 8 Badge */}
              <div className="flex w-fit items-center gap-3 rounded-xl border border-[#f59e0b]/20 bg-[#f59e0b]/5 px-3.5 py-2 text-[10px] text-[#f59e0b] shadow-sm">
                <IoTrendingUp className="h-5 w-5 flex-shrink-0" />
                <div className="flex flex-col leading-none">
                  <span className="font-bold">SDG 8</span>
                  <span className="text-[8px] opacity-75 mt-0.5">{lang === 'id' ? 'Pekerjaan Layak & Pertumbuhan Ekonomi' : 'Decent Work & Economic Growth'}</span>
                </div>
              </div>

              {/* SDG 15 Badge */}
              <div className="flex w-fit items-center gap-3 rounded-xl border border-[#4ade80]/20 bg-[#4ade80]/5 px-3.5 py-2 text-[10px] text-[#4ade80] shadow-sm">
                <GiPineTree className="h-5 w-5 flex-shrink-0" />
                <div className="flex flex-col leading-none">
                  <span className="font-bold">SDG 15</span>
                  <span className="text-[8px] opacity-75 mt-0.5">{lang === 'id' ? 'Ekosistem Darat' : 'Kehidupan di Darat'}</span>
                </div>
              </div>

            </div>
          </div>

          {/* Column 4: Contact & Socials */}
          <div className="flex flex-col gap-5">
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-foreground/80 dark:text-white/80">
              {lang === 'id' ? 'Hubungi' : 'Get in Touch'}
            </h4>
            <div className="flex flex-col gap-3 text-xs tracking-wider text-foreground/70 dark:text-white/50">
              <a href="mailto:hello@salingka.com" className="flex items-center gap-2.5 transition-colors hover:text-primary">
                <FiMail className="h-4 w-4" />
                hello@salingka.com
              </a>
              <p className="flex items-start gap-2.5">
                <FiMapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>
                  {lang === 'id' ? (
                    <>Padang, Sumatra Barat,<br />Indonesia</>
                  ) : (
                    <>Padang, West Sumatra,<br />Indonesia</>
                  )}
                </span>
              </p>
            </div>
            
            {/* Social Icons */}
            <div className="flex gap-4 mt-1">
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-foreground/10 dark:border-white/10 text-foreground/60 dark:text-white/50 transition-colors hover:border-primary hover:text-primary"
                aria-label="Instagram"
              >
                <FiInstagram className="h-4 w-4" />
              </a>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-foreground/10 dark:border-white/10 text-foreground/60 dark:text-white/50 transition-colors hover:border-primary hover:text-primary"
                aria-label="YouTube"
              >
                <FiYoutube className="h-4 w-4" />
              </a>
              <a
                href="#"
                onClick={(e) => e.preventDefault()}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-foreground/10 dark:border-white/10 text-foreground/60 dark:text-white/50 transition-colors hover:border-primary hover:text-primary"
                aria-label="Twitter"
              >
                <FiTwitter className="h-4 w-4" />
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Footer Bottom Bar */}
      <div className="border-t border-foreground/5 dark:border-white/5 bg-transparent dark:bg-black/20 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 text-[10px] uppercase tracking-[0.25em] text-foreground/60 dark:text-white/35 md:flex-row md:px-10">
          <span>
            {lang === 'id'
              ? '© 2026 Salingka. Hak cipta dilindungi.'
              : '© 2026 Salingka. All rights reserved.'
            }
          </span>
          <span className="italic">
            {lang === 'id'
              ? '"Tinggalkan hanya jejak, bawa hanya kenangan"'
              : '"Leave only footprints, take only memories"'
            }
          </span>
        </div>
      </div>
    </footer>

  )
}
