import { useState, useEffect } from 'react'
import { getSubscriptions } from '../utils/storage'

const PRESETS = [500, 1000, 3000, 5000]

export default function MontantSelector({ type, montant, onChange }) {
  const min = type === 'parts-sociales' ? 100 : 300
  const step = 100
  const [inputVal, setInputVal] = useState(String(montant))
  const objectifTotal = parseInt(import.meta.env.VITE_OBJECTIF_PHASE1 || import.meta.env.VITE_OBJECTIF_TOTAL || '0')
  const [totalSouscrit, setTotalSouscrit] = useState(0)

  useEffect(() => {
    if (objectifTotal > 0) {
      const subs = getSubscriptions()
      setTotalSouscrit(subs.reduce((acc, s) => acc + (s.montant || 0), 0))
    }
  }, [])

  useEffect(() => {
    setInputVal(String(montant))
  }, [montant])

  function clamp(val) {
    const rounded = Math.max(min, Math.floor(val / step) * step)
    return rounded
  }

  function decrement() {
    onChange(Math.max(min, montant - step))
  }

  function increment() {
    onChange(montant + step)
  }

  function handleBlur() {
    const val = parseInt(inputVal) || min
    const clamped = clamp(val)
    onChange(clamped)
    setInputVal(String(clamped))
  }

  const nombreParts = Math.round(montant / 100)
  const unitLabel = type === 'parts-sociales'
    ? `${nombreParts} part${nombreParts > 1 ? 's' : ''} sociale${nombreParts > 1 ? 's' : ''}`
    : `${nombreParts} titre${nombreParts > 1 ? 's' : ''} participatif${nombreParts > 1 ? 's' : ''}`
  const unitVerb = type === 'parts-sociales' ? 'souscrivez' : 'promettez de souscrire'

  const progressPct = objectifTotal > 0
    ? Math.min(100, Math.round(((totalSouscrit + montant) / objectifTotal) * 100))
    : 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center gap-6">
        <button
          onClick={decrement}
          disabled={montant <= min}
          className="w-12 h-12 border-2 border-[#111111] text-[#111111] font-display text-2xl disabled:opacity-30 hover:bg-[#111111] hover:text-white transition-colors"
        >
          −
        </button>
        <div className="text-center">
          <input
            type="number"
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            onBlur={handleBlur}
            className="font-display text-6xl text-center text-[#111111] w-48 bg-transparent border-b-2 border-[#111111] outline-none"
          />
          <span className="font-display text-3xl text-[#111111] ml-1">€</span>
        </div>
        <button
          onClick={increment}
          className="w-12 h-12 border-2 border-[#111111] text-[#111111] font-display text-2xl hover:bg-[#111111] hover:text-white transition-colors"
        >
          +
        </button>
      </div>

      {/* Montants rapides */}
      <div className="flex gap-2 justify-center">
        {PRESETS.filter(p => p >= min).map(preset => (
          <button
            key={preset}
            onClick={() => onChange(preset)}
            className={`flex-1 py-2 text-sm font-display font-bold rounded-lg border transition-all duration-150 ${
              montant === preset
                ? 'bg-[#6195a4] border-[#6195a4] text-white'
                : 'border-black/15 text-black/50 hover:border-[#6195a4] hover:text-[#6195a4] bg-white/40'
            }`}
          >
            {preset.toLocaleString('fr-FR')} €
          </button>
        ))}
      </div>

      <p className="text-center text-sm text-black/50">
        Vous {unitVerb} <strong className="text-[#111111]">{unitLabel}</strong>
      </p>

      {objectifTotal > 0 && (
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1 font-inter">
            <span>{(totalSouscrit + montant).toLocaleString('fr-FR')} € engagés</span>
            <span>Objectif : {objectifTotal.toLocaleString('fr-FR')} € jusqu'en décembre</span>
          </div>
          <div className="w-full h-2 bg-gray-200">
            <div
              className="h-2 bg-[#6195a4] transition-all"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <p className="text-xs text-right text-gray-500 mt-1 font-inter">{progressPct}% de l'objectif</p>
        </div>
      )}
    </div>
  )
}
