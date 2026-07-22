import { getStore } from '@netlify/blobs'

export default async (req, context) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 })

  const { id, pwd } = await req.json()
  if (pwd !== process.env.ADMIN_PASSWORD) return new Response('Unauthorized', { status: 401 })

  const store = getStore({ name: 'subscriptions', consistency: 'strong' })
  await store.delete(id)

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}

export const config = { path: '/api/delete-subscription' }
