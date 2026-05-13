import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Button from '../components/UI/Button'
import logoImage from '../assets/logo_horizontal.png'

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
    <div className="min-h-screen bg-charcoal flex flex-col items-center justify-center px-4 font-body relative overflow-hidden">
      {/* Background lighting effects */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-copper/5 rounded-full blur-[100px] pointer-events-none translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-copper/5 rounded-full blur-[80px] pointer-events-none -translate-x-1/3 translate-y-1/3" />

      <div className="w-full max-w-md flex flex-col gap-6 relative z-10">
        {/* Logo */}
        <div className="text-center">
          <img 
            src={logoImage} 
            alt="Svicero Studio" 
            className="h-24 mx-auto mb-12 opacity-90"
          />
          <h1 className="text-[1.875rem] md:text-4xl font-medium tracking-tight text-cream mb-2">
            Área Administrativa
          </h1>
          <p className="text-lg text-muted">
            Faça login para gerenciar o estúdio
          </p>
        </div>

        {/* Formulário de Login */}
        <div className="bg-[#141414]/60 backdrop-blur-xl rounded-[2rem] p-8 border border-white/5 shadow-2xl">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {error && (
              <div className="bg-red-900/20 border border-red-900/50 rounded-lg p-4 flex items-center gap-3">
                <i className="fa-solid fa-circle-exclamation text-red-400 text-xl"></i>
                <span className="text-red-400 text-sm">{error}</span>
              </div>
            )}
            <div>
              <label htmlFor="email" className="block text-cream text-sm font-medium mb-2">
                E-mail
              </label>
              <input
                type="email"
                name="email"
                id="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-cream text-base focus:border-copper/60 focus:bg-white/10 focus:outline-none transition-all placeholder:text-white/20"
                placeholder="seu@email.com"
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-cream text-sm font-medium mb-2">
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
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-white/5 border border-white/10 text-cream text-base focus:border-copper/60 focus:bg-white/10 focus:outline-none transition-all placeholder:text-white/20"
                  placeholder="••••••••"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-copper transition-colors p-1 bg-transparent border-none outline-none focus:outline-none"
                  tabIndex={-1}
                >
                  <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
            </div>
            <Button 
              type="submit" 
              disabled={isLoading}
              variant='primary'
              className="w-full"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <i className="fa-solid fa-spinner fa-spin"></i>
                  Entrando...
                </span>
              ) : (
                'Entrar no Painel'
              )}
            </Button>
          </form>
        </div>

        {/* Link para voltar */}
        <div className="text-center">
          <a 
            href="/" 
            className="text-muted hover:text-cream transition-colors text-sm font-medium inline-flex items-center gap-2"
          >
            <i className="fa-solid fa-arrow-left"></i>
            Voltar para o site
          </a>
        </div>
      </div>
    </div>
  )
}

export default Login
