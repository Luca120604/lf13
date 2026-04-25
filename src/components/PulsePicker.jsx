import React, { useRef, useState, useCallback } from 'react'

export default function PulsePicker({ value = 0, onChange, min = 40, max = 220 }) {
  const startY = useRef(null)
  const startVal = useRef(value)
  const [dragging, setDragging] = useState(false)

  const getY = (e) => (e.touches ? e.touches[0].clientY : e.clientY)

  const start = useCallback(
    (e) => {
      startY.current = getY(e)
      startVal.current = value || 70
      if (!value) onChange?.(70)
      setDragging(true)
    },
    [value, onChange],
  )

  const move = useCallback(
    (e) => {
      if (startY.current == null) return
      const dy = startY.current - getY(e) // hochziehen → positiv
      const delta = Math.round(dy / 3) // 3 px = 1 BPM
      const next = Math.max(min, Math.min(max, startVal.current + delta))
      if (next !== value) onChange?.(next)
      if (e.cancelable) e.preventDefault()
    },
    [value, min, max, onChange],
  )

  const end = useCallback(() => {
    startY.current = null
    setDragging(false)
  }, [])

  const display = value > 0 ? value : '—'

  return (
    <div className="select-none">
      <div
        onTouchStart={start}
        onTouchMove={move}
        onTouchEnd={end}
        onTouchCancel={end}
        onMouseDown={start}
        onMouseMove={dragging ? move : undefined}
        onMouseUp={end}
        onMouseLeave={dragging ? end : undefined}
        className={`mx-auto w-44 py-7 rounded-3xl text-center cursor-ns-resize transition ${
          dragging ? 'bg-forest-200 scale-105 shadow-lg' : 'bg-forest-100'
        }`}
        style={{ touchAction: 'none' }}
        role="slider"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value || 0}
        aria-label="Puls in Schlägen pro Minute"
      >
        <div className="text-5xl font-extrabold text-forest-900 tabular-nums leading-none">
          {display}
        </div>
        <div className="text-[11px] text-forest-700 mt-2 font-medium tracking-wide">
          BPM · ↕ Finger ziehen
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 justify-center">
        <button
          type="button"
          aria-label="Puls minus 1"
          className="btn-secondary w-11 h-11 text-xl"
          onClick={() => onChange?.(Math.max(min, (value || 70) - 1))}
        >
          −
        </button>
        {value > 0 && (
          <button
            type="button"
            className="btn-ghost text-xs px-3"
            onClick={() => onChange?.(0)}
          >
            zurücksetzen
          </button>
        )}
        <button
          type="button"
          aria-label="Puls plus 1"
          className="btn-secondary w-11 h-11 text-xl"
          onClick={() => onChange?.(Math.min(max, (value || 70) + 1))}
        >
          +
        </button>
      </div>
    </div>
  )
}
