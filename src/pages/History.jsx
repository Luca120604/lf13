import React from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage.js'

function fmt(ts) {
  const d = new Date(ts)
  return d.toLocaleString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function History({ go }) {
  const [history, setHistory] = useLocalStorage('roland.checks', [])

  function remove(id) {
    setHistory(history.filter((h) => h.id !== id))
  }

  function clearAll() {
    if (!confirm('Alle Checks löschen?')) return
    setHistory([])
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-forest-900">Vitalcheck Verlauf</h2>
        {history.length > 0 && (
          <button className="text-sm text-forest-700 underline" onClick={clearAll}>Alle löschen</button>
        )}
      </div>

      {history.length === 0 && (
        <div className="card text-sm text-forest-700">
          Noch keine Checks. Starte einen <button className="underline" onClick={() => go('vital-pre')}>vor</button> oder <button className="underline" onClick={() => go('vital-post')}>nach</button> der Fahrt.
        </div>
      )}

      {history.map((h) => (
        <div key={h.id} className="card">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-forest-600">{fmt(h.at)}</div>
              <div className="font-bold text-forest-900">
                {h.mode === 'pre' ? 'Vor der Fahrt' : 'Nach der Fahrt'}
              </div>
            </div>
            <button aria-label="Löschen" className="text-forest-600 px-2" onClick={() => remove(h.id)}>✕</button>
          </div>
          <div className="mt-2 grid grid-cols-5 gap-1">
            {Object.entries(h.answers).map(([k, v]) => (
              <div key={k} className="bg-forest-100 rounded-lg text-center py-1">
                <div className="text-[10px] text-forest-700 uppercase">{k}</div>
                <div className="font-bold text-forest-900">{v}★</div>
              </div>
            ))}
          </div>
          {h.note && <p className="mt-2 text-sm text-forest-800">{h.note}</p>}
          {h.images?.length > 0 && (
            <div className="mt-2 grid grid-cols-3 gap-2">
              {h.images.map((src, i) => (
                <img key={i} src={src} alt="" className="w-full h-20 object-cover rounded-lg" />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
