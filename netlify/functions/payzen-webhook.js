import crypto from 'crypto'
import { getStore } from '@netlify/blobs'

export default async (req, context) => {
  const body = await req.text()
  const params = new URLSearchParams(body)

  // Verify HMAC
  const krHash = params.get('kr-hash')
  const krHashKey = params.get('kr-hash-key')
  const hmacKey = krHashKey === 'sha256_hmac'
    ? process.env.PAYZEN_HMAC_KEY
    : process.env.PAYZEN_PASSWORD

  const krAnswer = params.get('kr-answer')
  const expectedHash = crypto.createHmac('sha256', hmacKey).update(krAnswer).digest('hex')

  if (expectedHash !== krHash) {
    return new Response('Invalid signature', { status: 400 })
  }

  const answer = JSON.parse(krAnswer)
  const orderId = answer.orderDetails?.orderId
  const isPaid = answer.orderStatus === 'PAID'
  const transactionId = answer.transactions?.[0]?.uuid
  const paidAt = new Date().toISOString()

  if (orderId && isPaid) {
    try {
      const store = getStore({ name: 'subscriptions', consistency: 'strong' })
      const existing = await store.get(orderId, { type: 'json' })
      if (existing) {
        await store.setJSON(orderId, {
          ...existing,
          statut: 'PAYÉ EN LIGNE',
          paymentTransactionId: transactionId,
          paidAt,
        })
      }
    } catch (e) {
      console.error('Blob update error:', e)
    }
  }

  return new Response('OK', { status: 200 })
}

export const config = { path: '/api/payzen-webhook' }
