import { useState } from 'react';
import { Shield, Plus, AlertTriangle, CreditCard } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { useToast } from '@/components/ui/Toast';
import type { CardColor } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Modal } from '@/components/ui/Modal';
import { Select, Textarea } from '@/components/ui/Form';

export function DisciplinaPage() {
  const { data, registerDiscipline } = useData();
  const { showToast } = useToast();
  const [showAdd, setShowAdd] = useState(false);

  const sorted = [...data.discipline].sort((a, b) => b.date.localeCompare(a.date));

  const suspended = data.members.filter(
    (member) => member.status === 'suspenso' || member.status === 'bloqueado'
  );

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    .toISOString()
    .slice(0, 10);

  const yellowThisMonth = data.members
    .map((member) => {
      const count = data.discipline.filter(
        (record) =>
          record.memberId === member.id &&
          record.card === 'amarelo' &&
          record.date >= monthStart
      ).length;

      return { member, count };
    })
    .filter((item) => item.count > 0);

  const limit = data.rules.disciplineSettings.yellowMonthLimit;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Disciplina</h1>
          <p className="text-sm text-gray-500">
            Cartões, suspensões e multas da pelada
          </p>
        </div>

        <Button onClick={() => setShowAdd(true)}>
          <Plus size={18} /> Registrar ocorrência
        </Button>
      </div>

      <Card className="p-4">
        <h2 className="mb-3 flex items-center gap-2 font-bold text-gray-900">
          <Shield size={20} className="text-red-500" />
          Suspensos e bloqueados ({suspended.length})
        </h2>

        {suspended.length === 0 ? (
          <p className="text-sm text-gray-400">Nenhum jogador suspenso ou bloqueado</p>
        ) : (
          <div className="space-y-2">
            {suspended.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-3 rounded-lg bg-red-50 p-3"
              >
                <Avatar name={member.name} size="sm" />

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900">{member.name}</p>
                  {member.disciplineNote && (
                    <p className="text-xs text-red-600">{member.disciplineNote}</p>
                  )}
                </div>

                <Badge type="danger">
                  {member.expelledAt
                    ? 'Expulso'
                    : member.status === 'bloqueado'
                      ? 'Bloqueado'
                      : 'Suspenso'}
                </Badge>

                {member.suspensionsLeft > 0 && (
                  <span className="text-xs text-red-500">
                    {member.suspensionsLeft} pelada(s)
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card className="p-4">
        <h2 className="mb-3 flex items-center gap-2 font-bold text-gray-900">
          <AlertTriangle size={20} className="text-yellow-500" />
          Amarelos acumulados no mês
        </h2>

        <p className="mb-3 text-xs text-gray-500">
          Amarelo é advertência. Ao atingir o limite, o sistema aplica a regra
          configurada pela pelada.
        </p>

        {yellowThisMonth.length === 0 ? (
          <p className="text-sm text-gray-400">Nenhum cartão amarelo este mês</p>
        ) : (
          <div className="space-y-2">
            {yellowThisMonth.map(({ member, count }) => (
              <div key={member.id} className="flex items-center gap-3">
                <Avatar name={member.name} size="sm" />

                <span className="flex-1 text-sm font-medium text-gray-800">
                  {member.name}
                </span>

                <div className="flex gap-0.5">
                  {Array.from({ length: Math.max(limit, count) }).map((_, index) => (
                    <div
                      key={index}
                      className={`h-6 w-4 rounded-sm ${
                        index < count ? 'bg-yellow-400' : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>

                <span
                  className={`text-xs font-medium ${
                    limit > 0 && count >= limit ? 'text-red-600' : 'text-gray-500'
                  }`}
                >
                  {limit > 0 && count >= limit ? 'Regra aplicada' : `${count}/${limit}`}
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card className="p-4">
        <h2 className="mb-3 font-bold text-gray-900">Histórico de ocorrências</h2>

        {sorted.length === 0 ? (
          <p className="text-sm text-gray-400">Nenhuma ocorrência registrada</p>
        ) : (
          <div className="space-y-2">
            {sorted.map((record) => (
              <div
                key={record.id}
                className="flex items-start gap-3 border-b border-gray-50 py-2 last:border-0"
              >
                <div
                  className={`mt-1.5 h-3 w-3 rounded-full ${
                    record.card === 'amarelo' ? 'bg-yellow-400' : 'bg-red-500'
                  }`}
                />

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium text-gray-900">
                      {record.memberName}
                    </span>

                    <Badge type={record.card === 'amarelo' ? 'warning' : 'danger'}>
                      {record.card === 'amarelo' ? 'Amarelo' : 'Vermelho'}
                    </Badge>

                    {record.fineAmount && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-red-600">
                        <CreditCard size={13} />
                        Multa R$ {record.fineAmount.toFixed(2)}
                      </span>
                    )}
                  </div>

                  <p className="mt-0.5 text-xs text-gray-500">{record.reason}</p>

                  <p className="text-xs text-gray-400">
                    {new Date(`${record.date}T00:00:00`).toLocaleDateString('pt-BR')} —{' '}
                    {record.consequence}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Modal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        title="Registrar ocorrência"
      >
        <DisciplineForm
          members={data.members
            .filter((member) => !member.expelledAt)
            .map((member) => ({ id: member.id, name: member.name }))}
          events={data.events.map((event) => ({
            id: event.id,
            label: `${event.name} — ${new Date(`${event.date}T00:00:00`).toLocaleDateString('pt-BR')}`,
          }))}
          onSubmit={(input) => {
            registerDiscipline(input);
            setShowAdd(false);
            showToast(
              'success',
              'Ocorrência registrada e regra disciplinar aplicada.'
            );
          }}
          onCancel={() => setShowAdd(false)}
        />
      </Modal>
    </div>
  );
}

function DisciplineForm({
  members,
  events,
  onSubmit,
  onCancel,
}: {
  members: { id: string; name: string }[];
  events: { id: string; label: string }[];
  onSubmit: (input: {
    memberId: string;
    eventId: string;
    card: CardColor;
    reason: string;
  }) => void;
  onCancel: () => void;
}) {
  const [memberId, setMemberId] = useState(members[0]?.id ?? '');
  const [eventId, setEventId] = useState(events[0]?.id ?? '');
  const [card, setCard] = useState<CardColor>('amarelo');
  const [reason, setReason] = useState('');

  const canSubmit = Boolean(memberId && eventId);

  return (
    <div className="space-y-4">
      <Select
        label="Jogador"
        value={memberId}
        onChange={(event) => setMemberId(event.target.value)}
        options={members.map((member) => ({
          value: member.id,
          label: member.name,
        }))}
      />

      <Select
        label="Evento"
        value={eventId}
        onChange={(event) => setEventId(event.target.value)}
        options={events.map((event) => ({
          value: event.id,
          label: event.label,
        }))}
      />

      <Select
        label="Cartão"
        value={card}
        onChange={(event) => setCard(event.target.value as CardColor)}
        options={[
          { value: 'amarelo', label: 'Amarelo — advertência' },
          { value: 'vermelho', label: 'Vermelho — aplicar regra da pelada' },
        ]}
      />

      <Textarea
        label="Motivo"
        value={reason}
        onChange={(event) => setReason(event.target.value)}
        placeholder="Descreva a ocorrência..."
        rows={3}
      />

      {!events.length && (
        <p className="rounded-lg bg-yellow-50 p-3 text-xs text-yellow-700">
          Crie um evento antes de registrar uma ocorrência.
        </p>
      )}

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>

        <Button
          disabled={!canSubmit}
          onClick={() =>
            onSubmit({
              memberId,
              eventId,
              card,
              reason: reason || 'Não informado',
            })
          }
        >
          Registrar
        </Button>
      </div>
    </div>
  );
}