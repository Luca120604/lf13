import React from 'react'
import { SEED_ROUTES } from '../data/routes.js'
import { useLocalStorage } from '../hooks/useLocalStorage.js'
import DeepLinkButtons from '../components/DeepLinkButtons.jsx'
import MapView from '../components/MapView.jsx'

export default function RouteDetail({ routeId, go }) {
  const [userRoutes, setUserRoutes] = useLocalStorage('roland.routes', [])
  const all = [...userRoutes, ...SEED_ROUTES]
  const route = all.find((r) => r.id === routeId)

  if (!route) {
    return (
      <div className="card">
        <p className="text-forest-800">Route nicht gefunden.</p>
        <button className="btn-ghost mt-2" onClick={() => go('list')}>Zur Liste</button>
      </div>
    )
  }

  const isUserRoute = userRoutes.some((r) => r.id === routeId)

  function remove() {
    if (!confirm('Route wirklich löschen?')) return
    setUserRoutes(userRoutes.filter((r) => r.id !== routeId))
    go('list')
  }

  const query = route.loop ? route.start : `${route.start} nach ${route.end}`

  return (
    <div className="space-y-4">
      <div>
        <div className="text-sm text-forest-600">{route.region}</div>
        <h2 className="text-2xl font-extrabold text-forest-900 leading-tight">{route.name}</h2>
        <div className="text-forest-700 mt-1">
          {route.start}
          {!route.loop && route.end ? ` → ${route.end}` : route.loop ? ' · Rundtour' : ''}
        </div>
      </div>

      {route.startCoords && (
        <MapView start={route.startCoords} end={route.endCoords} />
      )}

      {route.images?.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {route.images.map((src, i) => (
            <img key={i} src={src} alt="" className="w-full h-40 object-cover rounded-2xl" />
          ))}
        </div>
      )}

      <div className="card">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <div className="text-xs text-forest-600">Länge</div>
            <div className="font-bold text-forest-900">{route.lengthKm} km</div>
          </div>
          <div>
            <div className="text-xs text-forest-600">Dauer</div>
            <div className="font-bold text-forest-900">{route.durationMin} min</div>
          </div>
          <div>
            <div className="text-xs text-forest-600">Höhenmeter</div>
            <div className="font-bold text-forest-900">{route.elevationM} hm</div>
          </div>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <span className="pill capitalize">{route.difficulty}</span>
          <span className="pill capitalize">{route.vibe}</span>
          {route.ebike && <span className="pill">E-Bike</span>}
          <span className="pill">{route.loop ? 'Rundtour' : 'A→B'}</span>
        </div>
      </div>

      {route.description && (
        <div className="card">
          <div className="font-bold text-forest-900 mb-1">Beschreibung</div>
          <p className="text-sm text-forest-800 whitespace-pre-wrap">{route.description}</p>
        </div>
      )}

      <div className="card">
        <div className="font-bold text-forest-900 mb-2">Navigation öffnen</div>
        <DeepLinkButtons links={route.links} query={query} />
      </div>

      <div className="card">
        <div className="font-bold text-forest-900 mb-2">Vor der Tour Vitalcheck?</div>
        <div className="grid grid-cols-2 gap-2">
          <button className="btn-secondary" onClick={() => go('vital-pre')}>Vor der Fahrt</button>
          <button className="btn-secondary" onClick={() => go('vital-post')}>Nach der Fahrt</button>
        </div>
      </div>

      {isUserRoute && (
        <button className="btn-ghost w-full text-red-700" onClick={remove}>
          Route löschen
        </button>
      )}
    </div>
  )
}
