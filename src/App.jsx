import React, { useState } from 'react'
import Home from './pages/Home.jsx'
import RouteFinder from './pages/RouteFinder.jsx'
import RouteUpload from './pages/RouteUpload.jsx'
import RouteList from './pages/RouteList.jsx'
import RouteDetail from './pages/RouteDetail.jsx'
import VitalHome from './pages/VitalHome.jsx'
import VitalCheck from './pages/VitalCheck.jsx'
import History from './pages/History.jsx'
import BodyCheck from './pages/BodyCheck.jsx'
import Camera from './pages/Camera.jsx'
import Tipps from './pages/Tipps.jsx'
import InteractiveMenu from './components/InteractiveMenu.jsx'

const BACK_LABELS = {
  detail: { to: 'find', label: 'Routen' },
  upload: { to: 'find', label: 'Routen' },
  list: { to: 'find', label: 'Routen' },
  'vital-pre': { to: 'vital', label: 'Vital' },
  'vital-post': { to: 'vital', label: 'Vital' },
  history: { to: 'vital', label: 'Vital' },
}

export default function App() {
  const [view, setView] = useState('home')
  const [param, setParam] = useState(null)

  function go(next, p = null) {
    setView(next)
    setParam(p)
    window.scrollTo(0, 0)
  }

  const back = BACK_LABELS[view]

  return (
    <div className="min-h-screen flex flex-col">
      <header
        className="sticky top-0 z-20 bg-stone-warm/95 backdrop-blur border-b border-forest-100"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <div className="max-w-xl mx-auto px-4 h-14 flex items-center gap-3">
          {back ? (
            <button
              onClick={() => go(back.to)}
              className="flex items-center gap-1 text-forest-700 active:scale-95 transition px-1 -ml-1"
              aria-label={`Zurück zu ${back.label}`}
            >
              <span className="text-lg leading-none">‹</span>
              <span className="text-sm font-medium">{back.label}</span>
            </button>
          ) : (
            <button
              onClick={() => go('home')}
              className="flex items-center gap-2 active:scale-95 transition"
              aria-label="Startseite"
            >
              <img
                src="/web-app-manifest-192x192.png"
                alt=""
                className="w-8 h-8 rounded-lg object-cover bg-black"
                onError={(e) => { e.currentTarget.style.display = 'none' }}
              />
              <span className="font-extrabold text-forest-900 tracking-tight">Roland Radar</span>
            </button>
          )}
        </div>
      </header>

      <main
        className="flex-1 max-w-xl w-full mx-auto px-4 pt-4"
        style={{ paddingBottom: 'calc(112px + env(safe-area-inset-bottom))' }}
      >
        {view === 'home' && <Home go={go} />}
        {view === 'find' && <RouteFinder go={go} />}
        {view === 'upload' && <RouteUpload go={go} />}
        {view === 'list' && <RouteList go={go} />}
        {view === 'detail' && <RouteDetail routeId={param} go={go} />}
        {view === 'vital' && <VitalHome go={go} />}
        {view === 'vital-pre' && <VitalCheck mode="pre" go={go} />}
        {view === 'vital-post' && <VitalCheck mode="post" go={go} />}
        {view === 'history' && <History go={go} />}
        {view === 'body' && <BodyCheck go={go} />}
        {view === 'camera' && <Camera go={go} />}
        {view === 'tipps' && <Tipps go={go} />}
      </main>

      <InteractiveMenu view={view} go={go} />
    </div>
  )
}
