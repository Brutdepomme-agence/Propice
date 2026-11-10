import { useState, useEffect } from 'react'

export default function Simulateur({ type, montantInitial, montantControlled }) {
  const [montant, setMontant] = useState(montantInitial || 2000)

  useEffect(() => {
    if (montantControlled !== undefined) setMontant(montantControlled)
  }, [montantControlled])

  const m = Math.max(0, parseInt(montant) || 0)
  const isControlled = montantControlled !== undefined

  const Row = ({ label, value, highlight, bold }) => (
    <div className="flex justify-between items-center py-0.5">
      <span className="text-[11px] text-black/45 font-inter">{label}</span>
      <span className={`text-[11px] font-bold font-display ${highlight ? 'text-[#6195a4]' : bold ? 'text-[#111111]' : 'text-[#111111]'}`}>{value}</span>
    </div>
  )

  if (type === 'tp' || type === 'titres-participatifs') {
    const interetsAn = Math.round(m * 0.03)
    const interets7ans = interetsAn * 7
    const reductionIR = Math.round(m * 0.18)
    const totalRemu = interets7ans + reductionIR
    const remuPctAn = m > 0 ? ((totalRemu / 7 / m) * 100).toFixed(1).replace('.', ',') : '0'

    return (
      <div>
        <div className="flex justify-between items-center mb-2">
          <p className="font-display font-bold text-[10px] tracking-widest text-black/35 uppercase">Simulateur · Titre Participatif</p>
          {!isControlled && (
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={montant}
                onChange={e => setMontant(e.target.value)}
                onClick={e => e.stopPropagation()}
                className="w-20 text-right text-xs font-bold text-[#111111] font-display bg-black/5 rounded px-2 py-1 outline-none focus:bg-[#6195a4]/10"
              />
              <span className="text-xs text-black/45">€</span>
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 gap-x-4 border-t border-black/8 pt-2">
          <Row label="Intérêts / an (3%)" value={`${interetsAn.toLocaleString('fr-FR')} €`} />
          <Row label="Intérêts sur 7 ans" value={`${interets7ans.toLocaleString('fr-FR')} €`} />
          <Row label="Réduction IR (18%)" value={`− ${reductionIR.toLocaleString('fr-FR')} €`} highlight />
          <Row label="Rendement moyen / an" value={`${remuPctAn} %`} highlight />
        </div>
        <div className="flex justify-between items-center border-t border-black/10 mt-1.5 pt-1.5">
          <span className="text-[11px] font-semibold text-black/60 font-inter">Total avantage sur 7 ans</span>
          <span className="text-sm font-bold text-[#111111] font-display">{totalRemu.toLocaleString('fr-FR')} €</span>
        </div>
        <p className="text-[9px] text-black/25 italic font-inter mt-1">IR-PME sous réserve d'éligibilité. Flat tax 30% sur les intérêts.</p>
      </div>
    )
  }

  // Parts sociales
  const reductionIR = Math.round(m * 0.18)
  const remuPctAn = m > 0 ? ((reductionIR / 7 / m) * 100).toFixed(1).replace('.', ',') : '0'

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <p className="font-display font-bold text-[10px] tracking-widest text-black/35 uppercase">Simulateur · Parts Sociales</p>
        {!isControlled && (
          <div className="flex items-center gap-1">
            <input
              type="number"
              value={montant}
              onChange={e => setMontant(e.target.value)}
              onClick={e => e.stopPropagation()}
              className="w-20 text-right text-xs font-bold text-[#111111] font-display bg-black/5 rounded px-2 py-1 outline-none focus:bg-[#6195a4]/10"
            />
            <span className="text-xs text-black/45">€</span>
          </div>
        )}
      </div>
      <div className="grid grid-cols-2 gap-x-4 border-t border-black/8 pt-2">
        <Row label="Droit de vote" value="Oui" />
        <Row label="Intérêts / an" value="0 €" />
        <Row label="Réduction IR (18%)" value={`− ${reductionIR.toLocaleString('fr-FR')} €`} highlight />
        <Row label="Rendement moyen / an" value={`${remuPctAn} %`} highlight />
      </div>
      <div className="flex justify-between items-center border-t border-black/10 mt-1.5 pt-1.5">
        <span className="text-[11px] font-semibold text-black/60 font-inter">Avantage total</span>
        <span className="text-sm font-bold text-[#111111] font-display">{reductionIR.toLocaleString('fr-FR')} €</span>
      </div>
      <p className="text-[9px] text-black/25 italic font-inter mt-1">IR-PME sous réserve d'éligibilité. Capital récupérable à la sortie.</p>
    </div>
  )
}
