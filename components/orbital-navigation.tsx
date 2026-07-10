'use client'

/**
 * OrbitalNavigation — Cinematic 3D "Eco Globe" interactive navigator
 *
 * Architecture:
 *   OrbitalNavigation (root, manages shared refs & React state)
 *     └─ <Canvas>
 *          └─ <OrbitalScene>
 *               ├─ Lighting rig (cinematic three-point)
 *               ├─ <fog>
 *               ├─ <Stars>
 *               ├─ <AtmosphericParticles>
 *               ├─ <OrbitalRing>
 *               ├─ <CentralIsland>
 *               │    └─ {locations.map <HotspotMarker>}  ← children → rotate with island
 *               ├─ <CameraRig>           ← smooth lerp animator, useFrame only
 *               └─ <OrbitControls>
 *        └─ HTML overlays (framer-motion)
 *               ├─ <OrbitOverlay>        ← title & instructions in orbit mode
 *               ├─ <InfoPanel>           ← location detail slide-up panel
 *               └─ <FlightIndicator>     ← "Approaching…" status strip
 */

import {
  useRef,
  useState,
  useMemo,
  useEffect,
  useCallback,
  type MutableRefObject,
} from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Html, OrbitControls, Stars, Sphere } from '@react-three/drei'
import * as THREE from 'three'
import { motion, AnimatePresence } from 'framer-motion'
import { Navbar } from '@/components/navbar'
import { IoLeaf, IoLeafOutline } from 'react-icons/io5'
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi'
import { useLanguage } from '@/components/language-context'
import { useTheme } from '@/components/theme-context'

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

type CameraState = 'orbit' | 'flying-to' | 'at-hotspot' | 'flying-back'

interface EcoLocation {
  id: string
  name: string
  subtitle: string
  description: string
  ecoFact: string
  /** Local position on the unit island surface (will be normalized at click time) */
  position: [number, number, number]
  color: string
  ecoRating: number
}

// ─────────────────────────────────────────────────────────────────────────────
// ECO-TOURISM DATA
// ─────────────────────────────────────────────────────────────────────────────

