import React, { useState, useMemo } from 'react'
import { SEED_ROUTES } from '../data/routes.js'
import { useLocalStorage } from '../hooks/useLocalStorage.js'
import RouteCard from '../components/RouteCard.jsx'

const DURATIONS = [
  { k: 'kurz', label: '< 1 h', max: 60 },
  { k: 'mittel', label: '1–2 h', min: 60, max: 120 },
  { k: 'lang', label: '2–4 h', min: 120, max: 240 },
  { k: 'ganztags', label: '> 4 h', min: 240 },
]
const DIFFS = ['leicht', 'mittel', 'schwer']
const VIBES = ['entspannt', 'Aussicht', 'sportlich']

export default function RouteFinder({ go }) {
  const [userRoutes] = useLocalStorage('roland.routes', [])
  const [start, setStart] = useState('')
  const [dur, setDur] = useState(null)
  const [diff, setDiff] = useState(null)
  const [vibe, setVibe] = useState(null)
  const [ebike, setEbike] = useState(null) // null | true | false
  const [loop, setLoop] = useState(null) // null | true | false

  const all = useMemo(() => [...SEED_ROUTES, ...userRoutes], [userRoutes])

  const results = useMemo(() => {
    return all.filter((r) => {
      if (start && !r.start?.toLowerCase().includes(start.toLowerCase())) return false
      if (dur) {
        const d = DURATIONS.find((x) => x.k === dur)
        if (d?.min && r.durationMin < d.min) return false
        if (d?.max && r.durationMin > d.max) return false
      }
      if (diff && r.difficulty !== diff) return false
      if (vibe && r.vibe !== vibe) return false
      if (ebike === true && !r.ebike) return false
      if (loop === true && !r.loop) return false
      if (loop === false && r.loop) return false
      return true
    })
  }, [all, start, dur, diff, vibe, ebike, loop])

  function Chip({ active, onClick, children }) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`px-3 py-2 rounded-full text-sm font-medium border transition ${
          active
            ? 'bg-forest-700 text-stone-warm border-forest-700'
            : 'bg-white text-forest-800 border-forest-200'
        }`}
      >
        {children}
      </button>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-forest-900">Route finden</h2>

      <div className="card space-y-4">
        <div>
          <label className="label">Startort</label>
          <input
            className="input"
            placeholder="z. B. Schenkenzell"
            value={start}
            onChange={(e) => setStart(e.target.value)}
          />
        </div>

        <div>
          <div className="label">Dauer</div>
          <div className="flex flex-wrap gap-2">
            {DURATIONS.map((d) => (
              <Chip key={d.k} active={dur === d.k} onClick={() => setDur(dur === d.k ? null : d.k)}>
                {d.label}
              </Chip>
            ))}
          </div>
        </div>

        <div>
          <div className="label">Schwierigkeit</div>
          <div className="flex flex-wrap gap-2">
            {DIFFS.map((d) => (
              <Chip key={d} active={diff === d} onClick={() => setDiff(diff === d ? null : d)}>
                {d}
              </Chip>
            ))}
          </div>
        </div>

        <div>
          <div className="label">Ziel</div>
          <div className="flex flex-wrap gap-2">
            {VIBES.map((v) => (
              <Chip key={v} active={vibe === v} onClick={() => setVibe(vibe === v ? null : v)}>
                {v}
              </Chip>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="label">Bike</div>
            <div className="flex gap-2">
              <Chip active={ebike === false} onClick={() => setEbike(ebike === false ? null : false)}>Normal</Chip>
              <Chip active={ebike === true} onClick={() => setEbike(ebike === true ? null : true)}>E-Bike</Chip>
            </div>
          </div>
          <div>
            <div className="label">Form</div>
            <div className="flex gap-2">
              <Chip active={loop === true} onClick={() => setLoop(loop === true ? null : true)}>Rundtour</Chip>
              <Chip active={loop === false} onClick={() => setLoop(loop === false ? null : false)}>A→B</Chip>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="text-sm text-forest-600 mb-2">{results.length} passende Route(n)</div>
        <div className="space-y-2">
          {results.map((r) => (
            <RouteCard key={r.id} route={r} onOpen={(route) => go('detail', route.id)} />
          ))}
          {results.length === 0 && (
            <div className="card text-sm text-forest-700">
              Keine Treffer. Filter lockern oder <button className="underline" onClick={() => go('upload')}>eigene Route hochladen</button>.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
