import React from 'react'
import { SEED_ROUTES } from '../data/routes.js'
import { useLocalStorage } from '../hooks/useLocalStorage.js'
import RouteCard from '../components/RouteCard.jsx'

export default function RouteList({ go }) {
  const [userRoutes] = useLocalStorage('roland.routes', [])
  const all = [...userRoutes, ...SEED_ROUTES]

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-bold text-forest-900">Alle Routen</h2>
      <div className="space-y-2">
        {all.map((r) => (
          <RouteCard key={r.id} route={r} onOpen={(route) => go('detail', route.id)} />
        ))}
      </div>
    </div>
  )
}
