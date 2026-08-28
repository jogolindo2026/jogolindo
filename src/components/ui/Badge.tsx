import type { PaymentStatus, MemberStatus, Category, EventStatus, MatchStatus } from '@/types';

type BadgeType = PaymentStatus | MemberStatus | Category | EventStatus | MatchStatus | 'info' | 'success' | 'warning' | 'danger';

const styles: Record<string, string> = {
  // Payment
  pago: 'bg-green-100 text-green-700',
  pendente: 'bg-yellow-100 text-yellow-700',
  atrasado: 'bg-red-100 text-red-700',
  isento: 'bg-gray-100 text-gray-600',
  liberado: 'bg-blue-100 text-blue-700',
  // Member
  ativo: 'bg-green-100 text-green-700',
  suspenso: 'bg-red-100 text-red-700',
  bloqueado: 'bg-gray-800 text-white',
  // Category
  Mensalista: 'bg-blue-100 text-blue-700',
  Convidado: 'bg-purple-100 text-purple-700',
  Goleiro: 'bg-orange-100 text-orange-700',
  // Event
  rascunho: 'bg-gray-100 text-gray-600',
  inscricoes_abertas: 'bg-blue-100 text-blue-700',
  em_andamento: 'bg-green-100 text-green-700',
  encerrado: 'bg-gray-200 text-gray-500',
  // Match
  agendado: 'bg-gray-100 text-gray-600',
  em_andamento: 'bg-green-100 text-green-700',
  finalizado: 'bg-gray-200 text-gray-500',
  penaltis: 'bg-yellow-100 text-yellow-700',
  // Generic
  info: 'bg-blue-100 text-blue-700',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-yellow-100 text-yellow-700',
  danger: 'bg-red-100 text-red-700',
};

const labels: Record<string, string> = {
  pago: 'Pago',
  pendente: 'Pendente',
  atrasado: 'Atrasado',
  isento: 'Isento',
  liberado: 'Liberado',
  ativo: 'Ativo',
  suspenso: 'Suspenso',
  bloqueado: 'Bloqueado',
  rascunho: 'Rascunho',
  inscricoes_abertas: 'Inscrições Abertas',
  em_andamento: 'Em Andamento',
  encerrado: 'Encerrado',
  agendado: 'Agendado',
  finalizado: 'Finalizado',
  penaltis: 'Pênaltis',
};

export function Badge({ type, children, className = '' }: { type: BadgeType; children?: React.ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${styles[type] ?? styles.info} ${className}`}>
      {children ?? labels[type] ?? type}
    </span>
  );
}
