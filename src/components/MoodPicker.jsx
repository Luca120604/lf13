import React from 'react'

const EMOJIS = [
  { v: 1, e: '😩', label: 'mies' },
  { v: 2, e: '😕', label: 'meh' },
  { v: 3, e: '😐', label: 'okay' },
  { v: 4, e: '🙂', label: 'gut' },
  { v: 5, e: '😄', label: 'top' },
]

export default function MoodPicker({ value = 0, onChange }) {
  return (
    <div className="flex gap-2 justify-between" role="radiogroup" aria-label="Stimmung">
      {EMOJIS.map(({ v, e, label }) => {
        const active = v === value
        return (
          <button
            key={v}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={label}
            onClick={() => onChange?.(v === value ? 0 : v)}
            className={`text-3xl flex-1 py-3 rounded-2xl transition active:scale-95 ${
              active
                ? 'bg-forest-100 ring-2 ring-forest-700 scale-110'
                : 'bg-white border border-forest-100'
            }`}
            style={{ filter: active || value === 0 ? 'none' : 'grayscale(0.6) opacity(0.7)' }}
          >
            {e}
          </button>
        )
      })}
    </div>
  )
}
