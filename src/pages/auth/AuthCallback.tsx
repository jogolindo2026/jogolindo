import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { supabase } from '../../lib/supabase';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const { fetchUserProfile } = useAuthStore();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('🔄 Processando callback de autenticação...');
        
        const { data, error } = await supabase.auth.getSession();
        
        if (error || !data.session) {
          console.error('❌ Erro ou sessão não encontrada:', error);
          navigate('/login');
          return;
        }
        
        const userId = data.session.user.id;
        console.log('✅ Sessão ativa para:', userId);
        
        // 1. Verifica se o perfil já existe no banco
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('role')
          .eq('id', userId)
          .single();
        
        // 2. Se o usuário é NOVO (não existe na tabela 'users')
        if (userError && userError.code === 'PGRST116') {
          console.log('🆕 Novo usuário detectado. Criando perfil base...');
          
          const profileData = {
            id: userId,
            email: data.session.user.email!,
            name: data.session.user.user_metadata?.full_name || data.session.user.email!.split('@')[0],
            role: null, // OBRIGATÓRIO: Nulo para forçar a escolha no Welcome
            profile_picture: data.session.user.user_metadata?.avatar_url || '',
          };
          
          const { error: insertError } = await supabase
            .from('users')
            .insert([profileData]);
          
          if (insertError) {
            console.error('❌ Erro ao inserir perfil:', insertError);
            navigate('/login?error=profile_creation_failed');
            return;
          }

          // IMPORTANTE: Primeiro navegamos para a escolha, depois carregamos o store
          navigate('/auth/welcome', { replace: true });
          await fetchUserProfile();
          return;
        }
        
        // 3. Se o usuário existe, mas o 'role' ainda é nulo (não escolheu antes)
        if (userData && !userData.role) {
          console.log('⚠️ Usuário sem cargo definido. Redirecionando para Welcome...');
          navigate('/auth/welcome', { replace: true });
          await fetchUserProfile();
          return;
        }

        // 4. Usuário antigo com perfil completo: vai para a Home
        console.log('🏠 Usuário completo. Indo para Home.');
        await fetchUserProfile();
        navigate('/', { replace: true });
        
      } catch (err) {
        console.error('❌ Erro crítico:', err);
        navigate('/login');
      }
    };

    handleAuthCallback();
  }, [navigate, fetchUserProfile]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Finalizando autenticação...</h2>
        <p className="text-gray-600">Configurando seu acesso ao Jogo Lindo.</p>
      </div>
    </div>
  );
};

export default AuthCallback;