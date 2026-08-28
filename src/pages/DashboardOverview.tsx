import {
  Users, AlertTriangle, Calendar, DollarSign, Trophy, TrendingUp, Zap,
  ArrowRight, CheckCircle2, Clock,
} from 'lucide-react';
import { useData } from '@/context/DataContext';
import { Card, StatCard } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface Props {
  onNavigate: (path: string) => void;
}

export function DashboardOverview({ onNavigate }: Props) {
  const { data } = useData();
  const { members, events, payments, pelada } = data;

  const activeMembers = members.filter((m) => m.status === 'ativo');
  const inadimplent = members.filter((m) => m.category === 'Mensalista' && !m.monthlyFeePaid);
  const todayEvent = events.find((e) => e.status === 'em_andamento');
  const nextEvent = events.find((e) => e.status === 'inscricoes_abertas') ?? todayEvent;

  const monthlyRevenue = members
    .filter((m) => m.category === 'Mensalista')
    .reduce((sum, m) => sum + pelada.monthlyFee, 0);
  const received = payments
    .filter((p) => p.type === 'mensalidade' && p.status === 'pago')
    .reduce((sum, p) => sum + p.amount, 0);
  const pending = payments
    .filter((p) => p.type === 'mensalidade' && (p.status === 'pendente' || p.status === 'atrasado'))
    .reduce((sum, p) => sum + p.amount, 0);
  const flamiliaFee = received * 0.05;
  const netBalance = received - flamiliaFee;

  const pendingTasks: string[] = [];
  if (inadimplent.length > 0) pendingTasks.push(`${inadimplent.length} jogador(es) com mensalidade pendente`);
  if (todayEvent) pendingTasks.push(`Evento em andamento - abra o Dia de Jogo`);
  const suspended = members.filter((m) => m.status === 'suspenso');
  if (suspended.length > 0) pendingTasks.push(`${suspended.length} jogador(es) suspenso(s)`);
  if (nextEvent && nextEvent.status === 'inscricoes_abertas') pendingTasks.push(`Confirmar presenças do próximo evento`);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Visão Geral</h1>
          <p className="text-gray-500 text-sm">{pelada.name}</p>
        </div>
        <Button size="lg" onClick={() => onNavigate('/dia-de-jogo')}>
          <Zap size={20} /> Abrir Dia de Jogo
        </Button>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <StatCard label="Jogadores Ativos" value={activeMembers.length} icon={<Users size={22} />} accent="green" subtitle={`${members.length} no total`} />
        <StatCard label="Inadimplentes" value={inadimplent.length} icon={<AlertTriangle size={22} />} accent="red" subtitle="Mensalistas atrasados" />
        <StatCard label="Próximo Evento" value={nextEvent ? formatDate(nextEvent.date) : '—'} icon={<Calendar size={22} />} accent="blue" subtitle={nextEvent?.startTime} />
        <StatCard label="Arrecadação Mensal" value={`R$ ${monthlyRevenue.toFixed(0)}`} icon={<DollarSign size={22} />} accent="green" subtitle="Previsto" />
        <StatCard label="Taxa Flamilia (5%)" value={`R$ ${flamiliaFee.toFixed(2)}`} icon={<TrendingUp size={22} />} accent="yellow" subtitle="Sobre recebido" />
        <StatCard label="Saldo Líquido" value={`R$ ${netBalance.toFixed(2)}`} icon={<Trophy size={22} />} accent="blue" subtitle="Destinado à pelada" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Pendências */}
        <Card className="p-5">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Clock size={20} className="text-orange-500" />
            Pendências
          </h2>
          {pendingTasks.length === 0 ? (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle2 size={20} />
              <span className="text-sm font-medium">Tudo em dia!</span>
            </div>
          ) : (
            <ul className="space-y-3">
              {pendingTasks.map((task, i) => (
                <li key={i} className="flex items-center justify-between gap-2 py-2 border-b border-gray-50 last:border-0">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-orange-400 rounded-full" />
                    <span className="text-sm text-gray-700">{task}</span>
                  </div>
                  <ArrowRight size={16} className="text-gray-300" />
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Próximo evento */}
        <Card className="p-5">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar size={20} className="text-blue-500" />
            Próximo Evento
          </h2>
          {nextEvent ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">{nextEvent.name}</p>
                  <p className="text-sm text-gray-500">{nextEvent.place}</p>
                </div>
                <Badge type={nextEvent.status} />
              </div>
              <div className="flex gap-4 text-sm text-gray-600">
                <span>{formatDate(nextEvent.date)}</span>
                <span>{nextEvent.startTime} - {nextEvent.endTime}</span>
              </div>
              <Button variant="outline" fullWidth onClick={() => onNavigate('/eventos')}>
                Ver eventos
              </Button>
            </div>
          ) : (
            <p className="text-gray-400 text-sm">Nenhum evento agendado</p>
          )}
        </Card>
      </div>

      {/* Financeiro resumo */}
      <Card className="p-5">
        <h2 className="font-bold text-gray-900 mb-4">Resumo Financeiro</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-xs text-gray-500 uppercase font-medium">Recebido</p>
            <p className="text-xl font-bold text-green-600">R$ {received.toFixed(0)}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 uppercase font-medium">Pendente</p>
            <p className="text-xl font-bold text-yellow-600">R$ {pending.toFixed(0)}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500 uppercase font-medium">Líquido</p>
            <p className="text-xl font-bold text-blue-600">R$ {netBalance.toFixed(0)}</p>
          </div>
        </div>
        <Button variant="ghost" fullWidth onClick={() => onNavigate('/financeiro')} className="mt-4">
          Ver financeiro completo <ArrowRight size={16} />
        </Button>
      </Card>
    </div>
  );
}
