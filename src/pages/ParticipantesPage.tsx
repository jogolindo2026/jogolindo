import { useState, useMemo } from 'react';
import {
  UserPlus, MoreVertical, Shield, Ban, Trash2, UserCog, X, Target, Hand, Trophy, Clock,
} from 'lucide-react';
import { useData } from '@/context/DataContext';
import { useToast } from '@/components/ui/Toast';
import type { Member, Position, Category } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Modal } from '@/components/ui/Modal';
import { Input, Select } from '@/components/ui/Form';
import { ProgressBar } from '@/components/ui/ProgressBar';

type Filter = 'todos' | 'em_dia' | 'pendentes' | 'goleiros' | 'convidados' | 'suspensos';

const filters: { key: Filter; label: string }[] = [
  { key: 'todos', label: 'Todos' },
  { key: 'em_dia', label: 'Em dia' },
  { key: 'pendentes', label: 'Pendentes' },
  { key: 'goleiros', label: 'Goleiros' },
  { key: 'convidados', label: 'Convidados' },
  { key: 'suspensos', label: 'Suspensos' },
];

const positions: Position[] = ['Goleiro', 'Zagueiro', 'Lateral', 'Meio-campo', 'Atacante'];
const categories: Category[] = ['Mensalista', 'Convidado', 'Goleiro'];

