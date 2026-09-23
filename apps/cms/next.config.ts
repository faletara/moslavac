import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)

const dirname = path.dirname(__filename)

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
      {
        // Snimke klupskih stranica na marketinškoj naslovnici.
        pathname: '/klubovi/**',
      },
    ],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname, "../.."),
  },
  /**
   * Marketinška naslovnica stoji na klupskoj domeni. Tehničke adrese
   * deploymenta (vercel.app, admin poddomena) vode ravno u Payload admin, pa
   * nitko ne ulazi u prodajni tekst kad hoće prijavu.
   *
   * Dodatne hostove upiši u `ADMIN_HOSTS`, odvojene zarezom.
   */
  async redirects() {
    const hosts = (process.env.ADMIN_HOSTS ?? 'clubs-cms.vercel.app')
      .split(',')
      .map((host) => host.trim())
      .filter(Boolean)

    return hosts.map((host) => ({
      source: '/',
      has: [{ type: 'host' as const, value: host }],
      destination: '/admin',
      // Namjerno privremeni: vezan je uz okolinu, a trajni bi ostao u cacheu
      // preglednika i nakon što se domena promijeni.
      permanent: false,
    }))
  },
  // Osnovni sigurnosni headeri. CSP se namjerno ne postavlja jer Payload admin
  // na istoj domeni koristi inline stilove i workere.
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
      {
        // Admin i API platforme ne smiju u indeks tražilica.
        source: '/(admin|api)/:path*',
        headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
      },
    ]
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
