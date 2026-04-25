import React, { useState } from 'react'
import Home from './pages/Home.jsx'
import RouteFinder from './pages/RouteFinder.jsx'
import RouteUpload from './pages/RouteUpload.jsx'
import RouteList from './pages/RouteList.jsx'
import RouteDetail from './pages/RouteDetail.jsx'
import VitalCheck from './pages/VitalCheck.jsx'
import History from './pages/History.jsx'

export default function App() {
  const [view, setView] = useState('home')
  const [param, setParam] = useState(null)

  function go(next, p = null) {
    setView(next)
    setParam(p)
    window.scrollTo(0, 0)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-20 bg-stone-warm/90 backdrop-blur border-b border-forest-100">
        <div className="max-w-xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => go('home')}
            className="flex items-center gap-2 active:scale-95 transition"
            aria-label="Startseite"
          >
            <img
              src="/web-app-manifest-192x192.png"
              alt=""
              className="w-9 h-9 rounded-lg object-cover bg-black"
              onError={(e) => { e.currentTarget.style.display = 'none' }}
            />
            <span className="font-extrabold text-forest-900 tracking-tight">Roland Radar</span>
          </button>
          <div className="ml-auto flex gap-1">
            {view !== 'home' && (
              <button className="text-sm text-forest-700 px-2 py-1" onClick={() => go('home')}>
                ← Start
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-xl w-full mx-auto px-4 py-5">
        {view === 'home' && <Home go={go} />}
        {view === 'find' && <RouteFinder go={go} />}
        {view === 'upload' && <RouteUpload go={go} />}
        {view === 'list' && <RouteList go={go} />}
        {view === 'detail' && <RouteDetail routeId={param} go={go} />}
        {view === 'vital-pre' && <VitalCheck mode="pre" go={go} />}
        {view === 'vital-post' && <VitalCheck mode="post" go={go} />}
        {view === 'history' && <History go={go} />}
      </main>

      <footer className="py-6 text-center text-xs text-forest-600">
        Roland Radar · Schwarzwald / Kinzigtal · MVP
      </footer>
    </div>
  )
}
