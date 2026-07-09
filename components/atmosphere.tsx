'use client'

/**
 * Atmosphere — Fixed atmospheric overlay
 *
 * Stays fixed to the viewport so fireflies, mist, and leaves persist
 * across all sections as the user scrolls — creating a continuous "depth" effect.
 *
 * Ported from jungle-depth-voyage-main/Atmosphere.tsx and merged with
 * Salingka's CSS keyframes (firefly-drift, mist-flow, leaf-fall).
 */

import { useMemo } from 'react'

export function Atmosphere() {
  const fireflies = useMemo(
    () =>
      Array.from({ length: 26 }, (_, i) => ({
        id: i,
        left: 5 + ((i * 53.7) % 90),
        top: 10 + ((i * 37.3) % 80),
        size: 2 + ((i * 7) % 3),
        delay: (i * 1.7) % 10,
        duration: 6 + ((i * 13) % 8),
        driftX: `${-40 + ((i * 29) % 80)}px`,
        driftY: `${-60 + ((i * 17) % 40)}px`,
      })),
    [],
  )

  const leaves = useMemo(
    () =>
      Array.from({ length: 10 }, (_, i) => ({
        id: i,
        left: `${(i * 61.8) % 100}%`,
        duration: 12 + ((i * 11) % 10),
        delay: (i * 3.1) % 14,
        sway: `${-80 + ((i * 43) % 160)}px`,
        scale: 0.5 + ((i * 19) % 10) / 20,
      })),
    [],
  )

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[50] overflow-hidden"
      aria-hidden="true"
    >
      {/* Drifting mist blobs */}
      <div
        className="drift-slow absolute -inset-[20%] opacity-40"
        style={{
          background:
            'radial-gradient(60% 40% at 30% 70%, oklch(0.75 0.02 175 / 0.16), transparent), radial-gradient(50% 40% at 75% 35%, oklch(0.75 0.02 175 / 0.12), transparent)',
        }}
      />
      <div
        className="drift-slow absolute -inset-[20%] opacity-30"
        style={{
          background:
            'radial-gradient(55% 45% at 60% 60%, oklch(0.75 0.02 175 / 0.14), transparent)',
          animationDelay: '-11s',
          animationDuration: '28s',
        }}
      />

      {/* Fireflies */}
      {fireflies.map((f) => (
        <span
          key={f.id}
          className="absolute rounded-full"
          style={
            {
              left: `${f.left}%`,
              top: `${f.top}%`,
              width: f.size,
              height: f.size,
              background: 'oklch(0.88 0.22 155)',
              boxShadow: `0 0 ${f.size * 3}px ${f.size}px oklch(0.88 0.22 155 / 70%)`,
              animation: `firefly-drift ${f.duration}s ease-in-out ${f.delay}s infinite`,
              '--drift-x': f.driftX,
              '--drift-y': f.driftY,
              willChange: 'transform, opacity',
            } as React.CSSProperties
          }
        />
      ))}

      {/* Falling leaves */}
      {leaves.map((l) => (
        <span
          key={l.id}
          className="absolute top-0"
          style={
            {
              left: l.left,
              animation: `leaf-fall ${l.duration}s linear ${l.delay}s infinite`,
              '--sway': l.sway,
            } as React.CSSProperties
          }
        >
          <svg
            width={16 * l.scale + 8}
            height={16 * l.scale + 8}
            viewBox="0 0 24 24"
            fill="oklch(0.45 0.07 165 / 0.5)"
          >
            <path d="M12 2C7 7 4 12 4 16a8 8 0 0 0 16 0c0-4-3-9-8-14z" />
          </svg>
        </span>
      ))}

      {/* Bottom mist gradient — grounds the scene (matches bg in both modes) */}
      <div
        className="absolute inset-x-0 bottom-0 h-1/3"
        style={{
          background:
            'linear-gradient(to top, var(--background) 0%, transparent 60%)',
        }}
      />
    </div>
  )
}
