import { useState } from 'react'

export default function PaymentChoice({ data, onPayOnline, onPayWire }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handlePayOnline() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: data.montant,
          orderId: data.id,
          customer: {
            email: data.email,
            prenom: data.prenom,
            nom: data.nom,
            adresse: data.adresse,
            codePostal: data.codePostal,
            ville: data.ville,
          },
        }),
      })
      const contentType = res.headers.get('content-type') || ''
      if (!contentType.includes('application/json')) {
        throw new Error(
          window.location.hostname === 'localhost'
            ? 'Fonctions Netlify non disponibles en local. Lancez "netlify dev" à la place de "npm run dev" pour tester le paiement.'
            : `Erreur serveur (${res.status})`
        )
      }
      const json = await res.json()
      if (json.error) throw new Error(json.error)
      onPayOnline(json.formToken)
    } catch (e) {
      setError(e.message || 'Erreur lors de la connexion au paiement.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-black/50">
        Choisissez votre mode de règlement pour{' '}
        <strong className="text-[#111111]">{data.montant?.toLocaleString('fr-FR')} €</strong>.
      </p>

      <button
        onClick={handlePayOnline}
        disabled={loading}
        className="w-full bg-[#111111] text-white font-display font-bold text-base py-4 tracking-widest hover:bg-[#6195a4] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {loading ? (
          <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
        ) : '💳'} PAYER EN LIGNE MAINTENANT
      </button>

      <button
        onClick={onPayWire}
        className="w-full border border-black/15 text-black/60 font-display font-bold text-base py-4 tracking-widest hover:border-[#111111] hover:text-[#111111] transition-colors bg-white/40 backdrop-blur-sm"
      >
        JE RÉGLERAI PAR VIREMENT
      </button>

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      <p className="text-[10px] text-black/30 italic text-center">
        Paiement sécurisé par PayZen / Lyra Collect. Aucune donnée bancaire n&apos;est stockée sur nos serveurs.
      </p>
    </div>
  )
}
