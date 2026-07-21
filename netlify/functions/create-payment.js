export default async (req, context) => {
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 })

  const { amount, orderId, customer } = await req.json()

  const shopId = process.env.PAYZEN_SHOP_ID
  const password = process.env.PAYZEN_PASSWORD
  const credentials = Buffer.from(`${shopId}:${password}`).toString('base64')

  const body = {
    amount: amount * 100, // PayZen uses cents
    currency: 'EUR',
    orderId,
    customer: {
      email: customer.email,
      billingDetails: {
        firstName: customer.prenom,
        lastName: customer.nom,
        address: customer.adresse,
        zipCode: customer.codePostal,
        city: customer.ville,
        country: 'FR',
      }
    }
  }

  const response = await fetch('https://api.payzen.eu/api-payment/V4/Charge/CreatePayment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Basic ${credentials}`,
    },
    body: JSON.stringify(body),
  })

  const data = await response.json()

  if (data.status !== 'SUCCESS') {
    return new Response(JSON.stringify({ error: data.answer?.errorMessage || 'PayZen error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  return new Response(JSON.stringify({ formToken: data.answer.formToken }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  })
}

export const config = { path: '/api/create-payment' }
