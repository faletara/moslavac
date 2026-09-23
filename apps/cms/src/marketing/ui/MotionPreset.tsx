'use client'

import { motion, useInView, useReducedMotion, type Transition, type Variant } from 'framer-motion'
import { useRef, type ReactNode } from 'react'

type MotionPresetProps = {
  children?: ReactNode
  className?: string
  component?: 'div' | 'span' | 'p' | 'li'
  transition?: Transition
  delay?: number
  blur?: string | boolean
  slide?: { direction?: 'up' | 'down' | 'left' | 'right'; offset?: number } | boolean
  fade?: boolean
  zoom?: { initialScale?: number } | boolean
}

/**
 * Ulazna animacija sastavljena od fade / blur / slide / zoom dijelova.
 * Isti API kao shadcn studio predložak, ali na framer-motionu koji repo već
 * koristi. Uz „reduce motion" ostaje samo fade.
 */
export function MotionPreset({
  children,
  className,
  component = 'div',
  transition = { type: 'spring', stiffness: 200, damping: 20 },
  delay = 0,
  blur = false,
  slide = false,
  fade = false,
  zoom = false,
}: MotionPresetProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const reduced = useReducedMotion()

  const hidden: Variant = {}
  const visible: Variant = {}

  if (blur && !reduced) {
    hidden.filter = blur === true ? 'blur(10px)' : `blur(${blur})`
    visible.filter = 'blur(0px)'
  }

  if (slide && !reduced) {
    const offset = slide === true ? 100 : (slide.offset ?? 100)
    const direction = slide === true ? 'left' : (slide.direction ?? 'left')
    const axis = direction === 'up' || direction === 'down' ? 'y' : 'x'
    hidden[axis] = direction === 'left' || direction === 'up' ? -offset : offset
    visible[axis] = 0
  }

  if (fade) {
    hidden.opacity = 0
    visible.opacity = 1
  }

  if (zoom && !reduced) {
    hidden.scale = zoom === true ? 0.5 : (zoom.initialScale ?? 0.5)
    visible.scale = 1
  }

  // SAFETY: sve varijante primaju isti ref; tip se svodi na `motion.div` da TS
  // ne traži presjek referenci svih HTML elemenata. Sam element bira
  // `component`, pa je runtime i dalje točan.
  const Tag = motion[component] as typeof motion.div

  return (
    <Tag
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={{ hidden, visible }}
      transition={{ ...transition, delay: (transition?.delay ?? 0) + delay }}
      className={className}
    >
      {children}
    </Tag>
  )
}