function fade(t: number) {
  return t * t * t * (t * (t * 6 - 15) + 10)
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function hash2(x: number, z: number) {
  const value = Math.sin(x * 127.1 + z * 311.7) * 43758.5453123
  return value - Math.floor(value)
}

function valueNoise2D(x: number, z: number) {
  const xi = Math.floor(x)
  const zi = Math.floor(z)
  const xf = x - xi
  const zf = z - zi

  const topLeft = hash2(xi, zi)
  const topRight = hash2(xi + 1, zi)
  const bottomLeft = hash2(xi, zi + 1)
  const bottomRight = hash2(xi + 1, zi + 1)

  const u = fade(xf)
  const v = fade(zf)

  return lerp(
    lerp(topLeft, topRight, u),
    lerp(bottomLeft, bottomRight, u),
    v,
  )
}

function fbmTerrain(x: number, z: number, time = 0) {
  let value = 0
  let amplitude = 0.42
  let frequency = 0.55

  for (let octave = 0; octave < 5; octave += 1) {
    const sample = valueNoise2D(
      x * frequency + time * 0.012 * (octave + 1),
      z * frequency - time * 0.01 * (octave + 1),
    )
    value += amplitude * sample
    amplitude *= 0.5
    frequency *= 2.05
  }

  const ridgeBand = Math.exp(-((z + 0.7) * (z + 0.7)) * 0.22)
  const mountainCore = Math.exp(-((x + 1.1) * (x + 1.1) + (z - 0.55) * (z - 0.55)) * 0.18)
  const coastalShelf = Math.exp(-((x - 2.35) * (x - 2.35) + (z + 1.55) * (z + 1.55)) * 0.14)

  return (value - 0.5) * 0.34 + ridgeBand * 0.2 + mountainCore * 0.18 + coastalShelf * 0.15
}

function terrainHeightAt(x: number, z: number, time = 0) {
  return fbmTerrain(x * 0.92, z * 0.92, time) * 0.62
}

const ECO_LOCATIONS: EcoLocation[] = [
  {
    id: 'danau-toba',
    name: 'Danau Toba',
    subtitle: 'Supervolcanic Highland Lake',
    description:
      'Born from a cataclysmic supervolcanic eruption 74,000 years ago, Danau Toba is the world\'s largest volcanic lake. Surrounded by ancient Batak villages perched on cloud-piercing ridges, it is Sumatra\'s most sacred and otherworldly landscape.',
    ecoFact:
      'Home to critically endemic freshwater species found in no other lake on Earth, alongside the ancient Batak indigenous civilization and its living megalithic culture.',
    position: [-1.2, 0.4, 0.5],
    color: '#4ade80',
    ecoRating: 5,
  },
  {
    id: 'gunung-leuser',
    name: 'Gunung Leuser',
    subtitle: 'Last Eden of Southeast Asia',
    description:
      'A UNESCO World Heritage Site where Sumatran tigers, orangutans, rhinos, and elephants still share the same ancient canopy. The Leuser Ecosystem is one of the last intact tropical rainforests on Earth — the true lungs of Sumatra, and of our planet.',
    ecoFact:
      'Sequesters millions of metric tons of carbon annually. Losing Leuser is inseparable from losing the fight against global climate change.',
    position: [-3.0, 0.5, -1.8],
    color: '#f59e0b',
    ecoRating: 5,
  },
  {
    id: 'bukit-lawang',
    name: 'Bukit Lawang',
    subtitle: 'Gateway to the Orangutan Forest',
    description:
      'On the banks of the emerald Bahorok River, Bukit Lawang is the soul of Sumatran eco-tourism. Every jungle trek funds local ranger patrols protecting the forest, and every encounter with a wild orangutan is a memory that lasts a lifetime.',
    ecoFact:
      'Orangutan rehabilitation began here in 1973. Now a world-renowned model for wildlife-tourism coexistence, protecting over 800 orangutans in the wild.',
    position: [-2.0, 0.4, -0.8],
    color: '#22d3ee',
    ecoRating: 4,
  },
  {
    id: 'harau',
    name: 'Lembah Harau',
    subtitle: 'Granite Canyons & Paddy Valleys',
    description:
      'A breathtaking nature reserve surrounded by sheer 100-meter granite cliffs, cascading waterfalls, and vibrant rice paddies. Local Minangkabau villages here offer sustainable homestays and guided treks through the valley\'s unique tropical ecosystems.',
    ecoFact:
      'Community-led tourism helps protect the natural habitat of wild gibbons and hornbills nesting in the high cliffs while directly funding local organic farming initiatives.',
    position: [-0.2, 0.4, 0.8],
    color: '#84cc16',
    ecoRating: 4,
  },
  {
    id: 'kerinci-seblat',
    name: 'Kerinci Seblat',
    subtitle: 'Active Volcanic Rainforest',
    description:
      'The largest national park in Sumatra, home to Mount Kerinci and a vital refuge for the critically endangered Sumatran tiger. It spans volcanic peaks, high-altitude lakes, and dense pine forests.',
    ecoFact:
      'Holds the highest density of Sumatran tigers in the wild, monitored by dedicated indigenous community ranger teams.',
    position: [1.0, -0.2, 1.2],
    color: '#fb7185',
    ecoRating: 5,
  },
  {
    id: 'nias',
    name: 'Pulau Nias',
    subtitle: 'Ancient Culture & Pristine Reefs',
    description:
      'Where megalithic stone temples stand beside world-class surf breaks and pristine coral reefs. Nias is one of Indonesia\'s most culturally and ecologically intact islands — a place time has barely touched, where ancient tradition meets the untouched ocean.',
    ecoFact:
      'Nias reefs host 1,200 species of reef fish within a protected marine sanctuary spanning 58,000 hectares of pristine coral garden.',
    position: [-2.2, 0.2, 0.2],
    color: '#a78bfa',
    ecoRating: 4,
  },
  {
    id: 'mentawai',
    name: 'Mentawai (Siberut)',
    subtitle: 'Indigenous Tribal Eco-Sanctuary',
    description:
      'Siberut Island is a UNESCO Biosphere Reserve and home to the Mentawai tribe. Living deep inside the ancient rainforest in traditional Uma houses, the Mentawai practice a sustainable way of life governed by forest spirits, sago farming, and natural healing.',
    ecoFact:
      'Tourism here supports the preservation of the ancient Arat Sabulungan indigenous culture and funds community-run school projects that teach Mentawai traditions to children.',
    position: [-1.2, 0.2, 1.2],
    color: '#14b8a6',
    ecoRating: 5,
  },
  {
    id: 'bengkulu',
    name: 'Bengkulu',
    subtitle: 'Home of the Giant Rafflesia',
    description:
      'The rainforests of Bengkulu are the native habitat of Rafflesia arnoldii, the world\'s largest individual flower. Blooming mysteriously without roots, leaves, or stems, this giant flower blooms for only a few short days, representing Sumatra\'s most ephemeral botanical wonder.',
    ecoFact:
      'Rafflesia is a parasitic plant that depends entirely on the Tetrastigma vine. Bengkulu local communities actively patrol and protect bloom sites to conserve these rare plants.',
    position: [2.0, 0.4, 1.6],
    color: '#ef4444',
    ecoRating: 5,
  },
  {
    id: 'way-kambas',
    name: 'Way Kambas',
    subtitle: 'Lowland Elephant Sanctuary',
    description:
      'A massive national park on Sumatra\'s southern tip, famous for its swamp forests and savanna grasslands. It is the premier sanctuary for the endangered Sumatran elephant and the highly elusive Sumatran rhinoceros.',
    ecoFact:
      'Pioneered community-led human-elephant conflict mitigation programs and hosts one of the only active breeding sanctuaries for Sumatran rhinos.',
    position: [3.0, -0.6, 2.0],
    color: '#fbbf24',
    ecoRating: 4,
  },
]

const LOCATION_TRANSLATIONS: Record<string, Record<'id' | 'en', { subtitle: string; description: string; ecoFact: string }>> = {
  'danau-toba': {
    id: {
      subtitle: 'Danau Vulkanik Terbesar di Dunia',
      description: 'Terbentuk dari letusan supervolcano dahsyat 74.000 tahun lalu, Danau Toba adalah danau vulkanik terbesar di dunia. Dikelilingi desa-desa tua suku Batak yang bertengger di punggungan bercadar awan, tempat ini menjadi lanskap Sumatra yang paling sakral dan tak terlupakan.',
      ecoFact: 'Rumah bagi spesies air tawar endemik yang tak ditemukan di danau manapun di Bumi, hidup berdampingan dengan peradaban adat Batak dan budaya megalitiknya yang masih lestari.'
    },
    en: {
      subtitle: 'Supervolcanic Highland Lake',
      description: 'Born from a cataclysmic supervolcanic eruption 74,000 years ago, Danau Toba is the world\'s largest volcanic lake. Surrounded by ancient Batak villages perched on cloud-piercing ridges, it is Sumatra\'s most sacred and otherworldly landscape.',
      ecoFact: 'Home to critically endemic freshwater species found in no other lake on Earth, alongside the ancient Batak indigenous civilization and its living megalithic culture.'
    }
  },
  'gunung-leuser': {
    id: {
      subtitle: 'Surga Terakhir Asia Tenggara',
      description: 'Situs Warisan Dunia UNESCO tempat harimau sumatra, orangutan, badak, dan gajah masih berbagi kanopi hutan purba yang sama. Ekosistem Leuser adalah salah satu hutan hujan tropis utuh terakhir di Bumi — paru-paru Sumatra, dan paru-paru planet kita.',
      ecoFact: 'Menyerap jutaan ton karbon setiap tahun. Kehilangan Leuser sama artinya dengan kalah melawan perubahan iklim global.'
    },
    en: {
      subtitle: 'Last Eden of Southeast Asia',
      description: 'A UNESCO World Heritage Site where Sumatran tigers, orangutans, rhinos, and elephants still share the same ancient canopy. The Leuser Ecosystem is one of the last intact tropical rainforests on Earth — the true lungs of Sumatra, and of our planet.',
      ecoFact: 'Sequesters millions of metric tons of carbon annually. Losing Leuser is inseparable from losing the fight against global climate change.'
    }
  },
  'bukit-lawang': {
    id: {
      subtitle: 'Pintu Masuk ke Hutan Orangutan',
      description: 'Di tepi Sungai Bahorok yang hijau zamrud, Bukit Lawang adalah jiwa ekowisata Sumatra. Setiap trek hutan mendanai patroli ranger lokal yang menjaga kelestariannya — dan setiap momen bersama orangutan liar adalah kenangan seumur hidup.',
      ecoFact: 'Rehabilitasi orangutan dimulai di sini sejak 1973. Kini menjadi model dunia untuk wisata yang hidup berdampingan dengan satwa liar, melindungi lebih dari 800 orangutan di alam bebas.'
    },
    en: {
      subtitle: 'Gateway to the Orangutan Forest',
      description: 'On the banks of the emerald Bahorok River, Bukit Lawang is the soul of Sumatran eco-tourism. Every jungle trek funds local ranger patrols protecting the forest, and every encounter with a wild orangutan is a memory that lasts a lifetime.',
      ecoFact: 'Orangutan rehabilitation began here in 1973. Now a world-renowned model for wildlife-tourism coexistence, protecting over 800 orangutans in the wild.'
    }
  },
  'harau': {
    id: {
      subtitle: 'Tebing Granit & Lembah Sawah',
      description: 'Cagar alam memukau yang dikelilingi tebing granit setinggi 100 meter, air terjun deras, dan hamparan sawah yang subur. Desa-desa Minangkabau di sini menawarkan homestay berkelanjutan dan trekking bersama pemandu lokal melalui ekosistem tropis yang unik.',
      ecoFact: 'Wisata berbasis komunitas melindungi habitat siamang liar dan enggang yang bersarang di tebing tinggi, sekaligus mendanai pertanian organik lokal.'
    },
    en: {
      subtitle: 'Granite Canyons & Paddy Valleys',
      description: 'A breathtaking nature reserve surrounded by sheer 100-meter granite cliffs, cascading waterfalls, and vibrant rice paddies. Local Minangkabau villages here offer sustainable homestays and guided treks through the valley\'s unique tropical ecosystems.',
      ecoFact: 'Community-led tourism helps protect the natural habitat of wild gibbons and hornbills nesting in the high cliffs while directly funding local organic farming initiatives.'
    }
  },
  'kerinci-seblat': {
    id: {
      subtitle: 'Hutan Hujan di Kaki Gunung Berapi',
      description: 'Taman nasional terbesar di Sumatra, rumah bagi Gunung Kerinci dan perlindungan vital harimau sumatra yang terancam punah. Hamparan puncak vulkanik, danau pegunungan, dan hutan pinus lebat — semua dalam satu kawasan.',
      ecoFact: 'Memiliki kepadatan harimau sumatra tertinggi di alam liar, dipantau oleh tim ranger adat setempat.',
    },
    en: {
      subtitle: 'Active Volcanic Rainforest',
      description: 'The largest national park in Sumatra, home to Mount Kerinci and a vital refuge for the critically endangered Sumatran tiger. It spans volcanic peaks, high-altitude lakes, and dense pine forests.',
      ecoFact: 'Holds the highest density of Sumatran tigers in the wild, monitored by dedicated indigenous community ranger teams.'
    }
  },
  'nias': {
    id: {
      subtitle: 'Budaya Purba & Terumbu Karang Perawan',
      description: 'Kuil batu megalitik berdiri di samping ombak kelas dunia dan terumbu karang yang masih perawan. Nias adalah salah satu pulau paling utuh secara budaya dan ekologi di Indonesia — tempat tradisi leluhur bertemu samudra yang belum terjamah.',
      ecoFact: 'Terumbu karang Nias menampung lebih dari 1.200 spesies ikan karang dalam kawasan suaka laut seluas 58.000 hektar.'
    },
    en: {
      subtitle: 'Ancient Culture & Pristine Reefs',
      description: 'Where megalithic stone temples stand beside world-class surf breaks and pristine coral reefs. Nias is one of Indonesia\'s most culturally and ecologically intact islands — a place time has barely touched, where ancient tradition meets the untouched ocean.',
      ecoFact: 'Nias reefs host 1,200 species of reef fish within a protected marine sanctuary spanning 58,000 hectares of pristine coral garden.'
    }
  },
  'mentawai': {
    id: {
      subtitle: 'Suaka Alam Suku Pedalaman',
      description: 'Pulau Siberut adalah Cagar Biosfer UNESCO dan rumah suku Mentawai. Tinggal jauh di dalam hutan hujan purba di rumah adat Uma, suku Mentawai menjalani hidup berkelanjutan yang diatur oleh roh hutan, budidaya sagu, dan pengobatan alami.',
      ecoFact: 'Wisata di sini mendukung pelestarian budaya Arat Sabulungan dan mendanai sekolah adat yang mengajarkan tradisi Mentawai kepada generasi muda.'
    },
    en: {
      subtitle: 'Indigenous Tribal Eco-San Sanctuary',
      description: 'Siberut Island is a UNESCO Biosphere Reserve and home to the Mentawai tribe. Living deep inside the ancient rainforest in traditional Uma houses, the Mentawai practice a sustainable way of life governed by forest spirits, sago farming, and natural healing.',
      ecoFact: 'Tourism here supports the preservation of the ancient Arat Sabulungan indigenous culture and funds community-run school projects that teach Mentawai traditions to children.'
    }
  },
  'bengkulu': {
    id: {
      subtitle: 'Tanah Kelahiran Rafflesia Raksasa',
      description: 'Hutan hujan Bengkulu adalah habitat asli Rafflesia arnoldii, bunga tunggal terbesar di dunia. Tumbuh misterius tanpa akar, daun, atau batang — bunga raksasa ini mekar hanya beberapa hari, menjadi keajaiban botani Sumatra yang paling menakjubkan.',
      ecoFact: 'Rafflesia adalah tanaman parasit yang bergantung sepenuhnya pada tanaman merambat Tetrastigma. Warga lokal aktif berpatroli melindungi setiap situs mekarnya.'
    },
    en: {
      subtitle: 'Home of the Giant Rafflesia',
      description: 'The rainforests of Bengkulu are the native habitat of Rafflesia arnoldii, the world\'s largest individual flower. Blooming mysteriously without roots, leaves, or stems, this giant flower blooms for only a few short days, representing Sumatra\'s most ephemeral botanical wonder.',
      ecoFact: 'Rafflesia is a parasitic plant that depends entirely on the Tetrastigma vine. Bengkulu local communities actively patrol and protect bloom sites to conserve these rare plants.'
    }
  },
  'way-kambas': {
    id: {
      subtitle: 'Surga Gajah di Dataran Rendah',
      description: 'Taman nasional luas di ujung selatan Sumatra, terkenal dengan rawa dan sabananya. Ini adalah suaka utama gajah sumatra yang terancam punah dan badak sumatra yang sangat langka.',
      ecoFact: 'Pelopor program mitigasi konflik manusia-gajah berbasis komunitas, dan menjadi satu-satunya tempat penangkaran badak sumatra yang masih aktif di dunia.'
    },
    en: {
      subtitle: 'Lowland Elephant Sanctuary',
      description: 'A massive national park on Sumatra\'s southern tip, famous for its swamp forests and savanna grasslands. It is the premier sanctuary for the endangered Sumatran elephant and the highly elusive Sumatran rhinoceros.',
      ecoFact: 'Pioneered community-led human-elephant conflict mitigation programs and hosts one of the only active breeding sanctuaries for Sumatran rhinos.'
    }
  }
}


// ─────────────────────────────────────────────────────────────────────────────
// SCENE CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const DEFAULT_CAM_POS   = new THREE.Vector3(0, 7.8, 9.2)
const DEFAULT_LOOK_AT   = new THREE.Vector3(0, 0, 0)
const CAM_LERP_SPEED    = 0.075
const ARRIVAL_THRESHOLD = 0.09

// ─────────────────────────────────────────────────────────────────────────────
// ATMOSPHERIC PARTICLES
// Slow-drifting green-tinted dust cloud, 500 particles
// ─────────────────────────────────────────────────────────────────────────────

function AtmosphericParticles({ count = 500 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null)

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * 28
      arr[i * 3 + 1] = (Math.random() - 0.5) * 28
      arr[i * 3 + 2] = (Math.random() - 0.5) * 28
    }
    return arr
  }, [count])

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime()
    ref.current.rotation.y = t * 0.011
    ref.current.rotation.x = t * 0.005
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#4ade80"
        transparent
        opacity={0.28}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ORBITAL RING
