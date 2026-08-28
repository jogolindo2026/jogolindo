import { useState, useEffect, useMemo, useRef } from 'react';
import {
  Trophy, CheckCircle2, Clock, Users, ArrowUp, ArrowDown, Shuffle, Play,
  Plus, Target, Hand, Square, AlertTriangle, X, Timer, Crown, RefreshCw,
} from 'lucide-react';
import { useData } from '@/context/DataContext';
import { useToast } from '@/components/ui/Toast';
import type { Match, Team, MatchEvent, TeamColor, Member, QueueEntry } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Modal } from '@/components/ui/Modal';

type Tab = 'presenca' | 'fila' | 'times' | 'jogo';

export function DiaDeJogoPage() {
  const { data, updateEvent, updateMatch, addMatch, setQueue, updateMember, addDiscipline } = useData();
  const { showToast } = useToast();
  const [tab, setTab] = useState<Tab>('presenca');

  const todayEvent = data.events.find((e) => e.status === 'em_andamento') ?? data.events.find((e) => e.date === new Date().toISOString().slice(0, 10));
  const eventMatches = useMemo(() => data.matches.filter((m) => m.eventId === todayEvent?.id), [data.matches, todayEvent]);
  const liveMatch = eventMatches.find((m) => m.status === 'em_andamento');
  const [finishModal, setFinishModal] = useState<Match | null>(null);
  const [penaltyModal, setPenaltyModal] = useState<Match | null>(null);

  if (!todayEvent) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">Dia de Jogo</h1>
        <Card className="p-8 text-center">
          <Trophy size={48} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">Nenhum evento em andamento.</p>
          <p className="text-gray-400 text-sm mt-1">Crie ou inicie um evento na aba Eventos.</p>
        </Card>
      </div>
    );
  }

  const eventAttendance = data.attendance.filter((a) => a.eventId === todayEvent.id);
  const eventQueue = data.queue.filter((q) => q.eventId === todayEvent.id).sort((a, b) => a.position - b.position);

  const closeEvent = () => {
    updateEvent(todayEvent.id, { status: 'encerrado' });
    showToast('success', 'Evento encerrado!');
  };

  const tabs: { key: Tab; label: string }[] = [
    { key: 'presenca', label: 'Presença' },
    { key: 'fila', label: 'Fila' },
    { key: 'times', label: 'Times' },
    { key: 'jogo', label: 'Jogo' },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="p-4 bg-gradient-to-br from-green-600 to-emerald-700 text-white border-0">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold">{todayEvent.name}</h1>
            <p className="text-green-100 text-sm mt-1">
              {new Date(todayEvent.date + 'T00:00:00').toLocaleDateString('pt-BR')} | {todayEvent.startTime} - {todayEvent.endTime} | {todayEvent.place}
            </p>
          </div>
          <Button variant="danger" size="sm" onClick={closeEvent}>Encerrar</Button>
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex gap-1 bg-white rounded-xl p-1 border border-gray-100">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
              tab === t.key ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            {t.label}
            {t.key === 'jogo' && liveMatch && <span className="ml-1 w-2 h-2 bg-red-400 rounded-full inline-block animate-pulse" />}
          </button>
        ))}
      </div>

      {tab === 'presenca' && <PresenceTab eventAttendance={eventAttendance} members={data.members} eventId={todayEvent.id} />}
      {tab === 'fila' && <QueueTab queue={eventQueue} eventId={todayEvent.id} onSetQueue={setQueue} />}
      {tab === 'times' && <TeamsTab members={data.members} queue={eventQueue} eventAttendance={eventAttendance} liveMatch={liveMatch} eventMatches={eventMatches} onAddMatch={addMatch} showToast={showToast} />}
      {tab === 'jogo' && (
        <MatchTab
          matches={eventMatches}
          members={data.members}
          liveMatch={liveMatch}
          onFinish={(m) => setFinishModal(m)}
          onPenalty={(m) => setPenaltyModal(m)}
          onUpdateMatch={updateMatch}
          onAddDiscipline={addDiscipline}
          showToast={showToast}
          eventId={todayEvent.id}
          rules={data.rules}
          queue={eventQueue}
          onSetQueue={setQueue}
          onAddMatch={addMatch}
          updateMember={updateMember}
        />
      )}

      {/* Finish modal */}
      <Modal open={!!finishModal} onClose={() => setFinishModal(null)} title="Finalizar Partida">
        {finishModal && (
          <FinishMatchModal
            match={finishModal}
            onConfirm={(winnerId) => {
              updateMatch(finishModal.id, {
                status: 'finalizado',
                winnerTeamId: winnerId,
                finishedAt: new Date().toISOString(),
                scoreA: finishModal.teamA.score,
                scoreB: finishModal.teamB.score,
              });
              setFinishModal(null);
              showToast('success', 'Partida finalizada! Preparando próximo jogo...');
            }}
            onCancel={() => setFinishModal(null)}
          />
        )}
      </Modal>

      {/* Penalty modal */}
      <Modal open={!!penaltyModal} onClose={() => setPenaltyModal(null)} title="Disputa de Pênaltis">
        {penaltyModal && (
          <PenaltyModal
            match={penaltyModal}
            onConfirm={(scoreA, scoreB) => {
              const winner = scoreA > scoreB ? penaltyModal.teamA.id : penaltyModal.teamB.id;
              updateMatch(penaltyModal.id, {
                status: 'finalizado',
                isPenalties: true,
                penaltyScoreA: scoreA,
                penaltyScoreB: scoreB,
                winnerTeamId: winner,
                finishedAt: new Date().toISOString(),
                scoreA: penaltyModal.teamA.score,
                scoreB: penaltyModal.teamB.score,
              });
              setPenaltyModal(null);
              showToast('success', 'Disputa de pênaltis finalizada!');
            }}
            onCancel={() => setPenaltyModal(null)}
          />
        )}
      </Modal>
    </div>
  );
}

