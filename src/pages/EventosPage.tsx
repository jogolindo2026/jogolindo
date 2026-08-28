import { useState, useMemo } from 'react';
import { Plus, Calendar, MapPin, Users, Clock, CheckCircle2, XCircle, AlertCircle, Lock } from 'lucide-react';
import { useData } from '@/context/DataContext';
import { useToast } from '@/components/ui/Toast';
import type { AppEvent } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Input, Select } from '@/components/ui/Form';

export function EventosPage() {
  const { data, addEvent, updateEvent } = useData();
  const { showToast } = useToast();
  const [showCreate, setShowCreate] = useState(false);
  const [detailEvent, setDetailEvent] = useState<AppEvent | null>(null);

  const sorted = useMemo(() => [...data.events].sort((a, b) => b.date.localeCompare(a.date)), [data.events]);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  const getAttendance = (eventId: string) => data.attendance.filter((a) => a.eventId === eventId);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Eventos</h1>
        <Button onClick={() => setShowCreate(true)}>
          <Plus size={18} /> Criar evento
        </Button>
      </div>

      <div className="space-y-3">
        {sorted.map((event) => {
          const att = getAttendance(event.id);
          const confirmed = att.filter((a) => a.status === 'confirmado' || a.status === 'presente').length;
          return (
            <Card key={event.id} className="p-4" onClick={() => setDetailEvent(event)}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar size={18} className="text-green-600" />
                    <p className="font-bold text-gray-900">{event.name}</p>
                  </div>
                  <div className="space-y-1 text-sm text-gray-500">
                    <p className="flex items-center gap-1.5"><MapPin size={14} /> {event.place}</p>
                    <p className="flex items-center gap-1.5"><Clock size={14} /> {event.startTime} - {event.endTime}</p>
                    <p className="flex items-center gap-1.5"><Users size={14} /> {confirmed} confirmados / {event.capacity} vagas</p>
                  </div>
                </div>
                <Badge type={event.status} />
              </div>
            </Card>
          );
        })}
      </div>

      {/* Create modal */}
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Criar Evento">
        <EventForm
          peladaPlace={data.pelada.place}
          onSubmit={(e) => {
            addEvent(e);
            setShowCreate(false);
            showToast('success', 'Evento criado!');
          }}
          onCancel={() => setShowCreate(false)}
        />
      </Modal>

      {/* Detail modal */}
      <Modal open={!!detailEvent} onClose={() => setDetailEvent(null)} title="Detalhes do Evento" size="lg">
        {detailEvent && (
          <EventDetail
            event={detailEvent}
            attendance={getAttendance(detailEvent.id)}
            members={data.members}
            onStatusChange={(status) => {
              updateEvent(detailEvent.id, { status });
              setDetailEvent({ ...detailEvent, status });
              showToast('success', 'Status do evento atualizado!');
            }}
          />
        )}
      </Modal>
    </div>
  );
}

function EventForm({ onSubmit, onCancel, peladaPlace }: { onSubmit: (e: Omit<AppEvent, 'id' | 'createdAt'>) => void; onCancel: () => void; peladaPlace: string }) {
  const today = new Date().toISOString().slice(0, 10);
  const [name, setName] = useState('');
  const [date, setDate] = useState(today);
  const [startTime, setStartTime] = useState('20:00');
  const [endTime, setEndTime] = useState('22:00');
  const [place, setPlace] = useState(peladaPlace);
  const [type, setType] = useState<'regular' | 'extra'>('regular');
  const [capacity, setCapacity] = useState(22);

  return (
    <div className="space-y-4">
      <Input label="Nome" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ex: Pelada de quarta" />
      <div className="grid grid-cols-2 gap-3">
        <Input label="Data" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        <Input label="Capacidade" type="number" value={capacity} onChange={(e) => setCapacity(Number(e.target.value))} />
        <Input label="Início" type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
        <Input label="Fim" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
      </div>
      <Input label="Local" value={place} onChange={(e) => setPlace(e.target.value)} />
      <Select label="Tipo" value={type} onChange={(e) => setType(e.target.value as 'regular' | 'extra')} options={[{ value: 'regular', label: 'Regular' }, { value: 'extra', label: 'Extra' }]} />
      <div className="flex gap-3 justify-end">
        <Button variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button onClick={() => onSubmit({ name: name || 'Pelada', date, startTime, endTime, place, type, status: 'inscricoes_abertas', capacity, peladaId: 'pelada-1' })}>Criar</Button>
      </div>
    </div>
  );
}

function EventDetail({ event, attendance, members, onStatusChange }: {
  event: AppEvent;
  attendance: { memberId: string; memberName: string; status: string }[];
  members: { id: string; name: string; avatar?: string; category: string; paymentStatus: string }[];
  onStatusChange: (status: AppEvent['status']) => void;
}) {
  const confirmed = attendance.filter((a) => a.status === 'confirmado' || a.status === 'presente');
  const pending = attendance.filter((a) => a.status === 'pendente');
  const waitlist = members.filter((m) => !attendance.find((a) => a.memberId === m.id)).slice(0, 5);

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 rounded-xl p-4">
        <p className="font-bold text-gray-900">{event.name}</p>
        <div className="text-sm text-gray-500 mt-1 space-y-1">
          <p>{new Date(event.date + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
          <p>{event.startTime} - {event.endTime} | {event.place}</p>
          <p>Capacidade: {event.capacity}</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant={event.status === 'inscricoes_abertas' ? 'primary' : 'outline'} onClick={() => onStatusChange('inscricoes_abertas')}>
          Abrir inscrições
        </Button>
        <Button size="sm" variant={event.status === 'em_andamento' ? 'primary' : 'outline'} onClick={() => onStatusChange('em_andamento')}>
          Iniciar
        </Button>
        <Button size="sm" variant={event.status === 'encerrado' ? 'danger' : 'outline'} onClick={() => onStatusChange('encerrado')}>
          <Lock size={16} /> Encerrar
        </Button>
      </div>

      <div>
        <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
          <CheckCircle2 size={18} className="text-green-600" /> Confirmados ({confirmed.length})
        </h4>
        <div className="space-y-1">
          {confirmed.map((a) => (
            <div key={a.memberId} className="flex items-center justify-between bg-green-50 rounded-lg px-3 py-2 text-sm">
              <span className="text-gray-800">{a.memberName}</span>
              {a.status === 'presente' && <Badge type="success">Presente</Badge>}
            </div>
          ))}
        </div>
      </div>

      {pending.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <AlertCircle size={18} className="text-yellow-500" /> Pendentes ({pending.length})
          </h4>
          <div className="space-y-1">
            {pending.map((a) => (
              <div key={a.memberId} className="flex items-center justify-between bg-yellow-50 rounded-lg px-3 py-2 text-sm">
                <span className="text-gray-800">{a.memberName}</span>
                <Badge type="warning">Pendente</Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {waitlist.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <Users size={18} className="text-gray-400" /> Lista de espera
          </h4>
          <div className="space-y-1">
            {waitlist.map((m) => (
              <div key={m.id} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2 text-sm">
                <span className="text-gray-600">{m.name}</span>
                <XCircle size={16} className="text-gray-300" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
