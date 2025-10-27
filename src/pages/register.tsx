import { useState } from 'react'
import { Link } from 'react-router-dom'
import imgHide1 from '../assets/olho.jpg'
import imgLogo from '../assets/logo.jpg'

export default function Register() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-2xl border border-cyan-700 rounded-lg p-8 shadow-md">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img src={imgLogo} alt="Logo ANAmnesis" className="h-24" />
        </div>

        {/* Título */}
        <h1 className="text-3xl font-semibold text-cyan-700 text-center mb-1">
          Create a new account
        </h1>

        {/* Subtítulo */}
        <p className="text-center text-[#009fae] mb-6">
          Join us to optimize the hospital care
        </p>

        {/* Formulário */}
        <form className="space-y-5">
          {/* Nome completo */}
          <div>
            <label className="block text-[#009fae] text-lg mb-1">Full name:</label>
            <input
              type="text"
              placeholder="Your full name"
              className="w-full px-4 py-2 border-2 border-[#0077b1] rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-[#009fae] text-lg mb-1">Email:</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-2 border-2 border-[#0077b1] rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>

          {/* Senha */}
          <div className="relative">
            <label className="block text-[#009fae] text-lg mb-1">Password:</label>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="********"
              className="w-full px-4 py-2 border-2 border-[#0077b1] rounded-md pr-10 focus:outline-none focus:ring-2 focus:ring-cyan-400"
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
            className="w-full bg-[#0077b1] text-white py-3 rounded-md text-lg hover:bg-cyan-800 transition"
          >
            Register
          </button>
        </form>

        {/* Link de login */}
        <p className="text-center text-[#009fae] mt-6">
          Already have an account?{' '}
          <Link to="/login" className="underline text-[#0077b1] hover:text-cyan-800">
            Make login
          </Link>
        </p>
      </div>
    </div>
  )
}
