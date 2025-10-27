import React from 'react';
import BackButton from "../components/buttonback"

const employees = [
  { id: 1, name: 'Employee 1' },
  { id: 2, name: 'Employee 2' },
  { id: 3, name: 'Employee 3' },
];

export default function AuthorizeEmployees() {
  
  const handleAuthorize = (id: number) => {
    console.log(`Authorized employee ${id}`);
  };

  const handleDeny = (id: number) => {
    console.log(`Denied employee ${id}`);
  };

  return (
    <div className="min-h-screen bg-white p-8">
      {/* Botão Voltar */}
      <BackButton />
      {/* Título */}
      <h1 className="text-2xl text-center text-[#0077B1] font-semibold mb-8">
        Authorize new employee
      </h1>

      {/* Lista de Funcionários */}
      <div className="flex flex-col gap-4 max-w-3xl mx-auto">
        {employees.map((employee) => (
          <div
            key={employee.id}
            className="flex justify-between items-center px-6 py-4 bg-[#0077B1] text-white rounded-lg"
          >
            <span className="font-medium">{employee.name}</span>
            <div className="flex gap-2">
              <button
                className="bg-teal-400 hover:bg-teal-500 text-white px-3 py-1 rounded"
                onClick={() => handleAuthorize(employee.id)}
              >
                Authorize
              </button>
              <button
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                onClick={() => handleDeny(employee.id)}
              >
                Deny
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
