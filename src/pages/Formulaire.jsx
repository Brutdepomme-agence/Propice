import { useState, useEffect } from 'react'
import StepIndicator from '../components/StepIndicator'
import TitreCard from '../components/TitreCard'
import MontantSelector from '../components/MontantSelector'
import CoordForm from '../components/CoordForm'
import Recapitulatif from '../components/Recapitulatif'
import ConfirmationPage from '../components/ConfirmationPage'
import KryptonForm from '../components/KryptonForm'
import Simulateur from '../components/Simulateur'
import { saveSubscription } from '../utils/storage'
import { generateBulletin } from '../utils/generatePDF'

const stepContent = [
  {
    title: `Investissez local,\ninvestissez\nsolidaire.`,
    sub: `Plus de 4 millions d'euros déjà levés. Il reste la dernière ligne droite.`,
  },
  {
    title: `Choisissez\nvotre montant\nd'engagement.`,
    sub: `Devenez copropriétaire d'un projet coopératif de territoire.`,
  },
  {
    title: `Vous rejoignez\nune coopérative\nde territoire.`,
    sub: `Belle-Île vous attendait. Propice vous accueille.`,
  },
  {
    title: `Plus qu'un geste,\nun acte\nfondateur.`,
    sub: `Vérifiez vos informations avant de confirmer votre souscription.`,
  },
]

const confirmedContent = {
  title: `Bienvenue\ndans l'aventure\nPropice.`,
  sub: `Votre engagement compte. À très vite sur l'île.`,
}

