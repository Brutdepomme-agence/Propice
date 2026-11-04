import { useState } from 'react'

const cards = [
  {
    id: 'titres-participatifs',
    title: 'Promesse de souscription de titres participatifs',
    tag: null,
    min: '300 €',
    tranche: '100 €',
    avantages: [
      { label: 'Rémunération fixe', value: '3%', sub: '+ une part variable du résultat de la coopérative.' },
      { label: 'Réduction d\'impôt IR-PME', value: '18 à 25%', sub: 'Sous réserve d\'éligibilité.' },
    ],
    exemple: [
      { label: 'Montant souscrit', value: '2 000 €' },
      { label: 'Intérêts / an', value: '60 €' },
      { label: 'Intérêts sur 5 ans', value: '300 €' },
      { label: 'Intérêts sur 10 ans', value: '600 €' },
    ],
    note: 'Versement sous condition d\'approbation par l\'AG du 1er novembre 2026 de la levée de fonds. Soumis à la flat tax 30 %.',
  },
  {
    id: 'parts-sociales',
    title: 'Parts sociales',
    tag: 'DROIT DE VOTE',
    tagSub: '1 tête = 1 voix, quel que soit le montant investi.',
    min: '100 €',
    tranche: '100 €',
    avantages: [
      { label: 'Droit de vote', value: '1 voix', sub: '1 tête = 1 voix, quel que soit le montant.' },
      { label: 'Réduction d\'impôt IR-PME', value: '18 à 25%', sub: 'Sous réserve d\'éligibilité.' },
    ],
    exemple: [
      { label: 'Montant souscrit', value: '2 000 €' },
      { label: "Réduction d'impôt (18 %)", value: '− 360 €' },
      { label: 'Coût réel', value: '1 640 €' },
    ],
    note: 'Dispositif IR-PME. Sous réserve d\'éligibilité.',
  },
]

export default function TitreCard({ selected, onSelect }) {
  const [expanded, setExpanded] = useState(null)

  function toggleExpand(e, id) {
    e.stopPropagation()
    setExpanded(v => v === id ? null : id)
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {cards.map(card => {
        const isSelected = selected === card.id
        const isExpanded = expanded === card.id
        return (
          <div
            key={card.id}
            onClick={() => onSelect(card.id)}
            className={`cursor-pointer rounded-2xl border transition-all duration-200 backdrop-blur-sm overflow-hidden ${
              isSelected
                ? 'border-[#6195a4] bg-white/60 shadow-lg'
                : 'border-white/40 bg-white/40 hover:border-[#6195a4] hover:bg-white/55'
            }`}
          >
            {/* En-tête */}
            <div className="px-5 pt-5 pb-3 border-b border-white/40">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-display font-bold text-xl text-[#111111]">{card.title}</h3>
                <button
                  onClick={e => toggleExpand(e, card.id)}
                  className={`w-5 h-5 shrink-0 rounded-full border-2 font-bold text-[10px] flex items-center justify-center transition-colors ${
                    isExpanded ? 'bg-[#6195a4] border-[#6195a4] text-white' : 'border-[#6195a4] text-[#6195a4]'
                  }`}
                >
                  {isExpanded ? '−' : '?'}
                </button>
              </div>
              <p className="text-[#6195a4] text-xs font-semibold mt-0.5">
                À partir de {card.min} · Tranche de {card.tranche}
              </p>
            </div>

            {/* Corps */}
            <div className="px-5 py-4">
              {card.tag && (
                <div className="mb-3">
                  <span className="font-display font-bold text-xs tracking-widest bg-[#111111] text-white px-2 py-0.5 rounded-sm">{card.tag}</span>
                  {card.tagSub && <p className="text-[10px] text-black/40 mt-1">{card.tagSub}</p>}
                </div>
              )}
              <div className="flex gap-3 py-1">
                {card.avantages.map((av, i) => (
                  <div key={i} className={`flex-1 text-center rounded-xl py-2 px-1 ${i === 0 ? 'bg-white/50' : 'bg-[#6195a4]/10'}`}>
                    <p className="text-[10px] text-black/40 mb-0.5 leading-tight">{av.label}</p>
                    <p className="font-display font-bold text-2xl text-[#111111] leading-none">{av.value}</p>
                    {av.sub && <p className="text-[9px] text-black/35 mt-1 leading-tight">{av.sub}</p>}
                  </div>
                ))}
              </div>
            </div>

            {/* Détails inline — s'ouvre vers le bas dans le flux */}
            <div
              className="overflow-hidden transition-all duration-300 ease-in-out"
              style={{ maxHeight: isExpanded ? '200px' : '0px' }}
            >
              <div className="px-5 pb-4 border-t border-white/40 pt-3 space-y-2">
                <p className="font-display font-bold text-[10px] tracking-widest text-black/40 uppercase">Exemple pour 2 000 €</p>
                {card.exemple.map(row => (
                  <div key={row.label} className="flex justify-between">
                    <span className="text-xs text-black/50">{row.label}</span>
                    <span className="text-xs font-semibold text-[#111111]">{row.value}</span>
                  </div>
                ))}
                <p className="text-[10px] text-black/35 italic pt-1">{card.note}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
