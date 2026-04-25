import React, { useState } from 'react'
import { SYMPTOM_GROUPS, analyzeSymptoms } from '../data/symptoms.js'
import { useLocalStorage } from '../hooks/useLocalStorage.js'

export default function BodyCheck({ go }) {
  const [selected, setSelected] = useState(new Set())
  const [done, setDone] = useState(false)
  const [history, setHistory] = useLocalStorage('roland.body', [])

  function toggle(id) {
    setSelected((s) => {
      const n = new Set(s)
      if (n.has(id)) n.delete(id)
      else n.add(id)
      return n
    })
  }

  function finish() {
    const ids = Array.from(selected)
    const result = analyzeSymptoms(ids).slice(0, 4)
    const entry = {
      id: `body-${Date.now()}`,
      at: Date.now(),
      symptoms: ids,
      top: result.map((r) => ({ tag: r.tag, label: r.label, count: r.count })),
    }
    setHistory([entry, ...history])
    setDone(true)
  }

  function reset() {
    setSelected(new Set())
    setDone(false)
  }

  if (done) {
    const ids = Array.from(selected)
    const result = analyzeSymptoms(ids)
    const top = result.slice(0, 4)

    return (
      <div className="space-y-4 pb-4">
        <div>
          <h2 className="text-xl font-bold text-forest-900">Mögliche Gründe</h2>
          <p className="text-sm text-forest-600 mt-1">
            {ids.length} Symptom{ids.length === 1 ? '' : 'e'} ausgewählt. Keine Diagnose — nur Orientierung.
          </p>
        </div>

        {top.length === 0 && (
          <div className="card text-sm text-forest-700">
            Wähl mindestens ein Symptom aus, dann analysiere ich.
          </div>
        )}

        {top.map((d, i) => (
          <div key={d.tag} className="card">
            <div className="flex items-start gap-3">
              <div className="text-3xl leading-none">{d.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <div className="font-bold text-forest-900">{d.label}</div>
                  {i === 0 && (
                    <span className="text-[10px] uppercase font-semibold tracking-wider bg-forest-700 text-white px-2 py-0.5 rounded-full">
                      Top-Treffer
                    </span>
                  )}
                  <span className="ml-auto text-xs text-forest-600">{d.count}× passend</span>
                </div>
                <p className="text-sm text-forest-800 mt-1">{d.desc}</p>
                {d.foods && d.foods !== '—' && (
                  <div className="mt-2 bg-forest-100 rounded-xl p-3">
                    <div className="text-[11px] uppercase tracking-wide text-forest-700 font-semibold">Wo's drin steckt</div>
                    <p className="text-sm text-forest-900 mt-0.5">{d.foods}</p>
                  </div>
                )}
                {d.when && (
                  <div className="mt-2 bg-amber-50 rounded-xl p-3 border border-amber-100">
                    <div className="text-[11px] uppercase tracking-wide text-amber-800 font-semibold">Wann zum Arzt</div>
                    <p className="text-sm text-amber-900 mt-0.5">{d.when}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        <p className="text-xs text-forest-600 leading-relaxed">
          Diese Hinweise basieren rein auf den von dir angetippten Symptomen.
          Ähnliche Beschwerden können viele Ursachen haben — bei Sorgen oder
          anhaltenden Symptomen bitte einen Arzt fragen.
        </p>

        <div className="grid grid-cols-2 gap-2">
          <button className="btn-ghost" onClick={reset}>Nochmal</button>
          <button className="btn-primary" onClick={() => go('home')}>Fertig</button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 pb-4">
      <div>
        <h2 className="text-xl font-bold text-forest-900">Mein Körper</h2>
        <p className="text-sm text-forest-600 mt-1">
          Tippe an, was bei dir gerade passt. Ich zeig dir mögliche Mängel — keine Diagnose.
        </p>
      </div>

      {SYMPTOM_GROUPS.map((g) => (
        <div key={g.id} className="card">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xl">{g.icon}</span>
            <div className="font-bold text-forest-900">{g.label}</div>
          </div>
          <div className="flex flex-wrap gap-2">
            {g.symptoms.map((s) => {
              const active = selected.has(s.id)
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => toggle(s.id)}
                  className={`px-3 py-2 rounded-2xl text-sm font-medium border transition active:scale-95 ${
                    active
                      ? 'bg-forest-700 text-stone-warm border-forest-700'
                      : 'bg-white text-forest-800 border-forest-200'
                  }`}
                >
                  {active ? '✓ ' : ''}{s.label}
                </button>
              )
            })}
          </div>
        </div>
      ))}

      <div className="sticky bottom-[78px] bg-stone-warm/0 pt-2">
        <button
          type="button"
          className="btn-primary w-full disabled:opacity-50"
          disabled={selected.size === 0}
          onClick={finish}
        >
          {selected.size === 0
            ? 'Wähle mindestens 1 Symptom'
            : `Analysieren (${selected.size})`}
        </button>
      </div>
    </div>
  )
}
