import { ImageResponse } from 'next/og'
import { BRAND } from '@/marketing/config'

export const alt = `${BRAND.name} — ${BRAND.tagline}`

export const size = { width: 1200, height: 630 }

export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#fbfaf7',
          padding: 72,
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 13,
              background: '#0e1311',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#d8ff4b',
              fontSize: 22,
              fontWeight: 700,
            }}
          >
            K
          </div>
          <div style={{ fontSize: 30, fontWeight: 700, color: '#0e1311' }}>{BRAND.name}</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div
            style={{
              fontSize: 76,
              fontWeight: 700,
              color: '#0e1311',
              lineHeight: 1.02,
              letterSpacing: -2.5,
            }}
          >
            Stranica vašeg kluba.
          </div>
          <div
            style={{
              fontSize: 76,
              fontWeight: 700,
              color: '#0b7a44',
              lineHeight: 1.02,
              letterSpacing: -2.5,
            }}
          >
            Rezultati se upisuju sami.
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid #e6e4dc',
            paddingTop: 28,
            fontSize: 24,
            color: '#5c6560',
          }}
        >
          <div style={{ display: 'flex' }}>Izrada, hosting i podrška u jednoj pretplati</div>
          <div style={{ display: 'flex' }}>{BRAND.domain}</div>
        </div>
      </div>
    ),
    size,
  )
}