export default function Formulaire() {
  const [step, setStep] = useState(1)
  const [phase, setPhase] = useState('form')
  const [formData, setFormData] = useState({ type: null, montant: 100 })
  const [savedData, setSavedData] = useState(null)
  const [payzenToken, setPayzenToken] = useState(null)

  function goToStep(n) {
    if (n < step) setStep(n)
  }

  function handleTypeSelect(type) {
    const minMontant = type === 'parts-sociales' ? 100 : 300
    setFormData(d => ({ ...d, type, montant: Math.max(d.montant, minMontant) }))
  }

  function handleStep3Submit(coordData) {
    setFormData(d => ({ ...d, ...coordData }))
    setStep(4)
  }

  const [paymentLoading, setPaymentLoading] = useState(false)
  const [paymentError, setPaymentError] = useState(null)
  const [totalSouscrit, setTotalSouscrit] = useState(0)
  const objectifTotal = parseInt(import.meta.env.VITE_OBJECTIF_PHASE1 || '0')

  useEffect(() => {
    fetch('/api/total').then(r => r.json()).then(d => setTotalSouscrit(d.total || 0)).catch(() => {})
  }, [])

  async function handleConfirm() {
    setPaymentLoading(true)
    setPaymentError(null)
    try {
      const sub = await saveSubscription(formData)
      const data = { ...formData, id: sub.id }
      setSavedData(data)
      const res = await fetch('/api/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: data.montant,
          orderId: data.id,
          customer: { email: data.email, prenom: data.prenom, nom: data.nom, adresse: data.adresse, codePostal: data.codePostal, ville: data.ville },
        }),
      })
      const ct = res.headers.get('content-type') || ''
      if (!ct.includes('application/json')) {
        throw new Error(window.location.hostname === 'localhost'
          ? 'Lancez "netlify dev" pour tester le paiement en local.'
          : `Erreur serveur (${res.status})`)
      }
      const json = await res.json()
      if (json.error) throw new Error(json.error)
      setPayzenToken(json.formToken)
      setPhase('krypton')
    } catch (e) {
      setPaymentError(e.message || 'Erreur paiement.')
    } finally {
      setPaymentLoading(false)
    }
  }

  async function handleKryptonSuccess(paymentResult) {
    const sub = {
      ...savedData,
      paymentMode: 'online',
      statut: 'PAYÉ EN LIGNE',
      ...paymentResult,
    }
    await saveSubscription(sub)
    generateBulletin(sub)
    setSavedData(sub)
    setPhase('confirmed')
  }

  function handleRestart() {
    setStep(1)
    setPhase('form')
    setFormData({ type: null, montant: 100 })
    setSavedData(null)
    setPayzenToken(null)
  }

  const leftContent = phase === 'confirmed' ? confirmedContent : stepContent[step - 1]

  return (
    <div
      className="h-screen w-screen overflow-hidden flex flex-col lg:flex-row"
      style={{ backgroundImage: 'url(/bg.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="absolute inset-0 bg-black/25 pointer-events-none" />

      {/* GAUCHE — accroche dynamique */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 relative z-10 p-12 xl:p-16">
        <div>
          <p className="font-display font-bold text-white text-2xl tracking-widest">PROPICE</p>
          <p className="text-white/50 text-[10px] tracking-widest uppercase mt-1">
            Culture · Art · Spectacle · Belle-Île-en-Mer
          </p>
        </div>

        <div key={`${phase}-${step}`} className="space-y-5 step-enter">
          <h1
            className="font-display font-bold text-white leading-[1.05]"
            style={{ fontSize: 'clamp(2.8rem, 4.5vw, 5rem)', whiteSpace: 'pre-line' }}
          >
            {leftContent.title}
          </h1>
          <p className="text-white/65 text-sm font-display font-normal max-w-xs leading-relaxed">
            {leftContent.sub}
          </p>
        </div>

        <div className="space-y-5">
          {objectifTotal > 0 && (() => {
            const montantAffiché = totalSouscrit + (phase === 'form' && step >= 2 ? (formData.montant || 0) : 0)
            const pct = Math.min(100, Math.round(montantAffiché / objectifTotal * 100))
            return (
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20">
                <p className="text-white/50 text-[10px] font-inter uppercase tracking-widest mb-3">Objectif de financement</p>
                <p className="font-display font-bold text-white leading-none mb-1" style={{ fontSize: 'clamp(1.8rem, 2.8vw, 2.5rem)' }}>
                  {montantAffiché.toLocaleString('fr-FR')} €
                </p>
                <p className="text-white/40 text-xs font-inter mb-3">sur {objectifTotal.toLocaleString('fr-FR')} € à réunir</p>
                <div className="w-full h-2.5 bg-white/15 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
                </div>
                <p className="text-white/50 text-[11px] font-inter font-semibold mt-1.5">{pct}% atteint</p>
              </div>
            )
          })()}
          <a href="/admin" className="text-white/25 text-xs hover:text-white/50 transition-colors">Admin</a>
        </div>
      </div>

      {/* DROITE — panneau formulaire */}
      <div
        className="relative z-10 w-full lg:w-1/2 h-full flex flex-col overflow-y-auto bg-white/80 backdrop-blur-2xl border-l border-white/30"
        style={{ boxShadow: '-8px 0 48px rgba(0,0,0,0.18)' }}
      >
        {/* Header mobile */}
        <div className="lg:hidden flex justify-between items-center px-5 py-4 border-b border-black/5">
          <div>
            <p className="font-display font-bold text-[#111111] text-xl tracking-widest">PROPICE</p>
            <p className="text-black/30 text-[10px] tracking-widest uppercase">Belle-Île-en-Mer</p>
          </div>
          <a href="/admin" className="text-black/20 text-xs">Admin</a>
        </div>

        <div className="flex-1 px-8 py-6 lg:px-12 lg:py-8">
          {phase === 'confirmed' && savedData ? (
            <ConfirmationPage data={savedData} onRestart={handleRestart} />
          ) : phase === 'krypton' ? (
            <div className="space-y-6">
              <h2 className="font-display font-bold text-2xl text-[#111111]">PAIEMENT SÉCURISÉ</h2>
              <KryptonForm
                formToken={payzenToken}
                onSuccess={handleKryptonSuccess}
                onError={() => { setPhase('form') }}
                onCancel={() => { setStep(4); setPhase('form') }}
              />
            </div>
          ) : (
            <>
              <StepIndicator currentStep={step} onStepClick={goToStep} />

              {step === 1 && (
                <div className="space-y-5">
                  <h2 className="font-display font-bold text-2xl text-[#111111]">2 MANIÈRES DE NOUS SOUTENIR</h2>
                  <TitreCard selected={formData.type} onSelect={handleTypeSelect} />
                  <button
                    onClick={() => formData.type && setStep(2)}
                    disabled={!formData.type}
                    className="w-full bg-[#111111] text-white font-display font-bold text-base py-4 tracking-widest hover:bg-[#6195a4] transition-colors disabled:opacity-30"
                  >
                    CONTINUER
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-5">
                  <div>
                    <h2 className="font-display font-bold text-2xl text-[#111111]">DÉFINISSEZ LE MONTANT</h2>
                    <p className="text-black/40 text-xs mt-1">
                      {formData.type === 'parts-sociales'
                        ? 'Parts sociales · min. 100 € · tranche de 100 €'
                        : 'Titres participatifs · min. 300 € · tranche de 100 €'}
                    </p>
                  </div>
                  <MontantSelector
                    type={formData.type}
                    montant={formData.montant}
                    onChange={montant => setFormData(d => ({ ...d, montant }))}
                  />
                  <div className="rounded-2xl bg-black/3 border border-black/8 px-4 py-3">
                    <Simulateur type={formData.type} montantControlled={formData.montant} />
                  </div>
                  <button
                    onClick={() => setStep(3)}
                    className="w-full bg-[#111111] text-white font-display font-bold text-base py-4 tracking-widest hover:bg-[#6195a4] transition-colors"
                  >
                    CONTINUER
                  </button>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-5">
                  <h2 className="font-display font-bold text-2xl text-[#111111]">VOS COORDONNÉES</h2>
                  <CoordForm defaultValues={formData} onSubmit={handleStep3Submit} />
                </div>
              )}

              {step === 4 && (
                <div className="space-y-4">
                  <h2 className="font-display font-bold text-2xl text-[#111111]">RÉCAPITULATIF</h2>
                  {paymentError && <p className="text-red-500 text-sm text-center">{paymentError}</p>}
                  <Recapitulatif
                    data={formData}
                    onConfirm={handleConfirm}
                    loading={paymentLoading}
                  />
                </div>
              )}
            </>
          )}

          {phase === 'form' && (
            <footer className="mt-8 pt-4 border-t border-black/5">
              <p className="text-[10px] text-black/25 italic leading-relaxed">
                Ce formulaire recueille votre souscription en qualité de futur sociétaire de PROPICE. Le règlement s&apos;effectue en ligne de manière sécurisée. Vos données personnelles sont utilisées exclusivement dans le cadre de cette démarche de souscription et ne sont transmises à aucun tiers.
              </p>
            </footer>
          )}
        </div>
      </div>
    </div>
  )
}
