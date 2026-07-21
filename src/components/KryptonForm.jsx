import { useEffect, useRef } from 'react'

export default function KryptonForm({ formToken, onSuccess, onError, onCancel }) {
  const publicKey = import.meta.env.VITE_PAYZEN_PUBLIC_KEY
  const containerRef = useRef(null)

  useEffect(() => {
    // Inject Krypton CSS
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://static.payzen.eu/static/js/krypton-client/V4.0/stable/kr-payment-form.min.css'
    document.head.appendChild(link)

    // Inject Krypton JS
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
          return false // prevent default redirect
        })
      }
    }
    document.body.appendChild(script)

    return () => {
      if (document.head.contains(link)) document.head.removeChild(link)
      if (document.body.contains(script)) document.body.removeChild(script)
      if (window.KR) window.KR.removeForms()
    }
  }, [formToken])

  return (
    <div className="space-y-4">
      <div ref={containerRef} className="kr-embedded" kr-form-token={formToken} />

      <button
        onClick={onCancel}
        className="w-full text-black/40 text-sm font-display py-2 hover:text-black/70 transition-colors"
      >
        ← Revenir au choix de paiement
      </button>
    </div>
  )
}
