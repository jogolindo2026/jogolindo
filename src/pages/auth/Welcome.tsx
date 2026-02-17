import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Users, Handshake } from 'lucide-react';

const Welcome = () => {
  const { updateProfile } = useAuthStore();
  const navigate = useNavigate();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSelectRole = async (role: 'player' | 'businessman') => {
    if (isUpdating) return; // Evita cliques duplos
    
    setIsUpdating(true);
    try {
      // Atualiza o cargo no Supabase
      await updateProfile({ role });
      
      // Direcionamento estratégico
      if (role === 'player') {
        navigate('/aulas');
      } else {
        navigate('/parceiros');
      }
    } catch (error) {
      console.error("Erro ao definir cargo:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2 font-montserrat">Bem-vindo ao Jogo Lindo!</h1>
        <p className="text-gray-600 mb-12">Para começarmos, como você pretende usar a plataforma?</p>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Opção Jogador */}
          <button 
            disabled={isUpdating}
            onClick={() => handleSelectRole('player')}
            className="bg-white p-8 rounded-3xl shadow-sm border-2 border-transparent hover:border-green-600 hover:shadow-xl transition-all group text-left disabled:opacity-50"
          >
            <div className="bg-green-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-600 transition-colors">
              <Users className="w-8 h-8 text-green-600 group-hover:text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Sou Atleta</h3>
            <p className="text-gray-500 text-sm">Quero treinar com ex-craques e evoluir minha técnica com IA.</p>
          </button>

          {/* Opção Empresário/Parceiro */}
          <button 
            disabled={isUpdating}
            onClick={() => handleSelectRole('businessman')}
            className="bg-white p-8 rounded-3xl shadow-sm border-2 border-transparent hover:border-green-600 hover:shadow-xl transition-all group text-left disabled:opacity-50"
          >
            <div className="bg-green-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-600 transition-colors">
              <Handshake className="w-8 h-8 text-green-600 group-hover:text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Sou Parceiro</h3>
            <p className="text-gray-500 text-sm">Quero investir em talentos e acessar dados de Business Intelligence.</p>
          </button>
        </div>
        
        {isUpdating && (
          <p className="mt-6 text-green-600 font-medium animate-pulse">Configurando seu acesso...</p>
        )}
      </div>
    </div>
  );
};

export default Welcome;