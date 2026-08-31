import { jsPDF } from 'jspdf'

export function generateBulletin(data) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const W = 210
  const margin = 20
  const contentW = W - margin * 2
  let y = 20

  const IBAN = import.meta.env.VITE_IBAN || 'FR76 XXXX XXXX XXXX XXXX XXXX XXX'
  const EMAIL = import.meta.env.VITE_EMAIL_CONTACT || 'contact@propice.bzh'

  const typeLabel = data.type === 'parts-sociales' ? 'PARTS SOCIALES' : 'TITRES PARTICIPATIFS'
  const refDate = data.dateSouscription.replace(/-/g, '')
  const reference = `${data.nom.toUpperCase()}-${refDate}-${data.type === 'parts-sociales' ? 'PS' : 'TP'}`
  const nombreParts = Math.round(data.montant / 100)

  function line(x1, y1, x2, y2) {
    doc.setDrawColor(17, 17, 17)
    doc.setLineWidth(0.5)
    doc.line(x1, y1, x2, y2)
  }

  function section(title) {
    line(margin, y, W - margin, y)
    y += 5
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.text(title, margin, y)
    y += 6
    doc.setFont('helvetica', 'normal')
  }

  function row(label, value) {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.text(label, margin, y)
    doc.setFont('helvetica', 'normal')
    doc.text(String(value), margin + 45, y)
    y += 6
  }

  // Header
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(18)
  doc.text('PROPICE — TIERS LIEU INSULAIRE', margin, y)
  y += 8
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.text('Belle-Île-en-Mer · Haute Boulogne · 56360 Le Palais', margin, y)
  y += 5
  doc.text(EMAIL, margin, y)
  y += 8

  line(margin, y, W - margin, y)
  y += 6

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(14)
  doc.text('BULLETIN DE SOUSCRIPTION', margin, y)
  y += 7
  doc.setFontSize(11)
  doc.text(typeLabel, margin, y)
  y += 8

  section('SOUSCRIPTEUR')
  row('Nom :', data.nom)
  row('Prénom :', data.prenom)
  row('Adresse :', data.adresse)
  row('Code postal :', data.codePostal)
  row('Ville :', data.ville)
  row('Email :', data.email)
  if (data.telephone) row('Téléphone :', data.telephone)
  row('Date :', data.dateSouscription)
  y += 2

  section('SOUSCRIPTION')
  row('Type :', data.type === 'parts-sociales' ? 'Parts sociales' : 'Titres participatifs')
  row('Nombre :', `${nombreParts} ${data.type === 'parts-sociales' ? 'part(s) sociale(s)' : 'titre(s) participatif(s)'}`)
  row('Montant :', `${data.montant.toLocaleString('fr-FR')} €`)
  y += 2

  section('MODALITÉS DE RÈGLEMENT')
  if (data.paymentMode === 'online') {
    row('Mode :', 'Paiement en ligne sécurisé')
    row('Statut :', 'PAYÉ')
    if (data.paidAt) {
      row('Date de paiement :', new Date(data.paidAt).toLocaleDateString('fr-FR'))
    }
    if (data.transactionId) {
      row('Référence transaction :', data.transactionId)
    }
  } else {
    row('Titulaire :', 'PROPICE')
    row('IBAN :', IBAN)
    row('Référence :', reference)
    row('Règlement :', 'par virement bancaire uniquement')
  }
  y += 2

  line(margin, y, W - margin, y)
  y += 6
  doc.setFontSize(9)
  doc.setFont('helvetica', 'italic')
  const instructionText = `Pour toute question, contactez-nous à ${EMAIL}.`
  const splitInstruction = doc.splitTextToSize(instructionText, contentW)
  doc.text(splitInstruction, margin, y)
  y += splitInstruction.length * 5 + 4
  doc.setFont('helvetica', 'normal')

  line(margin, y, W - margin, y)
  y += 5
  doc.setFontSize(8)
  doc.setTextColor(100, 100, 100)
  doc.text(`Document généré le ${new Date().toLocaleDateString('fr-FR')} — Réf. ${data.id || '------'}`, margin, y)
  y += 5
  doc.setFont('helvetica', 'italic')
  const legal = 'Vos données personnelles sont utilisées exclusivement dans le cadre de cette démarche de souscription et ne sont transmises à aucun tiers.'
  const splitLegal = doc.splitTextToSize(legal, contentW)
  doc.text(splitLegal, margin, y)

  const filename = `bulletin-propice-${data.nom.toLowerCase()}-${refDate}.pdf`
  doc.save(filename)
  return filename
}
