export type Position = 'Goleiro' | 'Zagueiro' | 'Lateral' | 'Meio-campo' | 'Atacante';

export type Category = 'Mensalista' | 'Convidado' | 'Goleiro' | 'Juiz';

export type PaymentStatus = 'pago' | 'pendente' | 'atrasado' | 'isento' | 'liberado';

export type MemberStatus = 'ativo' | 'suspenso' | 'bloqueado';

export type EventType = 'regular' | 'extra';

export type EventStatus = 'rascunho' | 'inscricoes_abertas' | 'em_andamento' | 'encerrado';

export type TeamColor = 'verde' | 'branco';

export type MatchStatus = 'agendado' | 'em_andamento' | 'finalizado' | 'penaltis';

export type CardColor = 'amarelo' | 'vermelho';

export type DisciplineAction =
  | 'advertencia'
  | 'minutos_fora'
  | 'sai_partida'
  | 'fora_evento'
  | 'suspensao_eventos'
  | 'suspensao_ate_data'
  | 'bloqueio_analise'
  | 'expulsao_pelada';

export type ReturnPolicy =
  | 'automatico'
  | 'aprovacao_master'
  | 'pagamento_multa'
  | 'aprovacao_e_multa';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  isMaster: boolean;
  activationPaid: boolean;
}

export interface Pelada {
  id: string;
  name: string;
  image?: string;
  place: string;
  mapLink?: string;
  days: string[];
  startTime: string;
  endTime: string;
  extraSchedules?: string[];
  playersPerTeam: number;
  hasGoalkeeper: boolean;
  maxReserves: number;
  monthlyFee: number;
  guestFee: number;
  goalkeeperFee: number;
  dueDate: number;
  maxParticipants: number;
  inviteLink: string;
  refereeFee: number;
  createdAt: string;
}

export interface Member {
  id: string;
  peladaId: string;
  name: string;
  avatar?: string;
  phone?: string;
  email?: string;
  position: Position;
  category: Category;
  status: MemberStatus;
  paymentStatus: PaymentStatus;
  monthlyFeePaid: boolean;
  gamesPlayed: number;
  wins: number;
  draws: number;
  losses: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  suspensionsLeft: number;
  presentCount: number;
  behaviorScore: number;
  joinedAt: string;

  // Informações adicionais de disciplina
  disciplineNote?: string;
  suspendedUntil?: string;
  expelledAt?: string;
}

export interface Attendance {
  id: string;
  eventId: string;
  memberId: string;
  memberName: string;
  confirmedAt: string | null;
  checkedInAt: string | null;
  status: 'confirmado' | 'presente' | 'ausente' | 'pendente';
}

export interface QueueEntry {
  id: string;
  eventId: string;
  memberId: string;
  memberName: string;
  position: number;
  joinedAt: string;
}

export interface Team {
  id: string;
  name: string;
  color: TeamColor;
  memberIds: string[];
  goalkeeperIds: string[];
  score: number;
  winsStreak: number;
}

export interface MatchEvent {
  id: string;
  matchId: string;
  type: 'gol' | 'assistencia' | 'amarelo' | 'vermelho';
  memberId: string;
  memberName: string;
  teamId: string;
  minute: number;
  note?: string;
}

export interface Match {
  id: string;
  eventId: string;
  matchNumber: number;
  teamA: Team;
  teamB: Team;
  scoreA: number;
  scoreB: number;
  status: MatchStatus;
  startedAt: string | null;
  finishedAt: string | null;
  durationSeconds: number;
  events: MatchEvent[];
  winnerTeamId: string | null;
  isPenalties: boolean;
  penaltyScoreA?: number;
  penaltyScoreB?: number;
}

export interface Payment {
  id: string;
  peladaId: string;
  memberId: string;
  memberName: string;
  type: 'mensalidade' | 'convidado' | 'goleiro' | 'ativacao' | 'multa';
  amount: number;
  dueDate: string;
  paidDate: string | null;
  status: PaymentStatus;
  pixCode?: string;
  boletoCode?: string;
  disciplineRecordId?: string;
}

export interface DisciplineRecord {
  id: string;
  memberId: string;
  memberName: string;
  card: CardColor;
  reason: string;
  matchId?: string;
  eventId: string;
  date: string;
  consequence: string;
  active: boolean;

  // Regra efetivamente aplicada no momento do cartão
  action?: DisciplineAction;
  minutesOut?: number;
  suspensionEvents?: number;
  suspensionUntil?: string;
  fineAmount?: number;
  finePaymentId?: string;
  finePaidDate?: string | null;
  returnPolicy?: ReturnPolicy;
  ruleSnapshot?: string;
}

export interface RegisterDisciplineInput {
  memberId: string;
  eventId: string;
  matchId?: string;
  card: CardColor;
  reason: string;
}

export interface AppEvent {
  id: string;
  peladaId: string;
  name: string;
  date: string;
  startTime: string;
  endTime: string;
  place: string;
  type: EventType;
  status: EventStatus;
  capacity: number;
  createdAt: string;
}

// ---------- Rule Settings ----------

