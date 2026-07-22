import { useEffect } from 'react'

const KRYPTON_CSS = `
  .kr-embedded { width: 100% !important; }
  .kr-embedded .kr-field-wrapper { margin-bottom: 12px !important; }
  .kr-embedded .kr-field { border: none !important; border-bottom: 1px solid rgba(0,0,0,0.15) !important; border-radius: 0 !important; background: transparent !important; box-shadow: none !important; padding: 10px 0 !important; }
  .kr-embedded .kr-field:focus-within { border-bottom-color: #6195a4 !important; box-shadow: none !important; }
  .kr-embedded .kr-field-component { font-family: 'Space Grotesk', sans-serif !important; font-size: 14px !important; color: #111111 !important; background: transparent !important; }
  .kr-embedded .kr-field-label { font-family: 'Space Grotesk', sans-serif !important; font-size: 10px !important; font-weight: 700 !important; letter-spacing: 0.1em !important; text-transform: uppercase !important; color: rgba(0,0,0,0.4) !important; margin-bottom: 2px !important; }
  .kr-embedded .kr-icon { color: #6195a4 !important; }
  .kr-embedded .kr-payment-button { width: 100% !important; background: #111111 !important; color: white !important; font-family: 'Space Grotesk', sans-serif !important; font-weight: 700 !important; font-size: 14px !important; letter-spacing: 0.15em !important; border-radius: 0 !important; border: none !important; padding: 16px !important; margin-top: 8px !important; cursor: pointer !important; transition: background 0.2s !important; }
  .kr-embedded .kr-payment-button:hover { background: #6195a4 !important; }
  .kr-embedded .kr-error-message { font-family: 'Space Grotesk', sans-serif !important; font-size: 12px !important; color: #dc2626 !important; margin-top: 4px !important; }
  .kr-embedded .kr-field-wrapper--pan .kr-field { padding-left: 0 !important; }
  .kr-embedded .kr-fields-wrapper { gap: 0 !important; }
`

export default function KryptonForm({ formToken, onSuccess, onError, onCancel }) {
  const publicKey = import.meta.env.VITE_PAYZEN_PUBLIC_KEY

  useEffect(() => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://static.payzen.eu/static/js/krypton-client/V4.0/stable/kr-payment-form.min.css'
    document.head.appendChild(link)

    const style = document.createElement('style')
    style.textContent = KRYPTON_CSS
    document.head.appendChild(style)

    const script = document.createElement('script')
    script.src = 'https://static.payzen.eu/static/js/krypton-client/V4.0/stable/kr-payment-form.min.js'
    script.setAttribute('kr-public-key', publicKey)
    script.setAttribute('kr-post-url-success', 'loaded')
    script.onload = () => {
      if (window.KR) {
        window.KR.setFormConfig({ formToken, language: 'fr-FR' })
        window.KR.onSubmit(handler => {
          const answer = handler.clientAnswer
          if (answer.orderStatus === 'PAID') {
            onSuccess({
              transactionId: answer.transactions?.[0]?.uuid,
              paidAt: new Date().toISOString(),
              orderStatus: answer.orderStatus,
            })
          } else {
            onError('Paiement non abouti.')
          }
          return false
        })
      }
    }
    document.body.appendChild(script)

    return () => {
      if (document.head.contains(link)) document.head.removeChild(link)
      if (document.head.contains(style)) document.head.removeChild(style)
      if (document.body.contains(script)) document.body.removeChild(script)
      if (window.KR) window.KR.removeForms()
    }
  }, [formToken])

  return (
    <div className="space-y-2">
      <p className="text-[10px] text-black/30 uppercase tracking-widest font-display font-bold mb-4">Paiement sécurisé</p>

      <div className="kr-embedded" kr-form-token={formToken} />

      <p className="text-[10px] text-black/25 italic text-center pt-2">
        Vos données bancaires sont chiffrées et ne transitent pas par nos serveurs.
      </p>

      <button
        onClick={onCancel}
        className="w-full text-black/35 text-xs font-display tracking-widest py-2 hover:text-black/60 transition-colors"
      >
        ← RETOUR AU RÉCAPITULATIF
      </button>
    </div>
  )
}
