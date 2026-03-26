import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Button from '../components/UI/Button'
import logoImage from '../images/logo_alternativo 4.png'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const { error } = await signIn(email, password)
      
      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setError('Email ou senha incorretos. Verifique as credenciais do usuário administrador.')
        } else if (error.message.includes('Email not confirmed')) {
          setError('Conta não habilitada para login. Verifique a configuração do usuário administrador.')
        } else {
          setError(`Erro ao fazer login: ${error.message}`)
        }
        return
      }

      // Redirecionar para admin após login bem-sucedido
      navigate('/admin')
    } catch (err) {
      setError('Erro inesperado. Verifique sua conexão e tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#141414] flex flex-col items-center justify-center px-4 font-body">
      <div className="w-full max-w-md flex flex-col gap-6">
        {/* Logo */}
        <div className="text-center">
          <img 
            src={logoImage} 
            alt="Svicero Studio" 
            className="h-32 mx-auto mb-16"
          />
          <h1 className="font-title text-3xl md:text-4xl font-semibold text-low-dark mb-2">
            Área Administrativa
          </h1>
          <p className="text-lg text-low-medium">
            Faça login para gerenciar seus projetos
          </p>
        </div>

        {/* Formulário de Login */}
        <div className="bg-gelo rounded-xl p-8 border border-white/10">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                <i className="fa-solid fa-circle-exclamation text-red-500 text-xl"></i>
                <span className="text-red-700 text-sm">{error}</span>
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-low-dark text-base mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                id="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-[#141414] border border-cream/40 text-low-dark text-base focus:border-secondary focus:outline-none transition-colors"
                placeholder="seu@email.com"
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-low-dark text-base mb-2">
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  id="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 rounded-lg bg-[#141414] border border-cream/40 text-low-dark text-base focus:border-secondary focus:outline-none transition-colors"
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-low-medium hover:text-secondary transition-colors p-1 bg-transparent border-none"
                  tabIndex={-1}
                  style={{ outline: 'none', boxShadow: 'none' }}
                >
                  <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <i className="fa-solid fa-spinner fa-spin"></i>
                  Entrando...
                </span>
              ) : (
                'Entrar'
              )}
            </Button>
          </form>
        </div>

        {/* Link para voltar */}
        <div className="text-center">
          <a 
            href="/" 
            className="text-low-dark hover:text-secondary transition-colors text-sm font-medium"
          >
            <i className="fa-solid fa-arrow-left mr-2"></i>
            Voltar para o site
          </a>
        </div>
      </div>
    </div>
  )
}

export default Login