// Subtle equatorial accent ring in world space (doesn't rotate with island)
// ─────────────────────────────────────────────────────────────────────────────

function OrbitalRing() {
  const ref = useRef<THREE.Mesh>(null)

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.z = clock.getElapsedTime() * 0.04
      ref.current.rotation.x = Math.PI / 2 + Math.sin(clock.getElapsedTime() * 0.08) * 0.06
    }
  })

  return (
    <mesh ref={ref}>
      <ringGeometry args={[2.1, 2.16, 80]} />
      <meshBasicMaterial
        color="#1f6b40"
        transparent
        opacity={0.1}
        side={THREE.DoubleSide}
        depthWrite={false}
      />
    </mesh>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// HOTSPOT MARKER
// Rendered as a child of the island group → auto-rotates with the planet.
// Uses <Html> from drei for screen-projected interactive UI.
// ─────────────────────────────────────────────────────────────────────────────

function HotspotMarker({
  location,
  onClick,
  isAnyActive,
  isActive,
  islandPausedRef,
  terrainTimeRef,
}: {
  location: EcoLocation
  onClick: () => void
  isAnyActive: boolean
  isActive: boolean
  islandPausedRef: MutableRefObject<boolean>
  terrainTimeRef: MutableRefObject<number>
}) {
  const groupRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)

  // Gentle float — modulates only the Y offset within the group
  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const elapsed = clock.getElapsedTime()
    const t = islandPausedRef.current ? terrainTimeRef.current : elapsed * 0.65
    groupRef.current.position.y =
      terrainHeightAt(location.position[0], location.position[2], t) +
      0.14 +
      Math.sin(elapsed * 1.25 + location.position[0] * 4.7) * 0.018
  })

  const handleHover = (isHovered: boolean) => {
    setHovered(isHovered)
  }

  return (
    <group
      ref={groupRef}
      position={[location.position[0], location.position[1], location.position[2]]}
    >
      {/* 3D core node (standardized as a sphere using Drei's Sphere) */}
      <Sphere
        args={[0.08, 32, 32]}
        scale={hovered ? 1.5 : 1}
        onClick={(e) => {
          e.stopPropagation()
          onClick()
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          handleHover(true)
        }}
        onPointerOut={(e) => {
          e.stopPropagation()
          handleHover(false)
        }}
      >
        <meshBasicMaterial color={location.color} />
      </Sphere>

      {/* Screen-space Html marker */}
      <Html
        center
        distanceFactor={7.5}
        zIndexRange={[20, 0]}
        style={{
          pointerEvents: 'auto',
          opacity: isAnyActive && !isActive ? (hovered ? 1.0 : 0.35) : 1.0,
          transition: 'opacity 0.3s ease',
        }}
      >
        <button
          id={`hotspot-${location.id}`}
          onClick={(e) => {
            e.stopPropagation()
            onClick()
          }}
          onMouseEnter={() => handleHover(true)}
          onMouseLeave={() => handleHover(false)}
          className="group flex flex-col items-center gap-2 cursor-pointer focus:outline-none"
          aria-label={`Explore ${location.name}`}
        >
          {/* Label displaying name above the sphere */}
          <span
            className="
              whitespace-nowrap rounded-full px-3 py-1
              text-[10px] font-semibold uppercase tracking-widest
              transition-all duration-300
            "
            style={{
              background: hovered ? `${location.color}e6` : 'rgba(8, 22, 14, 0.75)',
              border: `1px solid ${location.color}45`,
              color: hovered ? '#07160d' : location.color,
              boxShadow: hovered ? `0 0 12px ${location.color}90` : 'none',
              transform: hovered ? 'translateY(-4px) scale(1.05)' : 'translateY(0) scale(1.0)',
              opacity: hovered ? 1 : 0,
              pointerEvents: 'none',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
            }}
          >
            {location.name}
          </span>

          {/* Pulsing ring + core node */}
          <span className="relative flex h-6 w-6 flex-shrink-0 items-center justify-center">
            {/* Outer animated ping */}
            <span
              className="absolute inset-0 animate-ping rounded-full"
              style={{
                background: location.color,
                opacity: 0.22,
              }}
            />
            {/* Mid ring */}
            <span
              className="absolute inset-0 rounded-full transition-all duration-300"
              style={{
                border: `1.5px solid ${location.color}`,
                transform: hovered ? 'scale(1.5)' : 'scale(1.0)',
                opacity: hovered ? 1 : 0,
              }}
            />
          </span>
        </button>
      </Html>
    </group>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// CENTRAL ISLAND
// Deterministically distorted IcosahedronGeometry — the "eco-planet" of Sumatra.
// Contains hotspot markers as children so they co-rotate.
// ─────────────────────────────────────────────────────────────────────────────

function Beacon({
  position,
  color,
  islandPausedRef,
  terrainTimeRef,
}: {
  position: [number, number, number]
  color: string
  islandPausedRef: MutableRefObject<boolean>
  terrainTimeRef: MutableRefObject<number>
}) {
  const groupRef = useRef<THREE.Group>(null)
  const beaconColor = useMemo(() => new THREE.Color(color), [color])

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor: { value: beaconColor },
  }), [beaconColor])

  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime()
    const t = islandPausedRef.current ? terrainTimeRef.current : elapsed * 0.65
    uniforms.uTime.value = t
    if (groupRef.current) {
      groupRef.current.position.y = terrainHeightAt(position[0], position[2], t)
    }
  })

  return (
    <group ref={groupRef} position={[position[0], 0, position[2]]}>
      {/* Vertical beam */}
      <mesh position={[0, 0.75, 0]}>
        <cylinderGeometry args={[0.005, 0.05, 1.5, 16, 1, true]} />
        <shaderMaterial
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          uniforms={uniforms}
          vertexShader={`
            varying vec2 vUv;
            void main() {
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            varying vec2 vUv;
            uniform vec3 uColor;
            uniform float uTime;
            void main() {
              float fade = pow(1.0 - vUv.y, 2.5);
              float pulse = sin(vUv.y * 8.0 - uTime * 4.0) * 0.5 + 0.5;
              float alpha = fade * (0.15 + 0.25 * pulse);
              gl_FragColor = vec4(uColor, alpha);
            }
          `}
        />
      </mesh>

      {/* Soft ground ripple */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <ringGeometry args={[0.01, 0.2, 32]} />
        <shaderMaterial
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          uniforms={uniforms}
          vertexShader={`
            varying vec2 vUv;
            void main() {
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            varying vec2 vUv;
            uniform vec3 uColor;
            uniform float uTime;
            void main() {
              float dist = length(vUv - 0.5);
              float ripple = sin(dist * 20.0 - uTime * 5.0) * 0.5 + 0.5;
              float alpha = (1.0 - dist * 2.0) * 0.4 * ripple;
              gl_FragColor = vec4(uColor, alpha);
            }
          `}
        />
      </mesh>
    </group>
  )
}

