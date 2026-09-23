import { describe, expect, it } from 'vitest'
import { matchesBearerSecret } from './bearerSecret'

describe('matchesBearerSecret', () => {
  it('prihvaća točan Bearer header', () => {
    expect(matchesBearerSecret('Bearer s3cret', 's3cret')).toBe(true)
  })

  it('odbija krivu tajnu iste duljine', () => {
    expect(matchesBearerSecret('Bearer s3creT', 's3cret')).toBe(false)
  })

  it('odbija tajnu druge duljine', () => {
    expect(matchesBearerSecret('Bearer s3cret-dulje', 's3cret')).toBe(false)
    expect(matchesBearerSecret('Bearer s3cre', 's3cret')).toBe(false)
  })

  it('odbija header bez Bearer prefiksa', () => {
    expect(matchesBearerSecret('s3cret', 's3cret')).toBe(false)
  })

  it('odbija kad header ili tajna nedostaju', () => {
    expect(matchesBearerSecret(null, 's3cret')).toBe(false)
    expect(matchesBearerSecret('Bearer ', '')).toBe(false)
    expect(matchesBearerSecret('Bearer x', undefined)).toBe(false)
  })
})

describe('matchesBearerSecret bez tajne', () => {
  it('nepostavljena ili prazna tajna nikad ne prolazi', () => {
    expect(matchesBearerSecret('Bearer ', undefined)).toBe(false)
    expect(matchesBearerSecret('Bearer ', '')).toBe(false)
    expect(matchesBearerSecret(null, '')).toBe(false)
  })
})
