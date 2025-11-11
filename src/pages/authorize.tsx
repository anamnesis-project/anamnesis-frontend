import { useEffect, useState } from 'react';
import BackButton from "../components/buttonback";
import { getApiUrl } from '../config/api';

type Employee = {
  id: number;
  name: string;
  email: string;
  cpf: string;
  role: {
    id: number;
    name: string;
    accessAllowed: boolean;
  };
  [key: string]: any;
};

type Role = {
  id: number;
  name: string;
  accessAllowed: boolean;
};

export default function AuthorizeEmployees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<Record<number, number>>({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successEmployeeName, setSuccessEmployeeName] = useState('');

  useEffect(() => {
    let mounted = true;
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Buscar roles e employees em paralelo
        const [rolesData, employeesData] = await Promise.all([
          getRoles(),
          getPendingEmployees()
        ]);
        
        if (mounted) {
          setRoles(rolesData ?? []);
          setEmployees(employeesData ?? []);
          
          // Inicializar selectedRoles com os roles atuais dos employees
          const initialRoles: Record<number, number> = {};
          employeesData?.forEach((emp) => {
            if (emp.role?.id) {
              initialRoles[emp.id] = emp.role.id;
            }
          });
          setSelectedRoles(initialRoles);
        }
      } catch (err: any) {
        console.error(err);
        
        // Tratamento especial para "Failed to fetch"
        if (err.message === 'Failed to fetch' || err.name === 'TypeError') {
          if (mounted) setError('Cannot connect to server. Please check:\n1. Backend is running\n2. CORS/Proxy is configured\n3. You are logged in (token in localStorage)');
        } else {
          if (mounted) setError(err.message || 'Erro ao carregar dados');
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchData();
    return () => {
      mounted = false;
    };
  }, []);

  const handleRoleChange = (employeeId: number, roleId: number) => {
    setSelectedRoles(prev => ({ ...prev, [employeeId]: roleId }));
  };

  const handleAssignRole = async (employeeId: number) => {
    const roleId = selectedRoles[employeeId];
    
    if (!roleId) {
      setError('Please select a role first');
      return;
    }

    setProcessingId(employeeId);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(getApiUrl(`/employees/${employeeId}`), {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify({ roleId }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: Failed to assign role`);
      }

      // Mostrar modal de sucesso e remover o funcionário da lista
      const employee = employees.find(e => e.id === employeeId);
      setSuccessEmployeeName(employee?.name || 'Employee');
      setShowSuccessModal(true);
      
      // Remover funcionário da lista
     
      // Fechar modal após 3 segundos
      setTimeout(() => {
        setShowSuccessModal(false);
      }, 3000);
      
    } catch (err: any) {
      console.error('Assign role error:', err);
      setError(err.message || 'Failed to assign role');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-white p-8">
    
      <BackButton />
     
      <h1 className="text-2xl text-center text-[#0077B1] font-semibold mb-8">
        Authorize new employee
      </h1>

      {/* Modal de Sucesso */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-4">
            <div className="flex flex-col items-center gap-4">
              {/* Ícone de Sucesso */}
              <div className="bg-green-100 rounded-full p-4">
                <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              {/* Mensagem */}
              <h2 className="text-2xl font-bold text-gray-800">Successfully Updated!</h2>
              <p className="text-gray-600 text-center">
                <span className="font-semibold text-[#0077B1]">{successEmployeeName}</span> has been authorized successfully.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Estados: loading / erro / vazio */}
      <div className="flex flex-col gap-4 max-w-3xl mx-auto">
        {loading && <div className="text-center">Loading...</div>}
        {error && <div className="text-center text-red-600 whitespace-pre-line">{error}</div>}
        {!loading && !error && employees.length === 0 && (
          <div className="text-center text-gray-600">No pending employees</div>
        )}

        {!loading && !error && employees.map((employee) => (
          <div
            key={employee.id}
            className="flex justify-between items-center px-6 py-4 bg-[#0077B1] text-white rounded-lg gap-4"
          >
            <span className="font-medium flex-shrink-0">{employee.name}</span>
            <div className="flex gap-2 items-center flex-grow justify-end">
              <select
                value={selectedRoles[employee.id] || ''}
                onChange={(e) => handleRoleChange(employee.id, Number(e.target.value))}
                disabled={processingId === employee.id}
                className="px-3 py-1 rounded border border-white bg-white text-[#0077B1] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="">Select role...</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name} {role.accessAllowed ? '✓' : '✗'}
                  </option>
                ))}
              </select>
              <button
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                onClick={() => handleAssignRole(employee.id)}
                disabled={processingId === employee.id || !selectedRoles[employee.id]}
              >
                {processingId === employee.id ? 'Assigning...' : 'Assign Role'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

async function getPendingEmployees(): Promise<Employee[]> {
  const token = localStorage.getItem('token') || undefined;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
      'ngrok-skip-browser-warning': 'true'
  }
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const response = await fetch(getApiUrl('/employees'), {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    // tratamento de erro
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(`Erro ${response.status}: ${errorBody.message || response.statusText}`);
  }

  // converte a resposta em JSON
  const employees = await response.json();
  return employees;
}

async function getRoles(): Promise<Role[]> {
  const token = localStorage.getItem('token') || undefined;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
      'ngrok-skip-browser-warning': 'true'
  }
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const response = await fetch(getApiUrl('/roles'), {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(`Erro ${response.status}: ${errorBody.message || response.statusText}`);
  }

  const roles = await response.json();
  return roles;
}
