import type {
  AppData,
  Member,
  Payment,
  AppEvent,
  Attendance,
  QueueEntry,
  Match,
  DisciplineRecord,
  RuleSettings,
} from '@/types';

const now = new Date();
const todayISO = now.toISOString().slice(0, 10);

function daysAgo(n: number): string {
  const d = new Date(now);
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}
function daysAhead(n: number): string {
  const d = new Date(now);
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
}

const defaultRules: RuleSettings = {
  matchFormat: {
    playersPerTeam: 6,
    hasGoalkeeper: true,
    maxReserves: 2,
    substitutionType: 'livre',
    canReturnToGame: true,
  },
  matchDuration: {
    periods: 2,
    periodMinutes: 15,
    intervalMinutes: 5,
    clockType: 'corrido',
    maxWaitMinutes: 10,
    lateLimitMinutes: 15,
    endCriterion: 'encerrar',
  },
  refereeSettings: {
    hasReferee: 'remunerado',
    refereeFee: 80,
    refereePaymentSplit: 'mensalistas',
    refereeName: 'Juiz Carlos',
    refereePix: 'carlos@pix.com',
  },
  goalkeeperSettings: {
    isRequired: true,
    isMonthly: false,
    feePerEvent: 80,
    paymentFrequency: 'evento',
    paymentStatus: 'pendente',
    fixedGoalkeeper: false,
  },
  queueSettings: { entryOrder: 'chegada' },
  rotationSettings: {
    winnerStays: 'permanece_ate_limite',
    winnerLimit: 2,
    winnerAtLimit: 'sai_todo',
    loserAction: 'sai_automatico',
    teamFormation: 'equilibrar_posicao',
  },
  tieSettings: { tieBreaker: 'penaltis' },
  disciplineSettings: {
    yellowConsequence: 'minutos_fora',
    yellowMinutesOut: 5,
    twoYellowSameEvent: true,
    yellowMonthLimit: 3,
    yellowLimitConsequence: 'suspensao_uma',
    yellowSuspensionCount: 1,
    redConsequence: 'suspenso_x',
    redMinutesOut: 0,
    redSuspensionCount: 2,
    redMonthLimit1: 'suspensao',
    redMonthLimit2: 2,
    redMonthLimit3: 'expulsao',
  },
  behaviorRankingSettings: {
    enabled: true,
    startScore: 100,
    presencePoints: 2,
    latePenalty: 3,
    noShowPenalty: 5,
    yellowPenalty: 4,
    redPenalty: 10,
    goodConductBonus: 3,
  },
  financialRules: {
    inadimplentCanPlay: 'paga_diaria',
    guestCanEnter: 'sim_taxa',
    guestQueuePosition: 'normal',
    sharedCosts: { quadra: true, juiz: true, goleiros: false, coletes: false, bola: true, outros: false },
    costSplit: 'mensalistas',
  },
};

