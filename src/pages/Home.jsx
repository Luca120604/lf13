import React from 'react'
import WeatherCard from '../components/WeatherCard.jsx'
import GoodWeatherBanner from '../components/GoodWeatherBanner.jsx'
import NotificationOptIn from '../components/NotificationOptIn.jsx'

export default function Home({ go }) {
  return (
    <div className="space-y-4 pb-4">
      <div className="pt-1">
        <h1 className="text-2xl font-extrabold text-forest-900 leading-tight">Hey Roland 🚴</h1>
        <p className="text-forest-600 text-sm mt-0.5">Schwarzwald · Kinzigtal</p>
      </div>

      <GoodWeatherBanner onStart={() => go('find')} />
      <WeatherCard />
      <NotificationOptIn />

      <div className="grid grid-cols-2 gap-3">
        <button
          className="card text-left p-4 active:scale-[.98] transition"
          onClick={() => go('find')}
        >
          <div className="text-3xl mb-2">🚴</div>
          <div className="font-bold text-forest-900 text-sm">Route finden</div>
          <div className="text-xs text-forest-600 mt-0.5">Filter & los</div>
        </button>
        <button
          className="card text-left p-4 active:scale-[.98] transition"
          onClick={() => go('vital-pre')}
        >
          <div className="text-3xl mb-2">❤️</div>
          <div className="font-bold text-forest-900 text-sm">Vor der Fahrt</div>
          <div className="text-xs text-forest-600 mt-0.5">5-Fragen-Check</div>
        </button>
        <button
          className="card text-left p-4 active:scale-[.98] transition"
          onClick={() => go('body')}
        >
          <div className="text-3xl mb-2">🧬</div>
          <div className="font-bold text-forest-900 text-sm">Mein Körper</div>
          <div className="text-xs text-forest-600 mt-0.5">Was fehlt mir?</div>
        </button>
        <button
          className="card text-left p-4 active:scale-[.98] transition"
          onClick={() => go('upload')}
        >
          <div className="text-3xl mb-2">➕</div>
          <div className="font-bold text-forest-900 text-sm">Route hochladen</div>
          <div className="text-xs text-forest-600 mt-0.5">Eigene Tour</div>
        </button>
      </div>
    </div>
  )
}
