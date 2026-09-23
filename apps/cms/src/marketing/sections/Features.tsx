import { ArrowRight, Newspaper, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { ButtonLink } from '../ui/Button'
import { DEMO_ANCHOR } from '../config'
import { TopoBackdrop } from '../components/TopoBackdrop'
import { cn } from '../ui/cn'

/**
 * Bento mreža na crnoj podlozi, kartice kao staklo iznad nje, bez
 * ulaznih animacija — svaka kartica nosi prikaz onoga o čemu govori.
 */
export function Features() {
  return (
    <section id="znacajke" className="relative overflow-hidden border-t border-white/10 bg-black">
      <TopoBackdrop className="pointer-events-none absolute inset-0 size-full" />
      <div className="relative mx-auto w-full max-w-[1180px] px-5 py-20 sm:px-8 lg:py-24">
        <div className="flex flex-col items-center text-center">
          <span className="rounded-full border border-white/10 bg-black px-3 py-1 text-[13px] text-white/60">
            Značajke
          </span>
          <h2 className="display mt-6 max-w-3xl text-[clamp(1.9rem,4.2vw,3rem)] text-white">
            Sve što klub treba na webu, bez ijednog unosa
          </h2>
          <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-white/55">
            Rezultati, tablica i raspored stižu sami iz službenog izvora. Klub objavljuje samo ono
            što želi — vijesti, slike i dokumente.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link href={DEMO_ANCHOR} className="rainbow-button h-11 gap-2 rounded-full px-6">
              Zatražite demo
              <Sparkles className="size-4" strokeWidth={1.8} />
            </Link>
            <ButtonLink
              href="/#klubovi"
              variant="secondary"
              className="border-white/15 bg-transparent text-white hover:border-white/30 hover:bg-white/10"
            >
              Pogledajte klubove
              <ArrowRight className="size-4" strokeWidth={1.8} />
            </ButtonLink>
          </div>
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          <div className="flex flex-col gap-4">
            <Card>
              <SourceOrbit />
              <CardText
                title="Rezultati i tablica"
                text="Stranica se spaja na službeni izvor natjecanja i sama povlači odigrane utakmice, poredak i strijelce."
              />
            </Card>
            <Card>
              <FacebookSync />
              <CardText
                title="Objave s Facebooka same dolaze"
                text="Stranica se poveže s Facebook stranicom kluba. Što objavite tamo, pojavi se i ovdje — bez dvostrukog pisanja."
              />
            </Card>
            <Card>
              <CategoryChips />
              <CardText
                title="Sve dobne kategorije"
                text="Od seniora do prstića — svaka momčad ima svoj raspored, postavu i rezultate."
              />
            </Card>
          </div>

          <Card>
            <RoundPanel />
            <CardText
              title="Pregled kola na naslovnici"
              text="Zadnji rezultati, sljedeća utakmica i forma momčadi — složeno tako da navijač sve vidi odmah."
            />
          </Card>

          <div className="flex flex-col gap-4">
            <Card>
              <SponsorNodes />
              <CardText
                title="Sponzori u prvom planu"
                text="Logotipi s poveznicom na svakoj stranici — vidljivost koju sponzoru možete pokazati."
              />
            </Card>
            <Card className="overflow-hidden">
              <StatTiles />
              <CardText
                title="Radi na mobitelu i vidi se na Googleu"
                text="Stranica se dodaje na početni zaslon, brzo se učitava i dolazi s mapom stranica za tražilice."
              />
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <article
      className={cn(
        'flex h-full flex-col rounded-2xl border border-white/10 bg-black p-5',
        className,
      )}
    >
      {children}
    </article>
  )
}

function CardText({ title, text }: { title: string; text: string }) {
  return (
    <div className="mt-6">
      <h3 className="display text-[19px] text-white">{title}</h3>
      <p className="mt-2 text-[14px] leading-relaxed text-white/55">{text}</p>
    </div>
  )
}

/** Izvor podataka u sredini, oko njega ono što iz njega dolazi. */
function SourceOrbit() {
  const labels = [
    { text: 'Rezultati', className: 'left-1/2 top-3 -translate-x-1/2 -rotate-3' },
    { text: 'Tablica', className: 'right-3 top-12 rotate-6' },
    { text: 'Strijelci', className: 'right-5 bottom-11 -rotate-3' },
    { text: 'Raspored', className: 'left-1/2 bottom-3 -translate-x-1/2 rotate-2' },
    { text: 'Kartoni', className: 'left-3 bottom-12 rotate-3' },
    { text: 'Kola', className: 'left-4 top-11 -rotate-6' },
  ]

  return (
    <div className="relative h-[188px] rounded-xl bg-white/[0.04]">
      <span className="absolute left-1/2 top-1/2 size-[124px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />
      <span className="absolute left-1/2 top-1/2 size-[78px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-black" />
      <span className="absolute left-1/2 top-1/2 flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white">
        <span className="font-mono text-[9px] tracking-[0.1em] text-black">HNS</span>
      </span>
      {labels.map((label) => (
        <span
          key={label.text}
          className={cn(
            'absolute rounded-full border border-white/10 bg-black px-2.5 py-1 font-mono text-[10px] text-white/60',
            label.className,
          )}
        >
          {label.text}
        </span>
      ))}
    </div>
  )
}

/** Objava s Facebooka putuje u novosti na klupskoj stranici. */
function FacebookSync() {
  return (
    <div className="relative flex h-[152px] items-center gap-3 overflow-hidden rounded-xl bg-white/[0.04] p-4">
      <div className="flex-1 rounded-lg border border-white/10 bg-black p-3">
        <div className="flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-md bg-[#1877F2] font-semibold text-[13px] leading-none text-white">
            f
          </span>
          <span className="font-mono text-[9px] text-white/50">FACEBOOK</span>
        </div>
        <div className="mt-3 space-y-1.5">
          <span className="block h-1.5 w-full rounded-full bg-white/15" />
          <span className="block h-1.5 w-4/5 rounded-full bg-white/10" />
        </div>
        <span className="mt-3 block h-10 rounded-md bg-white/[0.06]" />
      </div>

      <ArrowRight className="size-4 shrink-0 text-white/40" strokeWidth={2} />

      <div className="flex-1 rounded-lg border border-white/10 bg-black p-3">
        <div className="flex items-center gap-2">
          <span className="flex size-6 items-center justify-center rounded-md bg-white text-black">
            <Newspaper className="size-3.5" strokeWidth={1.8} />
          </span>
          <span className="font-mono text-[9px] text-white/50">NOVOSTI</span>
        </div>
        <div className="mt-3 space-y-1.5">
          <span className="block h-1.5 w-full rounded-full bg-white/15" />
          <span className="block h-1.5 w-4/5 rounded-full bg-white/10" />
        </div>
        <span className="mt-3 block h-10 rounded-md bg-white/[0.06]" />
      </div>
    </div>
  )
}

function CategoryChips() {
  const categories = ['Seniori', 'Juniori', 'Kadeti', 'Pioniri', 'Limači', 'Prstići', 'Veterani']

  return (
    <div className="relative h-[124px] overflow-hidden rounded-xl bg-white/[0.04] p-4">
      <div className="flex flex-wrap gap-2">
        {categories.map((category, index) => (
          <span
            key={category}
            className={cn(
              'rounded-full border border-white/10 bg-black px-3 py-1.5 text-[12px]',
              index === 0 ? 'border-white text-white' : 'text-white/55',
            )}
          >
            {category}
          </span>
        ))}
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black to-transparent"
      />
    </div>
  )
}

/** Maketa pregleda kola — redovi utakmica i stupci golova po kolu. */
function RoundPanel() {
  const matches = [
    { home: 'Naš klub', away: 'NK Lipa', score: '2:0', tag: '28. kolo', win: true },
    { home: 'NK Sokol', away: 'Naš klub', score: '1:1', tag: '27. kolo', win: false },
    { home: 'Naš klub', away: 'NK Hrast', score: '3:1', tag: '26. kolo', win: true },
  ]

  const bars = [40, 78, 55, 96, 34, 62, 88]
  const rounds = ['22', '23', '24', '25', '26', '27', '28']

  return (
    <div className="rounded-xl bg-white/[0.04] p-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[15px] font-semibold text-white">Rezultati</p>
          <p className="mt-0.5 text-[12px] text-white/55">Treća NL · 2025/26</p>
        </div>
        <span className="rounded-full border border-white/10 bg-black px-2.5 py-1 font-mono text-[10px] text-white/55">
          automatski
        </span>
      </div>

      <ul className="mt-4 space-y-2">
        {matches.map((match) => (
          <li
            key={match.tag}
            className="flex items-center gap-3 rounded-lg border border-white/10 bg-black px-3 py-2.5"
          >
            <span
              className={cn(
                'flex size-8 shrink-0 items-center justify-center rounded-md border border-white/10 font-mono text-[11px]',
                match.win ? 'bg-white text-black' : 'bg-white/[0.04] text-white/55',
              )}
            >
              {match.win ? 'P' : 'N'}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13px] font-medium text-white">
                {match.home} — {match.away}
              </span>
              <span className="text-[11px] text-white/55">{match.tag}</span>
            </span>
            <span className="font-mono text-[15px] tabular-nums text-white">
              {match.score}
            </span>
          </li>
        ))}
      </ul>

      <div className="mt-5">
        <p className="text-[12px] text-white/55">Golovi po kolu</p>
        <div className="mt-3 flex h-24 items-end gap-2">
          {bars.map((height, index) => (
            <span
              key={index}
              style={{ height: `${height}%` }}
              className={cn('flex-1 rounded-t-md', index === 3 ? 'bg-white' : 'bg-white/10')}
            />
          ))}
        </div>
        <div className="mt-2 flex gap-2">
          {rounds.map((round) => (
            <span key={round} className="flex-1 text-center font-mono text-[10px] text-white/40">
              {round}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

function SponsorNodes() {
  const left = ['ALPHA GYM', 'AUTO SERVIS', 'PEKARA']
  const right = ['GRAĐEVINE', 'CVJEĆARNA', 'KAFIĆ']

  return (
    <div className="relative h-[176px] overflow-hidden rounded-xl bg-white/[0.04]">
      {/* Zakrivljene veze od sponzora prema klubu. */}
      <svg viewBox="0 0 320 176" className="absolute inset-0 size-full" aria-hidden>
        <g stroke="rgba(255,255,255,0.18)" fill="none" strokeWidth="1">
          <path d="M72 36 C 120 36, 120 88, 148 88" />
          <path d="M72 88 H 148" />
          <path d="M72 140 C 120 140, 120 88, 148 88" />
          <path d="M248 36 C 200 36, 200 88, 172 88" />
          <path d="M248 88 H 172" />
          <path d="M248 140 C 200 140, 200 88, 172 88" />
        </g>
      </svg>

      <span className="absolute left-1/2 top-1/2 flex size-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-xl border border-white/10 bg-black shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
        <span className="font-mono text-[9px] tracking-[0.06em] text-white">KLUB</span>
      </span>

      {left.map((sponsor, index) => (
        <span
          key={sponsor}
          style={{ top: `${16 + index * 52}px` }}
          className="absolute left-3 rounded-lg border border-white/10 bg-black px-2.5 py-1.5 font-mono text-[9px] text-white/60"
        >
          {sponsor}
        </span>
      ))}
      {right.map((sponsor, index) => (
        <span
          key={sponsor}
          style={{ top: `${16 + index * 52}px` }}
          className="absolute right-3 rounded-lg border border-white/10 bg-black px-2.5 py-1.5 font-mono text-[9px] text-white/60"
        >
          {sponsor}
        </span>
      ))}
    </div>
  )
}

function StatTiles() {
  return (
    <div className="-mr-12 flex gap-3 rounded-xl bg-white/[0.04] p-4">
      <div className="w-1/2 shrink-0 rounded-lg border border-white/10 bg-black p-3">
        <p className="text-[13px] font-medium text-white">Unosa rezultata</p>
        <span className="mt-1.5 inline-block rounded-md bg-white/[0.04] px-2 py-0.5 text-[10px] text-white/55">
          tjedno
        </span>
        <p className="display mt-3 text-[26px] text-white">0</p>
      </div>
      <div className="w-1/2 shrink-0 rounded-lg border border-white/10 bg-black p-3">
        <p className="text-[13px] font-medium text-white">Instalacija</p>
        <span className="mt-1.5 inline-block rounded-md bg-white/[0.04] px-2 py-0.5 text-[10px] text-white/55">
          na mobitel
        </span>
        <p className="display mt-3 text-[26px] text-white">1 klik</p>
      </div>
    </div>
  )
}
