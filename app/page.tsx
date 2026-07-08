import { HeroScene } from '@/components/hero-scene'
import { OrbitalNavigation } from '@/components/orbital-navigation'
import { Journey } from '@/components/journey'
import { EcoImpact } from '@/components/eco-impact'
import { Packages } from '@/components/packages'
import { ResponsibleChecklist } from '@/components/responsible-checklist'
import { Expedition } from '@/components/expedition'
import { SiteFooter } from '@/components/site-footer'
import { Atmosphere } from '@/components/atmosphere'
import { LanguageProvider } from '@/components/language-context'
import { ThemeProvider } from '@/components/theme-context'

export default function Page() {
  return (
    <LanguageProvider>
      <ThemeProvider>
        <main className="relative">
          {/*
           * Atmosphere is a fixed overlay (z-50) — fireflies, mist, and leaves
           * stay visible across every scroll section for a continuous depth effect.
           * */}
          <Atmosphere />

          {/* ── Hero: cinematic branch-framed parallax (from jungle-depth-voyage) ── */}
          <HeroScene />

          {/* ── Body sections (from Salingka) ──────────────────────────────────── */}
          <OrbitalNavigation />
          <Journey />
          <EcoImpact />
          <Packages />
          <ResponsibleChecklist />
          <Expedition />
          <SiteFooter />
        </main>
      </ThemeProvider>
    </LanguageProvider>
  )
}
