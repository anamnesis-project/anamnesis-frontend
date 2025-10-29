// Configuração da API
// Usando proxy do Vite: requisições começam com /api
export const API_BASE_URL = '/api'

// Helper para construir URLs completas
export const getApiUrl = (endpoint: string) => {
  return `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`
}
