import React from 'react'

export default function Home({ go }) {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-3xl font-extrabold text-forest-900 leading-tight">Roland Radar</h1>
        <p className="text-forest-700 mt-1">Schwarzwald · Kinzigtal · Rad & Vital</p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <button className="btn-primary text-lg py-5" onClick={() => go('find')}>
          🚴 Route finden
        </button>
        <button className="btn-secondary text-lg py-5" onClick={() => go('upload')}>
          ➕ Eigene Route hochladen
        </button>
      </div>

      <div className="card">
        <div className="font-bold text-forest-900 mb-2">Vitalcheck</div>
        <p className="text-sm text-forest-700 mb-3">
          Kurzer Check vor oder nach der Fahrt. 5 Fragen, jeweils ⭐ 1–5.
          Keine Diagnose — nur Orientierung.
        </p>
        <div className="grid grid-cols-2 gap-2">
          <button className="btn-secondary" onClick={() => go('vital-pre')}>
            Vor der Fahrt
          </button>
          <button className="btn-secondary" onClick={() => go('vital-post')}>
            Nach der Fahrt
          </button>
        </div>
      </div>

      <div className="card">
        <div className="font-bold text-forest-900 mb-1">Historie</div>
        <p className="text-sm text-forest-600 mb-3">Deine letzten Checks & eigenen Routen.</p>
        <div className="grid grid-cols-2 gap-2">
          <button className="btn-ghost" onClick={() => go('history')}>Checks</button>
          <button className="btn-ghost" onClick={() => go('list')}>Routen</button>
        </div>
      </div>
    </div>
  )
}
