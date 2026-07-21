import { getStore } from '@netlify/blobs'

export default async (req, context) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 })

  const { id, statut, pwd } = await req.json()
  if (pwd !== process.env.ADMIN_PASSWORD) {
    return new Response('Unauthorized', { status: 401 })
  }

  const store = getStore({ name: 'subscriptions', consistency: 'strong' })
  const existing = await store.get(id, { type: 'json' })
  if (!existing) return new Response('Not found', { status: 404 })

  await store.setJSON(id, { ...existing, statut })
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}

export const config = { path: '/api/update-subscription' }
