import { type ReactNode } from 'react';
import {
  LayoutDashboard,
  Settings,
  Users,
  DollarSign,
  Calendar,
  Trophy,
  Shield,
  BarChart3,
  SlidersHorizontal,
  CircleDot,
} from 'lucide-react';

export interface NavItem {
  path: string;
  label: string;
  icon: ReactNode;
}

export const navItems: NavItem[] = [
  { path: '/dashboard', label: 'Visão geral', icon: <LayoutDashboard size={20} /> },
  { path: '/pelada', label: 'Minha Pelada', icon: <CircleDot size={20} /> },
  { path: '/participantes', label: 'Participantes', icon: <Users size={20} /> },
  { path: '/financeiro', label: 'Financeiro', icon: <DollarSign size={20} /> },
  { path: '/eventos', label: 'Eventos', icon: <Calendar size={20} /> },
  { path: '/dia-de-jogo', label: 'Dia de Jogo', icon: <Trophy size={20} /> },
  { path: '/disciplina', label: 'Disciplina', icon: <Shield size={20} /> },
  { path: '/ranking', label: 'Ranking', icon: <BarChart3 size={20} /> },
  { path: '/regras', label: 'Regras', icon: <SlidersHorizontal size={20} /> },
  { path: '/configuracoes', label: 'Configurações', icon: <Settings size={20} /> },
];

interface DashboardLayoutProps {
  children: ReactNode;
  currentPath: string;
  onNavigate: (path: string) => void;
  peladaName: string;
}

export function DashboardLayout({ children, currentPath, onNavigate, peladaName }: DashboardLayoutProps) {
  const current = navItems.find((n) => n.path === currentPath);
  const currentLabel = current?.label ?? 'Visão geral';

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 fixed left-0 top-0 bottom-0 bg-white border-r border-gray-100 z-30">
        <div className="px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-green-600 rounded-lg flex items-center justify-center">
              <Trophy size={20} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-gray-900 leading-tight">FLAMILIA</p>
              <p className="text-xs text-gray-400 leading-tight">{peladaName}</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-0.5">
          {navItems.map((item) => {
            const active = currentPath === item.path;
            const isDiaJogo = item.path === '/dia-de-jogo';
            return (
              <button
                key={item.path}
                onClick={() => onNavigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? 'bg-green-50 text-green-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                } ${isDiaJogo && !active ? 'text-green-600 font-semibold' : ''}`}
              >
                {item.icon}
                <span>{item.label}</span>
                {isDiaJogo && <span className="ml-auto w-2 h-2 bg-green-500 rounded-full animate-pulse" />}
              </button>
            );
          })}
        </nav>
        <div className="px-4 py-3 border-t border-gray-100">
          <button
            onClick={() => onNavigate('/')}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-gray-500 hover:bg-gray-50"
          >
            <LayoutDashboard size={18} />
            <span>Voltar ao site</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Mobile header */}
        <header className="lg:hidden sticky top-0 z-30 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <Trophy size={16} className="text-white" />
            </div>
            <span className="font-bold text-gray-900 text-sm">FLAMILIA</span>
          </div>
          <span className="text-sm font-medium text-gray-500">{currentLabel}</span>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 lg:pb-8 max-w-6xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Mobile bottom nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-30 px-1 py-1 flex items-center justify-around overflow-x-auto scrollbar-hide">
        {navItems.map((item) => {
          const active = currentPath === item.path;
          return (
            <button
              key={item.path}
              onClick={() => onNavigate(item.path)}
              className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg min-w-[58px] ${
                active ? 'text-green-600' : 'text-gray-400'
              }`}
            >
              {item.icon}
              <span className="text-[10px] font-medium leading-tight text-center">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
