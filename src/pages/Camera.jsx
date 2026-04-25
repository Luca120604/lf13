import React, { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera as CameraIcon, Pizza, Activity, Pill, Package, Watch, MoreHorizontal, StickyNote, X } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage.js'
import { cn } from '../lib/cn.js'
import PromptInputBox from '../components/ui/PromptInputBox.jsx'

const CATEGORIES = [
  { k: 'essen',       label: 'Essen',       Icon: Pizza,           hint: 'Mahlzeit, Snack, Getränk' },
  { k: 'blutdruck',   label: 'Blutdruck',   Icon: Activity,        hint: 'Anzeige vom Messgerät' },
  { k: 'supplement',  label: 'Supplement',  Icon: Pill,            hint: 'Vitamin, Mineral, Kapsel' },
  { k: 'verpackung',  label: 'Verpackung',  Icon: Package,         hint: 'Etikett, Inhaltsstoffe' },
  { k: 'smartwatch',  label: 'Smartwatch',  Icon: Watch,           hint: 'Schritte, Puls, HRV' },
  { k: 'sonstiges',   label: 'Sonstiges',   Icon: MoreHorizontal,  hint: 'Was du sonst festhalten willst' },
  { k: 'notiz',       label: 'Notiz',       Icon: StickyNote,      hint: 'Freie Eingabe' },
]

export default function Camera({ go }) {
  const inputRef = useRef(null)
  const [preview, setPreview] = useState(null)
  const [category, setCategory] = useState(null)
  const [note, setNote] = useState('')
  const [shots, setShots] = useLocalStorage('roland.camera.shots', [])
  const [saved, setSaved] = useState(false)

  function pickFile() {
    inputRef.current?.click()
  }

  function onFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      setPreview(ev.target?.result || null)
      setSaved(false)
    }
    reader.readAsDataURL(file)
  }

  function reset() {
    setPreview(null)
    setCategory(null)
    setNote('')
    setSaved(false)
    if (inputRef.current) inputRef.current.value = ''
  }

  function save() {
    if (!preview || !category) return
    const entry = {
      id: Date.now(),
      ts: new Date().toISOString(),
      category,
      note: note.trim(),
      // dataUrl can be heavy; keep last 12 to stay under quota
      dataUrl: preview,
    }
    const next = [entry, ...shots].slice(0, 12)
    setShots(next)
    setSaved(true)
  }

  const cat = CATEGORIES.find((c) => c.k === category)

  return (
    <div className="space-y-4 pb-4">
      <div className="pt-1">
        <h1 className="text-2xl font-extrabold text-forest-900 leading-tight">Foto-Tagebuch 📸</h1>
        <p className="text-forest-600 text-sm mt-0.5">
          Schnapp ein Bild und sag, was es ist — der Rest wird automatisch sortiert.
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={onFile}
      />

      <AnimatePresence mode="wait">
        {!preview ? (
          <motion.div
            key="capture"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-3"
          >
            <PromptInputBox
              placeholder="Notiz, Frage oder Bild — einfach senden"
              onSend={(message, attachedImages) => {
                const entry = {
                  id: Date.now(),
                  ts: new Date().toISOString(),
                  category: 'notiz',
                  note: message,
                  dataUrl: attachedImages[0] || null,
                }
                setShots([entry, ...shots].slice(0, 12))
              }}
            />

            <button
              type="button"
              onClick={pickFile}
              className="card w-full aspect-[4/3] flex flex-col items-center justify-center gap-3 border-dashed border-2 border-forest-200 bg-forest-50/40 active:scale-[0.98] transition"
            >
              <div className="w-16 h-16 rounded-full bg-forest-700 text-stone-warm flex items-center justify-center shadow-[0_8px_18px_-4px_rgba(29,53,33,0.45)]">
                <CameraIcon className="w-7 h-7" strokeWidth={2.2} />
              </div>
              <div className="text-forest-800 font-semibold">Foto mit Kategorie</div>
              <div className="text-xs text-forest-600">oder Bild aus der Galerie wählen</div>
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-3"
          >
            <div className="relative rounded-2xl overflow-hidden border border-forest-100 bg-black">
              <img src={preview} alt="Aufnahme" className="w-full max-h-[55vh] object-contain" />
              <button
                type="button"
                onClick={reset}
                className="absolute top-2 right-2 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center active:scale-95"
                aria-label="Verwerfen"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <div className="label">Kategorie</div>
              <div className="grid grid-cols-3 gap-2">
                {CATEGORIES.map((c) => {
                  const active = category === c.k
                  return (
                    <button
                      key={c.k}
                      type="button"
                      onClick={() => setCategory(c.k)}
                      className={cn(
                        'rounded-2xl border p-3 flex flex-col items-center gap-1 transition active:scale-95',
                        active
                          ? 'bg-forest-700 text-stone-warm border-forest-700 shadow-sm'
                          : 'bg-white text-forest-800 border-forest-100 hover:bg-forest-50'
                      )}
                    >
                      <c.Icon className="w-5 h-5" strokeWidth={active ? 2.4 : 2} />
                      <span className="text-xs font-semibold">{c.label}</span>
                    </button>
                  )
                })}
              </div>
              {cat && (
                <p className="mt-2 text-xs text-forest-600">{cat.hint}</p>
              )}
            </div>

            <div>
              <label className="label" htmlFor="cam-note">Notiz (optional)</label>
              <textarea
                id="cam-note"
                rows={2}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="z. B. nach 30 km, leicht müde"
                className="input"
              />
            </div>

            <div className="flex gap-2">
              <button type="button" onClick={reset} className="btn-secondary flex-1">
                Verwerfen
              </button>
              <button
                type="button"
                onClick={save}
                disabled={!category}
                className={cn('btn-primary flex-1', !category && 'opacity-50')}
              >
                Speichern
              </button>
            </div>

            <AnimatePresence>
              {saved && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-sm text-forest-700 bg-forest-100 border border-forest-200 rounded-2xl px-4 py-2"
                >
                  ✅ Gespeichert in „{cat?.label}".
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {shots.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-forest-800">Letzte Aufnahmen</h2>
            <span className="text-xs text-forest-500">{shots.length}</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {shots.map((s) => {
              const c = CATEGORIES.find((x) => x.k === s.category)
              if (s.dataUrl) {
                return (
                  <div key={s.id} className="relative aspect-square rounded-xl overflow-hidden border border-forest-100 bg-stone-warm">
                    <img src={s.dataUrl} alt="" className="w-full h-full object-cover" />
                    <div className="absolute bottom-1 left-1 right-1 flex items-center gap-1 bg-black/55 text-white text-[10px] font-medium rounded-md px-1.5 py-0.5">
                      {c?.Icon && <c.Icon className="w-3 h-3" />}
                      <span className="truncate">{c?.label || s.category}</span>
                    </div>
                  </div>
                )
              }
              return (
                <div
                  key={s.id}
                  className="aspect-square rounded-xl border border-forest-100 bg-forest-50 p-2 flex flex-col gap-1 overflow-hidden"
                >
                  <div className="flex items-center gap-1 text-forest-700 text-[10px] font-semibold">
                    {c?.Icon && <c.Icon className="w-3 h-3" />}
                    <span className="truncate">{c?.label || s.category}</span>
                  </div>
                  <p className="selectable text-xs text-forest-800 leading-snug overflow-hidden">
                    {s.note}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
