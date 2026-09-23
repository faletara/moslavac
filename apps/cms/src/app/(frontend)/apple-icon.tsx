import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }

export const contentType = 'image/png'

/** Isti znak za iOS početni zaslon; iOS sam zaobljuje rubove. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          background: '#0e1311',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 18,
            right: 18,
            height: 12,
            background: '#d8ff4b',
          }}
        />
        <div
          style={{
            width: 84,
            height: 84,
            borderRadius: 999,
            border: '12px solid #d8ff4b',
            background: 'transparent',
          }}
        />
      </div>
    ),
    size,
  )
}
