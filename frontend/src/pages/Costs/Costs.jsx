import { useState, useEffect } from 'react'
import { useClients } from '../../hooks/useClients'
import { useCosts }   from '../../hooks/useCosts'
import { PlusIcon, ArrowPathIcon, BanknotesIcon } from '@heroicons/react/24/outline'
import './Costs.css'

const EMPTY = { client_id: '', description: '', amount: '' }

export default function Costs() {
  const { clients, loading: loadingClients } = useClients()
  const { costs, loading, createCost, fetchCostsByClient } = useCosts()
  const [form,       setForm]       = useState(EMPTY)
  const [submitting, setSubmitting] = useState(false)

  // Recargar costos al cambiar el cliente seleccionado
  useEffect(() => {
    fetchCostsByClient(form.client_id ? Number(form.client_id) : null)
  }, [form.client_id, fetchCostsByClient])

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    const ok = await createCost({
      client_id:   Number(form.client_id),
      description: form.description,
      amount:      parseFloat(form.amount),
    })
    // Mantener el cliente seleccionado; limpiar solo los campos del costo
    if (ok) setForm((prev) => ({ ...prev, description: '', amount: '' }))
    setSubmitting(false)
  }

  const total = costs.reduce((sum, c) => sum + c.amount, 0)

  return (
    <div className="page">
      <header className="page__header">
        <h1 className="page__title">Costos</h1>
        <p className="page__subtitle">Gestión de costos por cliente</p>
      </header>

      <div className="costs__layout">
        {/* ── Formulario ── */}
        <section className="costs__form-section">
          <h2 className="section-title">Registrar Costo</h2>

          <form onSubmit={handleSubmit} className="costs__form">
            <div className="input-group">
              <label className="input-label" htmlFor="client_id">Cliente</label>
              <select id="client_id" name="client_id" className="input-select"
                      value={form.client_id} onChange={handleChange}
                      disabled={loadingClients} required>
                <option value="">— Seleccionar cliente —</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="description">Descripción</label>
              <textarea id="description" name="description" className="input-textarea"
                        placeholder="Descripción del costo…"
                        value={form.description} onChange={handleChange} required />
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="amount">Monto ($)</label>
              <input id="amount" name="amount" type="number" step="0.01" min="0"
                     className="input-text" placeholder="0.00"
                     value={form.amount} onChange={handleChange} required />
            </div>

            <div className="costs__form-actions">
              <button type="button" className="btn-secondary"
                      onClick={() => setForm(EMPTY)}>
                <ArrowPathIcon className="w-4 h-4" /> Limpiar
              </button>
              <button type="submit" className="btn-primary"
                      disabled={submitting || !form.client_id}>
                <PlusIcon className="w-4 h-4" />
                {submitting ? 'Registrando…' : 'Registrar'}
              </button>
            </div>
          </form>
        </section>

        {/* ── Listado ── */}
        <section className="costs__list-section">
          <div className="costs__list-header">
            <h2 className="section-title">Costos del Cliente</h2>
            {costs.length > 0 && (
              <span className="costs__total-badge">
                Total: ${total.toLocaleString('es-CR', { minimumFractionDigits: 2 })}
              </span>
            )}
          </div>

          {!form.client_id ? (
            <div className="empty-state">
              <BanknotesIcon className="w-8 h-8 text-slate-300" />
              <p>Selecciona un cliente para ver sus costos</p>
            </div>
          ) : loading ? (
            <p className="text-sm text-slate-400 mt-4">Cargando…</p>
          ) : costs.length === 0 ? (
            <div className="empty-state">
              <BanknotesIcon className="w-8 h-8 text-slate-300" />
              <p>Este cliente no tiene costos registrados</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr><th>#</th><th>Descripción</th><th className="text-right">Monto</th></tr>
                </thead>
                <tbody>
                  {costs.map((c) => (
                    <tr key={c.id}>
                      <td className="text-slate-400 w-10">{c.id}</td>
                      <td>{c.description}</td>
                      <td className="text-right font-medium text-emerald-600">
                        ${c.amount.toLocaleString('es-CR', { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}