export function ParticipantesPage() {
  const { data, addMember, updateMember, removeMember } = useData();
  const { showToast } = useToast();
  const [filter, setFilter] = useState<Filter>('todos');
  const [detailMember, setDetailMember] = useState<Member | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [editMember, setEditMember] = useState<Member | null>(null);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return data.members.filter((m) => {
      switch (filter) {
        case 'em_dia': return m.paymentStatus === 'pago' || m.paymentStatus === 'liberado';
        case 'pendentes': return m.paymentStatus === 'pendente' || m.paymentStatus === 'atrasado';
        case 'goleiros': return m.category === 'Goleiro';
        case 'convidados': return m.category === 'Convidado';
        case 'suspensos': return m.status === 'suspenso';
        default: return true;
      }
    });
  }, [data.members, filter]);

  const handleAction = (member: Member, action: 'suspender' | 'bloquear' | 'remover' | 'convidado') => {
    setMenuOpen(null);
    switch (action) {
      case 'suspender':
        updateMember(member.id, { status: 'suspenso' });
        showToast('warning', `${member.name} suspenso`);
        break;
      case 'bloquear':
        updateMember(member.id, { status: 'bloqueado' });
        showToast('error', `${member.name} bloqueado`);
        break;
      case 'remover':
        removeMember(member.id);
        showToast('success', `${member.name} removido`);
        break;
      case 'convidado':
        updateMember(member.id, { category: 'Convidado', paymentStatus: 'pendente' });
        showToast('info', `${member.name} agora é convidado`);
        break;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Participantes</h1>
        <Button onClick={() => setShowAdd(true)}>
          <UserPlus size={18} /> Adicionar
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              filter === f.key ? 'bg-green-600 text-white' : 'bg-white text-gray-600 border border-gray-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-2">
        {filtered.map((member) => (
          <Card key={member.id} className="p-3">
            <div className="flex items-center gap-3">
              <Avatar name={member.name} size="md" src={member.avatar} />
              <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setDetailMember(member)}>
                <p className="font-semibold text-gray-900 truncate">{member.name}</p>
                <div className="flex items-center gap-2 flex-wrap mt-0.5">
                  <span className="text-xs text-gray-500">{member.position}</span>
                  <Badge type={member.category} />
                  <Badge type={member.status === 'ativo' ? member.paymentStatus : member.status} />
                </div>
              </div>
              <div className="relative">
                <button
                  onClick={() => setMenuOpen(menuOpen === member.id ? null : member.id)}
                  className="p-2 rounded-lg hover:bg-gray-100 text-gray-400"
                >
                  <MoreVertical size={18} />
                </button>
                {menuOpen === member.id && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(null)} />
                    <div className="absolute right-0 top-10 z-20 bg-white rounded-xl shadow-lg border border-gray-100 py-1 w-48">
                      <button onClick={() => { setEditMember(member); setMenuOpen(null); }} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <UserCog size={16} /> Editar
                      </button>
                      <button onClick={() => handleAction(member, 'suspender')} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-orange-600 hover:bg-orange-50">
                        <Shield size={16} /> Suspender
                      </button>
                      <button onClick={() => handleAction(member, 'bloquear')} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        <Ban size={16} /> Bloquear
                      </button>
                      <button onClick={() => handleAction(member, 'convidado')} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50">
                        <UserCog size={16} /> Registrar como convidado
                      </button>
                      <button onClick={() => handleAction(member, 'remover')} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                        <Trash2 size={16} /> Remover
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Detail Modal */}
      <Modal open={!!detailMember} onClose={() => setDetailMember(null)} title="Perfil do Jogador" size="lg">
        {detailMember && <MemberDetail member={detailMember} />}
      </Modal>

      {/* Add Modal */}
      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Adicionar Participante">
        <MemberForm
          onSubmit={(m) => {
            addMember(m);
            setShowAdd(false);
            showToast('success', 'Participante adicionado!');
          }}
          onCancel={() => setShowAdd(false)}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal open={!!editMember} onClose={() => setEditMember(null)} title="Editar Participante">
        {editMember && (
          <MemberForm
            member={editMember}
            onSubmit={(m) => {
              updateMember(editMember.id, m);
              setEditMember(null);
              showToast('success', 'Participante atualizado!');
            }}
            onCancel={() => setEditMember(null)}
          />
        )}
      </Modal>
    </div>
  );
}

function MemberDetail({ member }: { member: Member }) {
  const { data } = useData();
  const disciplineRecords = data.discipline.filter((d) => d.memberId === member.id);
  const winRate = member.gamesPlayed > 0 ? Math.round((member.wins / member.gamesPlayed) * 100) : 0;
  const behaviorLabel =
    member.status === 'suspenso' ? 'Suspenso' :
    member.behaviorScore >= 90 ? 'Excelente' :
    member.behaviorScore >= 75 ? 'Boa' :
    member.behaviorScore >= 60 ? 'Atenção' : 'Risco disciplinar';

  const behaviorColor = member.behaviorScore >= 90 ? 'green' : member.behaviorScore >= 75 ? 'blue' : member.behaviorScore >= 60 ? 'orange' : 'red';

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4">
        <Avatar name={member.name} size="xl" src={member.avatar} />
        <div>
          <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
          <p className="text-gray-500 text-sm">{member.position}</p>
          <div className="flex gap-2 mt-2">
            <Badge type={member.category} />
            <Badge type={member.status === 'ativo' ? member.paymentStatus : member.status} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Stat icon={<Trophy size={18} />} label="Jogos" value={member.gamesPlayed} color="text-blue-600" />
        <Stat icon={<Trophy size={18} />} label="Vitórias" value={member.wins} color="text-green-600" />
        <Stat icon={<Target size={18} />} label="Gols" value={member.goals} color="text-orange-600" />
        <Stat icon={<Hand size={18} />} label="Assistências" value={member.assists} color="text-purple-600" />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="bg-gray-50 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-gray-900">{member.draws}</p>
          <p className="text-xs text-gray-500">Empates</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-gray-900">{member.losses}</p>
          <p className="text-xs text-gray-500">Derrotas</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-gray-900">{winRate}%</p>
          <p className="text-xs text-gray-500">Aproveitamento</p>
        </div>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">Comportamento</p>
        <ProgressBar value={member.behaviorScore} max={100} color={behaviorColor as 'green' | 'blue' | 'orange' | 'red'} label={behaviorLabel} showValue />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-yellow-50 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-yellow-700">{member.yellowCards}</p>
          <p className="text-xs text-yellow-600">Cartões amarelos</p>
        </div>
        <div className="bg-red-50 rounded-xl p-3 text-center">
          <p className="text-2xl font-bold text-red-700">{member.redCards}</p>
          <p className="text-xs text-red-600">Cartões vermelhos</p>
        </div>
      </div>

      {disciplineRecords.length > 0 && (
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Histórico de disciplina</p>
          <div className="space-y-2">
            {disciplineRecords.map((r) => (
              <div key={r.id} className="flex items-start gap-2 bg-gray-50 rounded-lg p-3 text-sm">
                <div className={`w-2 h-2 rounded-full mt-1.5 ${r.card === 'amarelo' ? 'bg-yellow-400' : 'bg-red-500'}`} />
                <div className="flex-1">
                  <p className="text-gray-800 font-medium">{r.card === 'amarelo' ? 'Cartão amarelo' : 'Cartão vermelho'}</p>
                  <p className="text-gray-500 text-xs">{r.reason} - {new Date(r.date + 'T00:00:00').toLocaleDateString('pt-BR')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-gray-500">Telefone</p>
          <p className="font-medium text-gray-900">{member.phone ?? '—'}</p>
        </div>
        <div>
          <p className="text-gray-500">E-mail</p>
          <p className="font-medium text-gray-900 truncate">{member.email ?? '—'}</p>
        </div>
        <div>
          <p className="text-gray-500">Presenças</p>
          <p className="font-medium text-gray-900">{member.presentCount}</p>
        </div>
        <div>
          <p className="text-gray-500">Entrou em</p>
          <p className="font-medium text-gray-900">{new Date(member.joinedAt + 'T00:00:00').toLocaleDateString('pt-BR')}</p>
        </div>
      </div>
    </div>
  );
}

function Stat({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color: string }) {
  return (
    <div className="bg-gray-50 rounded-xl p-3 text-center">
      <div className={`flex justify-center mb-1 ${color}`}>{icon}</div>
      <p className="text-xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  );
}

interface MemberFormProps {
  member?: Member;
  onSubmit: (m: Omit<Member, 'id' | 'peladaId' | 'joinedAt'>) => void;
  onCancel: () => void;
}

function MemberForm({ member, onSubmit, onCancel }: MemberFormProps) {
  const [name, setName] = useState(member?.name ?? '');
  const [position, setPosition] = useState<Position>(member?.position ?? 'Meio-campo');
  const [category, setCategory] = useState<Category>(member?.category ?? 'Mensalista');
  const [phone, setPhone] = useState(member?.phone ?? '');
  const [email, setEmail] = useState(member?.email ?? '');

  const submit = () => {
    if (!name.trim()) return;
    onSubmit({
      name: name.trim(),
      position,
      category,
      phone,
      email,
      status: member?.status ?? 'ativo',
      paymentStatus: member?.paymentStatus ?? (category === 'Goleiro' ? 'liberado' : 'pendente'),
      monthlyFeePaid: member?.monthlyFeePaid ?? false,
      gamesPlayed: member?.gamesPlayed ?? 0,
      wins: member?.wins ?? 0,
      draws: member?.draws ?? 0,
      losses: member?.losses ?? 0,
      goals: member?.goals ?? 0,
      assists: member?.assists ?? 0,
      yellowCards: member?.yellowCards ?? 0,
      redCards: member?.redCards ?? 0,
      suspensionsLeft: member?.suspensionsLeft ?? 0,
      presentCount: member?.presentCount ?? 0,
      behaviorScore: member?.behaviorScore ?? 100,
      avatar: member?.avatar,
    });
  };

  return (
    <div className="space-y-4">
      <Input label="Nome" value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome do jogador" />
      <div className="grid grid-cols-2 gap-3">
        <Select label="Posição" value={position} onChange={(e) => setPosition(e.target.value as Position)} options={positions.map((p) => ({ value: p, label: p }))} />
        <Select label="Categoria" value={category} onChange={(e) => setCategory(e.target.value as Category)} options={categories.map((c) => ({ value: c, label: c }))} />
      </div>
      <Input label="Telefone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(21) 99999-9999" />
      <Input label="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@email.com" />
      <div className="flex gap-3 justify-end">
        <Button variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button onClick={submit}>{member ? 'Salvar' : 'Adicionar'}</Button>
      </div>
    </div>
  );
}
