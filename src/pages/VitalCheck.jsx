import React, { useState } from 'react'
import StarRating from '../components/StarRating.jsx'
import MoodPicker from '../components/MoodPicker.jsx'
import PulsePicker from '../components/PulsePicker.jsx'
import ImageUpload from '../components/ImageUpload.jsx'
import { useLocalStorage } from '../hooks/useLocalStorage.js'

const PRE_QUESTIONS = [
  { k: 'fit', q: 'Wie fit fühlst du dich heute?' },
  { k: 'sleep', q: 'Wie gut hast du geschlafen?' },
  { k: 'fuel', q: 'Genug gegessen & getrunken?' },
  { k: 'pain', q: 'Wie schmerzfrei fühlst du dich? (5 = keine)' },
  { k: 'motivation', q: 'Wie motiviert bist du?' },
]

const POST_QUESTIONS = [
  { k: 'effort', q: 'Wie anstrengend war die Fahrt? (1 = locker, 5 = brutal)' },
  { k: 'circulation', q: 'Wie geht es deinem Kreislauf? (5 = top)' },
  { k: 'dizzy', q: 'Wie schwindelfrei bist du? (5 = alles gut)' },
  { k: 'exhaustion', q: 'Wie erholt fühlst du dich? (5 = frisch)' },
  { k: 'pain', q: 'Wie schmerzfrei? (5 = keine)' },
]

function evaluate(mode, answers, water, mood, pulse) {
  const hints = []
  const v = (k) => answers[k] || 0

  if (mode === 'pre') {
    if (v('fit') > 0 && v('fit') <= 2) hints.push({ t: 'warn', msg: 'Du wirkst heute etwas erschöpft — lockere Runde oder Pause einplanen.' })
    if (v('sleep') > 0 && v('sleep') <= 2) hints.push({ t: 'info', msg: 'Schlaf war dünn. Heute lieber keine harten Anstiege.' })
    if (v('fuel') > 0 && v('fuel') <= 2) hints.push({ t: 'warn', msg: 'Vor der Fahrt noch etwas essen und trinken.' })
    if (v('pain') > 0 && v('pain') <= 2) hints.push({ t: 'warn', msg: 'Schmerzen ernst nehmen — Belastung könnte ungünstig sein.' })
    if (v('motivation') > 0 && v('motivation') <= 2) hints.push({ t: 'info', msg: 'Motivation niedrig — vielleicht eine kürzere, entspannte Tour.' })
    if (mood > 0 && mood <= 2) hints.push({ t: 'info', msg: 'Stimmung im Keller — kürzere Runde oder Pause könnte helfen.' })
    if (water != null && water < 2) hints.push({ t: 'info', msg: 'Nimm mindestens 0,5–1 L Wasser für unterwegs mit.' })
  } else {
    if (v('effort') >= 4) hints.push({ t: 'info', msg: 'War heftig — Erholung, Dehnung und trinken.' })
    if (v('circulation') > 0 && v('circulation') <= 2) hints.push({ t: 'warn', msg: 'Kreislauf könnte schwach sein — hinsetzen, trinken, evtl. Blutdruck messen.' })
    if (v('dizzy') > 0 && v('dizzy') <= 2) hints.push({ t: 'alert', msg: 'Schwindel/Übelkeit: Pause einlegen, bei Anhalten Arzt kontaktieren.' })
    if (v('exhaustion') > 0 && v('exhaustion') <= 2) hints.push({ t: 'info', msg: 'Stark erschöpft — heute kein weiteres Training.' })
    if (v('pain') > 0 && v('pain') <= 2) hints.push({ t: 'warn', msg: 'Schmerzen beobachten. Bei Anhalten pausieren.' })
    if (mood > 0 && mood <= 2) hints.push({ t: 'info', msg: 'Stimmung mau nach der Fahrt — Pause, Snack, etwas trinken.' })
    if (pulse > 0) {
      if (pulse > 160) hints.push({ t: 'alert', msg: 'Puls sehr hoch (>160). Hinsetzen, ruhig atmen. Bei Anhalten Arzt.' })
      else if (pulse > 130) hints.push({ t: 'warn', msg: 'Puls deutlich erhöht (>130). Kurze Pause, sollte langsam sinken.' })
      else if (pulse < 45) hints.push({ t: 'info', msg: 'Puls niedrig (<45). Ungewöhnlich kurz nach Belastung — beobachten.' })
    }
  }

  if (hints.length === 0) {
    hints.push({ t: 'ok', msg: mode === 'pre' ? 'Sieht gut aus — entspannt losfahren.' : 'Alles im grünen Bereich. Gute Fahrt nachgeholt.' })
  }
  return hints
}