export interface MatchFormat {
  playersPerTeam: number;
  hasGoalkeeper: boolean;
  maxReserves: number;
  substitutionType: 'livre' | 'somente_parada' | 'sem_substituicao';
  canReturnToGame: boolean;
}

export interface MatchDuration {
  periods: 1 | 2;
  periodMinutes: number;
  intervalMinutes: number;
  clockType: 'corrido' | 'parado_juiz';
  maxWaitMinutes: number;
  lateLimitMinutes: number;
  endCriterion: 'encerrar' | 'prorrogacao' | 'penaltis' | 'gol_ouro';
}

export interface RefereeSettings {
  hasReferee: 'nao' | 'voluntario' | 'remunerado';
  refereeFee: number;
  refereePaymentSplit: 'todos_presentes' | 'mensalistas' | 'caixa_pelada' | 'pago_master';
  refereeName?: string;
  refereePix?: string;
}

export interface GoalkeeperSettings {
  isRequired: boolean;
  isMonthly: boolean;
  feePerEvent: number;
  paymentFrequency: 'evento' | 'semanal' | 'mensal';
  paymentStatus: PaymentStatus;
  fixedGoalkeeper?: boolean;
}

export interface QueueSettings {
  entryOrder: 'chegada' | 'sorteio' | 'presenca' | 'manual';
}

export interface RotationSettings {
  winnerStays: 'sai' | 'permanece' | 'permanece_ate_limite';
  winnerLimit: number;
  winnerAtLimit: 'sai_todo' | 'troca_parte' | 'manual';
  loserAction: 'sai_automatico' | 'permanece' | 'manual';
  teamFormation: 'sorteio_simples' | 'equilibrar_posicao' | 'equilibrar_nivel' | 'manual';
}

export interface TieSettings {
  tieBreaker:
    | 'penaltis'
    | 'gol_ouro'
    | 'dois_saem'
    | 'mais_tempo_quadra'
    | 'primeiro_entrada'
    | 'saem_os_dois'
    | 'manual';
}

export interface DisciplineSettings {
  // Estrutura antiga — mantida para não quebrar o seed atual
  yellowConsequence: 'advertencia' | 'minutos_fora' | 'sai_partida' | 'vermelho';
  yellowMinutesOut: number;
  twoYellowSameEvent: boolean;
  yellowMonthLimit: number;
  yellowLimitConsequence: 'advertencia' | 'suspensao_uma' | 'suspensao_x' | 'bloqueio_analise';
  yellowSuspensionCount: number;
  redConsequence: 'sai_partida' | 'minutos_fora' | 'fora_evento' | 'suspenso_x';
  redMinutesOut: number;
  redSuspensionCount: number;
  redMonthLimit1: 'advertencia' | 'suspensao';
  redMonthLimit2: number;
  redMonthLimit3: 'expulsao';

  // Novas regras — configuráveis por cada pelada
  yellowAccumulationPeriod?: 'mes' | 'temporada';
  yellowAccumulatedAction?: DisciplineAction;
  yellowFineEnabled?: boolean;
  yellowFineAmount?: number;

  redAction?: DisciplineAction;
  redSuspensionUntil?: string;
  redFineEnabled?: boolean;
  redFineAmount?: number;

  returnPolicy?: ReturnPolicy;
  fineDueDays?: number;
  fineBlocksReturn?: boolean;
}

export interface BehaviorRankingSettings {
  enabled: boolean;
  startScore: number;
  presencePoints: number;
  latePenalty: number;
  noShowPenalty: number;
  yellowPenalty: number;
  redPenalty: number;
  goodConductBonus: number;
}

export interface FinancialRules {
  inadimplentCanPlay: 'nao' | 'paga_diaria' | 'manual';
  guestCanEnter: 'sim_taxa' | 'sim_isento' | 'nao';
  guestQueuePosition: 'normal' | 'apos_mensalistas' | 'somente_vaga';
  sharedCosts: {
    quadra: boolean;
    juiz: boolean;
    goleiros: boolean;
    coletes: boolean;
    bola: boolean;
    outros: boolean;
  };
  costSplit: 'todos_presentes' | 'mensalistas' | 'incluso_mensalidade' | 'caixa_pelada';
}

export interface RuleSettings {
  matchFormat: MatchFormat;
  matchDuration: MatchDuration;
  refereeSettings: RefereeSettings;
  goalkeeperSettings: GoalkeeperSettings;
  queueSettings: QueueSettings;
  rotationSettings: RotationSettings;
  tieSettings: TieSettings;
  disciplineSettings: DisciplineSettings;
  behaviorRankingSettings: BehaviorRankingSettings;
  financialRules: FinancialRules;
}

export interface RuleChange {
  id: string;
  date: string;
  rule: string;
  oldValue: string;
  newValue: string;
  masterName: string;
}

export interface AppData {
  user: User;
  pelada: Pelada;
  members: Member[];
  events: AppEvent[];
  attendance: Attendance[];
  queue: QueueEntry[];
  matches: Match[];
  payments: Payment[];
  discipline: DisciplineRecord[];
  rules: RuleSettings;
  ruleChanges: RuleChange[];
}