const memberSeeds: Array<Partial<Member> & { name: string; position: Member['position']; category: Member['category'] }> = [
  { name: 'Ricardo Souza', position: 'Atacante', category: 'Mensalista', paymentStatus: 'pago', monthlyFeePaid: true, gamesPlayed: 24, wins: 14, draws: 4, losses: 6, goals: 31, assists: 12, yellowCards: 2, redCards: 0, presentCount: 24, behaviorScore: 96 },
  { name: 'Felipe Andrade', position: 'Meio-campo', category: 'Mensalista', paymentStatus: 'pago', monthlyFeePaid: true, gamesPlayed: 22, wins: 12, draws: 5, losses: 5, goals: 18, assists: 20, yellowCards: 3, redCards: 0, presentCount: 22, behaviorScore: 92 },
  { name: 'Bruno Carvalho', position: 'Zagueiro', category: 'Mensalista', paymentStatus: 'pago', monthlyFeePaid: true, gamesPlayed: 20, wins: 11, draws: 3, losses: 6, goals: 4, assists: 2, yellowCards: 5, redCards: 1, presentCount: 20, behaviorScore: 84 },
  { name: 'Lucas Ferreira', position: 'Lateral', category: 'Mensalista', paymentStatus: 'pago', monthlyFeePaid: true, gamesPlayed: 19, wins: 10, draws: 4, losses: 5, goals: 6, assists: 8, yellowCards: 1, redCards: 0, presentCount: 19, behaviorScore: 95 },
  { name: 'André Martins', position: 'Meio-campo', category: 'Mensalista', paymentStatus: 'pago', monthlyFeePaid: true, gamesPlayed: 21, wins: 13, draws: 2, losses: 6, goals: 15, assists: 14, yellowCards: 2, redCards: 0, presentCount: 21, behaviorScore: 90 },
  { name: 'Gustavo Lima', position: 'Atacante', category: 'Mensalista', paymentStatus: 'pago', monthlyFeePaid: true, gamesPlayed: 18, wins: 9, draws: 3, losses: 6, goals: 22, assists: 6, yellowCards: 1, redCards: 0, presentCount: 18, behaviorScore: 93 },
  { name: 'Diego Ramos', position: 'Zagueiro', category: 'Mensalista', paymentStatus: 'pago', monthlyFeePaid: true, gamesPlayed: 17, wins: 8, draws: 4, losses: 5, goals: 2, assists: 1, yellowCards: 4, redCards: 0, presentCount: 17, behaviorScore: 88 },
  { name: 'Marcelo Pinto', position: 'Lateral', category: 'Mensalista', paymentStatus: 'pago', monthlyFeePaid: true, gamesPlayed: 16, wins: 8, draw4: 3, draws: 3, losses: 5, goals: 5, assists: 7, yellowCards: 2, redCards: 0, presentCount: 16, behaviorScore: 91 } as Member,
  { name: 'Pedro Henrique', position: 'Atacante', category: 'Mensalista', paymentStatus: 'pago', monthlyFeePaid: true, gamesPlayed: 15, wins: 7, draws: 4, losses: 4, goals: 12, assists: 10, yellowCards: 0, redCards: 0, presentCount: 15, behaviorScore: 98 },
  { name: 'Rafael Gomes', position: 'Meio-campo', category: 'Mensalista', paymentStatus: 'pago', monthlyFeePaid: true, gamesPlayed: 14, wins: 7, draws: 2, losses: 5, goals: 9, assists: 11, yellowCards: 3, redCards: 0, presentCount: 14, behaviorScore: 87 },
  { name: 'Thiago Barbosa', position: 'Zagueiro', category: 'Mensalista', paymentStatus: 'pago', monthlyFeePaid: true, gamesPlayed: 13, wins: 6, draws: 3, losses: 4, goals: 3, assists: 2, yellowCards: 2, redCards: 0, presentCount: 13, behaviorScore: 89 },
  { name: 'Vinícius Costa', position: 'Lateral', category: 'Mensalista', paymentStatus: 'pago', monthlyFeePaid: true, gamesPlayed: 12, wins: 5, draws: 4, losses: 3, goals: 7, assists: 9, yellowCards: 1, redCards: 0, presentCount: 12, behaviorScore: 94 },
  { name: 'Carlos Eduardo', position: 'Atacante', category: 'Mensalista', paymentStatus: 'pago', monthlyFeePaid: true, gamesPlayed: 11, wins: 5, draws: 3, losses: 3, goals: 14, assists: 5, yellowCards: 2, redCards: 0, presentCount: 11, behaviorScore: 92 },
  { name: 'Jonas Oliveira', position: 'Meio-campo', category: 'Mensalista', paymentStatus: 'pago', monthlyFeePaid: true, gamesPlayed: 10, wins: 4, draws: 3, losses: 3, goals: 6, assists: 8, yellowCards: 1, redCards: 0, presentCount: 10, behaviorScore: 90 },
  { name: 'Leonardo Dias', position: 'Zagueiro', category: 'Mensalista', paymentStatus: 'pendente', monthlyFeePaid: false, gamesPlayed: 9, wins: 4, draws: 2, losses: 3, goals: 1, assists: 1, yellowCards: 2, redCards: 0, presentCount: 9, behaviorScore: 85 },
  { name: 'Eduardo Nunes', position: 'Lateral', category: 'Mensalista', paymentStatus: 'pago', monthlyFeePaid: true, gamesPlayed: 8, wins: 3, draws: 3, losses: 2, goals: 4, assists: 6, yellowCards: 0, redCards: 0, presentCount: 8, behaviorScore: 97 },
  { name: 'Fernando Rocha', position: 'Atacante', category: 'Mensalista', paymentStatus: 'pago', monthlyFeePaid: true, gamesPlayed: 7, wins: 3, draws: 2, losses: 2, goals: 8, assists: 4, yellowCards: 1, redCards: 0, presentCount: 7, behaviorScore: 91 },
  { name: 'Paulo Sergio', position: 'Meio-campo', category: 'Mensalista', paymentStatus: 'pago', monthlyFeePaid: true, gamesPlayed: 6, wins: 2, draws: 2, losses: 2, goals: 3, assists: 5, yellowCards: 2, redCards: 0, presentCount: 6, behaviorScore: 88 },
  { name: 'Roberto Silva', position: 'Goleiro', category: 'Goleiro', paymentStatus: 'liberado', monthlyFeePaid: false, gamesPlayed: 20, wins: 11, draws: 4, losses: 5, goals: 0, assists: 0, yellowCards: 0, redCards: 0, presentCount: 20, behaviorScore: 99 },
  { name: 'Marcos Vieira', position: 'Goleiro', category: 'Goleiro', paymentStatus: 'liberado', monthlyFeePaid: false, gamesPlayed: 15, wins: 8, draws: 3, losses: 4, goals: 0, assists: 0, yellowCards: 0, redCards: 0, presentCount: 15, behaviorScore: 98 },
  { name: 'Sérgio Mendes', position: 'Atacante', category: 'Convidado', paymentStatus: 'pago', monthlyFeePaid: false, gamesPlayed: 3, wins: 1, draws: 1, losses: 1, goals: 4, assists: 2, yellowCards: 1, redCards: 0, presentCount: 3, behaviorScore: 90 },
  { name: 'Henrique Alves', position: 'Zagueiro', category: 'Mensalista', paymentStatus: 'pago', monthlyFeePaid: true, gamesPlayed: 5, wins: 1, draws: 1, losses: 3, goals: 0, assists: 1, yellowCards: 4, redCards: 1, presentCount: 5, behaviorScore: 72, suspensionsLeft: 1, status: 'suspenso' },
];

