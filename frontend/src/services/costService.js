import api from './api'

// POST /costs/             →  { client_id, description, amount }
// GET  /costs/{client_id}  →  CostResponse[]

export const costService = {
  getByClient: (clientId) => api.get(`/costs/${clientId}`).then((r) => r.data),
  create:      (data)     => api.post('/costs/', data).then((r) => r.data),
}