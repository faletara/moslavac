'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { cn } from '../ui/cn'

/**
 * Maketa klupske stranice koja se sama mijenja: gol padne, semafor se pomakne,
 * a redak kluba u tablici se popne. Poanta cijele ponude — nitko iz kluba ne
 * upisuje ništa — pokazana umjesto opisana.
 */

type Moment = {
  minute: string
  home: number
  away: number
  /** Bodovi kluba nakon ovog trenutka; mijenja poredak u tablici. */
  points: number
  note: string
}

const MOMENTS: Moment[] = [
  { minute: "62'", home: 0, away: 0, points: 28, note: 'Utakmica u tijeku' },
  { minute: "74'", home: 1, away: 0, points: 28, note: 'Gol — Horvat (74′)' },
  { minute: "90'", home: 2, away: 0, points: 31, note: 'Kraj — upisana 3 boda' },
]

const RIVALS = [
  { name: 'NK Sokol', points: 34 },
  { name: 'NK Hrast', points: 30 },
  { name: 'NK Bregana', points: 27 },
  { name: 'NK Lipa', points: 25 },
]

export function SitePreview({ className }: { className?: string }) {
  const reduced = useReducedMotion()
  const [step, setStep] = useState(reduced ? MOMENTS.length - 1 : 0)

  useEffect(() => {
    if (reduced) return
    const id = setInterval(() => setStep((s) => (s + 1) % MOMENTS.length), 2800)

    return () => clearInterval(id)
  }, [reduced])

  const moment = MOMENTS[step]

  const table = [...RIVALS, { name: 'VAŠ KLUB', points: moment.points, self: true }].sort(
    (a, b) => b.points - a.points,
  )

  return (
    <div className={cn('relative', className)}>
      {/* Okvir preglednika */}
      <div className="overflow-hidden rounded-[22px] border border-line-strong bg-white shadow-[0_28px_60px_-28px_rgba(14,19,17,0.35)]">
        <div className="flex items-center gap-2 border-b border-line bg-paper-2 px-4 py-2.5">
          <span className="size-2.5 rounded-full bg-line-strong" />
          <span className="size-2.5 rounded-full bg-line-strong" />
          <span className="size-2.5 rounded-full bg-line-strong" />
          <span className="ml-2 truncate rounded-full bg-white px-3 py-1 font-mono text-[11px] text-muted">
            vasklub.hr
          </span>
        </div>

        {/* Klupski header */}
        <div className="flex items-center justify-between bg-ink px-5 py-3.5 text-white">
          <div className="flex items-center gap-2.5">
            <Crest />
            <span className="display text-[15px] tracking-tight">NK VAŠ KLUB</span>
          </div>
          <div className="hidden gap-4 font-mono text-[10px] tracking-[0.12em] text-white/50 sm:flex">
            <span>NOVOSTI</span>
            <span>MOMČADI</span>
            <span>RASPORED</span>
            <span>KLUB</span>
          </div>
        </div>

        <div className="space-y-4 p-5">
          {/* Semafor */}
          <div className="rounded-2xl border border-line bg-paper p-4">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 rounded-full bg-ink px-2.5 py-1">
                <motion.span
                  className="size-1.5 rounded-full bg-lime"
                  animate={reduced ? undefined : { opacity: [1, 0.25, 1] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
                />
                <span className="font-mono text-[10px] tracking-[0.14em] text-white">UŽIVO</span>
              </span>
              <span className="font-mono text-[11px] text-muted">{moment.minute}</span>
            </div>

            <div className="mt-3 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
              <div className="flex items-center gap-2">
                <Crest className="size-7" />
                <span className="truncate text-[13px] font-medium">Vaš klub</span>
              </div>
              <div className="display flex items-baseline gap-1.5 text-3xl tabular-nums">
                <Digit value={moment.home} />
                <span className="text-line-strong">:</span>
                <Digit value={moment.away} />
              </div>
              <div className="flex items-center justify-end gap-2">
                <span className="truncate text-[13px] font-medium text-muted">NK Lipa</span>
                <span className="size-7 rounded-full bg-line" />
              </div>
            </div>

            <div className="mt-3 h-4 overflow-hidden">
              <AnimatePresence mode="wait" initial={false}>
                <motion.p
                  key={moment.note}
                  initial={{ y: reduced ? 0 : 12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: reduced ? 0 : -12, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="font-mono text-[11px] text-pitch"
                >
                  {moment.note}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>

          {/* Tablica */}
          <div className="rounded-2xl border border-line">
            <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
              <span className="label text-muted">Tablica lige</span>
              <span className="font-mono text-[10px] text-muted">BOD.</span>
            </div>
            <ul className="p-1.5">
              {table.map((row, index) => (
                <motion.li
                  key={row.name}
                  layout
                  transition={{ type: 'spring', stiffness: 320, damping: 34 }}
                  className={cn(
                    'flex items-center justify-between rounded-xl px-2.5 py-2 text-[13px]',
                    'self' in row && row.self ? 'bg-pitch-soft font-semibold text-pitch' : 'text-ink',
                  )}
                >
                  <span className="flex items-center gap-3">
                    <span className="w-3 font-mono text-[11px] text-muted tabular-nums">
                      {index + 1}
                    </span>
                    <span className="truncate">{row.name}</span>
                  </span>
                  <span className="font-mono tabular-nums">{row.points}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Oznaka izvora podataka — objašnjava odakle brojke dolaze. */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="absolute -bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-line bg-white px-4 py-2 shadow-[0_10px_30px_-12px_rgba(14,19,17,0.3)]"
      >
        <span className="size-1.5 rounded-full bg-pitch" />
        <span className="font-mono text-[11px] text-muted">Podaci se povlače automatski</span>
      </motion.div>
    </div>
  )
}

function Digit({ value }: { value: number }) {
  return (
    <span className="relative inline-block h-[1em] w-[0.62em] overflow-hidden">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={{ y: '100%' }}
          animate={{ y: '0%' }}
          exit={{ y: '-100%' }}
          transition={{ type: 'spring', stiffness: 380, damping: 34 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

function Crest({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 28" className={cn('size-6', className)} aria-hidden>
      <path d="M12 1 22 4v11c0 6-4.4 10.2-10 12C6.4 25.2 2 21 2 15V4l10-3Z" fill="#0b7a44" />
      <path d="M12 5.5 18.5 7.5V15c0 4-2.8 6.9-6.5 8.3C8.3 21.9 5.5 19 5.5 15V7.5L12 5.5Z" fill="#d8ff4b" />
      <path d="M12 9.5 13.4 13h3.6l-2.9 2.2 1.1 3.5L12 16.6 8.8 18.7l1.1-3.5L7 13h3.6L12 9.5Z" fill="#0b7a44" />
    </svg>
  )
}