const members: Member[] = memberSeeds.map((s, i) => ({
  id: `m-${i + 1}`,
  peladaId: 'pelada-1',
  avatar: undefined,
  phone: `(21) 9${1000 + i}-${2000 + i}`,
  email: `${s.name.toLowerCase().replace(/\s/g, '.')}@email.com`,
  status: s.status ?? 'ativo',
  paymentStatus: s.paymentStatus ?? 'pago',
  monthlyFeePaid: s.monthlyFeePaid ?? false,
  gamesPlayed: s.gamesPlayed ?? 0,
  wins: s.wins ?? 0,
  draws: s.draws ?? 0,
  losses: s.losses ?? 0,
  goals: s.goals ?? 0,
  assists: s.assists ?? 0,
  yellowCards: s.yellowCards ?? 0,
  redCards: s.redCards ?? 0,
  suspensionsLeft: s.suspensionsLeft ?? 0,
  presentCount: s.presentCount ?? 0,
  behaviorScore: s.behaviorScore ?? 100,
  joinedAt: daysAgo(120 - i * 5),
  ...s,
})) as Member[];

// Events: today + 3 past
const events: AppEvent[] = [
  { id: 'evt-1', peladaId: 'pelada-1', name: 'Pelada de hoje', date: todayISO, startTime: '20:00', endTime: '22:00', place: 'Arena do Bairro', type: 'regular', status: 'em_andamento', capacity: 22, createdAt: daysAgo(7) },
  { id: 'evt-2', peladaId: 'pelada-1', name: 'Pelada da semana', date: daysAgo(7), startTime: '20:00', endTime: '22:00', place: 'Arena do Bairro', type: 'regular', status: 'encerrado', capacity: 22, createdAt: daysAgo(14) },
  { id: 'evt-3', peladaId: 'pelada-1', name: 'Pelada da semana', date: daysAgo(14), startTime: '20:00', endTime: '22:00', place: 'Arena do Bairro', type: 'regular', status: 'encerrado', capacity: 22, createdAt: daysAgo(21) },
  { id: 'evt-4', peladaId: 'pelada-1', name: 'Pelada da semana', date: daysAgo(21), startTime: '20:00', endTime: '22:00', place: 'Arena do Bairro', type: 'regular', status: 'encerrado', capacity: 22, createdAt: daysAgo(28) },
  { id: 'evt-5', peladaId: 'pelada-1', name: 'Próxima pelada', date: daysAhead(2), startTime: '20:00', endTime: '22:00', place: 'Arena do Bairro', type: 'regular', status: 'inscricoes_abertas', capacity: 22, createdAt: daysAgo(1) },
];