function CentralIsland({
  islandPausedRef,
  terrainTimeRef,
  islandMatrixRef,
  onHotspotClick,
  activeId,
}: {
  islandPausedRef: MutableRefObject<boolean>
  terrainTimeRef: MutableRefObject<number>
  islandMatrixRef: MutableRefObject<THREE.Matrix4>
  onHotspotClick: (loc: EcoLocation) => void
  activeId: string | null
}) {
  const groupRef  = useRef<THREE.Group>(null)
  const glowRef   = useRef<THREE.Mesh>(null)
  const [terrainTexture, setTerrainTexture] = useState<THREE.Texture | null>(null)
  
  const sharedUniformsRef = useRef({
    uTime: { value: 0 },
    uColor: { value: new THREE.Color('#10b981') }
  })

  const terrainGeo = useMemo(() => {
    const geometry = new THREE.PlaneGeometry(12, 12, 128, 128)
    geometry.rotateX(-Math.PI / 2)
    return geometry
  }, [])

  useEffect(() => {
    let isDisposed = false
    const loader = new THREE.TextureLoader()

    loader.load(
      '/sumatra-map.png',
      (texture) => {
        if (isDisposed) {
          texture.dispose()
          return
        }

        texture.colorSpace = THREE.SRGBColorSpace
        texture.needsUpdate = true
        setTerrainTexture(texture)
      },
      undefined,
      () => {
        if (!isDisposed) {
          setTerrainTexture(null)
          console.warn('sumatra-map.png not found in public folder, using fallback terrain material.')
        }
      },
    )

    return () => {
      isDisposed = true
    }
  }, [])

  useFrame(({ clock }) => {
    if (!groupRef.current) return

    const elapsed = clock.getElapsedTime()
    const terrainTime = islandPausedRef.current ? terrainTimeRef.current : elapsed * 0.65
    if (!islandPausedRef.current) {
      terrainTimeRef.current = terrainTime
    }

    // Update GPU uniforms
    sharedUniformsRef.current.uTime.value = terrainTime

    // Subtle floating motion instead of globe rotation.
    groupRef.current.rotation.x = Math.sin(terrainTime * 0.22) * 0.04
    groupRef.current.rotation.z = Math.cos(terrainTime * 0.18) * 0.03
    groupRef.current.position.y = Math.sin(terrainTime * 0.6) * 0.04

    // Export world matrix every frame so click-handler can compute hotspot world pos
    groupRef.current.updateWorldMatrix(true, false)
    islandMatrixRef.current.copy(groupRef.current.matrixWorld)
  })

  return (
    <group ref={groupRef} scale={[1.18, 1, 1.18]}>
      {/* ── Holographic Grid Floor ────────────────────────────── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.15, 0]}>
        <planeGeometry args={[14, 14]} />
        <shaderMaterial
          transparent
          depthWrite={false}
          uniforms={sharedUniformsRef.current}
          vertexShader={`
            varying vec2 vUv;
            void main() {
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            varying vec2 vUv;
            uniform vec3 uColor;
            uniform float uTime;
            void main() {
              vec2 gridUv = vUv * 36.0;
              vec2 grid = abs(fract(gridUv - 0.5) - 0.5) / fwidth(gridUv);
              float line = min(grid.x, grid.y);
              float gridPattern = 1.0 - min(line, 1.0);

              float dist = length(vUv - 0.5);
              float fade = smoothstep(0.5, 0.15, dist);

              float pulse = step(0.98, sin(dist * 12.0 - uTime * 2.0) * 0.5 + 0.5);
              
              vec3 finalColor = mix(uColor * 0.35, uColor * 1.2, pulse * 0.4);
              float alpha = mix(gridPattern * 0.08, 0.12, pulse * 0.15);

              gl_FragColor = vec4(finalColor, alpha * fade);
            }
          `}
        />
      </mesh>

      {/* ── Soft underglow ─────────────────────────────────────── */}
      <mesh ref={glowRef} scale={1.02} position={[0, -0.12, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[12, 12]} />
        <shaderMaterial
          transparent
          depthWrite={false}
          uniforms={sharedUniformsRef.current}
          vertexShader={`
            varying vec2 vUv;
            void main() {
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            varying vec2 vUv;
            uniform vec3 uColor;
            uniform float uTime;
            void main() {
              float dist = length(vUv - 0.5);
              float alpha = smoothstep(0.5, 0.15, dist);
              float pulse = 0.04 + 0.015 * sin(uTime * 1.5);
              gl_FragColor = vec4(uColor, alpha * pulse);
            }
          `}
        />
      </mesh>

      {/* ── Solid terrain surface ─────────────────────────────── */}
      <mesh geometry={terrainGeo} castShadow receiveShadow>
        <meshStandardMaterial
          map={terrainTexture ?? undefined}
          color="#10b981"
          transparent
          opacity={0.88}
          depthWrite={false}
          side={THREE.DoubleSide}
          emissive="#10b981"
          emissiveIntensity={0.95}
          roughness={0.25}
          metalness={0.8}
          onBeforeCompile={(shader) => {
            shader.uniforms.uTime = sharedUniformsRef.current.uTime;
            
            shader.vertexShader = `
              uniform float uTime;
              #ifdef USE_MAP
                uniform sampler2D map;
              #endif
              #ifndef USE_UV
                varying vec2 vUv;
              #endif
              
              float fade(float t) {
                return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
              }
              
              float hash(vec2 p) {
                float value = sin(p.x * 127.1 + p.y * 311.7) * 43758.5453123;
                return value - floor(value);
              }
              
              float valueNoise2D(vec2 p) {
                vec2 i = floor(p);
                vec2 f = fract(p);
                float topLeft = hash(i);
                float topRight = hash(i + vec2(1.0, 0.0));
                float bottomLeft = hash(i + vec2(0.0, 1.0));
                float bottomRight = hash(i + vec2(1.0, 1.0));
                float u = fade(f.x);
                float v = fade(f.y);
                return mix(mix(topLeft, topRight, u), mix(bottomLeft, bottomRight, u), v);
              }
              
              float fbmTerrain(vec2 p, float time) {
                float value = 0.0;
                float amplitude = 0.42;
                float frequency = 0.55;
                for (int octave = 0; octave < 5; octave++) {
                  float t = time * (float(octave) + 1.0);
                  vec2 samplePos = p * frequency + vec2(t * 0.012, -t * 0.01);
                  float sampleNoise = valueNoise2D(samplePos);
                  value += amplitude * sampleNoise;
                  amplitude *= 0.5;
                  frequency *= 2.05;
                }
                float ridgeBand = exp(-pow(p.y + 0.7, 2.0) * 0.22);
                float mountainCore = exp(-(pow(p.x + 1.1, 2.0) + pow(p.y - 0.55, 2.0)) * 0.18);
                float coastalShelf = exp(-(pow(p.x - 2.35, 2.0) + pow(p.y + 1.55, 2.0)) * 0.14);
                return (value - 0.5) * 0.34 + ridgeBand * 0.2 + mountainCore * 0.18 + coastalShelf * 0.15;
              }
              
              float terrainHeightAt(vec2 p, float time) {
                return fbmTerrain(p * 0.92, time) * 0.95;
              }
            ` + shader.vertexShader;
            
            shader.vertexShader = shader.vertexShader.replace(
              '#include <beginnormal_vertex>',
              `
                #ifndef USE_UV
                  vUv = uv;
                #endif
                
                float eps = 0.05;
                #ifdef USE_MAP
                  vec4 texL = texture2D(map, uv + vec2(-eps/12.0, 0.0));
                  vec4 texR = texture2D(map, uv + vec2(eps/12.0, 0.0));
                  vec4 texD = texture2D(map, uv + vec2(0.0, -eps/12.0));
                  vec4 texU = texture2D(map, uv + vec2(0.0, eps/12.0));
                  float lumaL = dot(texL.rgb, vec3(0.2126, 0.7152, 0.0722));
                  float lumaR = dot(texR.rgb, vec3(0.2126, 0.7152, 0.0722));
                  float lumaD_val = dot(texD.rgb, vec3(0.2126, 0.7152, 0.0722));
                  float lumaU_val = dot(texU.rgb, vec3(0.2126, 0.7152, 0.0722));
                  float landL = smoothstep(0.1, 0.2, lumaL);
                  float landR = smoothstep(0.1, 0.2, lumaR);
                  float landD = smoothstep(0.1, 0.2, lumaD_val);
                  float landU = smoothstep(0.1, 0.2, lumaU_val);
                #else
                  float landL = 0.0; float landR = 0.0; float landD = 0.0; float landU = 0.0;
                #endif
                
                float hL = terrainHeightAt(position.xz + vec2(-eps, 0.0), uTime) * landL;
                float hR = terrainHeightAt(position.xz + vec2(eps, 0.0), uTime) * landR;
                float hD = terrainHeightAt(position.xz + vec2(0.0, -eps), uTime) * landD;
                float hU = terrainHeightAt(position.xz + vec2(0.0, eps), uTime) * landU;
                
                vec3 customNormal = normalize(vec3(hL - hR, 2.0 * eps, hD - hU));
                #include <beginnormal_vertex>
                objectNormal = customNormal;
              `
            );
            
            shader.vertexShader = shader.vertexShader.replace(
              '#include <begin_vertex>',
              `
                #include <begin_vertex>
                #ifdef USE_MAP
                  vec4 texColor = texture2D(map, uv);
                  float luma = dot(texColor.rgb, vec3(0.2126, 0.7152, 0.0722));
                  float landMask = smoothstep(0.1, 0.2, luma);
                #else
                  float landMask = 1.0;
                #endif
                
                float height = terrainHeightAt(position.xz, uTime) * landMask;
                transformed.y = height;
              `
            );
            
            shader.fragmentShader = `
              uniform float uTime;
              #ifndef USE_UV
                varying vec2 vUv;
              #endif
            ` + shader.fragmentShader;

            shader.fragmentShader = shader.fragmentShader.replace(
              '#include <alphatest_fragment>',
              `
                #include <alphatest_fragment>
                float luma = dot(diffuseColor.rgb, vec3(0.2126, 0.7152, 0.0722));
                if (luma < 0.11) discard;
                
                // Glowing Coastline Border
                if (luma >= 0.11 && luma < 0.17) {
                  float pulse = 0.55 + 0.45 * sin(uTime * 3.2);
                  diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.25, 0.98, 0.55), pulse);
                  diffuseColor.a = 0.95;
                }
                
                float dist = length(vUv - 0.5);
                float vignette = smoothstep(0.5, 0.35, dist);
                diffuseColor.a *= vignette;
              `
            );
          }}
        />
      </mesh>

      {/* ── Hotspot markers & Beacons (rotate WITH island) ──────── */}
      {ECO_LOCATIONS.map((loc) => (
        <group key={loc.id}>
          <HotspotMarker
            location={loc}
            onClick={() => onHotspotClick(loc)}
            isAnyActive={activeId !== null}
            isActive={activeId === loc.id}
            islandPausedRef={islandPausedRef}
            terrainTimeRef={terrainTimeRef}
          />
          <Beacon
            position={loc.position}
            color={loc.color}
            islandPausedRef={islandPausedRef}
            terrainTimeRef={terrainTimeRef}
          />
        </group>
      ))}
    </group>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// CAMERA RIG
// Pure animation driver — runs inside useFrame, no React re-renders.
// Lerps camera.position and camera.lookAt toward refs each frame.
// Signals arrival via onArrived callback (called once per flight).
// ─────────────────────────────────────────────────────────────────────────────

function CameraRig({
  cameraStateRef,
  targetPosRef,
  targetLookAtRef,
  orbitControlsRef,
  onArrived,
}: {
  cameraStateRef:    MutableRefObject<CameraState>
  targetPosRef:      MutableRefObject<THREE.Vector3>
  targetLookAtRef:   MutableRefObject<THREE.Vector3>
  orbitControlsRef:  MutableRefObject<any>
  onArrived:         (fromState: CameraState) => void
}) {
  const { camera } = useThree()
  const currentLookAt = useRef(DEFAULT_LOOK_AT.clone())
  const prevState     = useRef<CameraState>('orbit')
  const arrivedFlag   = useRef(false)

  useFrame(() => {
    const state = cameraStateRef.current

    // ── React to state change ────────────────────────────────────────────────
    if (state !== prevState.current) {
      arrivedFlag.current = false
      prevState.current   = state

      const oc = orbitControlsRef.current
      if (state === 'orbit') {
        // Re-enable controls when back in orbit
        if (oc) {
          oc.enabled = true
          oc.target.set(0, 0, 0)
          oc.update()
        }
      } else {
        // Disable controls during any flight
        if (oc) oc.enabled = false
      }
    }

    // Orbit mode: controls handle the camera, nothing to do here
    if (state === 'orbit') return

    // ── Smooth camera position ───────────────────────────────────────────────
    camera.position.lerp(targetPosRef.current, CAM_LERP_SPEED)

    // ── Smooth lookAt (lerp the look-at point, then apply) ───────────────────
    currentLookAt.current.lerp(targetLookAtRef.current, CAM_LERP_SPEED)
    camera.lookAt(currentLookAt.current)

    // ── Arrival detection ────────────────────────────────────────────────────
    if (!arrivedFlag.current) {
      if (camera.position.distanceTo(targetPosRef.current) < ARRIVAL_THRESHOLD) {
        arrivedFlag.current = true
        onArrived(state)
      }
    }
  })

  return null
}

// ─────────────────────────────────────────────────────────────────────────────
// ORBITAL SCENE  (assembled inside <Canvas>)
// ─────────────────────────────────────────────────────────────────────────────

function OrbitalScene({
  cameraStateRef,
  targetPosRef,
  targetLookAtRef,
  orbitControlsRef,
  islandPausedRef,
  terrainTimeRef,
  islandMatrixRef,
  onHotspotClick,
  onArrived,
  activeId,
  isLight = false,
}: {
  cameraStateRef:   MutableRefObject<CameraState>
  targetPosRef:     MutableRefObject<THREE.Vector3>
  targetLookAtRef:  MutableRefObject<THREE.Vector3>
  orbitControlsRef: MutableRefObject<any>
  islandPausedRef:  MutableRefObject<boolean>
  terrainTimeRef:   MutableRefObject<number>
  islandMatrixRef:  MutableRefObject<THREE.Matrix4>
  onHotspotClick:   (loc: EcoLocation) => void
  onArrived:        (fromState: CameraState) => void
  activeId: string | null
  isLight?: boolean
}) {
  const fogColor = isLight ? '#e5ebe6' : '#050505'
  const ambientColor = isLight ? '#e0ebe3' : '#0a120c'
  const dirLightColor = isLight ? '#ffffff' : '#b8ffd6'

  return (
    <>
      {/* ── Scene background clear color ────────────────────────── */}
      <color attach="background" args={[fogColor]} key={`color-${fogColor}`} />

      {/* ── Depth fog (cinematic depth falloff) ─────────────────── */}
      <fog attach="fog" args={[fogColor, 14, 48]} key={`fog-${fogColor}`} />

      {/* ── Cinematic topographic lighting ─────────────────────── */}
      <ambientLight intensity={isLight ? 0.45 : 0.12} color={ambientColor} />
      <directionalLight
        castShadow
        position={[6, 9, 4]}
        intensity={isLight ? 1.45 : 1.15}
        color={dirLightColor}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* ── Starfield ───────────────────────────────────────────── */}
      {!isLight && (
        <Stars
          radius={90}
          depth={60}
          count={5000}
          factor={2}
          saturation={0}
          fade
          speed={0.3}
        />
      )}

      {/* ── Atmospheric particles ────────────────────────────────── */}
      <AtmosphericParticles count={500} />

      {/* ── Orbital accent ring ──────────────────────────────────── */}
      <OrbitalRing />

      {/* ── The eco-planet ───────────────────────────────────────── */}
      <CentralIsland
        islandPausedRef={islandPausedRef}
        terrainTimeRef={terrainTimeRef}
        islandMatrixRef={islandMatrixRef}
        onHotspotClick={onHotspotClick}
        activeId={activeId}
      />

      {/* ── Camera animation driver ───────────────────────────────── */}
      <CameraRig
        cameraStateRef={cameraStateRef}
        targetPosRef={targetPosRef}
        targetLookAtRef={targetLookAtRef}
        orbitControlsRef={orbitControlsRef}
        onArrived={onArrived}
      />

      {/* ── Orbit controls (user rotate only, no zoom/pan) ────────── */}
      <OrbitControls
        ref={orbitControlsRef}
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI * 0.2}
        maxPolarAngle={Math.PI * 0.48}
        rotateSpeed={0.42}
        dampingFactor={0.08}
        enableDamping
        touches={{
          ONE: 2,   // TWO_FINGER_ROTATE — use 2-finger drag so 1-finger scroll still works
          TWO: 0,   // DOLLY_PAN disabled
        }}
      />
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// INFO PANEL
// Slide-up, fade-in detail panel revealed when camera arrives at a hotspot.
// ─────────────────────────────────────────────────────────────────────────────

function InfoPanel({
  location,
  visible,
  onBack,
}: {
  location: EcoLocation | null
  visible: boolean
  onBack: () => void
}) {
  const { lang } = useLanguage()

  // Apply translations if available
  const displayLocation = location ? {
    ...location,
    subtitle: LOCATION_TRANSLATIONS[location.id]?.[lang]?.subtitle || location.subtitle,
    description: LOCATION_TRANSLATIONS[location.id]?.[lang]?.description || location.description,
    ecoFact: LOCATION_TRANSLATIONS[location.id]?.[lang]?.ecoFact || location.ecoFact
  } : null

  return (
    <AnimatePresence mode="wait">
      {visible && displayLocation && (
        <motion.aside
          key={displayLocation.id}
          initial={{ opacity: 0, x: -40, y: 16 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: -40, y: 16 }}
          transition={{ type: 'spring', damping: 24, stiffness: 195, delay: 0.12 }}
          className="absolute bottom-20 left-6 z-30 w-full max-w-[390px] pointer-events-auto md:left-10 md:bottom-24"
          role="complementary"
          aria-label={`Details for ${displayLocation.name}`}
        >
          <div
            className="liquid-glass-strong relative overflow-hidden rounded-2xl"
            style={{
              boxShadow: [
                '0 32px 80px rgba(0,0,0,0.6)',
                `0 0 0 1px ${displayLocation.color}10`,
                `inset 0 1px 0 ${displayLocation.color}28`,
              ].join(','),
            }}
          >
            {/* Top shimmer line */}
            <div
              className="absolute inset-x-0 top-0 h-px"
              style={{
                background: `linear-gradient(90deg, transparent, ${displayLocation.color}80, transparent)`,
              }}
            />

            <div
              className="p-7 overflow-y-auto info-panel-scroll"
              style={{
                maxHeight: 'min(480px, 100vh - 160px)',
              }}
            >
              <style dangerouslySetInnerHTML={{ __html: `
                .info-panel-scroll::-webkit-scrollbar {
                  width: 5px;
                }
                .info-panel-scroll::-webkit-scrollbar-track {
                  background: transparent;
                }
                .info-panel-scroll::-webkit-scrollbar-thumb {
                  background: ${displayLocation.color}40;
                  border-radius: 10px;
                }
                .info-panel-scroll::-webkit-scrollbar-thumb:hover {
                  background: ${displayLocation.color}80;
                }
              `}} />
              {/* ── Status badge ────────────────────────────────── */}
              <div className="mb-5 flex items-center gap-2.5">
                <span
                  className="h-2 w-2 animate-pulse rounded-full"
                  style={{
                    background: displayLocation.color,
                    boxShadow: `0 0 10px ${displayLocation.color}`,
                  }}
                />
                <span
                  className="text-[9px] font-medium uppercase tracking-[0.45em]"
                  style={{ color: displayLocation.color }}
                >
                  {lang === 'id' ? 'Perjalanan Ekologis · Lokasi Aktif' : 'Eco Journey · Active Location'}
                </span>
              </div>

              {/* ── Title & subtitle ─────────────────────────────── */}
              <h2 className="font-serif text-[2rem] leading-tight text-white">
                {displayLocation.name}
              </h2>
              <p className="mt-1 text-[11px] uppercase tracking-[0.28em] text-white/40">
                {displayLocation.subtitle}
              </p>

              {/* ── Separator ────────────────────────────────────── */}
              <div
                className="my-5 h-px"
                style={{
                  background: `linear-gradient(90deg, ${displayLocation.color}55, transparent)`,
                }}
              />

              {/* ── Description ──────────────────────────────────── */}
              <p className="text-[13px] leading-[1.78] text-foreground/80 dark:text-white/60">
                {displayLocation.description}
              </p>

              {/* ── Eco Insight card ─────────────────────────────── */}
              <div
                className="liquid-glass mt-5 rounded-xl p-4"
                style={{
                  boxShadow: `inset 0 1px 0 ${displayLocation.color}25`,
                }}
              >
                <p
                  className="mb-2 text-[9px] uppercase tracking-[0.38em]"
                  style={{ color: displayLocation.color }}
                >
                  {lang === 'id' ? '🌿 Wawasan Ekologis' : '🌿 Eco Insight'}
                </p>
                <p className="text-[12px] leading-relaxed text-white/50">
                  {displayLocation.ecoFact}
                </p>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <span className="text-[10px] uppercase tracking-wider text-white/28">
                  {lang === 'id' ? 'Rating Ekologis' : 'Eco Rating'}
                </span>
                <div className="flex gap-1.5">
                  {Array.from({ length: 5 }, (_, i) => (
                    i < displayLocation.ecoRating ? (
                      <IoLeaf key={i} style={{ color: displayLocation.color }} className="h-3.5 w-3.5" />
                    ) : (
                      <IoLeafOutline key={i} style={{ color: displayLocation.color }} className="h-3.5 w-3.5" opacity={0.3} />
                    )
                  ))}
                </div>
              </div>
              {/* ── Action buttons ────────────────────────────────── */}
              <div className="mt-6 flex items-center gap-3">
                <button
                  id="btn-back-to-orbit"
                  onClick={onBack}
                  className="liquid-glass flex items-center gap-2 rounded-full px-5 py-2.5 text-[11px] font-medium uppercase tracking-[0.2em] transition-all duration-200 hover:scale-105 active:scale-95"
                  style={{
                    color: displayLocation.color,
                  }}
                >
                  <FiArrowLeft className="h-3.5 w-3.5" />
                  {lang === 'id' ? 'Kembali ke Orbit' : 'Back to Orbit'}
                </button>

                <a
                  href="#packages"
                  id={`book-${displayLocation.id}`}
                  className="flex items-center gap-2 rounded-full px-5 py-2.5 text-[11px] font-medium uppercase tracking-[0.2em] transition-all duration-200 hover:opacity-85 active:scale-95"
                  style={{
                    background: displayLocation.color,
                    color: '#07160d',
                  }}
                >
                  {lang === 'id' ? 'Pesan Perjalanan' : 'Book Journey'}
                  <FiArrowRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>

            {/* Bottom shimmer line */}
            <div
              className="absolute inset-x-0 bottom-0 h-px"
              style={{
                background: `linear-gradient(90deg, transparent, ${displayLocation.color}45, transparent)`,
              }}
            />
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ORBIT OVERLAY
// Hero title + instructions shown only in 'orbit' mode.
// ─────────────────────────────────────────────────────────────────────────────

function OrbitOverlay({ visible }: { visible: boolean }) {
  const { lang } = useLanguage()

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.65 }}
          className="pointer-events-none absolute inset-0 z-20"
        >
          {/* ── Top-center title ───────────────────────────────── */}
          <div className="absolute inset-x-0 top-[13%] flex flex-col items-center gap-3">
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.85 }}
              className="text-[9px] uppercase tracking-[0.55em] text-primary/50"
            >
              {lang === 'id' ? 'Eco Journey · Sumatra · Indonesia' : 'Eco Journey · Sumatra · Indonesia'}
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.9 }}
              className="font-serif text-[clamp(3rem,7.5vw,6rem)] font-medium leading-none tracking-tight text-white"
            >
              {lang === 'id' ? 'Penjelajah Orbital' : 'Orbital Explorer'}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.62, duration: 0.8 }}
              className="max-w-[260px] text-center text-xs leading-relaxed text-white/35"
            >
              {lang === 'id' 
                ? 'Klik penanda bersinar untuk terbang ke destinasi ekologis paling suci di Sumatra'
                : 'Click the glowing markers to fly into Sumatra\'s most sacred eco-destinations'
              }
            </motion.p>
          </div>

          {/* ── Location dots legend ───────────────────────────── */}
          <div className="absolute inset-x-0 bottom-10 flex flex-col items-center gap-3">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.35 }}
              transition={{ delay: 0.9, duration: 1 }}
              className="text-[9px] uppercase tracking-[0.3em] text-white/40"
            >
              {lang === 'id' ? 'Geser untuk memutar · Klik untuk menjelajah' : 'Drag to rotate · Click to explore'}
            </motion.p>

            <div className="flex items-center gap-3">
              {ECO_LOCATIONS.map((loc, i) => (
                <motion.div
                  key={loc.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 + i * 0.1, type: 'spring', damping: 12 }}
                  className="flex items-center gap-1.5"
                >
                  <span
                    className="h-1.5 w-1.5 rounded-full"
                    style={{ background: loc.color }}
                  />
                  <span className="text-[9px] uppercase tracking-wider text-white/30">
                    {loc.name}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ── Animated orbit indicator (bottom-right corner) ─── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="absolute bottom-8 right-8 hidden md:flex flex-col items-end gap-1"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
              className="h-9 w-9 rounded-full"
              style={{
                border: '1px solid transparent',
                borderTopColor: 'oklch(0.82 0.14 85 / 50%)',
                borderRightColor: 'oklch(0.82 0.14 85 / 20%)',
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// FLIGHT INDICATOR
// Minimal status strip shown during camera transitions.
// ─────────────────────────────────────────────────────────────────────────────

function FlightIndicator({ cameraState }: { cameraState: CameraState }) {
  const { lang } = useLanguage()
  const isFlying =
    cameraState === 'flying-to' || cameraState === 'flying-back'
  const label =
    cameraState === 'flying-to' 
      ? (lang === 'id' ? 'Mendekati destinasi' : 'Approaching destination')
      : (lang === 'id' ? 'Kembali ke orbit' : 'Returning to orbit')

  return (
    <AnimatePresence>
      {isFlying && (
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 24 }}
          transition={{ duration: 0.3 }}
          className="pointer-events-none absolute bottom-8 right-8 z-30 flex items-center gap-2.5"
        >
          <span className="h-1.5 w-1.5 animate-ping rounded-full bg-primary" />
          <span className="text-[9px] uppercase tracking-[0.3em] text-primary/60">
            {label}
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ORBITAL NAVIGATION  — Main Export
// Manages all state and ref bridges between React & R3F worlds.
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// WEBGL SUPPORT DETECTION
// ─────────────────────────────────────────────────────────────────────────────

function isWebGLSupported(): boolean {
  if (typeof window === 'undefined') return true // SSR: assume supported
  try {
    const canvas = document.createElement('canvas')
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    )
  } catch {
    return false
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// WEBGL FALLBACK — shown when browser doesn't support WebGL
// ─────────────────────────────────────────────────────────────────────────────

function OrbitalFallback() {
  const { lang } = useLanguage()
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-6 px-6 text-center">
      <div
        className="liquid-glass flex h-20 w-20 items-center justify-center rounded-full"
        style={{ border: '1px solid oklch(0.82 0.14 85 / 30%)' }}
      >
        <span style={{ fontSize: '2.5rem' }}>🌿</span>
      </div>
      <h2 className="font-serif text-3xl text-foreground md:text-4xl">
        {lang === 'id' ? 'Penjelajah Orbital' : 'Orbital Explorer'}
      </h2>
      <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
        {lang === 'id'
          ? 'Browser ini tidak mendukung WebGL. Silakan gunakan Chrome, Firefox, atau Safari terbaru untuk menikmati peta 3D interaktif Sumatra.'
          : 'Your browser does not support WebGL. Please use a modern Chrome, Firefox, or Safari to experience the interactive 3D Sumatra map.'}
      </p>
      <div className="grid grid-cols-3 gap-3 mt-2">
        {ECO_LOCATIONS.slice(0, 6).map((loc) => (
          <a
            key={loc.id}
            href="#packages"
            className="liquid-glass rounded-xl px-3 py-2 text-center transition-all hover:scale-105"
            style={{ border: `1px solid ${loc.color}30` }}
          >
            <span className="block text-[9px] uppercase tracking-wider" style={{ color: loc.color }}>
              {loc.name}
            </span>
          </a>
        ))}
      </div>
    </div>
  )
}

export function OrbitalNavigation() {
  const { theme } = useTheme()
  const isLight = theme === 'light'
  const bgColor = isLight ? 'transparent' : '#050505'
  const [webglSupported, setWebglSupported] = useState(true)

  useEffect(() => {
    setWebglSupported(isWebGLSupported())
  }, [])

  // ── React state (drives UI conditionals + re-renders) ──────────────────────
  const [cameraState, setCameraState]         = useState<CameraState>('orbit')
  const [activeLocation, setActiveLocation]   = useState<EcoLocation | null>(null)
  const [panelVisible, setPanelVisible]       = useState(false)

  // ── Shared refs (read/written inside useFrame, no re-renders) ──────────────
  // IMPORTANT: cameraStateRef mirrors cameraState but avoids stale closures in useFrame
  const cameraStateRef   = useRef<CameraState>('orbit')
  const targetPosRef     = useRef<THREE.Vector3>(DEFAULT_CAM_POS.clone())
  const targetLookAtRef  = useRef<THREE.Vector3>(DEFAULT_LOOK_AT.clone())
  const orbitControlsRef = useRef<any>(null)
  const islandPausedRef  = useRef<boolean>(false)
  const terrainTimeRef   = useRef<number>(0)
  // Filled by CentralIsland.useFrame every frame: current island world matrix
  const islandMatrixRef  = useRef<THREE.Matrix4>(new THREE.Matrix4().identity())

  // Keep ref in sync with React state
  useEffect(() => {
    cameraStateRef.current = cameraState
  }, [cameraState])

  // Reveal panel once camera settles at hotspot
  useEffect(() => {
    if (cameraState === 'at-hotspot') {
      const timer = setTimeout(() => setPanelVisible(true), 220)
      return () => clearTimeout(timer)
    } else {
      setPanelVisible(false)
    }
  }, [cameraState])

  // ── Hotspot click handler ─────────────────────────────────────────────────
  const handleHotspotClick = useCallback((loc: EcoLocation) => {
    // Guard: only allow clicks from orbit or when settled at a hotspot
    if (cameraStateRef.current !== 'orbit' && cameraStateRef.current !== 'at-hotspot') return

    // Freeze island rotation
    islandPausedRef.current = true
    setActiveLocation(loc)

    // Compute current WORLD position of the hotspot using the island's live matrix.
    // This correctly accounts for whatever rotation the island was at when clicked.
    const localPos = new THREE.Vector3(
      loc.position[0],
      terrainHeightAt(loc.position[0], loc.position[2], terrainTimeRef.current) + 0.14,
      loc.position[2]
    )
    const worldPos = localPos.applyMatrix4(islandMatrixRef.current)

    // Camera target: swoop in from an isometric angle above the selected marker.
    const camPos = worldPos.clone().add(new THREE.Vector3(
      Math.sign(worldPos.x || 1) * 2.25,
      3.8,
      4.6,
    ))

    targetPosRef.current.copy(camPos)
    targetLookAtRef.current.copy(worldPos)

    // Transition (update both ref and state atomically)
    cameraStateRef.current = 'flying-to'
    setCameraState('flying-to')
  }, [])

  // ── Back to orbit handler ─────────────────────────────────────────────────
  const handleBack = useCallback(() => {
    // 1. Hide panel immediately
    setPanelVisible(false)

    // 2. After panel exit animation, start the return flight
    setTimeout(() => {
      islandPausedRef.current = false               // resume island spin
      targetPosRef.current.copy(DEFAULT_CAM_POS)
      targetLookAtRef.current.copy(DEFAULT_LOOK_AT)
      cameraStateRef.current = 'flying-back'
      setCameraState('flying-back')
    }, 320)
  }, [])

  // ── Arrival callback (called by CameraRig when distance < threshold) ───────
  const handleArrived = useCallback((fromState: CameraState) => {
    if (fromState === 'flying-to') {
      cameraStateRef.current = 'at-hotspot'
      setCameraState('at-hotspot')
    } else if (fromState === 'flying-back') {
      cameraStateRef.current = 'orbit'
      setCameraState('orbit')
      setActiveLocation(null)
    }
  }, [])

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <section
      id="orbital"
      className="relative h-[100svh] w-full overflow-hidden"
      style={{ background: bgColor }}
      aria-label="Interactive 3D orbital navigator — eco-tourism destinations in Sumatra"
    >
      <div className="pointer-events-none fixed inset-x-0 top-0 z-[70] flex justify-center px-4 pt-5 md:pt-6">
        <div className="pointer-events-auto w-full max-w-7xl">
          <Navbar floating />
        </div>
      </div>

      {/* ── WebGL not supported: show fallback ──────────────────────────────── */}
      {!webglSupported ? (
        <OrbitalFallback />
      ) : (
        <>
          {/* ── WebGL Canvas ────────────────────────────────────────────────── */}
          <Canvas
            shadows
            camera={{
              fov: 45,
              position: DEFAULT_CAM_POS.toArray() as [number, number, number],
              near: 0.1,
              far: 250,
            }}
            gl={{ antialias: true, alpha: false }}
            style={{ background: bgColor }}
          >
            <OrbitalScene
              cameraStateRef={cameraStateRef}
              targetPosRef={targetPosRef}
              targetLookAtRef={targetLookAtRef}
              orbitControlsRef={orbitControlsRef}
              islandPausedRef={islandPausedRef}
              terrainTimeRef={terrainTimeRef}
              islandMatrixRef={islandMatrixRef}
              onHotspotClick={handleHotspotClick}
              onArrived={handleArrived}
              activeId={activeLocation?.id ?? null}
              isLight={isLight}
            />
          </Canvas>

          {/* ── HTML Overlays ──────────────────────────────────────────────── */}
          <OrbitOverlay visible={cameraState === 'orbit'} />

          <InfoPanel
            location={activeLocation}
            visible={panelVisible}
            onBack={handleBack}
          />

          <FlightIndicator cameraState={cameraState} />
        </>
      )}
    </section>
  )
}
