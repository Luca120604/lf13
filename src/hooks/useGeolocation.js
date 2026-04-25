import { useEffect, useState } from 'react'

const STORAGE_KEY = 'roland.geo'
const TTL_MS = 30 * 60 * 1000 // 30 min Cache

function readCache() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const obj = JSON.parse(raw)
    if (!obj || Date.now() - obj.at > TTL_MS) return null
    return obj
  } catch {
    return null
  }
}

function writeCache(coords) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...coords, at: Date.now() }))
  } catch {}
}

export function useGeolocation({ auto = false } = {}) {
  const cached = readCache()
  const [coords, setCoords] = useState(cached)
  const [status, setStatus] = useState(cached ? 'ready' : 'idle')
  const [error, setError] = useState(null)

  function request() {
    if (!('geolocation' in navigator)) {
      setStatus('unsupported')
      setError('Standort wird vom Browser nicht unterstützt.')
      return
    }
    setStatus('loading')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const c = { lat: pos.coords.latitude, lon: pos.coords.longitude }
        setCoords(c)
        writeCache(c)
        setStatus('ready')
        setError(null)
      },
      (err) => {
        setStatus('denied')
        setError(err?.message || 'Standort konnte nicht ermittelt werden.')
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 5 * 60 * 1000 },
    )
  }

  useEffect(() => {
    if (auto && !cached) request()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auto])

  function clear() {
    localStorage.removeItem(STORAGE_KEY)
    setCoords(null)
    setStatus('idle')
  }

  return { coords, status, error, request, clear }
}
