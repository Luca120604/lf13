import React from 'react'
import { motion } from 'framer-motion'
import { Home, Bike, Camera, Heart, Lightbulb } from 'lucide-react'
import { cn } from '../lib/cn.js'

const TABS = [
  { k: 'home',   label: 'Start',  Icon: Home,      match: ['home'] },
  { k: 'find',   label: 'Routen', Icon: Bike,      match: ['find', 'list', 'upload', 'detail'] },
  { k: 'camera', label: 'Foto',   Icon: Camera,    match: ['camera'], center: true },
  { k: 'vital',  label: 'Vital',  Icon: Heart,     match: ['vital', 'vital-pre', 'vital-post', 'history', 'body'] },
  { k: 'tipps',  label: 'Tipps',  Icon: Lightbulb, match: ['tipps'] },
]

export default function InteractiveMenu({ view, go }) {
  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-30"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="max-w-xl mx-auto px-3 pb-3">
        <div className="relative bg-white/95 backdrop-blur border border-forest-100 rounded-3xl shadow-[0_8px_24px_-6px_rgba(29,53,33,0.18)]">
          <div className="grid grid-cols-5 h-16">
            {TABS.map((t) => {
              const active = t.match.includes(view)
              if (t.center) {
                return (
                  <div key={t.k} className="relative flex items-start justify-center">
                    <motion.button
                      type="button"
                      onClick={() => go('camera')}
                      whileTap={{ scale: 0.92 }}
                      whileHover={{ y: -2 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                      aria-label="Foto aufnehmen"
                      aria-current={active ? 'page' : undefined}
                      className={cn(
                        'absolute -top-6 w-14 h-14 rounded-full flex items-center justify-center',
                        'bg-forest-700 text-stone-warm shadow-[0_8px_18px_-4px_rgba(29,53,33,0.45)]',
                        'ring-4 ring-stone-warm',
                        active && 'bg-forest-800'
                      )}
                    >
                      <Camera className="w-6 h-6" strokeWidth={2.2} />
                    </motion.button>
                  </div>
                )
              }
              return (
                <button
                  key={t.k}
                  type="button"
                  onClick={() => go(t.k)}
                  className="relative flex flex-col items-center justify-center gap-0.5 active:scale-95 transition"
                  aria-current={active ? 'page' : undefined}
                >
                  {active && (
                    <motion.span
                      layoutId="menu-active-pill"
                      className="absolute inset-x-3 inset-y-1.5 bg-forest-100 rounded-2xl -z-0"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <motion.span
                    animate={{ y: active ? -1 : 0, scale: active ? 1.05 : 1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                    className={cn(
                      'relative z-10 flex items-center justify-center',
                      active ? 'text-forest-800' : 'text-forest-500'
                    )}
                  >
                    <t.Icon className="w-5 h-5" strokeWidth={active ? 2.4 : 2} />
                  </motion.span>
                  <span
                    className={cn(
                      'relative z-10 text-[10px] font-semibold tracking-wide',
                      active ? 'text-forest-800' : 'text-forest-500'
                    )}
                  >
                    {t.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
