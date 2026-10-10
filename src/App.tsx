import { useState } from 'react';

import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';

import { DashboardOverview } from './pages/DashboardOverview';
import { MinhaPeladaPage } from './pages/MinhaPeladaPage';
import { CriarPeladaPage } from './pages/CriarPeladaPage';
import { ParticipantesPage } from './pages/ParticipantesPage';
import { FinanceiroPage } from './pages/FinanceiroPage';
import { EventosPage } from './pages/EventosPage';
import { DiaDeJogoPage } from './pages/DiaDeJogoPage';
import { DisciplinaPage } from './pages/DisciplinaPage';
import { RankingPage } from './pages/RankingPage';
import { ConviteDiaristaPage } from './pages/ConviteDiaristaPage';

import { DashboardLayout } from './components/layout/DashboardLayout';
import { useData } from './context/DataContext';
import { useRouter } from './router';
import { rememberParticipantForAccountLink } from './services/participantLinking';

type Screen =
  | 'landing'
  | 'login'
  | 'cadastro'
  | 'sistema';

function App() {
  const [screen, setScreen] = useState<Screen>(() => {
    const hash = window.location.hash.replace('#', '');

    const rotasDoSistema = [
      '/dashboard',
      '/criar-pelada',
      '/pelada',
      '/participantes',
      '/financeiro',
      '/eventos',
      '/dia-de-jogo',
      '/disciplina',
      '/ranking',
      '/regras',
      '/configuracoes',
    ];

    if (
      rotasDoSistema.some(
        (rota) =>
          hash === rota ||
          hash.startsWith(`${rota}/`)
      )
    ) {
      return 'sistema';
    }

    return 'landing';
  });

  const { data } = useData();
  const { route, navigate } = useRouter();

  const conviteTokenPrefix =
    '/convite/';

  if (
    route.startsWith(
      conviteTokenPrefix
    )
  ) {
    const token = route.slice(
      conviteTokenPrefix.length
    );

    if (token) {
      return (
        <ConviteDiaristaPage
          token={token}
          onLinkAccount={(participantId, mode) => {
            rememberParticipantForAccountLink(participantId);
            setScreen(mode);
            navigate(`/${mode}`);
          }}
        />
      );
    }
  }

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
        onBack={() =>
          setScreen('landing')
        }
        onSuccess={entrarNoSistema}
      />
    );
  }

  if (screen === 'cadastro') {
    return (
      <AuthPage
        mode="cadastro"
        onBack={() =>
          setScreen('landing')
        }
        onSuccess={entrarNoSistema}
      />
    );
  }

  if (screen === 'sistema') {
    let page;

    switch (route) {
      case '/criar-pelada':
        page = (
          <CriarPeladaPage
            onVoltar={() =>
              navigate('/dashboard')
            }
            onCriada={(peladaId) => {
              console.log(
                'Pelada criada:',
                peladaId
              );

              /*
                Na próxima etapa vamos usar
                este ID para selecionar a
                pelada recém-criada.
              */
              navigate('/pelada');
            }}
          />
        );
        break;

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
        page = (
          <DashboardOverview
            onNavigate={navigate}
          />
        );
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
      onEnter={() =>
        setScreen('login')
      }
      onCreate={() =>
        setScreen('cadastro')
      }
    />
  );
}

export default App;