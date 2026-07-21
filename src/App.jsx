import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Formulaire from './pages/Formulaire'
import Admin from './pages/Admin'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Formulaire />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  )
}
