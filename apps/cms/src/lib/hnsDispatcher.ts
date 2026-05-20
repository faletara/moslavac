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
  const callback = (typeof options === 'function' ? options : maybeCallback) as LookupCallback
  const opts: LookupOptions = typeof options === 'function' ? {} : options

  resolver.resolve4(hostname).then(
    (addresses) => {
      if (addresses.length === 0) {
        const err = new Error(
          `No A records returned for ${hostname}`,
        ) as NodeJS.ErrnoException
        err.code = 'ENOTFOUND'
        callback(err, '', 0)
        return
      }
      if (opts.all) {
        callback(
          null,
          addresses.map((address) => ({ address, family: 4 })),
        )
      } else {
        callback(null, addresses[0], 4)
      }
    },
    (err: NodeJS.ErrnoException) => callback(err, '', 0),
  )
}

export const hnsDispatcher = new Agent({
  connect: { lookup: publicDnsLookup },
})
