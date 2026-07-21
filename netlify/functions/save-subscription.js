import { getStore } from '@netlify/blobs'

export default async (req, context) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 })

  const subscription = await req.json()
  const store = getStore({ name: 'subscriptions', consistency: 'strong' })
  await store.setJSON(subscription.id, subscription)

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}

export const config = { path: '/api/save-subscription' }
