import { useState } from 'react'
import { useClients } from '../../hooks/useClients'
import { PlusIcon, ArrowPathIcon, UserIcon } from '@heroicons/react/24/outline'
import './Clients.css'

const EMPTY = { name: '', email: '' }

export default function Clients() {
  const { clients, loading, createClient } = useClients()
  const [form,       setForm]       = useState(EMPTY)
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    const ok = await createClient(form)
    if (ok) setForm(EMPTY)
    setSubmitting(false)
  }

  return (
    <div className="page">
      <header className="page__header">
        <h1 className="page__title">Clientes</h1>
        <p className="page__subtitle">Gestión de clientes registrados</p>
      </header>

      <div className="clients__layout">
        {/* ── Formulario ── */}
        <section className="clients__form-section">
          <h2 className="section-title">Nuevo Cliente</h2>

          <form onSubmit={handleSubmit} className="clients__form">
            <div className="input-group">
              <label className="input-label" htmlFor="name">Nombre</label>
              <input id="name" name="name" type="text" className="input-text"
                     placeholder="Juan Pérez" value={form.name}
                     onChange={handleChange} required />
            </div>

            <div className="input-group">
              <label className="input-label" htmlFor="email">Correo electrónico</label>
              <input id="email" name="email" type="email" className="input-text"
                     placeholder="juan@ejemplo.com" value={form.email}
                     onChange={handleChange} required />
            </div>

            <div className="clients__form-actions">
              <button type="button" className="btn-secondary" onClick={() => setForm(EMPTY)}>
                <ArrowPathIcon className="w-4 h-4" /> Limpiar
              </button>
              <button type="submit" className="btn-primary" disabled={submitting}>
                <PlusIcon className="w-4 h-4" />
                {submitting ? 'Registrando…' : 'Registrar'}
              </button>
            </div>
          </form>
        </section>

        {/* ── Listado ── */}
        <section className="clients__list-section">
          <h2 className="section-title">Listado de Clientes</h2>

          {loading ? (
            <p className="text-sm text-slate-400 mt-4">Cargando…</p>
          ) : clients.length === 0 ? (
            <div className="empty-state">
              <UserIcon className="w-8 h-8 text-slate-300" />
              <p>No hay clientes registrados</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr><th>#</th><th>Nombre</th><th>Correo</th></tr>
                </thead>
                <tbody>
                  {clients.map((c) => (
                    <tr key={c.id}>
                      <td className="text-slate-400 w-10">{c.id}</td>
                      <td className="font-medium">{c.name}</td>
                      <td className="text-slate-500">{c.email}</td>
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