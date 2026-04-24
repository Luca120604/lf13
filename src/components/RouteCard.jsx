import React from 'react'

export default function RouteCard({ route, onOpen }) {
  return (
    <button
      type="button"
      onClick={() => onOpen?.(route)}
      className="card text-left w-full active:scale-[.99] transition"
    >
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-xl bg-forest-100 text-forest-800 flex items-center justify-center text-xl font-bold shrink-0">
          {route.loop ? '↻' : '→'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-forest-900 truncate">{route.name}</div>
          <div className="text-sm text-forest-600 truncate">
            {route.start}
            {!route.loop && route.end ? ` → ${route.end}` : ''} · {route.region}
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <span className="pill">{route.lengthKm} km</span>
            <span className="pill">{route.durationMin} min</span>
            <span className="pill">{route.elevationM} hm</span>
            <span className="pill capitalize">{route.difficulty}</span>
            <span className="pill capitalize">{route.vibe}</span>
            {route.ebike && <span className="pill">E-Bike</span>}
          </div>
        </div>
      </div>
    </button>
  )
}
