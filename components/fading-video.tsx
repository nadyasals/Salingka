'use client'

import { useCallback, useRef } from 'react'

interface FadingVideoProps {
  /** Single src string or array of srcs to cycle through */
  src: string | string[]
  className?: string
  style?: React.CSSProperties
}

/**
 * FadingVideo — seamless looping video with fade-in/fade-out transitions.
 *
 * Behaviour:
 * - Starts at opacity 0, fades in over 500ms on `loadeddata`
 * - When remaining time ≤ 0.55s, fades out over 550ms
 * - On `ended`: single src → resets & replays; array → advances to next (cycles)
 */
export function FadingVideo({ src, className = '', style }: FadingVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const srcs = Array.isArray(src) ? src : [src]
  const srcIndexRef = useRef(0)
  const fadeOutStartedRef = useRef(false)

  // ── Fade helpers ──────────────────────────────────────────────────────────
  const fadeTo = useCallback(
    (target: number, durationMs: number, onDone?: () => void) => {
      const el = videoRef.current
      if (!el) return
      const start = el.style.opacity ? parseFloat(el.style.opacity) : 0
      const startTime = performance.now()
      const tick = (now: number) => {
        const progress = Math.min((now - startTime) / durationMs, 1)
        el.style.opacity = String(start + (target - start) * progress)
        if (progress < 1) {
          requestAnimationFrame(tick)
        } else {
          onDone?.()
        }
      }
      requestAnimationFrame(tick)
    },
    [],
  )

  // ── Event handlers ────────────────────────────────────────────────────────
  const handleLoadedData = useCallback(() => {
    fadeTo(1, 500)
  }, [fadeTo])

  const handleTimeUpdate = useCallback(() => {
    const el = videoRef.current
    if (!el) return
    const remaining = el.duration - el.currentTime
    if (remaining <= 0.55 && !fadeOutStartedRef.current) {
      fadeOutStartedRef.current = true
      fadeTo(0, 550)
    }
  }, [fadeTo])

  const handleEnded = useCallback(() => {
    const el = videoRef.current
    if (!el) return
    fadeOutStartedRef.current = false

    if (srcs.length === 1) {
      // Single source — reset & replay
      el.currentTime = 0
      el.play().catch(() => {})
      fadeTo(1, 500)
    } else {
      // Multi source — advance to next, cycle
      srcIndexRef.current = (srcIndexRef.current + 1) % srcs.length
      el.src = srcs[srcIndexRef.current]
      el.load()
      el.play().catch(() => {})
      // fadeTo(1) triggered by handleLoadedData on the new src
    }
  }, [srcs, fadeTo])

  return (
    <video
      ref={videoRef}
      src={srcs[0]}
      autoPlay
      muted
      playsInline
      preload="auto"
      className={className}
      style={{ opacity: 0, ...style }}
      onLoadedData={handleLoadedData}
      onTimeUpdate={handleTimeUpdate}
      onEnded={handleEnded}
    />
  )
}
