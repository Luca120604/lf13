import React from 'react'
import { useNotifications } from '../hooks/useNotifications.js'

// Wird auf Home angezeigt solange der User noch keine Entscheidung getroffen hat.
// Zeigt sich NICHT mehr nach 'dismissed' oder 'enabled' oder 'denied'.

export default function NotificationOptIn() {
  const { supported, permission, pref, request, savePref } = useNotifications()

  if (!supported) return null
  if (pref === 'enabled' || pref === 'dismissed' || pref === 'denied') return null
  if (permission === 'granted' || permission === 'denied') return null

  async function yes() {
    const p = await request()
    if (p === 'granted') savePref('enabled')
  }

  return (
    <div className="card border-amber-200 bg-amber-50">
      <div className="font-bold text-amber-900 mb-1">🔔 Wetter-Reminder?</div>
      <p className="text-sm text-amber-900/90 mb-3 leading-snug">
        Sollen wir dich kurz erinnern, wenn das Wetter gut zum Radfahren passt? Nicht aufdringlich — nur freundlich vorbeischauen.
      </p>
      <div className="grid grid-cols-2 gap-2">
        <button className="btn-secondary" onClick={() => savePref('dismissed')}>
          Nein danke
        </button>
        <button className="btn-primary" onClick={yes}>
          Klingt gut
        </button>
      </div>
      <p className="text-[11px] text-amber-900/70 mt-2">
        Du kannst das jederzeit in den Browser-Einstellungen ändern.
      </p>
    </div>
  )
}
