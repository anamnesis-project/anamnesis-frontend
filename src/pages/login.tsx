import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import imgHide1 from '../assets/olho.jpg'
import imgLogo from '../assets/logo.jpg'
import { getApiUrl } from '../config/api'

export default function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try { 
      const response = await fetch(getApiUrl('/login'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        
        // Tratamento de erro 422 (validação)
        if (response.status === 422 && errorData.message) {
          const validationErrors = Object.entries(errorData.message)
            .map(([field, messages]) => {
              const msgArray = messages as string[]
              return `${field}:\n  - ${msgArray.join('\n  - ')}`
            })
            .join('\n\n')
          throw new Error(validationErrors)
        }
        
        throw new Error(errorData.message || `Error ${response.status}: Login failed`)
      }

      const data = await response.json()
      
      // Salvar token e employee no localStorage
      localStorage.setItem('token', data.token)
      localStorage.setItem('employee', JSON.stringify(data.employee))
      
      // Redirecionar para a lista de pacientes
      navigate('/patients')
    } catch (err: any) {
      console.error('Login error:', err)
      
      // Tratamento especial para "Failed to fetch"
      if (err.message === 'Failed to fetch' || err.name === 'TypeError') {
        setError('Cannot connect to server. Please check:\n1. Backend is running on http://localhost:8080\n2. CORS is enabled on the backend\n3. No firewall/proxy blocking the connection')
      } else {
        setError(err.message || 'Failed to login. Please check your credentials.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-2xl border border-cyan-700 rounded-lg p-8 shadow-md">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src={imgLogo} alt="Logo ANAmnesis" className="h-24" />
        </div>

        {/* Título */}
        <h1 className="text-3xl font-semibold text-cyan-700 text-center mb-1">
          Login to your account
        </h1>

        {/* Subtítulo */}
        <p className="text-center text-[#009fae] mb-6">
          Join us to optimize the hospital care
        </p>

        {/* Mensagem de erro */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md whitespace-pre-line">
            {error}
          </div>
        )}

        {/* Formulário */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Email */}
          <div>
            <label className="block text-[#009fae] text-lg mb-1">Email:</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="w-full px-4 py-2 border-2 border-[#0077b1] rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400 disabled:opacity-50"
            />
          </div>

          {/* Senha */}
          <div className="relative">
            <label className="block text-[#009fae] text-lg mb-1">Password:</label>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className="w-full px-4 py-2 border-2 border-[#0077b1] rounded-md pr-10 focus:outline-none focus:ring-2 focus:ring-cyan-400 disabled:opacity-50"
            />
            <img
              src={imgHide1}
              alt="Show/hide password"
              className="absolute right-3 top-10 w-5 h-5 cursor-pointer"
              onClick={() => setShowPassword(prev => !prev)}
            />
          </div>

          {/* Botão */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0077b1] text-white py-3 rounded-md text-lg hover:bg-cyan-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : 'Login'}
          </button>
        </form>

        {/* Link de registro */}
        <p className="text-center text-[#009fae] mt-6">
          Does not have an account?{' '}
          <Link to="/register" className="underline text-[#0077b1] hover:text-cyan-800">
             Register
          </Link>
        </p>
      </div>
    </div>
  )
}