export default function VitalCheck({ mode = 'pre', go }) {
  const questions = mode === 'pre' ? PRE_QUESTIONS : POST_QUESTIONS
  const [answers, setAnswers] = useState({})
  const [water, setWater] = useState(mode === 'pre' ? 1 : 0) // Flaschen à 0.5L
  const [mood, setMood] = useState(0) // 0 = nicht gewählt, 1–5
  const [pulse, setPulse] = useState(0) // 0 = nicht gemessen
  const [images, setImages] = useState([])
  const [done, setDone] = useState(false)
  const [history, setHistory] = useLocalStorage('roland.checks', [])

  function setAnswer(k, v) { setAnswers((s) => ({ ...s, [k]: v })) }

  const hints = done ? evaluate(mode, answers, water, mood, pulse) : []

  function finish() {
    const entry = {
      id: `check-${Date.now()}`,
      mode,
      at: Date.now(),
      answers,
      water,
      mood,
      pulse,
      images,
    }
    setHistory([entry, ...history])
    setDone(true)
  }

  const allAnswered = questions.every((q) => (answers[q.k] || 0) > 0)

  if (done) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-forest-900">
          Ergebnis — {mode === 'pre' ? 'vor der Fahrt' : 'nach der Fahrt'}
        </h2>
        <div className="space-y-2">
          {hints.map((h, i) => (
            <div
              key={i}
              className={`rounded-2xl p-4 border text-sm ${
                h.t === 'ok'
                  ? 'bg-forest-100 border-forest-200 text-forest-800'
                  : h.t === 'info'
                  ? 'bg-amber-50 border-amber-200 text-amber-900'
                  : h.t === 'warn'
                  ? 'bg-orange-50 border-orange-200 text-orange-900'
                  : 'bg-red-50 border-red-200 text-red-900'
              }`}
            >
              {h.msg}
            </div>
          ))}
        </div>
        <p className="text-xs text-forest-600">
          Keine medizinische Aussage. Nur Orientierung basierend auf deinen Eingaben.
        </p>
        <div className="grid grid-cols-2 gap-2">
          <button className="btn-ghost" onClick={() => go('history')}>Verlauf ansehen</button>
          <button className="btn-primary" onClick={() => go('home')}>Fertig</button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-forest-900">
        Vitalcheck — {mode === 'pre' ? 'vor der Fahrt' : 'nach der Fahrt'}
      </h2>

      <div className="card">
        <div className="text-forest-900 font-medium mb-3">
          {mode === 'pre' ? 'Wie ist deine Stimmung gerade?' : 'Wie fühlst du dich nach der Fahrt?'}
        </div>
        <MoodPicker value={mood} onChange={setMood} />
      </div>

      <div className="space-y-3">
        {questions.map((q) => (
          <div key={q.k} className="card">
            <div className="text-forest-900 font-medium mb-3">{q.q}</div>
            <StarRating value={answers[q.k] || 0} onChange={(v) => setAnswer(q.k, v)} />
          </div>
        ))}
      </div>

      {mode === 'post' && (
        <div className="card">
          <div className="label">Puls (optional)</div>
          <p className="text-xs text-forest-600 mb-3">
            Finger im grünen Feld halten und nach oben ziehen, um den Wert zu erhöhen.
          </p>
          <PulsePicker value={pulse} onChange={setPulse} />
        </div>
      )}

      {mode === 'pre' && (
        <div className="card">
          <div className="label">Wasser dabei (Flaschen à 0,5 L)</div>
          <div className="flex items-center gap-4">
            <button type="button" className="btn-secondary w-12 h-12 text-2xl" onClick={() => setWater(Math.max(0, water - 1))}>−</button>
            <div className="text-2xl font-bold text-forest-900 w-12 text-center">{water}</div>
            <button type="button" className="btn-secondary w-12 h-12 text-2xl" onClick={() => setWater(water + 1)}>+</button>
          </div>
        </div>
      )}

      <div className="card">
        <div className="label">Foto / Screenshot (optional)</div>
        <p className="text-xs text-forest-600 mb-2">
          z. B. Blutdruckgerät, Smartwatch (Apple Health / Garmin / Fitbit).
        </p>
        <ImageUpload images={images} onChange={setImages} label="Foto / Screenshot anhängen" />
      </div>

      <div className="flex gap-2">
        <button type="button" className="btn-ghost flex-1" onClick={() => go('home')}>Abbrechen</button>
        <button
          type="button"
          className="btn-primary flex-1 disabled:opacity-50"
          disabled={!allAnswered}
          onClick={finish}
        >
          Auswerten
        </button>
      </div>
    </div>
  )
}
