import { useEffect, useState } from 'react'

// Open-Meteo: keine Auth, kein API-Key, CORS offen.
// https://open-meteo.com/en/docs

const CACHE_PREFIX = 'roland.weather:'
const TTL_MS = 15 * 60 * 1000 // 15 min

function readCache(key) {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key)
    if (!raw) return null
    const obj = JSON.parse(raw)
    if (!obj || Date.now() - obj.at > TTL_MS) return null
    return obj.data
  } catch {
    return null
  }
}

function writeCache(key, data) {
  try {
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify({ at: Date.now(), data }))
  } catch {}
}

export function useWeather(coords) {
  const [data, setData] = useState(null)
  const [status, setStatus] = useState('idle') // idle | loading | ready | error
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!coords) return
    const key = `${coords.lat.toFixed(2)},${coords.lon.toFixed(2)}`
    const cached = readCache(key)
    if (cached) {
      setData(cached)
      setStatus('ready')
      return
    }

    const ctrl = new AbortController()
    setStatus('loading')

    const url =
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${coords.lat}&longitude=${coords.lon}` +
      `&current=temperature_2m,weather_code,wind_speed_10m,relative_humidity_2m,apparent_temperature,is_day` +
      `&hourly=temperature_2m,precipitation_probability,wind_speed_10m,weather_code` +
      `&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset` +
      `&forecast_days=1&timezone=auto&wind_speed_unit=kmh`

    fetch(url, { signal: ctrl.signal })
      .then((r) => {
        if (!r.ok) throw new Error('HTTP ' + r.status)
        return r.json()
      })
      .then((json) => {
        setData(json)
        setStatus('ready')
        writeCache(key, json)
      })
      .catch((err) => {
        if (err.name === 'AbortError') return
        setStatus('error')
        setError(err.message || 'Wetter konnte nicht geladen werden.')
      })

    return () => ctrl.abort()
  }, [coords?.lat, coords?.lon])

  return { data, status, error }
}

// WMO weather code → emoji + label (vereinfacht)
// https://open-meteo.com/en/docs (WMO Weather interpretation codes)
export function weatherIcon(code, isDay = 1) {
  if (code == null) return { icon: '·', label: '–' }
  if (code === 0) return { icon: isDay ? '☀️' : '🌙', label: 'klar' }
  if (code <= 2) return { icon: isDay ? '🌤️' : '🌙', label: 'leicht bewölkt' }
  if (code === 3) return { icon: '☁️', label: 'bewölkt' }
  if (code >= 45 && code <= 48) return { icon: '🌫️', label: 'Nebel' }
  if (code >= 51 && code <= 57) return { icon: '🌦️', label: 'Nieselregen' }
  if (code >= 61 && code <= 67) return { icon: '🌧️', label: 'Regen' }
  if (code >= 71 && code <= 77) return { icon: '🌨️', label: 'Schnee' }
  if (code >= 80 && code <= 82) return { icon: '🌧️', label: 'Schauer' }
  if (code >= 85 && code <= 86) return { icon: '🌨️', label: 'Schneeschauer' }
  if (code >= 95) return { icon: '⛈️', label: 'Gewitter' }
  return { icon: '·', label: '–' }
}

// Beste 3-Stunden-Fenster heute fürs Radfahren finden.
// Score: niedriger = besser. Penalisiert Hitze, Kälte, Regenwahrscheinlichkeit, Wind.
export function bestRideWindow(weather) {
  if (!weather?.hourly) return null
  const { time, temperature_2m, precipitation_probability, wind_speed_10m, weather_code } = weather.hourly
  const now = new Date()
  const todayStr = now.toISOString().slice(0, 10)

  const hours = time
    .map((t, i) => ({
      t: new Date(t),
      temp: temperature_2m[i],
      pop: precipitation_probability[i] ?? 0,
      wind: wind_speed_10m[i],
      code: weather_code[i],
    }))
    .filter((h) => h.t.toISOString().slice(0, 10) === todayStr && h.t >= now)

  if (hours.length < 2) return null

  const score = (h) => {
    let s = 0
    if (h.temp > 28) s += (h.temp - 28) * 2
    if (h.temp < 8) s += (8 - h.temp) * 2
    s += h.pop * 0.6
    if (h.wind > 25) s += (h.wind - 25) * 1.5
    if (h.code >= 61) s += 30
    if (h.code >= 95) s += 50
    return s
  }

  let bestStart = 0
  let bestScore = Infinity
  for (let i = 0; i + 2 < hours.length; i++) {
    const s = score(hours[i]) + score(hours[i + 1]) + score(hours[i + 2])
    if (s < bestScore) {
      bestScore = s
      bestStart = i
    }
  }

  const fmt = (d) => d.getHours().toString().padStart(2, '0') + ':00'
  return {
    from: fmt(hours[bestStart].t),
    to: fmt(new Date(hours[bestStart].t.getTime() + 3 * 60 * 60 * 1000)),
    avgTemp: Math.round(
      (hours[bestStart].temp + hours[bestStart + 1].temp + hours[bestStart + 2].temp) / 3,
    ),
    avgPop: Math.round(
      (hours[bestStart].pop + hours[bestStart + 1].pop + hours[bestStart + 2].pop) / 3,
    ),
  }
}
