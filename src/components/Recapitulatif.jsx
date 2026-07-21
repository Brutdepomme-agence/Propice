export default function Recapitulatif({ data, onConfirm, loading = false }) {
  const typeLabel = data.type === 'parts-sociales' ? 'Parts sociales' : 'Titres participatifs'
  const nombreParts = Math.round(data.montant / 100)
  const unitLabel = data.type === 'parts-sociales' ? 'part(s) sociale(s)' : 'titre(s) participatif(s)'

  const rows = [
    ['Type de titre', typeLabel],
    ['Montant', `${data.montant.toLocaleString('fr-FR')} €`],
    ['Nombre', `${nombreParts} ${unitLabel}`],
    ['Prénom', data.prenom],
    ['Nom', data.nom],
    ['Email', data.email],
    ['Téléphone', data.telephone || '—'],
    ['Adresse', data.adresse],
    ['Code postal', data.codePostal],
    ['Ville', data.ville],
    ['Date de souscription', data.dateSouscription],
  ]

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <button
          onClick={onConfirm}
          disabled={loading}
          className="w-full bg-[#111111] text-white font-display font-bold text-base py-4 tracking-widest hover:bg-[#6195a4] transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading
            ? <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            : '💳'} PAYER EN LIGNE
        </button>
        <p className="text-[10px] text-black/30 italic text-center">
          Paiement sécurisé par PayZen / Lyra Collect. Aucune donnée bancaire stockée.
        </p>
      </div>

      <div className="border border-black/10">
        {rows.map(([label, value], i) => (
          <div key={i} className={`flex justify-between px-4 py-2.5 ${i < rows.length - 1 ? 'border-b border-black/5' : ''}`}>
            <span className="font-display text-xs tracking-wide text-gray-500 uppercase">{label}</span>
            <span className="font-inter text-xs text-[#111111] font-medium text-right">{value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
