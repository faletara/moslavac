'use client'

import { animate, useMotionValue, useMotionValueEvent, useReducedMotion } from 'framer-motion'
import { ClipboardCheck, MessageSquare, PenTool, Rocket } from 'lucide-react'
import { useEffect, useState, type ReactElement } from 'react'
import { TopoBackdrop } from '../components/TopoBackdrop'
import { cn } from '../ui/cn'

type Step = {
  icon: ReactElement
  title: string
  description: string
  /** Dokle je traka ispunjena kad je korak aktivan. */
  progress: number
  duration: string
}

const STEPS: Step[] = [
  {
    icon: <MessageSquare />,
    title: 'Javite se',
    description:
      'Trebamo ime kluba, ligu u kojoj igrate i grb. Dogovor stane u jedan poziv ili poruku.',
    progress: 25,
    duration: '~1 dan',
  },
  {
    icon: <PenTool />,
    title: 'Radimo demo',
    description:
      'Dizajn crtamo za vaš klub: raspored, tipografija, fotografije. Demo ide na privremenu adresu, s vašim stvarnim rezultatima.',
    progress: 60,
    duration: '~3 dana',
  },
  {
    icon: <ClipboardCheck />,
    title: 'Pregled i ispravci',
    description:
      'Prolazite kroz stranicu s upravom i javljate što mijenjamo. Do ovog koraka nema nikakve obveze.',
    progress: 85,
    duration: '~1 tjedan',
  },
  {
    icon: <Rocket />,
    title: 'Objava i održavanje',
    description:
      'Spajamo domenu, stranica ide uživo, a rezultati se od tada osvježavaju sami. Održavanje preuzimamo mi.',
    progress: 100,
    duration: 'traje dalje',
  },
]

/** Koliko svaki korak ostaje aktivan prije prelaska na sljedeći. */
const STEP_MS = 2500

export function HowItWorks() {
  const reduced = useReducedMotion()
  const [active, setActive] = useState(0)

  useEffect(() => {
    if (reduced) {
      setActive(STEPS.length - 1)

      return
    }

    const id = setInterval(() => setActive((i) => (i + 1) % STEPS.length), STEP_MS)

    return () => clearInterval(id)
  }, [reduced])

  return (
    <section id="kako-radi" className="relative overflow-hidden border-t border-white/10 bg-black">
      <TopoBackdrop className="pointer-events-none absolute inset-0 size-full" />
      <div className="relative mx-auto w-full max-w-[1180px] px-5 py-20 sm:px-8 lg:py-24">
        <div className="mb-14 space-y-4 text-center lg:mb-20">
          <p className="text-[13px] font-medium uppercase tracking-wide text-white">Proces</p>
          <h2 className="display text-[clamp(1.9rem,4.2vw,3rem)] text-white">
            Od prve poruke do stranice uživo
          </h2>
          <p className="mx-auto max-w-3xl text-[17px] leading-relaxed text-white/55">
            Klub ne mora ništa pripremati ni odlučivati unaprijed. Stranicu vidite gotovu prije nego
            se na išta obvežete, a nakon objave održavanje je na nama.
          </p>
        </div>

        <ol className="flex flex-col gap-4 xl:flex-row xl:justify-center">
          {STEPS.map((step, index) => {
            const isActive = active === index
            const isPast = active > index
            const isLast = index === STEPS.length - 1

            return (
              <li key={step.title} className="flex flex-row items-start xl:flex-col">
                <div className="flex flex-col items-center gap-4 xl:flex-row">
                  <span
                    className={cn(
                      'flex size-10 shrink-0 items-center justify-center rounded-full transition-colors duration-300 [&>svg]:size-5',
                      isActive || isPast
                        ? 'bg-white text-black'
                        : 'bg-white/[0.04] text-white',
                    )}
                  >
                    {step.icon}
                  </span>
                  {!isLast && (
                    <TimelineLine
                      filled={isPast}
                      running={isActive && !reduced}
                      duration={STEP_MS}
                    />
                  )}
                </div>

                <div className="ml-4 flex flex-col justify-between gap-4 pb-2 xl:ml-0 xl:mt-4 xl:h-44 xl:max-w-[260px]">
                  <div>
                    <h3 className="text-[17px] font-medium text-white">{step.title}</h3>
                    <p className="mt-1.5 text-[15px] leading-relaxed text-white/55">
                      {step.description}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <ProgressBar
                      target={step.progress}
                      active={isActive}
                      past={isPast}
                      reduced={Boolean(reduced)}
                    />
                    <p className="text-[12px] text-white/55">{step.duration}</p>
                  </div>
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}

/** Spojnica među koracima — puni se dok je korak aktivan. */
function TimelineLine({
  filled,
  running,
  duration,
}: {
  filled: boolean
  running: boolean
  duration: number
}) {
  return (
    <span className="relative block w-0.5 flex-1 overflow-hidden rounded-full bg-white/10 max-xl:min-h-24 xl:h-0.5 xl:w-full xl:min-w-24">
      <span
        className={cn(
          'absolute inset-0 origin-top rounded-full bg-white xl:origin-left',
          running &&
            'animate-[timeline-fill-y_var(--fill-duration)_linear_forwards] xl:animate-[timeline-fill-x_var(--fill-duration)_linear_forwards]',
          !running && (filled ? 'scale-100' : 'scale-y-0 xl:scale-x-0 xl:scale-y-100'),
        )}
        // SAFETY: `--*` je CSS custom property; Reactov `CSSProperties` popisuje samo
        // standardna svojstva, pa ga inline stil ovdje mora proširiti.
        style={{ '--fill-duration': `${duration}ms` } as React.CSSProperties}
      />
    </span>
  )
}

/** Traka napretka s brojčanikom koji broji do ciljne vrijednosti. */
function ProgressBar({
  target,
  active,
  past,
  reduced,
}: {
  target: number
  active: boolean
  past: boolean
  reduced: boolean
}) {
  const value = useMotionValue(0)
  const [shown, setShown] = useState(0)

  useMotionValueEvent(value, 'change', (v) => setShown(Math.round(v)))

  useEffect(() => {
    if (past || reduced) {
      value.set(target)

      return
    }

    if (!active) {
      value.set(0)

      return
    }

    const controls = animate(value, target, { duration: 2, ease: [0.33, 1, 0.68, 1] })

    return () => controls.stop()
  }, [active, past, reduced, target, value])

  return (
    <div className="flex items-center gap-2">
      <span className="h-1.5 w-full max-w-[200px] overflow-hidden rounded-full bg-white/10">
        <span
          className="block h-full rounded-full bg-white transition-[width] duration-100"
          style={{ width: `${shown}%` }}
        />
      </span>
      <span className="text-[12px] font-semibold tabular-nums text-white/55">{shown}%</span>
    </div>
  )
}
