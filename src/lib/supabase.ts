import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('🔍 Verificando variáveis de ambiente:');
console.log('SUPABASE_URL:', supabaseUrl ? '✅ Definida' : '❌ Não definida');
console.log('SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅ Definida' : '❌ Não definida');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ ERRO: Variáveis de ambiente do Supabase não encontradas!');
  console.log('Verifique se o arquivo .env contém:');
  console.log('VITE_SUPABASE_URL=sua_url_aqui');
  console.log('VITE_SUPABASE_ANON_KEY=sua_chave_aqui');
  throw new Error('Missing Supabase environment variables');
}

// Clean and validate the URL
const cleanUrl = supabaseUrl.trim().replace(/\/+$/, '');

// Validate URL format
try {
  new URL(cleanUrl);
  console.log('✅ URL do Supabase válida:', cleanUrl);
} catch (error) {
  console.error('❌ URL do Supabase inválida:', cleanUrl);
  throw new Error(`Invalid Supabase URL format: ${cleanUrl}`);
}

export const supabase = createClient(cleanUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    debug: false
  },
  global: {
    headers: {
      'Content-Type': 'application/json',
    },
  },
  db: {
    schema: 'public',
  },
  realtime: {
    params: {
      eventsPerSecond: 2,
    },
  },
});

// Add connection test function for debugging
export const testConnection = async () => {
  try {
    console.log('🔄 Testando conexão com Supabase...');
    
    // Test 1: Check auth session
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      console.error('❌ Erro ao verificar sessão:', sessionError);
      return false;
    }
    console.log('✅ Verificação de sessão OK');
    
    // Test 2: Try to query users table
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select('id')
      .limit(1);
    
    if (usersError) {
      console.error('❌ Erro ao acessar tabela users:', usersError);
      return false;
    }
    console.log('✅ Acesso à tabela users OK');
    
    // Test 3: Check RLS policies
    const { data: authUser } = await supabase.auth.getUser();
    if (authUser.user) {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.user.id)
        .single();
      
      if (userError && userError.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('❌ Erro nas políticas RLS:', userError);
        return false;
      }
      console.log('✅ Políticas RLS OK');
    }
    
    console.log('🎉 Conexão com Supabase funcionando perfeitamente!');
    return true;
  } catch (error) {
    console.error('❌ Erro geral na conexão:', error);
    return false;
  }
};

// Test connection on module load
testConnection();