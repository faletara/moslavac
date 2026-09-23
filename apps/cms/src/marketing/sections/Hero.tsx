'use client'

import { motion, useReducedMotion } from 'framer-motion'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { TopoBackdrop } from '../components/TopoBackdrop'
import { CLUBS, HERO_SHOTS, demoFormUrl } from '../config'
import { cn } from '../ui/cn'

/** Ulazna animacija zajednička svim elementima heroa. */
const rise = {
  hidden: { opacity: 0, y: -40, filter: 'blur(10px)' },
  shown: { opacity: 1, y: 0, filter: 'blur(0px)' },
}

export function Hero() {
  const reduced = useReducedMotion()
  const [email, setEmail] = useState('')
  const tiltRef = useRef<HTMLDivElement>(null)

  // 3D nagib grupe kartica prati miš; isključen ispod 1024px i uz reduced motion.
  useEffect(() => {
    const node = tiltRef.current

    if (!node || reduced) return

    const canTilt = () => window.innerWidth >= 1024

    const move = (e: MouseEvent) => {
      if (!canTilt()) return
      const rect = node.getBoundingClientRect()
      const x = (e.clientX - rect.left - rect.width / 2) * 0.012
      const y = (e.clientY - rect.top - rect.height / 2) * -0.012
      node.style.transform = `perspective(1200px) rotateX(${y}deg) rotateY(${x}deg) scale3d(1.01,1.01,1.01)`
    }

    const enter = (e: MouseEvent) => {
      if (!canTilt()) return
      node.style.transition = 'transform 0.2s ease'
      move(e)
    }

    const leave = () => {
      node.style.transition = 'transform 0.6s ease'
      node.style.transform = 'perspective(1200px) rotateX(0) rotateY(0) scale3d(1,1,1)'
    }

    node.addEventListener('mouseenter', enter)
    node.addEventListener('mousemove', move)
    node.addEventListener('mouseleave', leave)

    return () => {
      node.removeEventListener('mouseenter', enter)
      node.removeEventListener('mousemove', move)
      node.removeEventListener('mouseleave', leave)
    }
  }, [reduced])

  // E-pošta se prosljeđuje obrascu; upisana adresa dolazi unaprijed ispunjena.
  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    window.open(demoFormUrl(email), '_blank', 'noopener')
  }

  return (
    <section className="relative overflow-hidden bg-black">
      <TopoBackdrop className="pointer-events-none absolute inset-0 size-full" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-72 bg-gradient-to-b from-transparent to-black"
      />

      <div className="relative mx-auto flex w-full max-w-[1180px] flex-col items-center px-5 pt-16 pb-20 text-center sm:px-8 lg:pt-20">
        <motion.h1
          variants={rise}
          initial="hidden"
          animate="shown"
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="display max-w-4xl text-[clamp(2.2rem,5.6vw,3.9rem)] text-white"
        >
          Stranica vašeg kluba, a rezultati se upisuju sami
        </motion.h1>

        <motion.p
          variants={rise}
          initial="hidden"
          animate="shown"
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="mt-5 max-w-xl text-[16px] leading-relaxed text-white/70"
        >
          Izrađujemo i održavamo web stranice za sportske klubove. Rezultati, tablica, raspored i
          strijelci povlače se automatski iz službenih izvora.
        </motion.p>

        <motion.form
          onSubmit={submit}
          variants={rise}
          initial="hidden"
          animate="shown"
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 flex w-full max-w-[560px] items-center justify-between gap-2.5 rounded-full bg-white py-1.5 pr-1.5 pl-5"
        >
          <label htmlFor="hero-email" className="sr-only">
            Vaša e-pošta
          </label>
          <input
            id="hero-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tajnik@vasklub.hr"
            className="h-9 min-w-0 flex-1 border-0 bg-transparent text-[15px] text-black outline-none placeholder:text-black/40"
          />
          <button type="submit" className="rainbow-button h-11 shrink-0 rounded-full px-6">
            Zatraži demo
          </button>
        </motion.form>

        <motion.p
          variants={rise}
          initial="hidden"
          animate="shown"
          transition={{ duration: 0.8, delay: 0.42, ease: [0.22, 1, 0.36, 1] }}
          className="mt-5 font-mono text-[11px] tracking-wide text-white/40"
        >
          Demo prije odluke · otkazivanje bilo kada · bez ugovorne obveze
        </motion.p>

        {/* Kartice — snimke klupskih stranica na mobitelu. */}
        <motion.div
          ref={tiltRef}
          initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.82 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mt-14 flex w-full items-end justify-center gap-3 sm:gap-5"
        >
          {HERO_SHOTS.map((shot, index) => (
            <PhoneCard key={shot.src} shot={shot} featured={index === 1} />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mt-14 flex flex-col items-center gap-4"
        >
          <p className="label text-white/35">Već koriste</p>
          <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {CLUBS.map((club) => (
              <li key={club.name}>
                <a
                  href={club.url}
                  target="_blank"
                  rel="noreferrer"
                  className="display text-[15px] text-white/45 transition-colors hover:text-white"
                >
                  {club.name}
                </a>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  )
}

function PhoneCard({
  shot,
  featured,
}: {
  shot: { src: string; alt: string }
  featured: boolean
}) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-[22px] border-4 border-white bg-black shadow-[0_30px_70px_-30px_rgba(0,0,0,0.9)]',
        featured ? 'z-10 w-[38%] max-w-[240px]' : 'w-[31%] max-w-[196px] opacity-90',
      )}
    >
      <div className={cn('relative', featured ? 'aspect-[9/16]' : 'aspect-[9/15]')}>
        <Image
          src={shot.src}
          alt={shot.alt}
          fill
          sizes="(min-width: 1024px) 290px, 33vw"
          priority={featured}
          className="object-cover object-top"
        />
      </div>
    </div>
  )
}
