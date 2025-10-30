import { FaHome } from 'react-icons/fa'
import BackButton from "../components/buttonback"
import { getApiUrl } from '../config/api'
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

type Urgency = 'undefined' | 'green' | 'yellow' | 'red';

type Patient = {
  id: number;
  name: string;
  cpf: string;
  dateOfBirth: string;
  sex: 'M' | 'F';
};

type Report = {
  id: number;
  patient: Patient;
  issuedAt: string;
  weight: number;
  height: number;
  heartRate: number;
  systolicPressure: number;
  diastolicPressure: number;
  temperature: number;
  oxygenSaturation: number;
  urgency: string;
  interview: Array<{ question: string; answer: string }>;
};

type FormattedHistory = {
  date: string;
  color: string;
  temperature: string;
  oxygen: string;
  pressure: string;
}

export default function PatientHistory() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Estados para armazenar dados da API
  const [triagens, setTriagens] = useState<FormattedHistory[]>([]);
  const [patientName, setPatientName] = useState('Carregando...');

  // Efeito para buscar os dados quando o 'id' do paciente mudar
  useEffect(() => {
    if (id) {
      const token = localStorage.getItem('authToken') || '';

      // Função assíncrona para buscar o nome do paciente
      const loadPatientName = async () => {
        try {
          const res = await fetch(getApiUrl(`/patients/${id}`), {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (!res.ok) throw new Error('Falha ao buscar paciente');
          const patientData: Patient = await res.json();
          setPatientName(patientData.name);
        } catch (e) {
          console.error(e);
          setPatientName('Paciente'); // Nome padrão em caso de erro
        }
      };

      // Função assíncrona para buscar o histórico de triagens
      const loadHistory = async () => {
        // Usa a função helper (abaixo) para buscar e formatar
        const historyData = await fetchPatientHistory(id);
        if (historyData) {
          setTriagens(historyData);
        }
      };

      // Chama as duas funções
      loadPatientName();
      loadHistory();
    }
  }, [id]); // Dependência: Roda de novo se o 'id' mudar

  return (
    <div className="min-h-screen bg-white p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 px-4">
        <div className="flex items-center gap-4">
          <BackButton />
          <FaHome size={24} className="text-[#0077B1] cursor-pointer" />
        </div>

        {/* Título dinâmico com o nome do paciente */}
        <h1 className="text-xl font-semibold text-[#0077B1] text-center flex-1">
          Patient: {patientName}
        </h1>

        <div className="bg-[#0077B1] text-white w-8 h-8 flex items-center justify-center rounded-full font-bold">
          A
        </div>
      </div>

      {/* Lista de Cards de Histórico */}
      <div className="space-y-4 max-w-4xl mx-auto">
        {/* Faz o map no estado 'triagens' para renderizar cada card */}
        {triagens.map((t, index) => (
          <div className="bg-[#0077B1] rounded-lg p-4 text-white shadow flex items-center justify-between gap-4"
            key={index}>
            <div className="flex flex-col gap-1 flex-1">
              <div className="flex items-center gap-2">
                {/* Cor da urgência */}
                <span className={`w-3 h-3 rounded-full ${t.color}`} />
                <span className="font-semibold">{t.date}</span>
              </div>
              <p className="text-sm">
                Temperature: {t.temperature}°C; Oxygenation: {t.oxygen}; Blood pressure {t.pressure}
              </p>
            </div>
            <button 
              onClick={() => navigate(`/patients/${id}`)}
              className="bg-white text-[#0077B1] px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              View
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
 
async function fetchPatientHistory(id: string): Promise<FormattedHistory[] | undefined> {
  try {
    const response = await fetch(getApiUrl(`/patients/${id}/reports`), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (response.status === 401) {
      console.error('Não autorizado. Verifique seu token.');
      return;
    }
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }

    // O 'response.json()' será automaticamente validado contra o 'type Report[]'
    const patientReports: Report[] = await response.json();

    // Formata os dados brutos da API para o formato 'FormattedHistory'
    const formattedHistory = patientReports.map(report => {
      // Agora a desestruturação bate com o 'type Report' (snake_case)
      const {
        issuedAt,
        urgency,
        temperature,
        oxygenSaturation,
        systolicPressure,
        diastolicPressure
      } = report;

      return {
        date: formatDate(issuedAt),
        color: getUrgencyColor(urgency as Urgency), // Converte a string para o 'type Urgency'
        temperature: String(temperature),
        oxygen: `${oxygenSaturation}%`,
        pressure: `${Math.trunc(systolicPressure / 10)} / ${Math.trunc(diastolicPressure/ 10)}`
      };
    });

    // Ordena o histórico, do mais recente para o mais antigo
    const sortedHistory = formattedHistory.sort((a, b) => {
      const dateA = new Date(a.date.split('/').reverse().join('-'));
      const dateB = new Date(b.date.split('/').reverse().join('-'));
      return dateB.getTime() - dateA.getTime(); // b - a para ordem decrescente
    });

    console.log(`Histórico formatado para Paciente ${id}:`, sortedHistory);
    return sortedHistory;

  } catch (error) {
    console.error(`Falha ao buscar histórico do paciente ${id}:`, error);
  }
}

/**
 * Retorna a cor Tailwind CSS correspondente ao nível de urgência.
 */
function getUrgencyColor(urgency: Urgency | null): string {
  switch (urgency) {
    case 'red':
      return 'bg-red-600';
    case 'yellow':
      return 'bg-yellow-500';
    case 'green':
      return 'bg-cyan-600';
    case 'undefined':
    default:
      return 'bg-gray-400';
  }
}

/**
 * Formata uma string de data ISO (ex: "2024-10-27T10:00:00Z") para "dd/mm/aaaa".
 */
function formatDate(isoString: string): string {
  if (!isoString) return '';
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Mês começa em 0
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}
