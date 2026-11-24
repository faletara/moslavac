import { lookup as systemLookup } from 'node:dns'
import { Resolver } from 'node:dns/promises'
import { Agent } from 'undici'

const PUBLIC_DNS_SERVERS = ['1.1.1.1', '1.0.0.1', '8.8.8.8']

const resolver = new Resolver()

resolver.setServers(PUBLIC_DNS_SERVERS)

type LookupOptions = { all?: boolean; family?: number | 'IPv4' | 'IPv6' }

type LookupCallback = (
  err: NodeJS.ErrnoException | null,
  addressOrAddresses: string | Array<{ address: string; family: number }>,
  family?: number,
) => void

function publicDnsLookup(
  hostname: string,
  options: LookupOptions | LookupCallback,
  maybeCallback?: LookupCallback,
): void {
  // SAFETY: `dns.lookup` ima dva preopterećenja — callback je ili drugi ili
  // treći argument. Node jedno od njih uvijek preda, pa je rezultat grananja
  // callback i kad TS to ne može dokazati.
  //
  // `anti-slop/no-runtime-typeof` prijavljuje oba reda. Ovdje nema granice na
  // koju bi se provjera premjestila: potpis dolazi iz Nodeove `dns` knjižnice i
  // razlikuje se samo po tome je li drugi argument funkcija.
  const callback = (typeof options === 'function' ? options : maybeCallback) as LookupCallback
  const opts: LookupOptions = typeof options === 'function' ? {} : options

  // Javni DNS je prvi izbor, ali ne i jedini: kad upit na 1.1.1.1 iz Vercel
  // funkcije padne, cron je dobivao samo "fetch failed" i nije objavljivao
  // ništa. Tada pitamo sistemski resolver — isti onaj koji klupske stranice
  // koriste bez problema.
  const fallback = () => systemLookup(hostname, { all: opts.all === true }, callback)

  resolver.resolve4(hostname).then(
    (addresses) => {
      if (addresses.length === 0) return fallback()

      if (opts.all) {
        callback(
          null,
          addresses.map((address) => ({ address, family: 4 })),
        )
      } else {
        callback(null, addresses[0], 4)
      }
    },
    fallback,
  )
}

export const hnsDispatcher = new Agent({
  connect: { lookup: publicDnsLookup },
})
