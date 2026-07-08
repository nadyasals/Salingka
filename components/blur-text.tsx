'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface BlurTextProps {
  text: string
  className?: string
  /** Delay between each word (ms). Default 100 */
  staggerMs?: number
  /** Animation duration per word (s). Default 0.7 */
  duration?: number
  /** IntersectionObserver threshold. Default 0.1 */
  threshold?: number
}

/**
 * BlurText — word-by-word staggered blur-in animation.
 * Each word fades in from blur(10px) + y-offset, triggered by IntersectionObserver.
 */
export function BlurText({
  text,
  className = '',
  staggerMs = 100,
  duration = 0.7,
  threshold = 0.1,
}: BlurTextProps) {
  const containerRef = useRef<HTMLSpanElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  const words = text.split(' ')

  return (
    <span
      ref={containerRef}
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'inherit',
        rowGap: '0.1em',
      }}
      aria-label={text}
    >
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          style={{ display: 'inline-block', marginRight: '0.28em' }}
          initial={{ filter: 'blur(10px)', opacity: 0, y: 50 }}
          animate={
            visible
              ? { filter: 'blur(0px)', opacity: 1, y: 0 }
              : { filter: 'blur(10px)', opacity: 0, y: 50 }
          }
          transition={{
            duration,
            delay: (i * staggerMs) / 1000,
            ease: [0.22, 1, 0.36, 1],
          }}
          className={className}
          aria-hidden="true"
        >
          {word}
        </motion.span>
      ))}
    </span>
  )
}
