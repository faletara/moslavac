'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { useState } from 'react'
import { LEGAL } from '../config'
import { FAQ } from '../data/faq'
import { TopoBackdrop } from '../components/TopoBackdrop'
import { cn } from '../ui/cn'

export function Faq() {
  const [open, setOpen] = useState<number | null>(0)
  const reduced = useReducedMotion()

  return (
    <section id="pitanja" className="relative overflow-hidden border-t border-white/10 bg-black">
      <TopoBackdrop className="pointer-events-none absolute inset-0 size-full" />
      <div className="relative mx-auto grid w-full max-w-[1180px] gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:py-24">
        <div>
          <span className="inline-flex h-[22px] items-center border border-white/10 px-2 text-[12px] text-white/60">
            Pitanja
          </span>
          <h2 className="display mt-4 text-[clamp(1.9rem,4.2vw,3rem)] text-white">
            Ono što klubovi pitaju
          </h2>
          <p className="mt-5 text-[15px] leading-relaxed text-white/55">
            Nema odgovora na vaše pitanje? Pišite na{' '}
            <a
              href={`mailto:${LEGAL.email}`}
              className="text-white underline underline-offset-4"
            >
              {LEGAL.email}
            </a>
            .
          </p>
        </div>

        <ul className="border-t border-white/10">
          {FAQ.map((item, index) => {
            const isOpen = open === index

            return (
              <li key={item.question} className="border-b border-white/10">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  className="flex w-full items-start justify-between gap-6 py-5 text-left"
                >
                  <span className="text-[17px] font-medium leading-snug text-white">
                    {item.question}
                  </span>
                  <Plus
                    className={cn(
                      'mt-0.5 size-5 shrink-0 text-white/40 transition-transform duration-300',
                      isOpen && 'rotate-45 text-white',
                    )}
                    strokeWidth={1.8}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: reduced ? 0 : 0.32, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-2xl pb-6 text-[15px] leading-relaxed text-white/55">
                        {item.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
