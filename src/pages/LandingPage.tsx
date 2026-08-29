import { useEffect, useState, type ReactNode } from 'react';
import {
  Trophy,
  Users,
  DollarSign,
  Calendar,
  Shield,
  ArrowRight,
  CheckCircle2,
  Zap,
  Menu,
  X,
  GraduationCap,
  Gamepad2,
  ClipboardCheck,
  QrCode,
  UserCheck,
  Wallet,
} from 'lucide-react';

import logoJogoLindo from '@/assets/JogoLindo_logo.png';

interface LandingPageProps {
  onEnter: () => void;
  onCreate: () => void;
}

const heroImage =
  'src/assets/gabriel.png';

const demoSlides = [
  {
    eyebrow: 'Cobrança automática',
    title: 'Mensalidades em dia',
    icon: <QrCode size={21} />,
    badge: 'PIX confirmado',
    primaryLabel: 'Jogadores liberados',
    primaryValue: '18',
    secondaryLabel: 'Pendências',
    secondaryValue: '2',
    footer: 'O pagamento entra na conta da própria pelada.',
  },
  {
    eyebrow: 'Dia de jogo',
    title: 'Presença e fila ao vivo',
    icon: <UserCheck size={21} />,
    badge: 'Check-in aberto',
    primaryLabel: 'Presentes',
    primaryValue: '22',
    secondaryLabel: 'Na fila',
    secondaryValue: '6',
    footer: 'Admins registram chegada, presença e ordem de entrada.',
  },
  {
    eyebrow: 'Jogo em andamento',
    title: 'Rodízio organizado',
    icon: <Trophy size={21} />,
    badge: 'Jogo 02',
    primaryLabel: 'Time Verde',
    primaryValue: '3',
    secondaryLabel: 'Time Amarelo',
    secondaryValue: '2',
    footer: 'Times, placar, vencedores e próximo jogo na mesma tela.',
  },
];

