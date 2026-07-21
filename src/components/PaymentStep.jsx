// Placeholder — remplacer le contenu de ce composant quand le module de paiement sera configuré.
// Props reçues : data (formData complet), onSuccess(paymentResult), onCancel

export default function PaymentStep({ data, onSuccess, onCancel }) {
  return (
    <div className="space-y-6">
      <div className="border-2 border-dashed border-gray-300 p-8 text-center space-y-3">
        <p className="font-display text-2xl text-gray-400 tracking-wide">MODULE DE PAIEMENT</p>
        <p className="font-inter text-sm text-gray-400">
          Le module de paiement sera intégré ici.<br />
          Montant à encaisser : <strong>{data.montant?.toLocaleString('fr-FR')} €</strong>
        </p>
        <p className="font-inter text-xs text-gray-300 italic">
          En attente des identifiants et du prestataire de paiement (ex. Stripe, HelloAsso, Lemonway…)
        </p>
      </div>

      {/* Boutons de test — à supprimer une fois le vrai module intégré */}
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 border-2 border-gray-300 font-display text-sm py-3 tracking-widest text-gray-400 hover:border-[#111111] hover:text-[#111111] transition-colors"
        >
          ANNULER
        </button>
        <button
          onClick={() => onSuccess({ status: 'paid', reference: 'TEST-' + Date.now() })}
          className="flex-1 bg-[#111111] text-white font-display text-sm py-3 tracking-widest hover:bg-[#6195a4] transition-colors"
        >
          SIMULER LE PAIEMENT
        </button>
      </div>
    </div>
  )
}
