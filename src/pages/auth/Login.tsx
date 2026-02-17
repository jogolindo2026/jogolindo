import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Wallpaper as BallSoccer, Mail, Lock, AlertCircle, CheckCircle, Wifi, WifiOff, RefreshCw } from 'lucide-react';
import Button from '../../components/ui/Button';

const Login: React.FC = () => {
  const { 
    login, 
    loginWithGoogle, 
    resetPassword, 
    resendConfirmation, 
    isLoading, 
    error, 
    isEmailConfirmationRequired,
    clearError, 
    testSupabaseConnection 
  } = useAuthStore();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'disconnected'>('checking');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  
  // Clear error when component mounts or when user starts typing
  useEffect(() => {
    clearError();
    checkConnection();
  }, [clearError]);
  
  useEffect(() => {
    if (email || password) {
      clearError();
    }
  }, [email, password, clearError]);

  const checkConnection = async () => {
    setConnectionStatus('checking');
    try {
      const isConnected = await testSupabaseConnection();
      setConnectionStatus(isConnected ? 'connected' : 'disconnected');
    } catch (error) {
      console.error('Erro ao testar conexão:', error);
      setConnectionStatus('disconnected');
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      return;
    }

    if (connectionStatus === 'disconnected') {
      await checkConnection();
      if (connectionStatus === 'disconnected') {
        return;
      }
    }
    
    const success = await login(email, password);
    if (success) {
      navigate('/');
    }
  };

  const handleGoogleLogin = async () => {
    if (connectionStatus === 'disconnected') {
      await checkConnection();
      if (connectionStatus === 'disconnected') {
        return;
      }
    }
    
    await loginWithGoogle();
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    
    await resetPassword(forgotEmail.trim());
    setShowForgotPassword(false);
    setForgotEmail('');
  };

  const handleResendConfirmation = async () => {
    if (!email.trim()) {
      alert('Por favor, digite seu email primeiro.');
      return;
    }
    
    await resendConfirmation(email.trim());
  };
  
  const isEmailConfirmationError = error?.includes('confirme seu email') || error?.includes('Email not confirmed');
  const isSuccessMessage = error?.includes('sucesso');
  
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <BallSoccer size={48} className="text-primary-500" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Entrar na sua conta
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Ou{' '}
          <Link to="/cadastro" className="font-medium text-primary-600 hover:text-primary-500">
            cadastre-se agora
          </Link>
        </p>

        {/* Connection Status */}
        <div className="mt-4 flex justify-center">
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
            connectionStatus === 'connected' ? 'bg-green-100 text-green-800' :
            connectionStatus === 'disconnected' ? 'bg-red-100 text-red-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {connectionStatus === 'connected' ? (
              <>
                <Wifi size={16} />
                <span>Conectado</span>
              </>
            ) : connectionStatus === 'disconnected' ? (
              <>
                <WifiOff size={16} />
                <span>Sem conexão</span>
              </>
            ) : (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600"></div>
                <span>Verificando...</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {/* Google Login Button */}
          <div className="mb-6">
            <Button
              type="button"
              variant="outline"
              fullWidth
              onClick={handleGoogleLogin}
              disabled={connectionStatus === 'disconnected' || isLoading}
              className="flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Continuar com Google</span>
            </Button>
          </div>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Ou continue com email</span>
            </div>
          </div>

          {error && (
            <div className={`mb-4 border px-4 py-3 rounded-md text-sm flex items-start space-x-2 ${
              isSuccessMessage 
                ? 'bg-green-50 border-green-200 text-green-700'
                : isEmailConfirmationError
                ? 'bg-blue-50 border-blue-200 text-blue-700'
                : 'bg-red-50 border-red-200 text-red-600'
            }`}>
              {isSuccessMessage ? (
                <CheckCircle size={18} className="flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
              )}
              <span>{error}</span>
            </div>
          )}

          {connectionStatus === 'disconnected' && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
              <div className="flex items-center space-x-2 mb-2">
                <WifiOff size={18} />
                <span className="font-medium">Problema de Conexão</span>
              </div>
              <p className="mb-2">Não foi possível conectar ao servidor. Verifique:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Sua conexão com a internet</li>
                <li>Se as variáveis de ambiente estão configuradas</li>
                <li>Se o Supabase está funcionando</li>
              </ul>
              <button
                type="button"
                onClick={checkConnection}
                className="mt-2 text-sm underline hover:no-underline"
              >
                Tentar novamente
              </button>
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder="••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember_me"
                  name="remember_me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-900">
                  Lembrar de mim
                </label>
              </div>

              <div className="text-sm">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="font-medium text-primary-600 hover:text-primary-500"
                >
                  Esqueceu a senha?
                </button>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                variant="primary"
                fullWidth
                isLoading={isLoading}
                disabled={!email || !password || connectionStatus === 'disconnected'}
              >
                Entrar
              </Button>
            </div>
          </form>

          {isEmailConfirmationError && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
              <h3 className="text-sm font-medium text-blue-800 mb-2">
                📧 Email não confirmado
              </h3>
              <ul className="text-sm text-blue-700 space-y-1 mb-3">
                <li>• Verifique sua caixa de entrada e pasta de spam</li>
                <li>• Clique no link de confirmação no email recebido</li>
                <li>• Se não recebeu o email, clique no botão abaixo</li>
                <li>• Após confirmar o email, tente fazer login novamente</li>
              </ul>
              <div className="flex space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleResendConfirmation}
                  disabled={isLoading || !email}
                  leftIcon={<RefreshCw size={16} />}
                >
                  Reenviar Confirmação
                </Button>
                <Link 
                  to="/cadastro"
                  className="text-sm font-medium text-blue-600 hover:text-blue-500 flex items-center"
                >
                  Cadastrar novamente →
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Recuperar Senha
            </h3>
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="Digite seu email"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  required
                />
              </div>
              <div className="flex space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setForgotEmail('');
                  }}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isLoading}
                  className="flex-1"
                >
                  Enviar
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;