import { describe, expect, it } from 'vitest'
import { matchPageBasePath } from './matchReportsStore'

describe('matchPageBasePath', () => {
  it.each([
    ['/raspored-i-rezultati', '/raspored-i-rezultati'],
    ['utakmice/', '/utakmice'],
    ['//raspored/2025-26//', '/raspored/2025-26'],
  ])('normalizira %j u %j', (value, expected) => {
    expect(matchPageBasePath(value)).toBe(expected)
  })

  // Prazna putanja dala bi poveznicu "//<slug>", koju preglednik čita kao host.
  it.each([null, undefined, '', '/', '///'])('bez putanje (%j) uzima zadanu', (value) => {
    expect(matchPageBasePath(value)).toBe('/raspored-i-rezultati')
  })
})
