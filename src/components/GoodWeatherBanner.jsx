import React, { useEffect, useState } from 'react'
import { useGeolocation } from '../hooks/useGeolocation.js'
import { useWeather, bestRideWindow } from '../hooks/useWeather.js'
import { useNotifications } from '../hooks/useNotifications.js'

const REMINDER_COOLDOWN = 6 * 60 * 60 * 1000 // 6 h

function isGoodWeather(current) {
  if (!current) return false
  const t = current.temperature_2m
  const wind = current.wind_speed_10m
  const code = current.weather_code
  if (t == null) return false
  if (t < 10 || t > 28) return false
  if (wind > 30) return false
  if (code >= 51) return false // ab Niesel/Regen/Schauer/Gewitter
  return true
}

export default function GoodWeatherBanner({ onStart }) {
  const { coords } = useGeolocation()
  const { data: weather } = useWeather(coords)
  const { enabled, notify, getLastReminder, markReminderShown } = useNotifications()
  const [dismissedAt, setDismissedAt] = useState(0)

  const good = isGoodWeather(weather?.current)
  const window = good ? bestRideWindow(weather) : null

  // Lokale Notification feuern (nur wenn opt-in & Cooldown abgelaufen)
  useEffect(() => {
    if (!good || !enabled) return
    const last = getLastReminder()
    if (Date.now() - last < REMINDER_COOLDOWN) return
    notify('Roland Radar', {
      body: window
        ? `Wetter passt heute. Gute Zeit: ${window.from}–${window.to}.`
        : 'Wetter passt heute zum Radfahren.',
      tag: 'roland-good-weather',
      silent: false,
    }).then((ok) => { if (ok) markReminderShown() })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [good, enabled])

  if (!good) return null
  if (Date.now() - dismissedAt < 24 * 60 * 60 * 1000) return null

  const t = Math.round(weather.current.temperature_2m)

  return (
    <div className="rounded-2xl bg-emerald-100 border border-emerald-300 p-4 relative">
      <button
        aria-label="Banner ausblenden"
        className="absolute top-2 right-2 text-emerald-800/70 px-2"
        onClick={() => setDismissedAt(Date.now())}
      >
        ✕
      </button>
      <div className="text-emerald-900 font-bold">🚴 Heute passt das Wetter</div>
      <div className="text-sm text-emerald-900/90 mt-1">
        {t}° und trocken
        {window && <> · Beste Zeit: <strong>{window.from}–{window.to}</strong></>}
      </div>
      <button className="btn-primary mt-3 w-full" onClick={onStart}>
        Route raussuchen
      </button>
    </div>
  )
}
