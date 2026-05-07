import { useState, useCallback } from 'react'
import { costService } from '../services/costService'
import toast from 'react-hot-toast'

export function useCosts() {
  const [costs,   setCosts]   = useState([])
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  const fetchCostsByClient = useCallback(async (clientId) => {
    if (!clientId) { setCosts([]); return }
    setLoading(true)
    setError(null)
    try {
      setCosts(await costService.getByClient(clientId))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const createCost = async (formData) => {
    try {
      const created = await costService.create(formData)
      setCosts((prev) => [...prev, created])
      toast.success('Costo registrado exitosamente')
      return true
    } catch (err) {
      toast.error(err.message)
      return false
    }
  }

  return { costs, loading, error, fetchCostsByClient, createCost }
}