import React, { useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage.js'
import ImageUpload from '../components/ImageUpload.jsx'

const empty = {
  name: '',
  start: '',
  end: '',
  region: 'Kinzigtal',
  loop: true,
  lengthKm: '',
  durationMin: '',
  elevationM: '',
  difficulty: 'mittel',
  vibe: 'entspannt',
  ebike: false,
  description: '',
  images: [],
  links: { gmaps: '', komoot: '', outdooractive: '' },
}

export default function RouteUpload({ go }) {
  const [routes, setRoutes] = useLocalStorage('roland.routes', [])
  const [r, setR] = useState(empty)
  const [saved, setSaved] = useState(false)

  function update(k, v) { setR((s) => ({ ...s, [k]: v })) }
  function updateLink(k, v) { setR((s) => ({ ...s, links: { ...s.links, [k]: v } })) }

  function submit(e) {
    e.preventDefault()
    const route = {
      ...r,
      id: `user-${Date.now()}`,
      lengthKm: Number(r.lengthKm) || 0,
      durationMin: Number(r.durationMin) || 0,
      elevationM: Number(r.elevationM) || 0,
      createdAt: Date.now(),
    }
    setRoutes([route, ...routes])
    setSaved(true)
    setTimeout(() => go('detail', route.id), 600)
  }

  return (
    <form className="space-y-4" onSubmit={submit}>
      <h2 className="text-xl font-bold text-forest-900">Eigene Route hochladen</h2>

      <div className="card space-y-3">
        <div>
          <label className="label">Name</label>
          <input className="input" required value={r.name} onChange={(e) => update('name', e.target.value)} placeholder="z. B. Kinzig-Sonntagsrunde" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Start</label>
            <input className="input" value={r.start} onChange={(e) => update('start', e.target.value)} placeholder="Schenkenzell" />
          </div>
          <div>
            <label className="label">Ziel</label>
            <input className="input" value={r.end} onChange={(e) => update('end', e.target.value)} placeholder={r.loop ? '(Rundtour)' : 'Hausach'} />
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-forest-800">
          <input type="checkbox" checked={r.loop} onChange={(e) => update('loop', e.target.checked)} />
          Rundtour
        </label>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="label">km</label>
            <input className="input" inputMode="decimal" value={r.lengthKm} onChange={(e) => update('lengthKm', e.target.value)} />
          </div>
          <div>
            <label className="label">Dauer (min)</label>
            <input className="input" inputMode="numeric" value={r.durationMin} onChange={(e) => update('durationMin', e.target.value)} />
          </div>
          <div>
            <label className="label">Höhe (m)</label>
            <input className="input" inputMode="numeric" value={r.elevationM} onChange={(e) => update('elevationM', e.target.value)} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Schwierigkeit</label>
            <select className="input" value={r.difficulty} onChange={(e) => update('difficulty', e.target.value)}>
              <option value="leicht">leicht</option>
              <option value="mittel">mittel</option>
              <option value="schwer">schwer</option>
            </select>
          </div>
          <div>
            <label className="label">Ziel</label>
            <select className="input" value={r.vibe} onChange={(e) => update('vibe', e.target.value)}>
              <option value="entspannt">entspannt</option>
              <option value="Aussicht">Aussicht</option>
              <option value="sportlich">sportlich</option>
            </select>
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-forest-800">
          <input type="checkbox" checked={r.ebike} onChange={(e) => update('ebike', e.target.checked)} />
          E-Bike empfohlen
        </label>

        <div>
          <label className="label">Beschreibung</label>
          <textarea className="input" rows={3} value={r.description} onChange={(e) => update('description', e.target.value)} placeholder="Wie fühlt sich die Tour an?" />
        </div>
      </div>

      <div className="card space-y-3">
        <div className="font-bold text-forest-900">Links</div>
        <div>
          <label className="label">Google Maps</label>
          <input className="input" value={r.links.gmaps} onChange={(e) => updateLink('gmaps', e.target.value)} placeholder="https://www.google.com/maps/..." />
        </div>
        <div>
          <label className="label">Komoot</label>
          <input className="input" value={r.links.komoot} onChange={(e) => updateLink('komoot', e.target.value)} placeholder="https://www.komoot.com/..." />
        </div>
        <div>
          <label className="label">Outdooractive</label>
          <input className="input" value={r.links.outdooractive} onChange={(e) => updateLink('outdooractive', e.target.value)} placeholder="https://www.outdooractive.com/..." />
        </div>
      </div>

      <div className="card">
        <div className="font-bold text-forest-900 mb-2">Bilder</div>
        <ImageUpload images={r.images} onChange={(imgs) => update('images', imgs)} label="Foto hinzufügen" />
      </div>

      <div className="flex gap-2">
        <button type="button" className="btn-ghost flex-1" onClick={() => go('home')}>Abbrechen</button>
        <button type="submit" className="btn-primary flex-1">{saved ? '✓ Gespeichert' : 'Speichern'}</button>
      </div>
    </form>
  )
}
