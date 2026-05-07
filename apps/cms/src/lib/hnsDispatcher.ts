import { Resolver } from 'node:dns/promises'
import { Agent } from 'undici'

const PUBLIC_DNS_SERVERS = ['1.1.1.1', '1.0.0.1', '8.8.8.8']

const resolver = new Resolver()
resolver.setServers(PUBLIC_DNS_SERVERS)

type LookupCallback = (
  err: NodeJS.ErrnoException | null,
  address: string,
  family: number,
) => void

function publicDnsLookup(
  hostname: string,
  _options: unknown,
  callback: LookupCallback,
): void {
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
      callback(null, addresses[0], 4)
    },
    (err: NodeJS.ErrnoException) => callback(err, '', 0),
  )
}

export const hnsDispatcher = new Agent({
  connect: { lookup: publicDnsLookup },
})