// ---------- Presence Tab ----------

function PresenceTab({ eventAttendance, members, eventId }: { eventAttendance: { id: string; memberId: string; memberName: string; status: string; checkedInAt: string | null }[]; members: Member[]; eventId: string }) {
  const { showToast } = useToast();
  const { updateMember } = useData();
  const [payModal, setPayModal] = useState<Member | null>(null);

  const getMember = (id: string) => members.find((m) => m.id === id);

  const checkIn = (attId: string, memberId: string) => {
    const member = getMember(memberId);
    if (!member) return;
    if (member.status === 'suspenso') {
      showToast('error', 'Jogador suspenso não pode fazer check-in');
      return;
    }
    if (member.paymentStatus === 'pendente' || member.paymentStatus === 'atrasado') {
      setPayModal(member);
      return;
    }
    showToast('success', `${member.name} fez check-in!`);
  };

  const statusColor = (member: Member | undefined) => {
    if (!member) return 'gray';
    if (member.status === 'suspenso' || member.status === 'bloqueado') return 'red';
    if (member.paymentStatus === 'pago' || member.paymentStatus === 'liberado') return 'green';
    if (member.category === 'Convidado') return 'yellow';
    return 'red';
  };

  const colorMap: Record<string, string> = {
    green: 'border-l-green-500 bg-green-50',
    yellow: 'border-l-yellow-500 bg-yellow-50',
    red: 'border-l-red-500 bg-red-50',
    gray: 'border-l-gray-300 bg-gray-50',
  };

  return (
    <div className="space-y-2">
      <p className="text-sm text-gray-500">Toque para fazer check-in. Verde = liberado, Amarelo = convidado, Vermelho = pendente/suspenso</p>
      {eventAttendance.map((att) => {
        const member = getMember(att.memberId);
        const color = statusColor(member);
        return (
          <Card key={att.id} className={`p-3 border-l-4 ${colorMap[color]}`}>
            <div className="flex items-center gap-3">
              <Avatar name={att.memberName} size="md" src={member?.avatar} />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">{att.memberName}</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs text-gray-500">{member?.position}</span>
                  {member && <Badge type={member.category} />}
                  {att.checkedInAt && <span className="text-xs text-green-600 flex items-center gap-1"><CheckCircle2 size={12} /> {att.checkedInAt.slice(11, 16)}</span>}
                </div>
              </div>
              {att.checkedInAt ? (
                <Badge type="success">Presente</Badge>
              ) : (
                <Button size="sm" variant="primary" onClick={() => checkIn(att.id, att.memberId)}>
                  Check-in
                </Button>
              )}
            </div>
          </Card>
        );
      })}

      {/* Pay modal */}
      <Modal open={!!payModal} onClose={() => setPayModal(null)} title="Regularizar Pagamento">
        {payModal && (
          <div className="space-y-4">
            <p className="text-gray-600">{payModal.name} está com mensalidade pendente.</p>
            <div className="bg-yellow-50 rounded-xl p-4 text-center">
              <p className="text-sm text-gray-500">Valor devido</p>
              <p className="text-2xl font-bold text-gray-900">R$ 100,00</p>
            </div>
            <Button fullWidth size="lg" variant="success" onClick={() => {
              updateMember(payModal.id, { paymentStatus: 'pago', monthlyFeePaid: true });
              setPayModal(null);
              showToast('success', 'Pagamento regularizado! Jogador liberado.');
            }}>
              Marcar como pago
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
}

// ---------- Queue Tab ----------

function QueueTab({ queue, eventId, onSetQueue }: { queue: QueueEntry[]; eventId: string; onSetQueue: (eventId: string, entries: { memberId: string; memberName: string; joinedAt: string }[]) => void }) {
  const { showToast } = useToast();

  const move = (index: number, dir: 'up' | 'down') => {
    const newQueue = [...queue];
    const swap = dir === 'up' ? index - 1 : index + 1;
    if (swap < 0 || swap >= newQueue.length) return;
    [newQueue[index], newQueue[swap]] = [newQueue[swap], newQueue[index]];
    onSetQueue(eventId, newQueue.map((q) => ({ memberId: q.memberId, memberName: q.memberName, joinedAt: q.joinedAt })));
  };

  const shuffle = () => {
    const shuffled = [...queue].sort(() => Math.random() - 0.5);
    onSetQueue(eventId, shuffled.map((q) => ({ memberId: q.memberId, memberName: q.memberName, joinedAt: q.joinedAt })));
    showToast('success', 'Fila sorteada!');
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">Ordem de chegada</p>
        <Button size="sm" variant="outline" onClick={shuffle}>
          <Shuffle size={16} /> Sortear fila
        </Button>
      </div>

      {queue.length === 0 && (
        <Card className="p-8 text-center">
          <Users size={40} className="mx-auto text-gray-300 mb-2" />
          <p className="text-gray-400 text-sm">Fila vazia</p>
        </Card>
      )}

      <div className="space-y-2">
        {queue.map((entry, i) => (
          <Card key={entry.id} className="p-3">
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm ${i < 2 ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'}`}>
                {i + 1}
              </div>
              <Avatar name={entry.memberName} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{entry.memberName}</p>
                {i < 2 && <p className="text-xs text-green-600 font-medium">Próximo a entrar</p>}
              </div>
              <div className="flex gap-1">
                <button onClick={() => move(i, 'up')} disabled={i === 0} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 disabled:opacity-30">
                  <ArrowUp size={16} />
                </button>
                <button onClick={() => move(i, 'down')} disabled={i === queue.length - 1} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 disabled:opacity-30">
                  <ArrowDown size={16} />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {queue.length >= 2 && (
        <Card className="p-4 bg-green-50 border-green-200">
          <p className="text-sm text-green-800 font-medium flex items-center gap-2">
            <Trophy size={18} /> Próximos a entrar: {queue[0]?.memberName} e {queue[1]?.memberName}
          </p>
        </Card>
      )}
    </div>
  );
}

// ---------- Teams Tab ----------

function TeamsTab({
  members,
  queue,
  eventAttendance,
  liveMatch,
  eventMatches,
  onAddMatch,
  showToast,
}: {
  members: Member[];
  queue: QueueEntry[];
  eventAttendance: { memberId: string; status: string }[];
  liveMatch: Match | undefined;
  eventMatches: Match[];
  onAddMatch: (m: Match) => void;
  showToast: (
    type: 'success' | 'error' | 'info' | 'warning',
    msg: string
  ) => void;
}) {
  const { data } = useData();
  const playersPerTeam = data.pelada.playersPerTeam;
  const goalkeepers = members.filter((m) => m.category === 'Goleiro');

  const presentIds = eventAttendance
    .filter((a) => a.status === 'presente')
    .map((a) => a.memberId);

  const availablePlayers = members.filter(
    (m) =>
      presentIds.includes(m.id) &&
      m.category !== 'Goleiro' &&
      m.status === 'ativo' &&
      (m.paymentStatus === 'pago' || m.paymentStatus === 'liberado')
  );

  const sortTeams = () => {
    if (availablePlayers.length < playersPerTeam * 2) {
      showToast(
        'error',
        `Precisa de pelo menos ${playersPerTeam * 2} jogadores em campo`
      );
      return;
    }

    const shuffled = [...availablePlayers].sort(() => Math.random() - 0.5);

    const teamAIds = shuffled
      .slice(0, playersPerTeam)
      .map((member) => member.id);

    const teamBIds = shuffled
      .slice(playersPerTeam, playersPerTeam * 2)
      .map((member) => member.id);

    const goalkeeperA = goalkeepers[0]?.id ? [goalkeepers[0].id] : [];
    const goalkeeperB = goalkeepers[1]?.id ? [goalkeepers[1].id] : [];

    const match: Match = {
      id: `match-${Date.now()}`,
      eventId:
        data.events.find((event) => event.status === 'em_andamento')?.id ?? '',
      matchNumber: eventMatches.length + 1,

      teamA: {
        id: `team-a-${Date.now()}`,
        name: 'Time Rubro',
        color: 'verde',
        memberIds: teamAIds,
        goalkeeperIds: goalkeeperA,
        score: 0,
        winsStreak: 0,
      },

      teamB: {
        id: `team-b-${Date.now()}`,
        name: 'Time Grafite',
        color: 'branco',
        memberIds: teamBIds,
        goalkeeperIds: goalkeeperB,
        score: 0,
        winsStreak: 0,
      },

      scoreA: 0,
      scoreB: 0,
      status: 'agendado',
      startedAt: null,
      finishedAt: null,
      durationSeconds: 0,
      events: [],
      winnerTeamId: null,
      isPenalties: false,
    };

    onAddMatch(match);
    showToast('success', 'Times sorteados! Pronto para iniciar.');
  };

  const currentMatch = liveMatch ?? eventMatches[eventMatches.length - 1];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {availablePlayers.length} jogadores disponíveis
        </p>

        <Button onClick={sortTeams} disabled={!!liveMatch}>
          <Shuffle size={18} /> Sortear times
        </Button>
      </div>

      {currentMatch ? (
        <div className="space-y-3">
          <TeamDisplay team={currentMatch.teamA} members={members} />
          <div className="text-center text-sm font-bold text-gray-400">VS</div>
          <TeamDisplay team={currentMatch.teamB} members={members} />
        </div>
      ) : (
        <Card className="p-8 text-center">
          <Users size={40} className="mx-auto mb-2 text-gray-300" />
          <p className="text-sm text-gray-400">
            Sortee os times para começar
          </p>
        </Card>
      )}
    </div>
  );
}

function TeamDisplay({ team, members }: { team: Team; members: Member[] }) {
  const teamColor =
    team.color === 'verde'
      ? 'border-red-200 bg-red-50'
      : 'border-slate-200 bg-slate-50';

  const headerColor =
    team.color === 'verde' ? 'bg-red-700' : 'bg-slate-700';

  return (
    <Card className={`border-2 p-3 ${teamColor}`}>
      <div
        className={`mb-2 flex items-center justify-between rounded-lg px-3 py-2 text-white ${headerColor}`}
      >
        <span className="font-bold">{team.name}</span>

        {team.winsStreak > 0 && (
          <span className="flex items-center gap-1 text-xs">
            <Crown size={14} /> {team.winsStreak}v
          </span>
        )}
      </div>

      {team.goalkeeperIds.map((id) => {
        const member = members.find((item) => item.id === id);

        if (!member) return null;

        return (
          <div
            key={id}
            className="mb-1 flex items-center gap-2 rounded-lg bg-amber-50 px-2 py-1.5"
          >
            <Avatar name={member.name} size="sm" />
            <span className="text-sm font-medium text-gray-800">
              {member.name}
            </span>
            <Badge type="Goleiro">GK</Badge>
          </div>
        );
      })}

      {team.memberIds.map((id) => {
        const member = members.find((item) => item.id === id);

        if (!member) return null;

        return (
          <div key={id} className="flex items-center gap-2 px-2 py-1.5">
            <Avatar name={member.name} size="sm" />
            <span className="text-sm text-gray-700">{member.name}</span>
            <span className="ml-auto text-xs text-gray-400">
              {member.position}
            </span>
          </div>
        );
      })}
    </Card>
  );
}


// ---------- Match Tab ----------

function MatchTab({ matches, members, liveMatch, onFinish, onPenalty, onUpdateMatch, onAddDiscipline, showToast, eventId, rules, queue, onSetQueue, onAddMatch, updateMember }: {
  matches: Match[];
  members: Member[];
  liveMatch: Match | undefined;
  onFinish: (m: Match) => void;
  onPenalty: (m: Match) => void;
  onUpdateMatch: (id: string, patch: Partial<Match>) => void;
  onAddDiscipline: (r: { memberId: string; memberName: string; card: 'amarelo' | 'vermelho'; reason: string; eventId: string; date: string; consequence: string; active: boolean }) => void;
  showToast: (type: 'success' | 'error' | 'info' | 'warning', msg: string) => void;
  eventId: string;
  rules: { disciplineSettings: { yellowConsequence: string; redConsequence: string; yellowMinutesOut: number } };
  queue: QueueEntry[];
  onSetQueue: (eventId: string, entries: { memberId: string; memberName: string; joinedAt: string }[]) => void;
  onAddMatch: (m: Match) => void;
  updateMember: (id: string, patch: Partial<Member>) => void;
}) {
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (liveMatch && liveMatch.status === 'em_andamento' && liveMatch.startedAt) {
      const start = new Date(liveMatch.startedAt).getTime();
      const tick = () => {
        const secs = Math.floor((Date.now() - start) / 1000) + (liveMatch.durationSeconds || 0);
        setElapsed(secs);
      };
      tick();
      timerRef.current = window.setInterval(tick, 1000);
      return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }
  }, [liveMatch]);

  const fmtTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  if (!liveMatch && matches.length === 0) {
    return (
      <Card className="p-8 text-center">
        <Trophy size={40} className="mx-auto text-gray-300 mb-2" />
        <p className="text-gray-400 text-sm">Nenhum jogo iniciado. Sortee os times na aba Times.</p>
      </Card>
    );
  }

  if (!liveMatch) {
    // Show history
    return (
      <div className="space-y-3">
        <h3 className="font-bold text-gray-900">Histórico de jogos</h3>
        {matches.map((m) => (
          <Card key={m.id} className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">Jogo {m.matchNumber}</span>
              <Badge type={m.status} />
            </div>
            <div className="flex items-center justify-center gap-4 my-3">
              <div className="text-right flex-1">
                <p className="font-semibold text-gray-900">{m.teamA.name}</p>
              </div>
              <div className="text-3xl font-bold text-gray-900">
                {m.scoreA} <span className="text-gray-300 text-xl">x</span> {m.scoreB}
              </div>
              <div className="text-left flex-1">
                <p className="font-semibold text-gray-900">{m.teamB.name}</p>
              </div>
            </div>
            {m.isPenalties && (
              <p className="text-center text-sm text-yellow-600">Pênaltis: {m.penaltyScoreA} x {m.penaltyScoreB}</p>
            )}
            {m.winnerTeamId && (
              <p className="text-center text-sm text-green-600 font-medium">
                Vencedor: {m.winnerTeamId === m.teamA.id ? m.teamA.name : m.teamB.name}
              </p>
            )}
          </Card>
        ))}
      </div>
    );
  }

  const addEvent = (type: MatchEvent['type'], memberId: string, teamId: string) => {
    const member = members.find((m) => m.id === memberId);
    if (!member) return;
    const minute = Math.floor(elapsed / 60);
    const event: MatchEvent = {
      id: `me-${Date.now()}`,
      matchId: liveMatch.id,
      type,
      memberId,
      memberName: member.name,
      teamId,
      minute,
    };
    const newEvents = [...liveMatch.events, event];
    let patch: Partial<Match> = { events: newEvents };

    if (type === 'gol') {
      if (teamId === liveMatch.teamA.id) {
        patch = { ...patch, scoreA: liveMatch.scoreA + 1, teamA: { ...liveMatch.teamA, score: liveMatch.teamA.score + 1 } };
      } else {
        patch = { ...patch, scoreB: liveMatch.scoreB + 1, teamB: { ...liveMatch.teamB, score: liveMatch.teamB.score + 1 } };
      }
      updateMember(member.id, { goals: member.goals + 1 });
      showToast('success', `Gol de ${member.name}!`);
    } else if (type === 'assistencia') {
      updateMember(member.id, { assists: member.assists + 1 });
      showToast('info', `Assistência de ${member.name}`);
    } else if (type === 'amarelo') {
      updateMember(member.id, { yellowCards: member.yellowCards + 1, behaviorScore: Math.max(0, member.behaviorScore - 4) });
      onAddDiscipline({
        memberId: member.id, memberName: member.name, card: 'amarelo', reason: 'Cartão amarelo',
        eventId, date: new Date().toISOString().slice(0, 10), consequence: `${rules.disciplineSettings.yellowMinutesOut} min fora`, active: false,
      });
      showToast('warning', `Cartão amarelo para ${member.name}`);
    } else if (type === 'vermelho') {
      updateMember(member.id, { redCards: member.redCards + 1, behaviorScore: Math.max(0, member.behaviorScore - 10) });
      onAddDiscipline({
        memberId: member.id, memberName: member.name, card: 'vermelho', reason: 'Cartão vermelho',
        eventId, date: new Date().toISOString().slice(0, 10), consequence: 'Suspenso', active: true,
      });
      showToast('error', `Cartão vermelho para ${member.name}`);
    }
    onUpdateMatch(liveMatch.id, patch);
  };

  const startMatch = () => {
    onUpdateMatch(liveMatch.id, { status: 'em_andamento', startedAt: new Date().toISOString() });
    showToast('success', 'Jogo iniciado!');
  };

  const finishMatch = () => {
    if (liveMatch.scoreA === liveMatch.scoreB) {
      onPenalty(liveMatch);
    } else {
      onFinish(liveMatch);
    }
  };

  const teamColor = (color: TeamColor) => color === 'verde' ? 'bg-green-600' : 'bg-gray-700';

  return (
    <div className="space-y-4">
      {/* Scoreboard */}
      <Card className="p-6 bg-gradient-to-br from-gray-900 to-gray-800 text-white border-0">
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-3 py-1 text-sm">
            <Timer size={16} className="text-green-400" />
            <span className="font-mono font-bold text-lg">{fmtTime(elapsed)}</span>
          </div>
        </div>
        <div className="flex items-center justify-center gap-6">
          <div className="flex-1 text-center">
            <div className={`w-12 h-12 ${teamColor(liveMatch.teamA.color)} rounded-xl mx-auto mb-2 flex items-center justify-center`}>
              <Trophy size={24} />
            </div>
            <p className="text-sm font-medium text-gray-300">{liveMatch.teamA.name}</p>
          </div>
          <div className="text-5xl font-bold">
            {liveMatch.scoreA}<span className="text-gray-500 text-3xl mx-2">x</span>{liveMatch.scoreB}
          </div>
          <div className="flex-1 text-center">
            <div className={`w-12 h-12 ${teamColor(liveMatch.teamB.color)} rounded-xl mx-auto mb-2 flex items-center justify-center`}>
              <Trophy size={24} />
            </div>
            <p className="text-sm font-medium text-gray-300">{liveMatch.teamB.name}</p>
          </div>
        </div>
        <div className="mt-4 flex justify-center">
          {liveMatch.status === 'agendado' ? (
            <Button size="lg" variant="success" onClick={startMatch}>
              <Play size={20} /> Iniciar Jogo {liveMatch.matchNumber}
            </Button>
          ) : (
            <Button size="lg" variant="danger" onClick={finishMatch}>
              <Square size={20} /> Finalizar partida
            </Button>
          )}
        </div>
      </Card>

      {/* Teams with action buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[liveMatch.teamA, liveMatch.teamB].map((team) => (
          <Card key={team.id} className="p-3">
            <div className={`rounded-lg ${teamColor(team.color)} text-white px-3 py-2 mb-2 font-bold text-sm`}>
              {team.name}
            </div>
            <div className="space-y-1">
              {team.memberIds.map((id) => {
                const m = members.find((mm) => mm.id === id);
                if (!m) return null;
                return (
                  <div key={id} className="flex items-center gap-2 py-1">
                    <Avatar name={m.name} size="sm" />
                    <span className="text-xs font-medium text-gray-800 flex-1 truncate">{m.name}</span>
                    {liveMatch.status === 'em_andamento' && (
                      <div className="flex gap-0.5">
                        <button onClick={() => addEvent('gol', id, team.id)} className="p-1 rounded text-green-600 hover:bg-green-50" title="Gol">
                          <Target size={14} />
                        </button>
                        <button onClick={() => addEvent('assistencia', id, team.id)} className="p-1 rounded text-blue-600 hover:bg-blue-50" title="Assistência">
                          <Hand size={14} />
                        </button>
                        <button onClick={() => addEvent('amarelo', id, team.id)} className="p-1 rounded text-yellow-500 hover:bg-yellow-50" title="Amarelo">
                          <Square size={14} className="fill-yellow-400 text-yellow-500" />
                        </button>
                        <button onClick={() => addEvent('vermelho', id, team.id)} className="p-1 rounded text-red-600 hover:bg-red-50" title="Vermelho">
                          <Square size={14} className="fill-red-500 text-red-500" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        ))}
      </div>

      {/* Events */}
      {liveMatch.events.length > 0 && (
        <Card className="p-4">
          <h4 className="font-semibold text-gray-900 mb-2 text-sm">Lance a lance</h4>
          <div className="space-y-1">
            {liveMatch.events.slice().reverse().map((ev) => (
              <div key={ev.id} className="flex items-center gap-2 text-sm py-1">
                <span className="text-xs text-gray-400 font-mono w-8">{ev.minute}'</span>
                {ev.type === 'gol' && <Target size={14} className="text-green-600" />}
                {ev.type === 'assistencia' && <Hand size={14} className="text-blue-600" />}
                {ev.type === 'amarelo' && <Square size={14} className="fill-yellow-400 text-yellow-500" />}
                {ev.type === 'vermelho' && <Square size={14} className="fill-red-500 text-red-500" />}
                <span className="text-gray-700">{ev.memberName}</span>
                <span className="text-gray-400 text-xs">{ev.type}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

// ---------- Finish Match Modal ----------

function FinishMatchModal({ match, onConfirm, onCancel }: { match: Match; onConfirm: (winnerId: string | null) => void; onCancel: () => void }) {
  const winner = match.scoreA > match.scoreB ? match.teamA.id : match.scoreB > match.scoreA ? match.teamB.id : null;
  const winnerName = winner === match.teamA.id ? match.teamA.name : winner === match.teamB.id ? match.teamB.name : 'Empate';

  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-3xl font-bold text-gray-900">{match.scoreA} x {match.scoreB}</p>
        <p className="text-gray-500 mt-1">{winnerName === 'Empate' ? 'Empate' : `Vencedor: ${winnerName}`}</p>
      </div>
      <div className="bg-blue-50 rounded-xl p-3 text-sm text-blue-700">
        {winner ? (
          <p>O time vencedor permanece em campo (até 2 vitórias). O perdedor sai e o próximo grupo da fila entra.</p>
        ) : (
          <p>Empate - vai para disputa de pênaltis.</p>
        )}
      </div>
      <div className="flex gap-3 justify-end">
        <Button variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button variant="primary" onClick={() => onConfirm(winner)}>Confirmar resultado</Button>
      </div>
    </div>
  );
}

// ---------- Penalty Modal ----------

function PenaltyModal({ match, onConfirm, onCancel }: { match: Match; onConfirm: (scoreA: number, scoreB: number) => void; onCancel: () => void }) {
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);

  return (
    <div className="space-y-4">
      <p className="text-center text-gray-500">Registre o resultado dos pênaltis</p>
      <div className="flex items-center justify-center gap-4">
        <div className="text-center">
          <p className="text-sm font-medium text-gray-700 mb-2">{match.teamA.name}</p>
          <div className="flex items-center gap-2 justify-center">
            <button onClick={() => setScoreA(Math.max(0, scoreA - 1))} className="w-8 h-8 rounded-lg bg-gray-100 font-bold">-</button>
            <span className="text-3xl font-bold w-12">{scoreA}</span>
            <button onClick={() => setScoreA(scoreA + 1)} className="w-8 h-8 rounded-lg bg-green-600 text-white font-bold">+</button>
          </div>
        </div>
        <span className="text-gray-400">x</span>
        <div className="text-center">
          <p className="text-sm font-medium text-gray-700 mb-2">{match.teamB.name}</p>
          <div className="flex items-center gap-2 justify-center">
            <button onClick={() => setScoreB(Math.max(0, scoreB - 1))} className="w-8 h-8 rounded-lg bg-gray-100 font-bold">-</button>
            <span className="text-3xl font-bold w-12">{scoreB}</span>
            <button onClick={() => setScoreB(scoreB + 1)} className="w-8 h-8 rounded-lg bg-gray-700 text-white font-bold">+</button>
          </div>
        </div>
      </div>
      <div className="flex gap-3 justify-end">
        <Button variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button onClick={() => onConfirm(scoreA, scoreB)}>Confirmar pênaltis</Button>
      </div>
    </div>
  );
}
