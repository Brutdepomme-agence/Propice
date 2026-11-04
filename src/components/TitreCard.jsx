import { useState } from 'react'

const cards = [
  {
    id: 'titres-participatifs',
    title: 'Titre Participatif',
    titleSub: '(Promesse de souscription)',
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
    titleSub: null,
    tag: null,
    tagSub: null,
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {cards.map(card => {
        const isSelected = selected === card.id
        const isExpanded = expanded === card.id
        return (
          <div
            key={card.id}
            onClick={() => onSelect(card.id)}
            className={`cursor-pointer rounded-2xl border-2 transition-all duration-200 backdrop-blur-sm overflow-hidden flex flex-col ${
              isSelected
                ? 'border-[#6195a4] bg-white/70 shadow-xl'
                : 'border-white/50 bg-white/40 hover:border-[#6195a4]/60 hover:bg-white/55 hover:shadow-md'
            }`}
          >
            {/* En-tête */}
            <div className="px-5 pt-5 pb-4 flex items-start justify-between gap-3">
              <div>
                <h3 className="font-display font-bold text-2xl text-[#111111] leading-tight">{card.title}</h3>
                {card.titleSub && (
                  <p className="text-[11px] text-black/35 font-inter mt-0.5 tracking-wide">{card.titleSub}</p>
                )}
                <p className="text-[#6195a4] text-[11px] font-semibold font-inter mt-2">
                  À partir de <span className="text-sm">{card.min}</span> · tranches de {card.tranche}
                </p>
              </div>
              <button
                onClick={e => toggleExpand(e, card.id)}
                className={`shrink-0 mt-0.5 w-6 h-6 rounded-full border-2 font-bold text-[11px] flex items-center justify-center transition-colors ${
                  isExpanded ? 'bg-[#6195a4] border-[#6195a4] text-white' : 'border-[#6195a4]/60 text-[#6195a4]'
                }`}
              >
                {isExpanded ? '−' : '?'}
              </button>
            </div>

            {/* Avantages — occupe la hauteur restante */}
            <div className="flex-1 px-5 pb-5 flex flex-col justify-center gap-3">
              {card.avantages.map((av, i) => (
                <div
                  key={i}
                  className={`rounded-xl px-4 py-3 flex items-center gap-4 ${
                    i === 0 ? 'bg-white/60' : 'bg-[#6195a4]/10'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-black/40 font-inter uppercase tracking-wider leading-tight">{av.label}</p>
                    {av.sub && <p className="text-[10px] text-black/30 font-inter mt-0.5 leading-tight">{av.sub}</p>}
                  </div>
                  <p className="font-display font-bold text-3xl text-[#111111] leading-none shrink-0">{av.value}</p>
                </div>
              ))}
            </div>

            {/* Détails dépliables */}
            <div
              className="overflow-hidden transition-all duration-300 ease-in-out"
              style={{ maxHeight: isExpanded ? '220px' : '0px' }}
            >
              <div className="px-5 pb-5 pt-3 border-t border-white/50 space-y-2">
                <p className="font-display font-bold text-[10px] tracking-widest text-black/35 uppercase mb-3">Exemple pour 2 000 €</p>
                {card.exemple.map(row => (
                  <div key={row.label} className="flex justify-between items-center">
                    <span className="text-xs text-black/45 font-inter">{row.label}</span>
                    <span className="text-xs font-bold text-[#111111] font-display">{row.value}</span>
                  </div>
                ))}
                <p className="text-[10px] text-black/30 italic pt-2 leading-relaxed font-inter">{card.note}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
