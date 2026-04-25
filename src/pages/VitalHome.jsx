import React from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage.js'

export default function VitalHome({ go }) {
  const [history] = useLocalStorage('roland.checks', [])
  const last = history[0]

  return (
    <div className="space-y-4 pb-4">
      <div>
        <h2 className="text-xl font-bold text-forest-900">Vitalcheck</h2>
        <p className="text-sm text-forest-600 mt-1">
          5 Sterne-Fragen + Stimmung. Vor oder nach der Fahrt — keine Diagnose, nur Orientierung.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <button
          className="card text-left active:scale-[.99] transition"
          onClick={() => go('vital-pre')}
        >
          <div className="flex items-center gap-4">
            <div className="text-4xl">🚴</div>
            <div className="flex-1">
              <div className="font-bold text-forest-900">Vor der Fahrt</div>
              <div className="text-sm text-forest-600 mt-0.5">
                Fitness, Schlaf, Stimmung — kriegst Tempo-Empfehlung zurück
              </div>
            </div>
            <div className="text-forest-400">→</div>
          </div>
        </button>

        <button
          className="card text-left active:scale-[.99] transition"
          onClick={() => go('vital-post')}
        >
          <div className="flex items-center gap-4">
            <div className="text-4xl">🌿</div>
            <div className="flex-1">
              <div className="font-bold text-forest-900">Nach der Fahrt</div>
              <div className="text-sm text-forest-600 mt-0.5">
                Erschöpfung, Kreislauf, Puls — Hinweise zur Erholung
              </div>
            </div>
            <div className="text-forest-400">→</div>
          </div>
        </button>
      </div>

      <button
        className="card w-full text-left active:scale-[.99] transition"
        onClick={() => go('history')}
      >
        <div className="flex items-center gap-4">
          <div className="text-3xl">📜</div>
          <div className="flex-1">
            <div className="font-bold text-forest-900">Verlauf</div>
            <div className="text-sm text-forest-600 mt-0.5">
              {history.length === 0
                ? 'Noch keine Checks'
                : `${history.length} Eintrag${history.length === 1 ? '' : 'e'}`}
              {last && (
                <> · zuletzt {new Date(last.at).toLocaleDateString('de-DE')}</>
              )}
            </div>
          </div>
          <div className="text-forest-400">→</div>
        </div>
      </button>

      <p className="text-xs text-forest-600 leading-relaxed">
        Nichts davon ersetzt eine ärztliche Einschätzung. Bei Sorgen oder anhaltenden Beschwerden Hausarzt fragen.
      </p>
    </div>
  )
}
