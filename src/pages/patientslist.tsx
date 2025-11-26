import { useState, useEffect } from 'react'
import { FiSearch } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import BackButton from "../components/buttonback"
import { getApiUrl } from '../config/api'

type Patient = {
  id: number
  patient: {
    id: number
    name: string
    cpf: string
    dateOfBirth: string
    sex: 'M' | 'F'
  }
  weight: number
  height: number
  heartRate: number
  systolicPressure: number
  diastolicPressure: number
  temperature: number
  oxygenSaturation: number
  interview: Array<{
    question: string
    answer: string
  }>
  occupation: string
  medications: string[]
  allergies: string[]
  diseases: string[]
  issuedAt: string
  urgency: string
  consultation?: {
    doctorId: number
    consultationDate: string
  }
}

export default function Patients() {
  const [search, setSearch] = useState('')
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const token = localStorage.getItem('token')
        
        if (!token) {
          navigate('/login')
          return
        }

        const response = await fetch(getApiUrl('/reports'), {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'ngrok-skip-browser-warning': 'true'
          },
        })

        if (response.status === 401) {
          // Token inválido ou expirado
          localStorage.removeItem('token')
          localStorage.removeItem('employee')
          navigate('/login')
          return
        }

        if (!response.ok) {
          const contentType = response.headers.get('content-type')
          let errorMessage = `Error ${response.status}: Failed to fetch patients`
          
          if (contentType?.includes('application/json')) {
            const errorData = await response.json()
            errorMessage = errorData.message || errorMessage
          } else {
            const text = await response.text()
            console.error('HTML Response received:', text)
            errorMessage = `Server returned HTML (${response.status}). Check backend is running correctly.`
          }
          throw new Error(errorMessage)
        }

        const contentType = response.headers.get('content-type')
        if (!contentType?.includes('application/json')) {
          const text = await response.text()
          console.error('❌ Unexpected response type:', {
            contentType,
            statusCode: response.status,
            responseText: text.substring(0, 500),
            fullUrl: getApiUrl('/reports')
          })
          throw new Error('Server returned non-JSON response. Check backend URL and CORS settings.')
        }

        const data = await response.json()
        console.log('✅ Patients loaded:', data)
        setPatients(data)
      } catch (err: any) {
        console.error('Fetch patients error:', err)
        
        if (err.message === 'Failed to fetch' || err.name === 'TypeError') {
          setError('Cannot connect to server. Please check:\n1. Backend is running\n2. CORS/Proxy is configured')
        } else {
          setError(err.message || 'Failed to load patients')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchPatients()
  }, [navigate])

  // Filtrar apenas pacientes SEM consultation e remover duplicatas por patient.id
  const filtered = patients
    .filter(p => !p.consultation) // Sem consultation
    .filter((p, index, self) => 
      self.findIndex(item => item.patient.id === p.patient.id) === index // Remove duplicatas
    )
    .filter(p =>
      p.patient.name.toLowerCase().includes(search.toLowerCase())
    )

  return (

    
    <div className="min-h-screen bg-white p-6">
            {/* Header */}
            <BackButton />

            <div className="mb-6 text-center">
        <h1 className="text-3xl font-semibold text-[#0077B1]">Patients waiting for treatment</h1>
    </div>

<div className="flex justify-end items-center mb-6">
  <button 
    onClick={() => navigate('/authorize-employees')}
    className="bg-[#0077B1] text-white px-4 py-2 rounded-md hover:bg-[#005a8c] transition"
  >
    Authorize employee
  </button>
  <div className="bg-[#0077B1] text-white w-8 h-8 flex items-center justify-center rounded-full font-bold ml-2">
    A
  </div>
</div>


      {/* Search input */}
      <div className="flex justify-center mb-6">
  <div className="relative w-full max-w-lg">
    <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
    <input
      type="text"
      placeholder="Search patient..."
      value={search}
      onChange={e => setSearch(e.target.value)}
      className="w-full pl-10 pr-4 py-2 rounded-full border border-[#0077B1] bg-[#e6f7ff] text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#0077B1]"
    />
  </div>
</div>

      {/* Loading / Error / Empty states */}
      <div className="space-y-4 max-w-4xl mx-auto">
        {loading && <div className="text-center text-gray-600">Loading patients...</div>}
        {error && (
          <div className="text-center text-red-600 whitespace-pre-line bg-red-50 p-4 rounded-lg">
            {error}
          </div>
        )}
        {!loading && !error && filtered.length === 0 && (
          <div className="text-center text-gray-600">
            {patients.length === 0 ? 'No patients found' : 'No patients match your search'}
          </div>
        )}

        {/* Patient list */}
        {!loading && !error && filtered.map((report) => (
          <div
            key={report.id}
            onClick={() => navigate(`/patients/${report.patient.id}/history`)}
            className="flex items-start bg-[#0077B1] text-white p-4 rounded-lg shadow-sm gap-3 cursor-pointer hover:bg-[#005a8c] transition"
          >
            <div className="flex-1">
              <h2 className="font-semibold text-lg">{report.patient.id}-{report.patient.name}</h2>
              <p className="text-sm opacity-90">
                Birth: { report.patient.dateOfBirth ? new Date(report.patient.dateOfBirth).toLocaleDateString() : "N/A" } |
                Sex: { report.patient.sex ? report.patient.sex : "N/A"} |
                Temperature: { report.temperature ? `${report.temperature} °C` : "N/A" } |
                Oxygenation: { report.oxygenSaturation ? `${report.oxygenSaturation} %` : "N/A" } |
                Blood pressure: { report.systolicPressure && report.diastolicPressure ? `${report.systolicPressure}/${report.diastolicPressure}` : "N/A" } 
              </p>
            </div>
            <div className="text-sm opacity-75">→</div>
          </div>
        ))}
      </div>
    </div>
  )
}