// Attendance for today's event - 14 confirmed, some checked in
const presentIds = members.slice(0, 14).map((m) => m.id);
const attendance: Attendance[] = presentIds.map((mid, i) => {
  const m = members.find((mm) => mm.id === mid)!;
  const checkedIn = i < 10;
  return {
    id: `att-${i + 1}`,
    eventId: 'evt-1',
    memberId: mid,
    memberName: m.name,
    confirmedAt: daysAgo(1),
    checkedInAt: checkedIn ? `${todayISO}T19:4${i % 10}:00` : null,
    status: checkedIn ? 'presente' : 'confirmado',
  };
});
// Add guest confirmed
const guest = members.find((m) => m.category === 'Convidado')!;
attendance.push({
  id: 'att-guest',
  eventId: 'evt-1',
  memberId: guest.id,
  memberName: guest.name,
  confirmedAt: daysAgo(1),
  checkedInAt: null,
  status: 'confirmado',
});

// Queue for today - order of arrival
const queue: QueueEntry[] = [];
const queueMembers = members.slice(14, 18); // 4 in queue
queueMembers.forEach((m, i) => {
  queue.push({
    id: `q-${i + 1}`,
    eventId: 'evt-1',
    memberId: m.id,
    memberName: m.name,
    position: i + 1,
    joinedAt: `${todayISO}T19:5${i}:00`,
  });
});

// Match 1 in progress for today
const teamAIds = members.slice(0, 6).map((m) => m.id);
const teamBIds = members.slice(6, 12).map((m) => m.id);
const gkA = members.find((m) => m.category === 'Goleiro')!;
const gkB = members.filter((m) => m.category === 'Goleiro')[1]!;

const match1: Match = {
  id: 'match-1',
  eventId: 'evt-1',
  matchNumber: 1,
  teamA: {
    id: 'team-a1',
    name: 'Time Verde',
    color: 'verde',
    memberIds: teamAIds,
    goalkeeperIds: [gkA.id],
    score: 2,
    winsStreak: 0,
  },
  teamB: {
    id: 'team-b1',
    name: 'Time Branco',
    color: 'branco',
    memberIds: teamBIds,
    goalkeeperIds: [gkB.id],
    score: 1,
    winsStreak: 0,
  },
  scoreA: 2,
  scoreB: 1,
  status: 'em_andamento',
  startedAt: `${todayISO}T20:05:00`,
  finishedAt: null,
  durationSeconds: 720,
  events: [
    { id: 'me-1', matchId: 'match-1', type: 'gol', memberId: teamAIds[0], memberName: members[0].name, teamId: 'team-a1', minute: 5 },
    { id: 'me-2', matchId: 'match-1', type: 'gol', memberId: teamBIds[0], memberName: members[6].name, teamId: 'team-b1', minute: 8 },
    { id: 'me-3', matchId: 'match-1', type: 'gol', memberId: teamAIds[1], memberName: members[1].name, teamId: 'team-a1', minute: 12 },
    { id: 'me-4', matchId: 'match-1', type: 'amarelo', memberId: teamBIds[2], memberName: members[8].name, teamId: 'team-b1', minute: 10 },
  ],
  winnerTeamId: null,
  isPenalties: false,
};

