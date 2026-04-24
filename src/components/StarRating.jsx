import React from 'react'

export default function StarRating({ value = 0, onChange, size = 38 }) {
  return (
    <div className="flex gap-1.5" role="radiogroup">
      {[1, 2, 3, 4, 5].map((n) => {
        const active = n <= value
        return (
          <button
            key={n}
            type="button"
            aria-label={`${n} Sterne`}
            aria-checked={active}
            role="radio"
            onClick={() => onChange?.(n === value ? 0 : n)}
            className="star-btn"
            style={{ lineHeight: 0 }}
          >
            <svg
              width={size}
              height={size}
              viewBox="0 0 24 24"
              fill={active ? '#f5b301' : 'none'}
              stroke={active ? '#d49200' : '#9abb99'}
              strokeWidth="1.8"
              strokeLinejoin="round"
            >
              <path d="M12 2.5l2.95 6 6.6.96-4.78 4.66 1.13 6.57L12 17.6l-5.9 3.1 1.13-6.57L2.45 9.46 9.05 8.5 12 2.5z" />
            </svg>
          </button>
        )
      })}
    </div>
  )
}
