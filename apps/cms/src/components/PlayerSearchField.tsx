'use client'

import { FieldLabel, useField, useForm } from '@payloadcms/ui'
import { useEffect, useId, useRef, useState } from 'react'

interface HnsResult {
  personId: number
  name: string
  shortName: string | null
  position: string | null
  shirtNumber: number | null
}

interface ApiError {
  error: string
}

const SEARCH_DEBOUNCE_MS = 300
const MIN_KEYWORD_LENGTH = 2

export function PlayerSearchField() {
  const { value, setValue } = useField<number | null>()
  const { dispatchFields } = useForm()

  const [keyword, setKeyword] = useState('')
  const [results, setResults] = useState<HnsResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputId = useId()

  useEffect(() => {
    if (keyword.trim().length < MIN_KEYWORD_LENGTH) {
      setResults([])
      setError(null)
      return
    }

    let cancelled = false
    const timer = setTimeout(async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch(
          `/api/hns-players/search?keyword=${encodeURIComponent(keyword.trim())}`,
          { credentials: 'include' },
        )
        const data = (await res.json()) as HnsResult[] | ApiError
        if (cancelled) return
        if (!res.ok || !Array.isArray(data)) {
          const message = !Array.isArray(data) && data.error
            ? data.error
            : `Greška ${res.status}`
          setError(message)
          setResults([])
        } else {
          setResults(data)
        }
      } catch (err) {
        if (cancelled) return
        setError(err instanceof Error ? err.message : 'Greška pri pretrazi')
        setResults([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }, SEARCH_DEBOUNCE_MS)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [keyword])

  useEffect(() => {
    function onClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  const handleSelect = (player: HnsResult) => {
    setValue(player.personId)
    dispatchFields({
      type: 'UPDATE',
      path: 'displayName',
      value: player.name,
    })
    setKeyword('')
    setResults([])
    setOpen(false)
  }

  const handleClear = () => {
    setValue(null)
    setKeyword('')
    setResults([])
  }

  return (
    <div className="field-type" ref={containerRef}>
      <FieldLabel htmlFor={inputId} label="Igrač (HNS pretraga)" required />
      <div style={{ position: 'relative' }}>
        <input
          id={inputId}
          type="text"
          value={keyword}
          onChange={(event) => {
            setKeyword(event.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          placeholder="Tipkaj ime igrača (min 2 znaka)..."
          autoComplete="off"
          style={{
            width: '100%',
            padding: '0.5rem 0.75rem',
            borderRadius: 4,
            border: '1px solid var(--theme-elevation-150)',
            background: 'var(--theme-input-bg)',
            color: 'var(--theme-text)',
          }}
        />
        {open && (loading || results.length > 0 || error) && (
          <ul
            style={{
              position: 'absolute',
              zIndex: 10,
              top: 'calc(100% + 4px)',
              left: 0,
              right: 0,
              listStyle: 'none',
              margin: 0,
              padding: 0,
              maxHeight: 280,
              overflowY: 'auto',
              background: 'var(--theme-input-bg)',
              border: '1px solid var(--theme-elevation-150)',
              borderRadius: 4,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            }}
          >
            {loading && (
              <li style={{ padding: '0.5rem 0.75rem', opacity: 0.7 }}>
                Pretražujem...
              </li>
            )}
            {error && (
              <li
                style={{
                  padding: '0.5rem 0.75rem',
                  color: 'var(--theme-error-500)',
                }}
              >
                {error}
              </li>
            )}
            {!loading &&
              !error &&
              results.length === 0 &&
              keyword.trim().length >= MIN_KEYWORD_LENGTH && (
                <li style={{ padding: '0.5rem 0.75rem', opacity: 0.7 }}>
                  Nema rezultata.
                </li>
              )}
            {!loading &&
              results.map((player) => (
                <li key={player.personId}>
                  <button
                    type="button"
                    onClick={() => handleSelect(player)}
                    style={{
                      display: 'flex',
                      width: '100%',
                      textAlign: 'left',
                      padding: '0.5rem 0.75rem',
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--theme-text)',
                      cursor: 'pointer',
                      gap: '0.5rem',
                      alignItems: 'baseline',
                    }}
                    onMouseEnter={(event) => {
                      event.currentTarget.style.background =
                        'var(--theme-elevation-100)'
                    }}
                    onMouseLeave={(event) => {
                      event.currentTarget.style.background = 'transparent'
                    }}
                  >
                    <strong>{player.name}</strong>
                    {player.position && (
                      <span style={{ fontSize: 12, opacity: 0.7 }}>
                        {player.position}
                      </span>
                    )}
                    {player.shirtNumber != null && (
                      <span style={{ fontSize: 12, opacity: 0.7 }}>
                        #{player.shirtNumber}
                      </span>
                    )}
                    <span
                      style={{
                        marginLeft: 'auto',
                        fontSize: 11,
                        opacity: 0.5,
                      }}
                    >
                      ID: {player.personId}
                    </span>
                  </button>
                </li>
              ))}
          </ul>
        )}
      </div>

      {value != null && (
        <div
          style={{
            marginTop: 8,
            padding: '0.5rem 0.75rem',
            background: 'var(--theme-elevation-50)',
            borderRadius: 4,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 13,
          }}
        >
          <span>
            Odabran personId: <strong>{value}</strong>
          </span>
          <button
            type="button"
            onClick={handleClear}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--theme-error-500)',
              cursor: 'pointer',
              fontSize: 13,
              padding: 0,
            }}
          >
            Ukloni
          </button>
        </div>
      )}
    </div>
  )
}