// Past matches
const pastMatches: Match[] = [
  {
    id: 'match-2', eventId: 'evt-2', matchNumber: 1,
    teamA: { id: 'team-a2', name: 'Time Verde', color: 'verde', memberIds: members.slice(0, 6).map(m => m.id), goalkeeperIds: [gkA.id], score: 3, winsStreak: 1 },
    teamB: { id: 'team-b2', name: 'Time Branco', color: 'branco', memberIds: members.slice(6, 12).map(m => m.id), goalkeeperIds: [gkB.id], score: 2, winsStreak: 0 },
    scoreA: 3, scoreB: 2, status: 'finalizado', startedAt: `${daysAgo(7)}T20:05:00`, finishedAt: `${daysAgo(7)}T20:35:00`, durationSeconds: 1800,
    events: [
      { id: 'me-10', matchId: 'match-2', type: 'gol', memberId: members[0].id, memberName: members[0].name, teamId: 'team-a2', minute: 3 },
      { id: 'me-11', matchId: 'match-2', type: 'gol', memberId: members[6].id, memberName: members[6].name, teamId: 'team-b2', minute: 7 },
      { id: 'me-12', matchId: 'match-2', type: 'gol', memberId: members[1].id, memberName: members[1].name, teamId: 'team-a2', minute: 12 },
      { id: 'me-13', matchId: 'match-2', type: 'gol', memberId: members[7].id, memberName: members[7].name, teamId: 'team-b2', minute: 18 },
      { id: 'me-14', matchId: 'match-2', type: 'gol', memberId: members[0].id, memberName: members[0].name, teamId: 'team-a2', minute: 25 },
      { id: 'me-15', matchId: 'match-2', type: 'amarelo', memberId: members[2].id, memberName: members[2].name, teamId: 'team-a2', minute: 15 },
    ],
    winnerTeamId: 'team-a2', isPenalties: false,
  },
  {
    id: 'match-3', eventId: 'evt-2', matchNumber: 2,
    teamA: { id: 'team-a3', name: 'Time Verde', color: 'verde', memberIds: members.slice(0, 6).map(m => m.id), goalkeeperIds: [gkA.id], score: 1, winsStreak: 0 },
    teamB: { id: 'team-b3', name: 'Time Branco', color: 'branco', memberIds: members.slice(12, 18).map(m => m.id), goalkeeperIds: [gkB.id], score: 1, winsStreak: 0 },
    scoreA: 1, scoreB: 1, status: 'finalizado', startedAt: `${daysAgo(7)}T20:40:00`, finishedAt: `${daysAgo(7)}T21:10:00`, durationSeconds: 1800,
    events: [
      { id: 'me-20', matchId: 'match-3', type: 'gol', memberId: members[0].id, memberName: members[0].name, teamId: 'team-a3', minute: 5 },
      { id: 'me-21', matchId: 'match-3', type: 'gol', memberId: members[12].id, memberName: members[12].name, teamId: 'team-b3', minute: 22 },
    ],
    winnerTeamId: 'team-a3', isPenalties: true, penaltyScoreA: 4, penaltyScoreB: 3,
  },
  {
    id: 'match-4', eventId: 'evt-3', matchNumber: 1,
    teamA: { id: 'team-a4', name: 'Time Verde', color: 'verde', memberIds: members.slice(6, 12).map(m => m.id), goalkeeperIds: [gkA.id], score: 4, winsStreak: 1 },
    teamB: { id: 'team-b4', name: 'Time Branco', color: 'branco', memberIds: members.slice(0, 6).map(m => m.id), goalkeeperIds: [gkB.id], score: 2, winsStreak: 0 },
    scoreA: 4, scoreB: 2, status: 'finalizado', startedAt: `${daysAgo(14)}T20:05:00`, finishedAt: `${daysAgo(14)}T20:35:00`, durationSeconds: 1800,
    events: [
      { id: 'me-30', matchId: 'match-4', type: 'gol', memberId: members[6].id, memberName: members[6].name, teamId: 'team-a4', minute: 2 },
      { id: 'me-31', matchId: 'match-4', type: 'gol', memberId: members[7].id, memberName: members[7].name, teamId: 'team-a4', minute: 8 },
      { id: 'me-32', matchId: 'match-4', type: 'gol', memberId: members[0].id, memberName: members[0].name, teamId: 'team-b4', minute: 12 },
      { id: 'me-33', matchId: 'match-4', type: 'gol', memberId: members[8].id, memberName: members[8].name, teamId: 'team-a4', minute: 16 },
      { id: 'me-34', matchId: 'match-4', type: 'gol', memberId: members[1].id, memberName: members[1].name, teamId: 'team-b4', minute: 20 },
      { id: 'me-35', matchId: 'match-4', type: 'gol', memberId: members[9].id, memberName: members[9].name, teamId: 'team-a4', minute: 28 },
      { id: 'me-36', matchId: 'match-4', type: 'vermelho', memberId: members[21].id, memberName: members[21].name, teamId: 'team-b4', minute: 25 },
    ],
    winnerTeamId: 'team-a4', isPenalties: false,
  },
  {
    id: 'match-5', eventId: 'evt-4', matchNumber: 1,
    teamA: { id: 'team-a5', name: 'Time Verde', color: 'verde', memberIds: members.slice(12, 18).map(m => m.id), goalkeeperIds: [gkA.id], score: 2, winsStreak: 0 },
    teamB: { id: 'team-b5', name: 'Time Branco', color: 'branco', memberIds: members.slice(0, 6).map(m => m.id), goalkeeperIds: [gkB.id], score: 3, winsStreak: 1 },
    scoreA: 2, scoreB: 3, status: 'finalizado', startedAt: `${daysAgo(21)}T20:05:00`, finishedAt: `${daysAgo(21)}T20:35:00`, durationSeconds: 1800,
    events: [
      { id: 'me-40', matchId: 'match-5', type: 'gol', memberId: members[12].id, memberName: members[12].name, teamId: 'team-a5', minute: 4 },
      { id: 'me-41', matchId: 'match-5', type: 'gol', memberId: members[0].id, memberName: members[0].name, teamId: 'team-b5', minute: 9 },
      { id: 'me-42', matchId: 'match-5', type: 'gol', memberId: members[13].id, memberName: members[13].name, teamId: 'team-a5', minute: 15 },
      { id: 'me-43', matchId: 'match-5', type: 'gol', memberId: members[1].id, memberName: members[1].name, teamId: 'team-b5', minute: 18 },
      { id: 'me-44', matchId: 'match-5', type: 'gol', memberId: members[0].id, memberName: members[0].name, teamId: 'team-b5', minute: 27 },
      { id: 'me-45', matchId: 'match-5', type: 'amarelo', memberId: members[21].id, memberName: members[21].name, teamId: 'team-a5', minute: 20 },
    ],
    winnerTeamId: 'team-b5', isPenalties: false,
  },
];

