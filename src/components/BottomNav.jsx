import React from 'react'

const TABS = [
  { k: 'home', label: 'Start', icon: '🏠', match: ['home'] },
  { k: 'find', label: 'Routen', icon: '🚴', match: ['find', 'list', 'upload', 'detail'] },
  { k: 'vital', label: 'Vital', icon: '❤️', match: ['vital', 'vital-pre', 'vital-post', 'history'] },
  { k: 'body', label: 'Körper', icon: '🧬', match: ['body', 'body-result'] },
]

export default function BottomNav({ view, go }) {
  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur border-t border-forest-100"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="max-w-xl mx-auto grid grid-cols-4">
        {TABS.map((t) => {
          const active = t.match.includes(view)
          return (
            <button
              key={t.k}
              type="button"
              onClick={() => go(t.k === 'find' ? 'find' : t.k === 'vital' ? 'vital' : t.k)}
              className="py-2 flex flex-col items-center gap-0.5 active:scale-95 transition"
              aria-current={active ? 'page' : undefined}
            >
              <span
                className={`text-2xl leading-none transition ${
                  active ? 'scale-110' : 'opacity-60 grayscale'
                }`}
              >
                {t.icon}
              </span>
              <span
                className={`text-[10px] font-semibold tracking-wide ${
                  active ? 'text-forest-800' : 'text-forest-500'
                }`}
              >
                {t.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
