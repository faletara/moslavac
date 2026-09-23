import { describe, expect, it } from 'vitest'
import { isProduction, resolveAdminOrigins } from './adminOrigin'

const DEV = { serverURL: 'http://localhost:43102', csrf: ['http://localhost:43102'] }

describe('resolveAdminOrigins', () => {
  it('uzima origin iz PAYLOAD_SERVER_URL', () => {
    expect(
      resolveAdminOrigins({
        PAYLOAD_SERVER_URL: 'https://cms.example.hr',
        NODE_ENV: 'production',
      }),
    ).toEqual({
      serverURL: 'https://cms.example.hr',
      csrf: ['https://cms.example.hr'],
    })
  })

  it('svodi URL na origin (bez putanje i završne kose crte)', () => {
    expect(
      resolveAdminOrigins({
        PAYLOAD_SERVER_URL: 'https://cms.example.hr/admin/',
        NODE_ENV: 'production',
      }).serverURL,
    ).toBe('https://cms.example.hr')
  })

  it('na Vercel previewu prihvaća branch, deployment i produkcijski URL', () => {
    expect(
      resolveAdminOrigins({
        NODE_ENV: 'production',
        VERCEL_BRANCH_URL: 'cms-git-fix-team.vercel.app',
        VERCEL_URL: 'cms-abc123-team.vercel.app',
        VERCEL_PROJECT_PRODUCTION_URL: 'cms.example.hr',
      }),
    ).toEqual({
      serverURL: 'https://cms-git-fix-team.vercel.app',
      csrf: [
        'https://cms-git-fix-team.vercel.app',
        'https://cms-abc123-team.vercel.app',
        'https://cms.example.hr',
      ],
    })
  })

  it('PAYLOAD_SERVER_URL ima prednost, a duplikati se izbacuju', () => {
    expect(
      resolveAdminOrigins({
        NODE_ENV: 'production',
        PAYLOAD_SERVER_URL: 'https://cms.example.hr',
        VERCEL_URL: 'cms-abc123-team.vercel.app',
        VERCEL_PROJECT_PRODUCTION_URL: 'cms.example.hr',
      }),
    ).toEqual({
      serverURL: 'https://cms.example.hr',
      csrf: ['https://cms.example.hr', 'https://cms-abc123-team.vercel.app'],
    })
  })

  it('u developmentu bez varijabli koristi lokalni CMS', () => {
    expect(resolveAdminOrigins({ NODE_ENV: 'development' })).toEqual(DEV)
    expect(resolveAdminOrigins({})).toEqual(DEV)
  })

  it('next build ne pada ni bez varijabli ni s neispravnom vrijednošću', () => {
    const build = { NODE_ENV: 'production', NEXT_PHASE: 'phase-production-build' }

    expect(resolveAdminOrigins(build)).toEqual(DEV)
    expect(
      resolveAdminOrigins({ ...build, PAYLOAD_SERVER_URL: 'http://cms.example.hr' }),
    ).toEqual(DEV)
  })

  it('produkcijski runtime bez ijednog origina baca grešku', () => {
    expect(() => resolveAdminOrigins({ NODE_ENV: 'production' })).toThrow(
      /PAYLOAD_SERVER_URL/,
    )
  })

  it('u produkciji odbija http origin', () => {
    expect(() =>
      resolveAdminOrigins({
        PAYLOAD_SERVER_URL: 'http://cms.example.hr',
        NODE_ENV: 'production',
      }),
    ).toThrow(/https/)
  })

  it('odbija vrijednost koja nije URL', () => {
    expect(() =>
      resolveAdminOrigins({ PAYLOAD_SERVER_URL: 'cms.example.hr' }),
    ).toThrow(/PAYLOAD_SERVER_URL/)
  })
})

describe('isProduction', () => {
  it('prati NODE_ENV', () => {
    expect(isProduction({ NODE_ENV: 'production' })).toBe(true)
    expect(isProduction({ NODE_ENV: 'development' })).toBe(false)
    expect(isProduction({})).toBe(false)
  })
})
