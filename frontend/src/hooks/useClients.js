import { useState, useEffect, useCallback } from 'react'
import { clientService } from '../services/clientService'
import toast from 'react-hot-toast'

export function useClients() {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  const fetchClients = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setClients(await clientService.getAll())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const createClient = async (formData) => {
    try {
      const created = await clientService.create(formData)
      setClients((prev) => [...prev, created])   // sin refetch
      toast.success('Cliente registrado exitosamente')
      return true
    } catch (err) {
      toast.error(err.message)
      return false
    }
  }

  useEffect(() => { fetchClients() }, [fetchClients])

  return { clients, loading, error, createClient, refetch: fetchClients }
}