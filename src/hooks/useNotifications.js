import { useEffect, useState } from 'react'

const PREF_KEY = 'roland.notify.pref' // 'enabled' | 'dismissed' | 'denied' | undefined
const LAST_KEY = 'roland.notify.last' // timestamp letztes lokales Reminder-Notification

export function useNotifications() {
  const supported =
    typeof window !== 'undefined' && 'Notification' in window
  const [permission, setPermission] = useState(
    supported ? Notification.permission : 'denied',
  )
  const [pref, setPref] = useState(() => {
    try {
      return localStorage.getItem(PREF_KEY) || null
    } catch {
      return null
    }
  })

  // Permission-Updates abholen falls User die Browser-Settings ändert
  useEffect(() => {
    if (!supported) return
    const id = setInterval(() => {
      if (Notification.permission !== permission) setPermission(Notification.permission)
    }, 5000)
    return () => clearInterval(id)
  }, [permission, supported])

  function savePref(value) {
    setPref(value)
    try {
      if (value) localStorage.setItem(PREF_KEY, value)
      else localStorage.removeItem(PREF_KEY)
    } catch {}
  }

  async function request() {
    if (!supported) return 'denied'
    let p = Notification.permission
    if (p === 'default') {
      try {
        p = await Notification.requestPermission()
      } catch {
        p = 'denied'
      }
    }
    setPermission(p)
    if (p === 'granted') savePref('enabled')
    if (p === 'denied') savePref('denied')
    return p
  }

  async function notify(title, options = {}) {
    if (!supported || permission !== 'granted') return false
    try {
      if (navigator.serviceWorker?.ready) {
        const reg = await navigator.serviceWorker.ready
        await reg.showNotification(title, {
          icon: '/web-app-manifest-192x192.png',
          badge: '/favicon-96x96.png',
          ...options,
        })
      } else {
        new Notification(title, options)
      }
      return true
    } catch {
      return false
    }
  }

  function getLastReminder() {
    try {
      const raw = localStorage.getItem(LAST_KEY)
      return raw ? Number(raw) : 0
    } catch {
      return 0
    }
  }

  function markReminderShown() {
    try {
      localStorage.setItem(LAST_KEY, String(Date.now()))
    } catch {}
  }

  return {
    supported,
    permission,
    enabled: permission === 'granted' && pref === 'enabled',
    pref, // 'enabled' | 'dismissed' | 'denied' | null
    request,
    notify,
    savePref,
    getLastReminder,
    markReminderShown,
  }
}
