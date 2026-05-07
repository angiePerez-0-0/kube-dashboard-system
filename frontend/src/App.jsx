import { Routes, Route, Navigate } from 'react-router-dom'
import Layout    from './components/Layout/Layout'
import Dashboard from './pages/Dashboard/Dashboard'
import Clients   from './pages/Clients/Clients'
import Costs     from './pages/Costs/Costs'

export default function App() {
  return (
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="clients"   element={<Clients />} />
          <Route path="costs"     element={<Costs />} />
        </Route>
      </Routes>
  )
}