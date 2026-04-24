import React from 'react'

function isIOS() {
  if (typeof navigator === 'undefined') return false
  return /iPad|iPhone|iPod/.test(navigator.userAgent)
}

export default function DeepLinkButtons({ links = {}, query }) {
  const gmaps =
    links.gmaps ||
    (query ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}` : null)
  const apple =
    links.apple ||
    (query ? `http://maps.apple.com/?q=${encodeURIComponent(query)}` : null)
  const komoot = links.komoot || (query ? `https://www.komoot.com/discover/${encodeURIComponent(query)}` : null)
  const outdooractive = links.outdooractive

  return (
    <div className="grid grid-cols-1 gap-2">
      {gmaps && (
        <a className="btn-primary" href={gmaps} target="_blank" rel="noreferrer">
          In Google Maps öffnen
        </a>
      )}
      {isIOS() && apple && (
        <a className="btn-secondary" href={apple} target="_blank" rel="noreferrer">
          In Apple Karten öffnen
        </a>
      )}
      {komoot && (
        <a className="btn-secondary" href={komoot} target="_blank" rel="noreferrer">
          In Komoot öffnen
        </a>
      )}
      {outdooractive && (
        <a className="btn-ghost" href={outdooractive} target="_blank" rel="noreferrer">
          Outdooractive
        </a>
      )}
    </div>
  )
}