const matches = [match1, ...pastMatches];

// Payments
const payments: Payment[] = [];
members.forEach((m) => {
  if (m.category === 'Mensalista') {
    payments.push({
      id: `pay-${m.id}`,
      peladaId: 'pelada-1',
      memberId: m.id,
      memberName: m.name,
      type: 'mensalidade',
      amount: 100,
      dueDate: daysAgo(5),
      paidDate: m.paymentStatus === 'pago' ? daysAgo(10) : null,
      status: m.paymentStatus,
    });
  }
  if (m.category === 'Convidado') {
    payments.push({
      id: `pay-${m.id}`,
      peladaId: 'pelada-1',
      memberId: m.id,
      memberName: m.name,
      type: 'convidado',
      amount: 25,
      dueDate: todayISO,
      paidDate: todayISO,
      status: 'pago',
    });
  }
  if (m.category === 'Goleiro') {
    payments.push({
      id: `pay-${m.id}`,
      peladaId: 'pelada-1',
      memberId: m.id,
      memberName: m.name,
      type: 'goleiro',
      amount: 80,
      dueDate: todayISO,
      paidDate: null,
      status: 'liberado',
    });
  }
});
// Master activation
payments.push({
  id: 'pay-ativacao',
  peladaId: 'pelada-1',
  memberId: 'user-1',
  memberName: 'Master',
  type: 'ativacao',
  amount: 100,
  dueDate: daysAgo(120),
  paidDate: daysAgo(120),
  status: 'pago',
});

