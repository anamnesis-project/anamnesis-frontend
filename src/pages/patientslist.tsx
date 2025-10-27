import { useState } from 'react'
import { FiSearch } from 'react-icons/fi'
import BackButton from "../components/buttonback"

type Patient = {
  name: string
  temperature: string
  oxygenation: string
  pressure: string
  critical: boolean
}

const mockPatients: Patient[] = [
  { name: 'Patient 1', temperature: '37.5', oxygenation: '90%', pressure: '12,8', critical: false },
  { name: 'Patient 2', temperature: '38.5', oxygenation: '80%', pressure: '12,8', critical: true },
  { name: 'Patient 3', temperature: '37.5', oxygenation: '90%', pressure: '12,8', critical: false },
  { name: 'Patient 4', temperature: '37.5', oxygenation: '90%', pressure: '9,2', critical: true },
  { name: 'Patient 5', temperature: '37.5', oxygenation: '90%', pressure: '12,8', critical: false },
  { name: 'Patient 6', temperature: '37.5', oxygenation: '90%', pressure: '12,8', critical: false },
]

export default function Patients() {
  const [search, setSearch] = useState('')

  const filtered = mockPatients.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  return (

    
    <div className="min-h-screen bg-white p-6">
            {/* Header */}
            <BackButton />

            <div className="mb-6 text-center">
        <h1 className="text-3xl font-semibold text-[#0077B1]">Patients waiting for treatment</h1>
    </div>

<div className="flex justify-end items-center mb-6">
  <button className="bg-[#0077B1] text-white px-4 py-2 rounded-md hover:bg-[#0077B1] transition">
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

      {/* Patient list */}
      <div className="space-y-4 max-w-4xl mx-auto">
        {filtered.map((p, i) => (
          <div
            key={i}
            className="flex items-start bg-[#0077B1] text-white p-4 rounded-lg shadow-sm gap-3"
          >
            <div
              className={`w-3 h-3 mt-1 rounded-full ${
                p.critical ? 'bg-red-600' : 'bg-teal-400'
              }`}
            />
            <div>
              <h2 className="font-semibold">{p.name}</h2>
              <p className="text-sm">
                Temperature: {p.temperature}°C, Oxygenation: {p.oxygenation}, Blood pressure: {p.pressure}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
