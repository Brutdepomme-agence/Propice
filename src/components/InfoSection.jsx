import { useState } from 'react'

function Row({ label, value }) {
  return (
    <div className="flex justify-between py-2 border-b border-gray-100 last:border-0">
      <span className="font-inter text-sm text-gray-500">{label}</span>
      <span className="font-inter text-sm font-semibold text-[#111111]">{value}</span>
    </div>
  )
}

function Panel({ id, open, onToggle, title, tag, children }) {
  return (
    <div className="border-2 border-[#111111]">
      <button
        onClick={() => onToggle(id)}
        className="w-full flex justify-between items-center px-5 py-4 text-left"
      >
        <div>
          <span className="font-display text-xl text-[#111111] tracking-wide">{title}</span>
          {tag && (
            <span className="ml-3 font-display text-xs px-2 py-0.5 bg-[#6195a4] text-white tracking-wide">{tag}</span>
          )}
        </div>
        <span className="font-display text-2xl text-[#6195a4]">{open ? '−' : '+'}</span>
      </button>
      {open && (
        <div className="px-5 pb-5 border-t border-gray-100 space-y-4">
          {children}
        </div>
      )}
    </div>
  )
}

export default function InfoSection() {
  const [open, setOpen] = useState(null)
  function toggle(id) { setOpen(o => o === id ? null : id) }

  return (
    <div className="mb-10 space-y-3">
      <p className="font-display text-xs tracking-widest text-gray-400 uppercase mb-4">Comprendre avant de souscrire</p>

      <Panel id="ps" open={open === 'ps'} onToggle={toggle} title="Parts sociales" tag="AVEC DROIT DE VOTE">
        <p className="font-inter text-sm text-gray-600 leading-relaxed">
          En souscrivant des parts sociales, vous devenez sociétaire de PROPICE et participez à la gouvernance du tiers lieu — une voix par personne, quel que soit le montant investi.
        </p>

        <div className="bg-white/10 border border-[#6195a4] p-4 space-y-1">
          <p className="font-display text-sm tracking-wide text-[#6195a4]">AVANTAGE FISCAL</p>
          <p className="font-inter text-sm text-[#111111]">
            Réduction d'impôt sur le revenu de <strong>25 %</strong> du montant souscrit, dans la limite de 50 000 € (célibataire) ou 100 000 € (couple), au titre du dispositif IR-PME / Madelin SCIC.
          </p>
        </div>

        <div>
          <p className="font-display text-xs tracking-widest text-gray-400 mb-2">EXEMPLE POUR 2 000 €</p>
          <Row label="Montant souscrit" value="2 000 €" />
          <Row label="Réduction d'impôt (25 %)" value="− 500 €" />
          <Row label="Coût réel après réduction fiscale" value="1 500 €" />
          <p className="font-inter text-xs text-gray-400 mt-2 italic">
            La réduction s'impute directement sur votre impôt de l'année de souscription. Sous réserve d'éligibilité et de maintien du dispositif en vigueur.
          </p>
        </div>
      </Panel>

      <Panel id="tp" open={open === 'tp'} onToggle={toggle} title="Titres participatifs" tag="3 % / AN">
        <p className="font-inter text-sm text-gray-600 leading-relaxed">
          Les titres participatifs sont des titres de dette subordonnée, sans droit de vote. Ils offrent une rémunération fixe annuelle de <strong>3 %</strong> et soutiennent le projet sans diluer la gouvernance coopérative.
        </p>

        <div className="bg-white/10 border border-[#6195a4] p-4 space-y-1">
          <p className="font-display text-sm tracking-wide text-[#6195a4]">RÉMUNÉRATION</p>
          <p className="font-inter text-sm text-[#111111]">
            Taux d'intérêt fixe de <strong>3 % par an</strong>, versé annuellement sur la durée du titre.
          </p>
        </div>

        <div>
          <p className="font-display text-xs tracking-widest text-gray-400 mb-2">EXEMPLE POUR 2 000 €</p>
          <Row label="Montant souscrit" value="2 000 €" />
          <Row label="Intérêts annuels (3 %)" value="60 €" />
          <Row label="Intérêts sur 5 ans" value="300 €" />
          <Row label="Intérêts sur 10 ans" value="600 €" />
          <p className="font-inter text-xs text-gray-400 mt-2 italic">
            Les intérêts sont soumis à la fiscalité applicable aux revenus de capitaux mobiliers (flat tax 30 % ou barème IR selon option). Aucune déduction fiscale sur le capital souscrit.
          </p>
        </div>
      </Panel>
    </div>
  )
}
