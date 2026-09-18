import { useState } from 'react';

import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';

import { DashboardOverview } from './pages/DashboardOverview';
import { MinhaPeladaPage } from './pages/MinhaPeladaPage';
import { ParticipantesPage } from './pages/ParticipantesPage';
import { FinanceiroPage } from './pages/FinanceiroPage';
import { EventosPage } from './pages/EventosPage';
import { DiaDeJogoPage } from './pages/DiaDeJogoPage';
import { DisciplinaPage } from './pages/DisciplinaPage';
import { RankingPage } from './pages/RankingPage';

import { DashboardLayout } from './components/layout/DashboardLayout';
import { useData } from './context/DataContext';
import { useRouter } from './router';

type Screen = 'landing' | 'login' | 'cadastro' | 'sistema';

function App() {
  const [screen, setScreen] = useState<Screen>('landing');

  const { data } = useData();
  const { route, navigate } = useRouter();

  const entrarNoSistema = () => {
    setScreen('sistema');

    if (
      !route ||
      route === '/' ||
      route === '/login' ||
      route === '/cadastro'
    ) {
      navigate('/dashboard');
    }
  };

  const sairParaSite = () => {
    navigate('/');
    setScreen('landing');
  };

  if (screen === 'login') {
    return (
      <AuthPage
        mode="login"
        onBack={() => setScreen('landing')}
        onSuccess={entrarNoSistema}
      />
    );
  }

  if (screen === 'cadastro') {
    return (
      <AuthPage
        mode="cadastro"
        onBack={() => setScreen('landing')}
        onSuccess={entrarNoSistema}
      />
    );
  }

  if (screen === 'sistema') {
    let page;

    switch (route) {
      case '/pelada':
        page = <MinhaPeladaPage />;
        break;

      case '/participantes':
        page = <ParticipantesPage />;
        break;

      case '/financeiro':
        page = <FinanceiroPage />;
        break;

      case '/eventos':
        page = <EventosPage />;
        break;

      case '/dia-de-jogo':
        page = <DiaDeJogoPage />;
        break;

      case '/disciplina':
        page = <DisciplinaPage />;
        break;

      case '/ranking':
        page = <RankingPage />;
        break;

      case '/regras':
        page = (
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h1 className="text-2xl font-bold text-gray-900">
              Regras
            </h1>

            <p className="mt-2 text-gray-500">
              Configuração das regras da pelada.
            </p>
          </div>
        );
        break;

      case '/configuracoes':
        page = (
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <h1 className="text-2xl font-bold text-gray-900">
              Configurações
            </h1>

            <p className="mt-2 text-gray-500">
              Configurações gerais do JogoLindo.
            </p>
          </div>
        );
        break;

      case '/dashboard':
      default:
       page = <DashboardOverview onNavigate={navigate} />;
        break;
    }

    return (
      <DashboardLayout
        currentPath={route}
        onNavigate={(path) => {
          if (path === '/') {
            sairParaSite();
            return;
          }

          navigate(path);
        }}
        peladaName={data.pelada.name}
      >
        {page}
      </DashboardLayout>
    );
  }

  return (
    <LandingPage
      onEnter={() => setScreen('login')}
      onCreate={() => setScreen('cadastro')}
    />
  );
}

export default App;