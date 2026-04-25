import React from 'react'
import { useGeolocation } from '../hooks/useGeolocation.js'
import { useWeather, weatherIcon, bestRideWindow } from '../hooks/useWeather.js'

export default function WeatherCard() {
  const { coords, status: geoStatus, error: geoError, request, clear } = useGeolocation()
  const { data, status: wxStatus } = useWeather(coords)

  if (geoStatus === 'idle' || geoStatus === 'unsupported') {
    return (
      <div className="card">
        <div className="font-bold text-forest-900 mb-1">Wetter & Standort</div>
        <p className="text-sm text-forest-700 mb-3">
          {geoStatus === 'unsupported'
            ? 'Dein Browser unterstützt keine Standortabfrage.'
            : 'Standort freigeben, um Wetter und beste Fahrzeiten zu sehen.'}
        </p>
        {geoStatus === 'idle' && (
          <button className="btn-primary w-full" onClick={request}>
            📍 Standort verwenden
          </button>
        )}
      </div>
    )
  }

  if (geoStatus === 'loading' || wxStatus === 'loading') {
    return (
      <div className="card">
        <p className="text-sm text-forest-700">Lade Wetter…</p>
      </div>
    )
  }

  if (geoStatus === 'denied') {
    return (
      <div className="card">
        <div className="font-bold text-forest-900 mb-1">Standort blockiert</div>
        <p className="text-sm text-forest-700 mb-2">{geoError}</p>
        <p className="text-xs text-forest-600 mb-3">
          In den Browser-Einstellungen Standort für diese Seite erlauben.
        </p>
        <button className="btn-secondary w-full" onClick={request}>Erneut versuchen</button>
      </div>
    )
  }

  if (wxStatus === 'error' || !data) {
    return (
      <div className="card">
        <p className="text-sm text-forest-700">Wetter konnte nicht geladen werden.</p>
      </div>
    )
  }

  const c = data.current || {}
  const { icon, label } = weatherIcon(c.weather_code, c.is_day)
  const tMin = data.daily?.temperature_2m_min?.[0]
  const tMax = data.daily?.temperature_2m_max?.[0]
  const window = bestRideWindow(data)

  return (
    <div className="card">
      <div className="flex items-start gap-3">
        <div className="text-5xl leading-none">{icon}</div>
        <div className="flex-1 min-w-0">
          <div className="text-3xl font-extrabold text-forest-900 leading-none">
            {Math.round(c.temperature_2m)}°
          </div>
          <div className="text-sm text-forest-700 mt-1">
            {label}
            {c.apparent_temperature != null && (
              <> · gefühlt {Math.round(c.apparent_temperature)}°</>
            )}
          </div>
          <div className="text-xs text-forest-600 mt-1">
            {tMin != null && tMax != null && <>↓ {Math.round(tMin)}° / ↑ {Math.round(tMax)}° · </>}
            🌬 {Math.round(c.wind_speed_10m)} km/h
          </div>
        </div>
        <button
          aria-label="Standort zurücksetzen"
          className="text-forest-500 text-sm px-2"
          onClick={clear}
          title="Standort vergessen"
        >
          ✕
        </button>
      </div>

      {window && (
        <div className="mt-3 bg-forest-100 rounded-2xl p-3">
          <div className="text-xs text-forest-700 font-medium uppercase tracking-wide">
            Beste Zeit heute
          </div>
          <div className="text-forest-900 font-bold">
            {window.from} – {window.to}
          </div>
          <div className="text-xs text-forest-700 mt-0.5">
            ~{window.avgTemp}° · {window.avgPop}% Regenwahrscheinlichkeit
          </div>
        </div>
      )}
    </div>
  )
}
