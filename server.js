import express from 'express'
import { createServer } from 'http'
import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import crypto from 'crypto'

const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// --- Storage JSON sur disque ---
const DATA_DIR = process.env.DATA_DIR || __dirname
const DB_PATH = join(DATA_DIR, 'subscriptions.json')

function readDB() {
  if (!existsSync(DB_PATH)) return {}
  try { return JSON.parse(readFileSync(DB_PATH, 'utf8')) } catch { return {} }
}

function writeDB(data) {
  writeFileSync(DB_PATH, JSON.stringify(data, null, 2))
}

// --- API routes ---

app.post('/api/save-subscription', (req, res) => {
  const sub = req.body
  if (!sub?.id) return res.status(400).json({ error: 'Missing id' })
  const db = readDB()
  db[sub.id] = sub
  writeDB(db)
  res.json({ ok: true })
})

app.get('/api/total', (req, res) => {
  const db = readDB()
  const initial = parseInt(process.env.MONTANT_INITIAL || '0')
  const total = initial + Object.values(db).reduce((acc, s) => acc + (s.montant || 0), 0)
  res.json({ total })
})

app.get('/api/subscriptions', (req, res) => {
  if (req.query.pwd !== process.env.ADMIN_PASSWORD) return res.status(401).send('Unauthorized')
  const db = readDB()
  res.json(Object.values(db))
})

app.post('/api/update-subscription', (req, res) => {
  const { id, statut, pwd } = req.body
  if (pwd !== process.env.ADMIN_PASSWORD) return res.status(401).send('Unauthorized')
  const db = readDB()
  if (!db[id]) return res.status(404).send('Not found')
  db[id] = { ...db[id], statut }
  writeDB(db)
  res.json({ ok: true })
})

app.post('/api/delete-subscription', (req, res) => {
  const { id, pwd } = req.body
  if (pwd !== process.env.ADMIN_PASSWORD) return res.status(401).send('Unauthorized')
  const db = readDB()
  delete db[id]
  writeDB(db)
  res.json({ ok: true })
})

app.post('/api/create-payment', async (req, res) => {
  const { amount, orderId, customer } = req.body
  const shopId = process.env.PAYZEN_SHOP_ID
  const password = process.env.PAYZEN_PASSWORD
  const credentials = Buffer.from(`${shopId}:${password}`).toString('base64')

  const body = {
    amount: amount * 100,
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

  try {
    const response = await fetch('https://api.payzen.eu/api-payment/V4/Charge/CreatePayment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Basic ${credentials}` },
      body: JSON.stringify(body),
    })
    const data = await response.json()
    if (data.status !== 'SUCCESS') {
      return res.status(500).json({ error: data.answer?.errorMessage || 'PayZen error' })
    }
    res.json({ formToken: data.answer.formToken })
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

app.post('/api/payzen-webhook', express.text({ type: '*/*' }), (req, res) => {
  const params = new URLSearchParams(req.body)
  const krHash = params.get('kr-hash')
  const krHashKey = params.get('kr-hash-key')
  const hmacKey = krHashKey === 'sha256_hmac' ? process.env.PAYZEN_HMAC_KEY : process.env.PAYZEN_PASSWORD
  const krAnswer = params.get('kr-answer')
  const expectedHash = crypto.createHmac('sha256', hmacKey).update(krAnswer).digest('hex')

  if (expectedHash !== krHash) return res.status(400).send('Invalid signature')

  const answer = JSON.parse(krAnswer)
  const orderId = answer.orderDetails?.orderId
  const isPaid = answer.orderStatus === 'PAID'
  const transactionId = answer.transactions?.[0]?.uuid
  const paidAt = new Date().toISOString()

  if (orderId && isPaid) {
    const db = readDB()
    if (db[orderId]) {
      db[orderId] = { ...db[orderId], statut: 'PAYÉ EN LIGNE', paymentTransactionId: transactionId, paidAt }
      writeDB(db)
    }
  }
  res.send('OK')
})

// --- Serveur statique (fichiers buildés par Vite) ---
app.use(express.static(join(__dirname, 'dist')))
app.get('/{*splat}', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'))
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
