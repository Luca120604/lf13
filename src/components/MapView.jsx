import React from 'react'

// OpenStreetMap iframe embed — kostenlos, kein Key, keine JS-Library.
// Wenn Start- und Ziel-Koordinaten übergeben werden, wird der Bbox so
// gewählt, dass beide Punkte sichtbar sind. Sonst zentriert auf Start.

function bboxAround(lat, lon, padDeg = 0.025) {
  return [lon - padDeg, lat - padDeg, lon + padDeg, lat + padDeg]
}

function bboxFromTwo(a, b, padDeg = 0.02) {
  const minLat = Math.min(a.lat, b.lat) - padDeg
  const maxLat = Math.max(a.lat, b.lat) + padDeg
  const minLon = Math.min(a.lon, b.lon) - padDeg
  const maxLon = Math.max(a.lon, b.lon) + padDeg
  return [minLon, minLat, maxLon, maxLat]
}

export default function MapView({ start, end, height = 220 }) {
  if (!start) return null

  const sameSpot =
    end && Math.abs(end.lat - start.lat) < 0.0005 && Math.abs(end.lon - start.lon) < 0.0005

  const bbox = end && !sameSpot ? bboxFromTwo(start, end) : bboxAround(start.lat, start.lon)
  const marker = `${start.lat},${start.lon}`

  // OSM erlaubt nur einen Marker per URL. Bei A→B malen wir per Tap-Through-Link.
  const src =
    `https://www.openstreetmap.org/export/embed.html` +
    `?bbox=${bbox.join(',')}&layer=mapnik&marker=${marker}`

  const externalLink = end && !sameSpot
    ? `https://www.openstreetmap.org/?mlat=${start.lat}&mlon=${start.lon}#map=12/${(start.lat + end.lat) / 2}/${(start.lon + end.lon) / 2}`
    : `https://www.openstreetmap.org/?mlat=${start.lat}&mlon=${start.lon}#map=14/${start.lat}/${start.lon}`

  return (
    <div className="rounded-2xl overflow-hidden border border-forest-100">
      <iframe
        title="Karte"
        src={src}
        style={{ width: '100%', height, border: 0, display: 'block' }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      <div className="bg-white px-3 py-2 flex items-center justify-between text-xs text-forest-700">
        <span>
          📍 {start.lat.toFixed(3)}, {start.lon.toFixed(3)}
          {end && !sameSpot && (
            <> → {end.lat.toFixed(3)}, {end.lon.toFixed(3)}</>
          )}
        </span>
        <a
          href={externalLink}
          target="_blank"
          rel="noreferrer"
          className="text-forest-700 underline"
        >
          Karte öffnen
        </a>
      </div>
    </div>
  )
}
