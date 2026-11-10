import { useState, useEffect } from 'react'

export default function Simulateur({ type, montantInitial, montantControlled }) {
  const [montant, setMontant] = useState(montantInitial || 2000)

  useEffect(() => {
    if (montantControlled !== undefined) setMontant(montantControlled)
  }, [montantControlled])

  const m = Math.max(0, parseInt(montant) || 0)
  const isControlled = montantControlled !== undefined

  if (type === 'tp' || type === 'titres-participatifs') {
    const interetsAn = Math.round(m * 0.03)
    const interets7ans = interetsAn * 7
    const reductionIR = Math.round(m * 0.18)
    const totalRemu = interets7ans + reductionIR
    const remuAn = Math.round(totalRemu / 7)

    return (
      <div className="space-y-3">
        <p className="font-display font-bold text-[10px] tracking-widest text-black/35 uppercase">Simulateur · Titre Participatif</p>
        <div className="flex justify-between items-center">
          <span className="text-xs text-black/45 font-inter">Montant souscrit</span>
          <div className="flex items-center gap-1">
            {isControlled ? (
              <span className="text-xs font-bold text-[#111111] font-display">{m.toLocaleString('fr-FR')} €</span>
            ) : (
              <>
                <input
                  type="number"
                  value={montant}
                  onChange={e => setMontant(e.target.value)}
                  onClick={e => e.stopPropagation()}
                  className="w-20 text-right text-xs font-bold text-[#111111] font-display bg-black/5 rounded px-2 py-1 outline-none focus:bg-[#6195a4]/10"
                />
                <span className="text-xs text-black/45">€</span>
              </>
            )}
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-black/45 font-inter">Intérêts / an (3%)</span>
          <span className="text-xs font-bold text-[#111111] font-display">{interetsAn.toLocaleString('fr-FR')} €</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-black/45 font-inter">Intérêts sur 7 ans</span>
          <span className="text-xs font-bold text-[#111111] font-display">{interets7ans.toLocaleString('fr-FR')} €</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-black/45 font-inter">Réduction d'impôt IR (18%)</span>
          <span className="text-xs font-bold text-[#6195a4] font-display">− {reductionIR.toLocaleString('fr-FR')} €</span>
        </div>
        <div className="border-t border-black/10 pt-2 flex justify-between items-center">
          <span className="text-xs font-semibold text-black/60 font-inter">Total sur 7 ans</span>
          <span className="text-sm font-bold text-[#111111] font-display">{totalRemu.toLocaleString('fr-FR')} €</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-black/45 font-inter">Soit en moyenne / an</span>
          <span className="text-xs font-bold text-[#6195a4] font-display">{remuAn.toLocaleString('fr-FR')} €</span>
        </div>
        <p className="text-[9px] text-black/25 italic leading-relaxed font-inter pt-1">IR-PME sous réserve d'éligibilité. Flat tax 30% sur les intérêts.</p>
      </div>
    )
  }

  // Parts sociales
  const reductionIR = Math.round(m * 0.18)
  const remuAn = Math.round(reductionIR / 7)

  return (
    <div className="space-y-3">
      <p className="font-display font-bold text-[10px] tracking-widest text-black/35 uppercase">Simulateur · Parts Sociales</p>
      <div className="flex justify-between items-center">
        <span className="text-xs text-black/45 font-inter">Montant souscrit</span>
        <div className="flex items-center gap-1">
          {isControlled ? (
            <span className="text-xs font-bold text-[#111111] font-display">{m.toLocaleString('fr-FR')} €</span>
          ) : (
            <>
              <input
                type="number"
                value={montant}
                onChange={e => setMontant(e.target.value)}
                onClick={e => e.stopPropagation()}
                className="w-20 text-right text-xs font-bold text-[#111111] font-display bg-black/5 rounded px-2 py-1 outline-none focus:bg-[#6195a4]/10"
              />
              <span className="text-xs text-black/45">€</span>
            </>
          )}
        </div>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-xs text-black/45 font-inter">Intérêts / an</span>
        <span className="text-xs font-bold text-[#111111] font-display">0 €</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-xs text-black/45 font-inter">Droit de vote</span>
        <span className="text-xs font-bold text-[#111111] font-display">Oui</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-xs text-black/45 font-inter">Réduction d'impôt IR (18%)</span>
        <span className="text-xs font-bold text-[#6195a4] font-display">− {reductionIR.toLocaleString('fr-FR')} €</span>
      </div>
      <div className="border-t border-black/10 pt-2 flex justify-between items-center">
        <span className="text-xs font-semibold text-black/60 font-inter">Avantage total</span>
        <span className="text-sm font-bold text-[#111111] font-display">{reductionIR.toLocaleString('fr-FR')} €</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-xs text-black/45 font-inter">Soit en moyenne / an (7 ans)</span>
        <span className="text-xs font-bold text-[#6195a4] font-display">{remuAn.toLocaleString('fr-FR')} €</span>
      </div>
      <p className="text-[9px] text-black/25 italic leading-relaxed font-inter pt-1">IR-PME sous réserve d'éligibilité. Capital récupérable à la sortie.</p>
    </div>
  )
}
