import { useEffect, useState } from 'react'
import { useClients } from '../../hooks/useClients'
import { costService } from '../../services/costService'
import { UsersIcon, CurrencyDollarIcon, CalculatorIcon } from '@heroicons/react/24/outline'
import './Dashboard.css'

export default function Dashboard() {
  const { clients, loading: loadingClients } = useClients()
  const [costStats, setCostStats] = useState({ count: 0, total: 0, loading: true })

  useEffect(() => {
    if (loadingClients) return
    if (!clients.length) { setCostStats({ count: 0, total: 0, loading: false }); return }

    Promise.all(clients.map((c) => costService.getByClient(c.id)))
      .then((results) => {
        const all = results.flat()
        setCostStats({
          count: all.length,
          total: all.reduce((sum, c) => sum + c.amount, 0),
          loading: false,
        })
      })
      .catch(() => setCostStats({ count: 0, total: 0, loading: false }))
  }, [clients, loadingClients])

  const stats = [
    { label: 'Total Clientes',     value: loadingClients ? '—' : clients.length,
      icon: UsersIcon,         colorText: 'text-indigo-600', colorBg: 'bg-indigo-50' },
    { label: 'Registros de Costos', value: costStats.loading ? '—' : costStats.count,
      icon: CalculatorIcon,    colorText: 'text-emerald-600', colorBg: 'bg-emerald-50' },
    { label: 'Costo Total',
      value: costStats.loading ? '—' : `$${costStats.total.toLocaleString('es-CR', { minimumFractionDigits: 2 })}`,
      icon: CurrencyDollarIcon, colorText: 'text-amber-600', colorBg: 'bg-amber-50' },
  ]

  return (
    <div className="page">
      <header className="page__header">
        <h1 className="page__title">Dashboard</h1>
        <p className="page__subtitle">Resumen general del sistema</p>
      </header>

      <div className="dashboard__stats">
        {stats.map((s) => (
          <div key={s.label} className="stat-card">
            <div className={`stat-card__icon ${s.colorBg}`}>
              <s.icon className={`w-5 h-5 ${s.colorText}`} />
            </div>
            <div>
              <p className="stat-card__label">{s.label}</p>
              <p className="stat-card__value">{s.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}