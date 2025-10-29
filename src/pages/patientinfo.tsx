import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import InfoCard from './infoCard';
import './patientinfo.css';
import BackButton from '../components/buttonback';
import { getApiUrl } from '../config/api';

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

export default function PatientInfo() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatientData = async () => {
      if (!id) {
        setError('Patient ID not provided');
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        };

        // Buscar paciente e seus relatórios
        const [patientRes, reportsRes] = await Promise.all([
          fetch(getApiUrl(`/patients/${id}`), { headers }),
          fetch(getApiUrl(`/patients/${id}/reports`), { headers }),
        ]);

        if (patientRes.status === 401 || reportsRes.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('employee');
          navigate('/login');
          return;
        }

        if (!patientRes.ok) {
          throw new Error(`Failed to fetch patient: ${patientRes.status}`);
        }

        const patientData = await patientRes.json();
        setPatient(patientData);

        if (reportsRes.ok) {
          const reportsData = await reportsRes.json();
          setReports(reportsData);
        }
      } catch (err: any) {
        console.error('Fetch error:', err);
        setError(err.message || 'Failed to load patient data');
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [id, navigate]);

  // Calcular idade a partir da data de nascimento
  const calculateAge = (dateOfBirth: string) => {
    const birth = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  // Pegar o relatório mais recente
  const latestReport = reports.length > 0 ? reports[0] : null;

  if (loading) {
    return (
      <div className="screen-container">
        <div className="text-center p-8">Loading patient data...</div>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="screen-container">
        <BackButton />
        <div className="text-center p-8 text-red-600">
          {error || 'Patient not found'}
        </div>
      </div>
    );
  }

  return (
    <div className="screen-container">
             

      <header className="screen-header">
        <BackButton />  
        <h1 className="screen-title text-[#0077B1]">
          {patient.name} - {latestReport ? new Date(latestReport.issuedAt).toLocaleDateString() : 'No reports'}
        </h1>
        <button className="avatar-button">A</button>
      </header>

      <main className="content-grid">
        {/* Coluna 1 - Dados do Paciente */}
        <div className="grid-column">
          <InfoCard label="Name" value={patient.name} />
          <InfoCard label="Age" value={calculateAge(patient.dateOfBirth).toString()} />
          <InfoCard label="Gender" value={patient.sex === 'M' ? 'Male' : 'Female'} />
          <InfoCard label="Weight" value={latestReport ? `${latestReport.weight} kg` : 'N/A'} />
        </div>

        {/* Coluna 2 - Informações da Entrevista */}
        <div className="grid-column">
          <InfoCard label="CPF" value={patient.cpf} />
          <InfoCard label="Birth Date" value={new Date(patient.dateOfBirth).toLocaleDateString()} />
          <InfoCard label="Height" value={latestReport ? `${latestReport.height} cm` : 'N/A'} />
          <InfoCard label="Urgency" value={latestReport?.urgency || 'undefined'} />
        </div>

        {/* Coluna 3 - Sinais Vitais */}
        <div className="grid-column">
          <InfoCard label="Temperature" value={latestReport ? `${latestReport.temperature}°C` : 'N/A'} />
          <InfoCard label="Oxygenation" value={latestReport ? `${latestReport.oxygenSaturation}%` : 'N/A'} />
          <InfoCard label="Blood pressure" value={latestReport ? `${latestReport.systolicPressure / 10}/${latestReport.diastolicPressure / 10}` : 'N/A'} />
          <InfoCard label="Heart rate" value={latestReport ? `${latestReport.heartRate} bpm` : 'N/A'} />
        </div>
      </main>

      {/* Interview Section */}
      {latestReport?.interview && latestReport.interview.length > 0 && (
        <div className="max-w-6xl mx-auto px-8 pb-8">
          <div className="bg-gray-50 rounded-xl shadow-2xl border mt-8 border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-[#0077B1] mb-6 flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
              Interview
            </h2>
            <div className="space-y-4">
              {latestReport.interview.map((item, index) => (
                <div key={index} className="bg-gradient-to-r from-blue-50 to-white rounded-lg p-4 border-l-4 border-[#0077B1] shadow-lg hover:shadow-xl transition-shadow">
                  <p className="text-base font-semibold text-gray-800 mb-2">
                    <span className="text-[#0077B1]">Q:</span> {item.question}
                  </p>
                  <p className="text-base text-gray-700 ml-6">
                    <span className="text-[#0077B1] font-semibold">A:</span> {item.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}