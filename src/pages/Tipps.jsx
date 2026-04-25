import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lightbulb, Droplet, ChevronDown, Plus, Minus } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage.js'
import { NUTRIENTS, TIPS, pickTipOfDay } from '../data/nutrients.js'
import { cn } from '../lib/cn.js'

const WATER_GOAL = 8 // glasses ≈ 2 L

function todayKey() {
  return new Date().toISOString().slice(0, 10)
}

export default function Tipps() {
  const tip = useMemo(() => pickTipOfDay(TIPS), [])
  const [waterDay, setWaterDay] = useLocalStorage('roland.tipps.water', { date: todayKey(), glasses: 0 })
  const [open, setOpen] = useState(null)

  // reset water counter at day change
  const today = todayKey()
  const glasses = waterDay.date === today ? waterDay.glasses : 0

  function setGlasses(n) {
    const clamped = Math.max(0, Math.min(n, 16))
    setWaterDay({ date: today, glasses: clamped })
  }

  return (
    <div className="space-y-4 pb-4">
      <div className="pt-1">
        <h1 className="text-2xl font-extrabold text-forest-900 leading-tight">Tipps & Nährstoffe 💡</h1>
        <p className="text-forest-600 text-sm mt-0.5">
          Kleine Hebel, die im Alltag und auf dem Rad wirklich was bringen.
        </p>
      </div>

      {/* Tipp des Tages */}
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="card bg-gradient-to-br from-forest-50 to-stone-warm border-forest-200"
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-forest-700 text-stone-warm flex items-center justify-center shrink-0">
            <Lightbulb className="w-5 h-5" strokeWidth={2.2} />
          </div>
          <div className="min-w-0">
            <div className="text-xs uppercase tracking-wide text-forest-600 font-semibold">Tipp des Tages</div>
            <h2 className="font-bold text-forest-900 mt-0.5">{tip.title}</h2>
            <p className="text-sm text-forest-700 mt-1 leading-relaxed">{tip.body}</p>
          </div>
        </div>
      </motion.section>

      {/* Wasser-Tracker */}
      <section className="card">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Droplet className="w-5 h-5 text-forest-700" strokeWidth={2.2} />
            <h2 className="font-bold text-forest-900">Wasser heute</h2>
          </div>
          <span className="text-sm font-semibold text-forest-700">
            {glasses}/{WATER_GOAL} Gläser
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setGlasses(glasses - 1)}
            disabled={glasses <= 0}
            className={cn(
              'w-10 h-10 rounded-full bg-forest-100 text-forest-800 flex items-center justify-center active:scale-95 transition',
              glasses <= 0 && 'opacity-40'
            )}
            aria-label="Ein Glas weniger"
          >
            <Minus className="w-5 h-5" />
          </button>

          <div className="flex-1 grid grid-cols-8 gap-1.5">
            {Array.from({ length: WATER_GOAL }).map((_, i) => {
              const filled = i < glasses
              return (
                <motion.button
                  key={i}
                  type="button"
                  onClick={() => setGlasses(i + 1)}
                  whileTap={{ scale: 0.85 }}
                  className={cn(
                    'h-10 rounded-xl flex items-center justify-center transition',
                    filled
                      ? 'bg-forest-600 text-stone-warm'
                      : 'bg-forest-50 text-forest-300 border border-forest-100'
                  )}
                  aria-label={`${i + 1} Gläser`}
                >
                  <Droplet className="w-4 h-4" strokeWidth={filled ? 2.4 : 2} fill={filled ? 'currentColor' : 'none'} />
                </motion.button>
              )
            })}
          </div>

          <button
            type="button"
            onClick={() => setGlasses(glasses + 1)}
            className="w-10 h-10 rounded-full bg-forest-700 text-stone-warm flex items-center justify-center active:scale-95 transition"
            aria-label="Ein Glas mehr"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {glasses >= WATER_GOAL && (
          <p className="text-xs text-forest-700 mt-3">🎯 Tagesziel erreicht — gut gemacht.</p>
        )}
      </section>

      {/* Nährstoffkarten */}
      <section>
        <h2 className="text-sm font-semibold text-forest-800 mb-2 px-1">Nährstoffe im Blick</h2>
        <div className="space-y-2">
          {NUTRIENTS.map((n) => {
            const isOpen = open === n.k
            return (
              <div key={n.k} className="card p-0 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : n.k)}
                  className="w-full flex items-center gap-3 p-4 active:bg-forest-50/60 transition"
                  aria-expanded={isOpen}
                >
                  <div className="w-10 h-10 rounded-2xl bg-forest-100 flex items-center justify-center text-xl shrink-0">
                    {n.emoji}
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="font-bold text-forest-900">{n.name}</div>
                    <div className="text-xs text-forest-600 truncate">{n.short}</div>
                  </div>
                  <motion.span
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                    className="text-forest-500"
                  >
                    <ChevronDown className="w-5 h-5" />
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="panel"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: 'easeOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 pt-0 space-y-3 border-t border-forest-100">
                        <p className="text-sm text-forest-700 leading-relaxed pt-3">{n.why}</p>
                        <div>
                          <div className="text-xs uppercase tracking-wide text-forest-600 font-semibold mb-1">
                            Gute Quellen
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {n.sources.map((s) => (
                              <span key={s} className="pill">{s}</span>
                            ))}
                          </div>
                        </div>
                        <div className="rounded-xl bg-forest-50 border border-forest-100 px-3 py-2">
                          <div className="text-xs uppercase tracking-wide text-forest-600 font-semibold">Roland-Tipp</div>
                          <p className="text-sm text-forest-800 mt-0.5">{n.tip}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </section>

      <p className="text-xs text-forest-500 px-1 leading-relaxed">
        Hinweis: Das ist Alltagswissen, kein Arztersatz. Bei dauernder Müdigkeit, Schwindel oder Beschwerden besser
        den Hausarzt drauf schauen lassen.
      </p>
    </div>
  )
}
