import { generateBulletin } from '../utils/generatePDF'

export default function ConfirmationPage({ data, onRestart }) {
  const typeLabel = data.type === 'parts-sociales' ? 'Parts sociales' : 'Titres participatifs'
  const typeCode = data.type === 'parts-sociales' ? 'PS' : 'TP'
  const refDate = data.dateSouscription.replace(/-/g, '')
  const reference = `${data.nom.toUpperCase()}-${refDate}-${typeCode}`
  const EMAIL = import.meta.env.VITE_EMAIL_CONTACT || 'contact@propice.bzh'
  const IBAN = import.meta.env.VITE_IBAN || 'FR76 XXXX XXXX XXXX XXXX XXXX XXX'

  function handleDownload() {
    generateBulletin(data)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-5xl text-[#111111]">MERCI {data.prenom.toUpperCase()}.</h1>
        <p className="font-inter text-gray-600 mt-2">Votre souscription a bien été enregistrée.</p>
      </div>

      <div className="border-2 border-[#111111] divide-y divide-gray-200">
        {[
          ['Type', typeLabel],
          ['Montant', `${data.montant.toLocaleString('fr-FR')} €`],
          ['Date', data.dateSouscription],
        ].map(([label, value]) => (
          <div key={label} className="flex justify-between px-4 py-3">
            <span className="font-display text-sm tracking-wide text-gray-500 uppercase">{label}</span>
            <span className="font-inter text-sm text-[#111111] font-medium">{value}</span>
          </div>
        ))}
      </div>

      <div className="bg-white/10 border border-[#6195a4] p-5 space-y-2">
        <h3 className="font-display text-lg text-[#6195a4] tracking-wide">INSTRUCTIONS DE VIREMENT</h3>
        <div className="font-inter text-sm text-[#111111] space-y-1">
          <p><strong>Titulaire :</strong> PROPICE</p>
          <p><strong>IBAN :</strong> {IBAN}</p>
          <p><strong>Référence :</strong> {reference}</p>
        </div>
      </div>

      <p className="font-inter text-sm text-gray-600">
        Votre bulletin PDF a été téléchargé. Signez-le et renvoyez-le à{' '}
        <a href={`mailto:${EMAIL}`} className="text-[#6195a4] underline">{EMAIL}</a>{' '}
        avec votre justificatif de virement.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleDownload}
          className="flex-1 border-2 border-[#111111] text-[#111111] font-display text-sm py-3 tracking-widest hover:bg-[#111111] hover:text-white transition-colors"
        >
          TÉLÉCHARGER À NOUVEAU LE BULLETIN
        </button>
        <button
          onClick={onRestart}
          className="flex-1 bg-[#111111] text-white font-display text-sm py-3 tracking-widest hover:bg-[#6195a4] transition-colors"
        >
          NOUVELLE SOUSCRIPTION
        </button>
      </div>
    </div>
  )
}