export function LandingPage({ onEnter, onCreate }: LandingPageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoIndex, setDemoIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setDemoIndex((current) => (current + 1) % demoSlides.length);
    }, 4200);

    return () => window.clearInterval(interval);
  }, []);

  const demo = demoSlides[demoIndex];

  const benefits = [
    {
      icon: <Users size={24} />,
      title: 'Cadastro de atletas',
      desc: 'Jogadores, convidados, goleiros e juiz entram pelo link da própria pelada.',
    },
    {
      icon: <Wallet size={24} />,
      title: 'Financeiro da pelada',
      desc: 'Mensalidades, diárias, multas e custos organizados na conta financeira do Master.',
    },
    {
      icon: <Calendar size={24} />,
      title: 'Agenda e confirmações',
      desc: 'Eventos regulares ou extras, vagas, lista de espera e confirmações.',
    },
    {
      icon: <Gamepad2 size={24} />,
      title: 'Dia de jogo',
      desc: 'Check-in, fila, sorteio, times, placar, rodízio e resultados pelo celular.',
    },
    {
      icon: <Shield size={24} />,
      title: 'Regras da sua turma',
      desc: 'Configure cartões, suspensões, multas, empates, juiz e formato de jogo.',
    },
    {
      icon: <GraduationCap size={24} />,
      title: 'Evolução do atleta',
      desc: 'Base pronta para a futura escola de futebol online JogoLindo.',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Crie sua pelada',
      desc: 'Defina local, dias, horários, jogadores por time, valores e regulamento.',
    },
    {
      number: '02',
      title: 'Ative o financeiro',
      desc: 'A pelada terá sua própria conta para receber mensalidades, diárias e multas.',
    },
    {
      number: '03',
      title: 'Convide e jogue',
      desc: 'A turma se cadastra, paga, confirma presença e entra na operação do jogo.',
    },
  ];

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <div className="min-h-screen bg-white font-jogolindo text-slate-900">
      <header className="sticky top-0 z-50 bg-emerald-800 shadow-md">
        <div className="mx-auto flex h-20 max-w-6xl items-center justify-between px-4 sm:px-6">
          <a href="#inicio" className="flex items-center gap-3" aria-label="JogoLindo">
            <img
              src={logoJogoLindo}
              alt=""
              className="h-14 w-auto object-contain sm:h-16"
            />

            <BrandWordmark light />
          </a>

          <nav className="hidden items-center gap-6 lg:flex">
            <a href="#peladas" className="text-sm font-bold text-white transition hover:text-yellow-300">
              Peladas
            </a>
            <a href="#como-funciona" className="text-sm font-bold text-white transition hover:text-yellow-300">
              Como funciona
            </a>
            <a href="#gestao" className="text-sm font-bold text-white transition hover:text-yellow-300">
              Gestão
            </a>
            <a href="#escolinha" className="text-sm font-bold text-white transition hover:text-yellow-300">
              Escolinha
            </a>

            <button
              type="button"
              onClick={onEnter}
              className="text-sm font-bold text-white transition hover:text-yellow-300"
            >
              Entrar
            </button>

            <button
              type="button"
              onClick={onCreate}
              className="rounded-lg bg-yellow-400 px-5 py-3 text-sm font-black text-emerald-950 shadow-sm transition hover:bg-yellow-300"
            >
              Criar minha pelada
            </button>
          </nav>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-white transition hover:bg-emerald-700 lg:hidden"
            aria-label="Abrir menu"
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {mobileMenuOpen && (
          <nav className="border-t border-emerald-700 bg-emerald-900 px-5 pb-5 pt-2 lg:hidden">
            <div className="flex flex-col">
              <a href="#peladas" onClick={closeMenu} className="border-b border-emerald-700 py-3 text-sm font-bold text-white">
                Peladas
              </a>
              <a href="#como-funciona" onClick={closeMenu} className="border-b border-emerald-700 py-3 text-sm font-bold text-white">
                Como funciona
              </a>
              <a href="#gestao" onClick={closeMenu} className="border-b border-emerald-700 py-3 text-sm font-bold text-white">
                Gestão
              </a>
              <a href="#escolinha" onClick={closeMenu} className="border-b border-emerald-700 py-3 text-sm font-bold text-white">
                Escolinha
              </a>
              <button
                type="button"
                onClick={() => {
                  closeMenu();
                  onEnter();
                }}
                className="py-3 text-left text-sm font-bold text-white"
              >
                Entrar
              </button>
              <button
                type="button"
                onClick={() => {
                  closeMenu();
                  onCreate();
                }}
                className="mt-2 rounded-lg bg-yellow-400 px-4 py-3 text-sm font-black text-emerald-950"
              >
                Criar minha pelada
              </button>
            </div>
          </nav>
        )}
      </header>

      <section
        id="inicio"
        className="relative isolate overflow-hidden bg-emerald-950 text-white"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }}
      >
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-emerald-950/50 via-emerald-900/85 to-emerald-950/55" />

        <div className="mx-auto grid min-h-[590px] max-w-6xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.15fr_.85fr]">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-yellow-300/40 bg-emerald-900/60 px-4 py-2 text-sm font-bold text-yellow-300 backdrop-blur-sm">
              <Trophy size={17} />
              JogoLindo Peladas
            </div>

            <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-tight sm:text-6xl">
              A sua pelada mais
              <span className="block text-yellow-300"> organizada e bonita.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-emerald-50 sm:text-xl">
              Cadastro, cobrança, pagamentos, presença, fila, times, jogos,
              disciplina e resultados — tudo em um só sistema.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={onCreate}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-yellow-400 px-6 py-4 font-black text-emerald-950 shadow-lg transition hover:bg-yellow-300"
              >
                Criar minha pelada
                <ArrowRight size={20} />
              </button>

              <button
                type="button"
                onClick={onEnter}
                className="rounded-xl border border-white/60 bg-white/10 px-6 py-4 font-bold text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                Entrar na minha pelada
              </button>
            </div>
          </div>

          <div className="rounded-3xl border border-white/20 bg-slate-950/75 p-5 shadow-2xl backdrop-blur-md">
            <div className="mb-5 flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-yellow-400 p-2.5 text-emerald-950">
                  {demo.icon}
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-yellow-300">
                    {demo.eyebrow}
                  </p>
                  <h2 className="mt-1 text-xl font-black">{demo.title}</h2>
                </div>
              </div>

              <span className="rounded-full bg-emerald-800 px-3 py-1.5 text-xs font-bold text-emerald-50">
                {demo.badge}
              </span>
            </div>

            <div className="rounded-2xl bg-white p-5 text-slate-900">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-emerald-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">
                    {demo.primaryLabel}
                  </p>
                  <strong className="mt-2 block text-4xl font-black text-emerald-950">
                    {demo.primaryValue}
                  </strong>
                </div>

                <div className="rounded-xl bg-yellow-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-yellow-700">
                    {demo.secondaryLabel}
                  </p>
                  <strong className="mt-2 block text-4xl font-black text-slate-900">
                    {demo.secondaryValue}
                  </strong>
                </div>
              </div>

              <p className="mt-4 rounded-xl bg-slate-50 px-3 py-3 text-xs font-medium leading-relaxed text-slate-600">
                {demo.footer}
              </p>
            </div>

            <div className="mt-4 flex justify-center gap-2">
              {demoSlides.map((slide, index) => (
                <button
                  key={slide.title}
                  type="button"
                  onClick={() => setDemoIndex(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === demoIndex ? 'w-7 bg-yellow-300' : 'w-2 bg-white/35'
                  }`}
                  aria-label={`Ver demonstração: ${slide.title}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="peladas" className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-emerald-700">
            Muito além de uma lista
          </p>
          <h2 className="text-3xl font-black sm:text-4xl">
            A gestão completa da sua pelada
          </h2>
          <p className="mt-4 text-slate-600">
            Mais organização para quem administra e mais jogo para quem quer jogar.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, index) => (
            <div
              key={benefit.title}
              className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div
                className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${
                  index === 1
                    ? 'bg-yellow-50 text-yellow-600'
                    : 'bg-emerald-50 text-emerald-700'
                }`}
              >
                {benefit.icon}
              </div>

              <h3 className="mb-2 text-lg font-black">{benefit.title}</h3>
              <p className="text-sm leading-relaxed text-slate-600">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="como-funciona" className="bg-emerald-800 py-20 text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-12 text-center">
            <p className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-yellow-300">
              Simples de usar
            </p>
            <h2 className="text-3xl font-black sm:text-4xl">
              Organize sua pelada em três passos
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-yellow-400 text-xl font-black text-emerald-950">
                  {step.number}
                </div>

                <h3 className="mb-2 text-xl font-black">{step.title}</h3>
                <p className="max-w-xs leading-relaxed text-emerald-100">{step.desc}</p>

                {index < 2 && (
                  <ArrowRight
                    size={28}
                    className="absolute right-2 top-5 hidden text-yellow-300 sm:block"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="gestao" className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
        <div className="grid items-center gap-10 rounded-3xl bg-slate-950 p-8 text-white sm:p-12 lg:grid-cols-[1fr_.85fr]">
          <div>
            <p className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-yellow-300">
              Gestão do Master
            </p>
            <h2 className="text-3xl font-black">
              Sua turma deixa de depender do grupo de WhatsApp.
            </h2>
            <p className="mt-5 leading-relaxed text-slate-300">
              O Master sabe quem pagou, quem confirmou presença, quem está na fila
              e quem entra no próximo jogo — sem discussão e sem planilha.
            </p>

            <button
              type="button"
              onClick={onCreate}
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-yellow-400 px-5 py-3 font-black text-emerald-950 transition hover:bg-yellow-300"
            >
              Começar agora <ArrowRight size={18} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <StatusCard icon={<ClipboardCheck size={24} />} label="Check-in" value="22 presentes" />
            <StatusCard icon={<DollarSign size={24} />} label="Em dia" value="18 liberados" />
            <StatusCard icon={<Users size={24} />} label="Fila" value="6 aguardando" />
            <StatusCard icon={<Trophy size={24} />} label="Jogo" value="3 x 2 ao vivo" />
          </div>
        </div>
      </section>

      <section id="escolinha" className="border-y border-yellow-100 bg-yellow-50 py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <GraduationCap size={38} className="mx-auto text-emerald-700" />
          <p className="mt-5 text-sm font-black uppercase tracking-[0.18em] text-emerald-700">
            Próxima evolução
          </p>
          <h2 className="mt-3 text-3xl font-black text-emerald-950 sm:text-4xl">
            Pelada, escola e evolução no mesmo JogoLindo.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl leading-relaxed text-slate-600">
            O sistema de peladas nasce conectado ao universo JogoLindo e, no futuro,
            poderá incluir desafios, aulas online e acompanhamento para jovens atletas.
          </p>
        </div>
      </section>

      <section id="planos" className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-emerald-700">
            Uma assinatura. Uma pelada organizada.
          </p>
          <h2 className="text-3xl font-black sm:text-4xl">
            JogoLindo Peladas por R$ 100 ao mês
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            O Master assina o sistema. Os pagamentos dos atletas pertencem à sua
            própria pelada e entram diretamente na conta financeira dela.
          </p>
        </div>

        <div className="overflow-hidden rounded-3xl border-2 border-emerald-800 bg-emerald-800 shadow-xl">
          <div className="grid lg:grid-cols-[.82fr_1.18fr]">
            <div className="bg-emerald-950 p-8 text-white sm:p-10">
              <div className="mb-5 inline-flex rounded-xl bg-yellow-400 p-3 text-emerald-950">
                <Zap size={25} />
              </div>

              <p className="text-sm font-black uppercase tracking-[0.16em] text-yellow-300">
                Assinatura mensal do Master
              </p>

              <p className="mt-3 text-5xl font-black">
                R$ 100
                <span className="text-xl font-medium text-emerald-100">/mês</span>
              </p>

              <p className="mt-4 text-sm leading-relaxed text-emerald-100">
                Uma assinatura por pelada, com gestão completa e estrutura para
                cobrança automática dos atletas.
              </p>

              <button
                type="button"
                onClick={onCreate}
                className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-yellow-400 px-5 py-4 font-black text-emerald-950 transition hover:bg-yellow-300"
              >
                Criar minha pelada
                <ArrowRight size={19} />
              </button>
            </div>

            <div className="bg-white p-8 sm:p-10">
              <h3 className="text-xl font-black text-slate-900">
                Tudo para a sua turma jogar melhor
              </h3>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <FeatureItem>Cadastro por convite de jogadores, goleiros e juiz</FeatureItem>
                <FeatureItem>Mensalidades e diárias dos atletas</FeatureItem>
                <FeatureItem>PIX e boleto na conta da própria pelada</FeatureItem>
                <FeatureItem>Confirmação automática de pagamento</FeatureItem>
                <FeatureItem>Multas, pendências e liberação para jogar</FeatureItem>
                <FeatureItem>Admins para operar presença e check-in</FeatureItem>
                <FeatureItem>Fila, sorteio de times, placar e rodízio</FeatureItem>
                <FeatureItem>Regras personalizadas de jogo e disciplina</FeatureItem>
                <FeatureItem>Ranking, estatísticas e histórico da turma</FeatureItem>
                <FeatureItem>Eventos regulares, extras e convidados diários</FeatureItem>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-slate-950 py-12 text-slate-400">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 md:grid-cols-3">
          <div>
            <div className="mb-5 flex items-center gap-3">
              <img
                src={logoJogoLindo}
                alt=""
                className="h-16 w-auto object-contain"
              />
              <BrandWordmark light />
            </div>

            <p className="max-w-xs text-sm leading-relaxed">
              Futebol organizado, atletas em evolução e uma comunidade apaixonada
              pelo jogo bonito.
            </p>
          </div>

          <div>
            <h3 className="mb-4 font-black text-white">JogoLindo</h3>
            <div className="flex flex-col gap-2 text-sm">
              <a href="#peladas" className="hover:text-yellow-300">Peladas</a>
              <a href="#gestao" className="hover:text-yellow-300">Gestão</a>
              <a href="#escolinha" className="hover:text-yellow-300">Escolinha</a>
              <a href="#planos" className="hover:text-yellow-300">Assinatura</a>
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-black text-white">JogoLindo Peladas</h3>
            <p className="text-sm leading-relaxed">
              Sua turma organizada.<br />
              Seu jogo acontecendo.
            </p>
            <button
              type="button"
              onClick={onCreate}
              className="mt-4 font-bold text-yellow-300 hover:text-yellow-200"
            >
              Criar minha pelada →
            </button>
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-6xl border-t border-slate-800 px-4 pt-6 text-xs sm:px-6">
          © 2026 JogoLindo. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
}

function BrandWordmark({ light = false }: { light?: boolean }) {
  return (
    <div className="leading-none">
      <div className="text-2xl font-black tracking-tight sm:text-3xl">
        <span className="text-yellow-300">Jogo</span>
        <span className={light ? 'text-white' : 'text-emerald-900'}>Lindo</span>
      </div>
      <span className="mt-1 block text-[9px] font-black uppercase tracking-[0.28em] text-emerald-200">
        Peladas
      </span>
    </div>
  );
}

function StatusCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-white/10 p-4">
      <div className="mb-3 text-yellow-300">{icon}</div>
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-sm font-black text-white">{value}</p>
    </div>
  );
}

function FeatureItem({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-start gap-2 text-sm leading-relaxed text-slate-700">
      <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-700" />
      <span>{children}</span>
    </div>
  );
}