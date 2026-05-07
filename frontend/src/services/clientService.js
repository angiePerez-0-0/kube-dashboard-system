import api from './api'

// POST /clients/  →  { name, email }
// GET  /clients/  →  ClientResponse[]

export const clientService = {
  getAll:  ()     => api.get('/clients/').then((r) => r.data),
  create:  (data) => api.post('/clients/', data).then((r) => r.data),
}