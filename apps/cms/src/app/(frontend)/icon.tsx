import { ImageResponse } from 'next/og'

export const size = { width: 32, height: 32 }

export const contentType = 'image/png'

/**
 * Znak je travnjak odozgo — središnji krug i središnja linija. Debljine su
 * namjerno velike jer se na 32 px tanke linije izgube.
 */
export default function Icon() {
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
          borderRadius: 7,
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 3,
            right: 3,
            height: 2.5,
            background: '#d8ff4b',
          }}
        />
        <div
          style={{
            width: 15,
            height: 15,
            borderRadius: 999,
            border: '2.5px solid #d8ff4b',
            background: 'transparent',
          }}
        />
      </div>
    ),
    size,
  )
}
