'use client'

import { useInView, useMotionValue, useMotionValueEvent, useSpring } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { cn } from './cn'

type NumberTickerProps = {
  value: number
  startValue?: number
  delay?: number
  className?: string
}

/** Broj koji se odmota od početne do ciljne vrijednosti kad uđe u vidno polje. */
export function NumberTicker({ value, startValue = 0, delay = 0, className }: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const motionValue = useMotionValue(startValue)
  const spring = useSpring(motionValue, { damping: 30, stiffness: 200 })
  const [shown, setShown] = useState(startValue)

  useMotionValueEvent(spring, 'change', (latest) => setShown(Math.round(latest)))

  useEffect(() => {
    if (!inView) return
    const timer = setTimeout(() => motionValue.set(value), delay * 1000)

    return () => clearTimeout(timer)
  }, [inView, delay, value, motionValue])

  return (
    <span ref={ref} className={cn('inline-block tabular-nums', className)}>
      {shown}
    </span>
  )
}
