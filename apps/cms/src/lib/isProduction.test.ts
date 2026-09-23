import { describe, expect, it } from 'vitest'
import { isProduction } from './isProduction'

describe('isProduction', () => {
  it('prati NODE_ENV', () => {
    expect(isProduction({ NODE_ENV: 'production' })).toBe(true)
    expect(isProduction({ NODE_ENV: 'development' })).toBe(false)
    expect(isProduction({})).toBe(false)
  })
})
