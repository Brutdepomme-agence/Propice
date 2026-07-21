import { useState, useEffect } from 'react'
import { getSubscriptions, updateSubscriptionStatus, exportCSV } from '../utils/storage'
import { generateBulletin } from '../utils/generatePDF'

const STATUTS = ['EN ATTENTE', 'BULLETIN REÇU', 'VIREMENT REÇU', 'PAYÉ EN LIGNE']
const statutColors = {
  'EN ATTENTE': 'bg-yellow-100 text-yellow-800',
  'BULLETIN REÇU': 'bg-blue-100 text-blue-800',
  'VIREMENT REÇU': 'bg-green-100 text-green-800',
  'PAYÉ EN LIGNE': 'bg-[#6195a4]/20 text-[#6195a4]',
}

const IS_NETLIFY = typeof window !== 'undefined' && window.location.hostname !== 'localhost'

export default function Admin() {
  const [authed, setAuthed] = useState(false)
  const [pwd, setPwd] = useState('')
  const [error, setError] = useState('')
  const [subs, setSubs] = useState([])
  const PASS = import.meta.env.VITE_ADMIN_PASSWORD || 'changeme'
  const objectifTotal = parseInt(import.meta.env.VITE_OBJECTIF_TOTAL || '0')

  useEffect(() => {
    if (sessionStorage.getItem('propice_admin') === 'ok') {
      setAuthed(true)
      loadSubs()
    }
  }, [])

  function loadSubs() {
    if (IS_NETLIFY) {
      const storedPwd = sessionStorage.getItem('propice_admin_pwd')
      fetch(`/api/subscriptions?pwd=${encodeURIComponent(storedPwd)}`)
        .then(r => r.json())
        .then(setSubs)
        .catch(() => setSubs([]))
    } else {
      setSubs(getSubscriptions())
    }
  }

  function handleLogin(e) {
    e.preventDefault()
    if (pwd === PASS) {
      sessionStorage.setItem('propice_admin', 'ok')
      sessionStorage.setItem('propice_admin_pwd', pwd)
      setAuthed(true)
      loadSubs()
    } else {
      setError('Mot de passe incorrect')
    }
  }

  async function handleStatutClick(id, currentStatut) {
    const idx = STATUTS.indexOf(currentStatut)
    const next = STATUTS[(idx + 1) % STATUTS.length]
    const storedPwd = sessionStorage.getItem('propice_admin_pwd')
    await updateSubscriptionStatus(id, next, storedPwd)
    setSubs(prev => prev.map(s => s.id === id ? { ...s, statut: next } : s))
  }

  function handleLogout() {
    sessionStorage.removeItem('propice_admin')
    sessionStorage.removeItem('propice_admin_pwd')
    setAuthed(false)
  }

  const totalSouscrit = subs.reduce((acc, s) => acc + (s.montant || 0), 0)
  const totalPS = subs.filter(s => s.typeCode === 'PS').reduce((acc, s) => acc + (s.montant || 0), 0)
  const totalTP = subs.filter(s => s.typeCode === 'TP').reduce((acc, s) => acc + (s.montant || 0), 0)
  const progressPct = objectifTotal > 0 ? Math.min(100, Math.round((totalSouscrit / objectifTotal) * 100)) : 0

  if (!authed) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="w-full max-w-sm space-y-6">
          <h1 className="font-display text-4xl text-[#111111]">ESPACE ADMIN</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="font-display text-xs tracking-widest uppercase text-[#111111]">Mot de passe</label>
              <input
                type="password"
                value={pwd}
                onChange={e => setPwd(e.target.value)}
                className="w-full bg-transparent border-b-2 border-[#111111] py-2 font-inter text-sm outline-none focus:border-[#6195a4]"
              />
            </div>
            {error && <p className="text-red-600 text-xs font-inter">{error}</p>}
            <button
              type="submit"
              className="w-full bg-[#111111] text-white font-display text-lg py-4 tracking-widest hover:bg-[#6195a4] transition-colors"
            >
              ACCÉDER
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b-2 border-[#111111] py-4 px-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="font-display text-2xl text-[#111111]">PROPICE — ADMIN SOUSCRIPTIONS</h1>
            <p className="font-inter text-xs text-gray-500">{subs.length} souscripteur{subs.length !== 1 ? 's' : ''}</p>
          </div>
          <button onClick={handleLogout} className="font-display text-sm text-gray-400 hover:text-[#111111]">
            DÉCONNEXION
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Stats banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            ['TOTAL SOUSCRIT', `${totalSouscrit.toLocaleString('fr-FR')} €`],
            ['PARTS SOCIALES', `${totalPS.toLocaleString('fr-FR')} €`],
            ['TITRES PARTICIPATIFS', `${totalTP.toLocaleString('fr-FR')} €`],
            ['SOUSCRIPTEURS', subs.length],
          ].map(([label, value]) => (
            <div key={label} className="border-2 border-[#111111] p-4">
              <p className="font-display text-xs tracking-widest text-gray-500">{label}</p>
              <p className="font-display text-3xl text-[#111111]">{value}</p>
            </div>
          ))}
        </div>

        {objectifTotal > 0 && (
          <div>
            <div className="flex justify-between text-xs text-gray-500 mb-1 font-inter">
              <span>{totalSouscrit.toLocaleString('fr-FR')} € / {objectifTotal.toLocaleString('fr-FR')} €</span>
              <span>{progressPct}%</span>
            </div>
            <div className="w-full h-3 bg-gray-100 border border-gray-200">
              <div className="h-3 bg-[#6195a4] transition-all" style={{ width: `${progressPct}%` }} />
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <button
            onClick={() => exportCSV(subs)}
            className="border-2 border-[#111111] font-display text-sm px-6 py-2 tracking-widest hover:bg-[#111111] hover:text-white transition-colors"
          >
            EXPORTER LES DONNÉES
          </button>
        </div>

        {subs.length === 0 ? (
          <p className="font-inter text-sm text-gray-500 text-center py-12">Aucune souscription enregistrée.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-inter border-collapse">
              <thead>
                <tr className="border-b-2 border-[#111111]">
                  {['Nom', 'Email', 'Type', 'Montant', 'Parts', 'Date', 'Statut', 'PDF'].map(h => (
                    <th key={h} className="font-display tracking-wide text-left py-3 px-2 text-gray-500 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {subs.map(s => (
                  <tr key={s.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-2 font-medium">{s.nom} {s.prenom}</td>
                    <td className="py-3 px-2 text-gray-600">{s.email}</td>
                    <td className="py-3 px-2">
                      <span className={`font-display text-xs px-2 py-1 ${s.typeCode === 'PS' ? 'bg-[#111111] text-white' : 'bg-[#6195a4] text-white'}`}>
                        {s.typeCode}
                      </span>
                    </td>
                    <td className="py-3 px-2 font-medium">{s.montant?.toLocaleString('fr-FR')} €</td>
                    <td className="py-3 px-2">{s.nombreParts}</td>
                    <td className="py-3 px-2 text-gray-600 whitespace-nowrap">{s.dateSouscription}</td>
                    <td className="py-3 px-2">
                      <button
                        onClick={() => handleStatutClick(s.id, s.statut)}
                        className={`text-xs font-display px-2 py-1 tracking-wide cursor-pointer ${statutColors[s.statut] || 'bg-gray-100 text-gray-600'}`}
                        title="Cliquer pour changer le statut"
                      >
                        {s.statut}
                      </button>
                    </td>
                    <td className="py-3 px-2">
                      <button
                        onClick={() => generateBulletin(s)}
                        className="font-display text-xs border border-[#111111] px-2 py-1 hover:bg-[#111111] hover:text-white transition-colors"
                      >
                        PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}
