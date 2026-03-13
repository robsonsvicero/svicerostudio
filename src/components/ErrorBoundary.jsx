import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Log do erro para monitoramento (pode ser enviado para serviço de logging)
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary capturou um erro:', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-dark-bg px-4">
          <div className="max-w-2xl w-full text-center">
            <div className="mb-8">
              <div className="text-6xl mb-4">⚠️</div>
              <h1 className="font-title text-4xl md:text-5xl font-semibold text-low-dark mb-4">
                Algo deu errado
              </h1>
              <p className="font-body text-lg text-low-dark mb-8">
                Desculpe, encontramos um problema inesperado. Nossa equipe foi notificada e está trabalhando para resolver.
              </p>
            </div>
            
            <div className="space-y-4">
              <button
                onClick={() => window.location.reload()}
                className="inline-block px-8 py-3 bg-secondary text-white font-title text-lg rounded-lg shadow-md hover:scale-105 hover:bg-secondary/90 transition-all duration-300"
              >
                Recarregar página
              </button>
              
              <div className="mt-4">
                <a
                  href="/"
                  className="inline-block px-8 py-3 bg-transparent border-2 border-white/30 text-text-primary font-title text-lg rounded-lg hover:bg-secondary hover:border-secondary hover:text-white transition-all duration-300"
                >
                  Voltar para a página inicial
                </a>
              </div>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-8 text-left bg-red-50 border border-red-200 rounded-lg p-4">
                <summary className="cursor-pointer font-semibold text-red-700 mb-2">
                  Detalhes do erro (apenas em desenvolvimento)
                </summary>
                <pre className="text-sm text-red-600 overflow-auto">
                  {this.state.error.toString()}
                  <br />
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
