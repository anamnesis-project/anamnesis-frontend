import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Register from './pages/register'
import Login from './pages/login'
import PatientHistory from './pages/patienthistory'
import PatientsList from './pages/patientslist'
import AuthorizeEmployees from './pages/authorize'
import PatientInfo from './pages/patientinfo'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/patients" element={<PatientsList />} />
        <Route path="/patients/:id" element={<PatientHistory />} />
        <Route path="/authorize-employees" element={<AuthorizeEmployees />} />
        <Route path="/patient-info" element={<PatientInfo />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
