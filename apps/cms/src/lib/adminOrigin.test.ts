import { describe, expect, it } from 'vitest'
import { resolveAdminOrigin } from './adminOrigin'

describe('resolveAdminOrigin', () => {
  it('vraća origin iz PAYLOAD_SERVER_URL', () => {
    expect(
      resolveAdminOrigin({
        PAYLOAD_SERVER_URL: 'https://cms.example.hr',
        NODE_ENV: 'production',
      }),
    ).toBe('https://cms.example.hr')
  })

  it('svodi URL na origin (bez putanje i završne kose crte)', () => {
    expect(
      resolveAdminOrigin({
        PAYLOAD_SERVER_URL: 'https://cms.example.hr/admin/',
        NODE_ENV: 'production',
      }),
    ).toBe('https://cms.example.hr')
  })

  it('u developmentu bez varijable koristi lokalni CMS', () => {
    expect(resolveAdminOrigin({ NODE_ENV: 'development' })).toBe(
      'http://localhost:43102',
    )
    expect(resolveAdminOrigin({})).toBe('http://localhost:43102')
  })

  it('u produkciji bez varijable baca grešku', () => {
    expect(() => resolveAdminOrigin({ NODE_ENV: 'production' })).toThrow(
      /PAYLOAD_SERVER_URL/,
    )
  })

  it('u produkciji odbija http origin', () => {
    expect(() =>
      resolveAdminOrigin({
        PAYLOAD_SERVER_URL: 'http://cms.example.hr',
        NODE_ENV: 'production',
      }),
    ).toThrow(/https/)
  })

  it('odbija vrijednost koja nije URL', () => {
    expect(() =>
      resolveAdminOrigin({ PAYLOAD_SERVER_URL: 'cms.example.hr' }),
    ).toThrow(/PAYLOAD_SERVER_URL/)
  })
})
