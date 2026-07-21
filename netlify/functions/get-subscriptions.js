import { getStore } from '@netlify/blobs'

export default async (req, context) => {
  // Simple password check via query param
  const url = new URL(req.url)
  const pwd = url.searchParams.get('pwd')
  if (pwd !== process.env.ADMIN_PASSWORD) {
    return new Response('Unauthorized', { status: 401 })
  }

  const store = getStore({ name: 'subscriptions', consistency: 'strong' })
  const { blobs } = await store.list()
  const subscriptions = await Promise.all(
    blobs.map(b => store.get(b.key, { type: 'json' }))
  )

  return new Response(JSON.stringify(subscriptions.filter(Boolean)), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}

export const config = { path: '/api/subscriptions' }
