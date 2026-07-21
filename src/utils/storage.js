const STORAGE_KEY = 'propice_souscriptions'
const IS_NETLIFY = typeof window !== 'undefined' && window.location.hostname !== 'localhost'

function shortId() {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

export async function saveSubscription(data) {
  const newSub = {
    ...data,
    id: data.id || shortId(),
    createdAt: data.createdAt || new Date().toISOString(),
    statut: data.statut || 'EN ATTENTE',
    typeCode: data.type === 'parts-sociales' ? 'PS' : 'TP',
    nombreParts: Math.round(data.montant / 100),
  }

  if (IS_NETLIFY) {
    await fetch('/api/save-subscription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newSub),
    })
  } else {
    const subs = getSubscriptionsLocal()
    const idx = subs.findIndex(s => s.id === newSub.id)
    if (idx !== -1) {
      subs[idx] = newSub
    } else {
      subs.push(newSub)
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(subs))
  }

  return newSub
}

function getSubscriptionsLocal() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') } catch { return [] }
}

export function getSubscriptions() {
  return getSubscriptionsLocal()
}

export async function updateSubscriptionStatus(id, statut, pwd) {
  if (IS_NETLIFY) {
    await fetch('/api/update-subscription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, statut, pwd }),
    })
  } else {
    const subs = getSubscriptionsLocal()
    const idx = subs.findIndex(s => s.id === id)
    if (idx !== -1) {
      subs[idx].statut = statut
      localStorage.setItem(STORAGE_KEY, JSON.stringify(subs))
    }
  }
}

export function exportCSV(subs) {
  if (!subs || subs.length === 0) return

  const headers = ['ID', 'Nom', 'Prénom', 'Email', 'Téléphone', 'Type', 'Montant (€)', 'Nombre de parts', 'Date souscription', 'Statut', 'Mode paiement', 'Créé le']
  const rows = subs.map(s => [
    s.id, s.nom, s.prenom, s.email, s.telephone || '',
    s.typeCode, s.montant, s.nombreParts, s.dateSouscription,
    s.statut, s.paymentMode || 'virement', new Date(s.createdAt).toLocaleDateString('fr-FR'),
  ])
  const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n')
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `propice-souscriptions-${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
