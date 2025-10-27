import { FaHome } from 'react-icons/fa'
import BackButton from "../components/buttonback"
const triagens = [
  { date: '03/10/2025', color: 'bg-cyan-600', temperature: '37.5', oxygen: '90%', pressure: '12,8' },
  { date: '10/08/2025', color: 'bg-red-600', temperature: '38.5', oxygen: '80%', pressure: '12,8' },
  { date: '30/04/2025', color: 'bg-cyan-600', temperature: '37.5', oxygen: '90%', pressure: '12,8' },
  { date: '28/12/2024', color: 'bg-red-600', temperature: '37.5', oxygen: '90%', pressure: '9,2' },
  { date: '30/10/2024', color: 'bg-cyan-600', temperature: '37.5', oxygen: '90%', pressure: '12,8' },
  { date: '15/05/2024', color: 'bg-cyan-600', temperature: '37.5', oxygen: '90%', pressure: '12,8' },
]

export default function PatientHistory() {
  return (
    <div className="min-h-screen bg-white p-6">
      {/* Header */}

      <div className="flex items-center justify-between mb-6 px-4">
  {/* Esquerda: Back + Home */}
  <div className="flex items-center gap-4">
    <BackButton />
    <FaHome size={24} className="text-[#0077B1] cursor-pointer" />
  </div>

  {/* Centro: Título */}
  <h1 className="text-xl font-semibold text-[#0077B1] text-center flex-1">
    Patient 1
  </h1>

  {/* Direita: Avatar */}
  <div className="bg-[#0077B1] text-white w-8 h-8 flex items-center justify-center rounded-full font-bold">
    A
  </div>
</div>


      {/* Cards */}
      <div className="space-y-4 max-w-4xl mx-auto">
        {triagens.map((t, i) => (
          <div key={i} className="bg-[#0077B1] rounded-lg p-4 text-white shadow flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${t.color}`} />
              <span className="font-semibold">{t.date}</span>
            </div>
            <p className="text-sm">
              Temperature: {t.temperature}°C; Oxygenation: {t.oxygen}; Blood pressure {t.pressure}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