// Discipline records
const discipline: DisciplineRecord[] = [
  { id: 'd-1', memberId: members[2].id, memberName: members[2].name, card: 'amarelo', reason: 'Falta dura', matchId: 'match-2', eventId: 'evt-2', date: daysAgo(7), consequence: 'Advertência', active: false },
  { id: 'd-2', memberId: members[21].id, memberName: members[21].name, card: 'vermelho', reason: 'Briga em campo', matchId: 'match-4', eventId: 'evt-3', date: daysAgo(14), consequence: 'Suspenso por 2 peladas', active: true },
  { id: 'd-3', memberId: members[21].id, memberName: members[21].name, card: 'amarelo', reason: 'Reclamação', matchId: 'match-5', eventId: 'evt-4', date: daysAgo(21), consequence: 'Advertência', active: false },
  { id: 'd-4', memberId: members[2].id, memberName: members[2].name, card: 'amarelo', reason: 'Falta por trás', matchId: 'match-5', eventId: 'evt-4', date: daysAgo(21), consequence: 'Advertência', active: false },
  { id: 'd-5', memberId: members[8].id, memberName: members[8].name, card: 'amarelo', reason: 'Falta táctica', matchId: 'match-1', eventId: 'evt-1', date: todayISO, consequence: '5 minutos fora', active: false },
];

const ruleChanges = [
  { id: 'rc-1', date: daysAgo(120), rule: 'Formato da partida', oldValue: '—', newValue: '6 contra 6 com goleiro', masterName: 'Master' },
  { id: 'rc-2', date: daysAgo(60), rule: 'Disciplina - vermelho', oldValue: 'Suspenso 1 pelada', newValue: 'Suspenso 2 peladas', masterName: 'Master' },
  { id: 'rc-3', date: daysAgo(30), rule: 'Fila - ordem de entrada', oldValue: 'Sorteio', newValue: 'Ordem de chegada', masterName: 'Master' },
];

export const seedData: AppData = {
  user: {
    id: 'user-1',
    name: 'Master',
    email: 'master@flamilia.com',
    phone: '(21) 99999-0000',
    isMaster: true,
    activationPaid: true,
  },
  pelada: {
    id: 'pelada-1',
    name: 'Pelada do Flamengo',
    place: 'Arena do Bairro',
    mapLink: 'https://maps.google.com/?q=Arena+do+Bairro',
    days: ['Quarta-feira', 'Sexta-feira'],
    startTime: '20:00',
    endTime: '22:00',
    extraSchedules: [],
    playersPerTeam: 6,
    hasGoalkeeper: true,
    maxReserves: 2,
    monthlyFee: 100,
    guestFee: 25,
    goalkeeperFee: 80,
    dueDate: 10,
    maxParticipants: 30,
    inviteLink: 'https://flamilia.app/p/pelada-flamengo',
    refereeFee: 80,
    createdAt: daysAgo(120),
  },
  members,
  events,
  attendance,
  queue,
  matches,
  payments,
  discipline,
  rules: defaultRules,
  ruleChanges,
};
