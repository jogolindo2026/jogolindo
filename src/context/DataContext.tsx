import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type {
  AppData,
  Member,
  Payment,
  AppEvent,
  Match,
  DisciplineRecord,
  RegisterDisciplineInput,
  RuleSettings,
  RuleChange,
  Pelada,
  Team,
  DisciplineAction,
  ReturnPolicy,
} from '@/types';
import { loadData, saveData, resetData } from '@/services/storage';
import { seedData } from '@/data/seed';

interface DataContextValue {
  data: AppData;

  updatePelada: (patch: Partial<Pelada>) => void;

  addMember: (member: Omit<Member, 'id' | 'peladaId' | 'joinedAt'>) => void;
  updateMember: (id: string, patch: Partial<Member>) => void;
  removeMember: (id: string) => void;

  markPaymentPaid: (id: string) => void;
  addPayment: (payment: Omit<Payment, 'id'>) => void;

  addEvent: (event: Omit<AppEvent, 'id' | 'createdAt'>) => void;
  updateEvent: (id: string, patch: Partial<AppEvent>) => void;

  addMatch: (match: Match) => void;
  updateMatch: (id: string, patch: Partial<Match>) => void;

  setQueue: (
    eventId: string,
    entries: { memberId: string; memberName: string; joinedAt: string }[]
  ) => void;

  addDiscipline: (record: Omit<DisciplineRecord, 'id'>) => void;
  registerDiscipline: (input: RegisterDisciplineInput) => void;

  updateRules: (patch: Partial<RuleSettings>) => void;
  addRuleChange: (change: Omit<RuleChange, 'id'>) => void;

  reset: () => void;
}

const DataContext = createContext<DataContextValue | null>(null);

let idCounter = Date.now();

function genId(prefix: string): string {
  idCounter += 1;
  return `${prefix}-${idCounter}`;
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function dateAfterDays(days: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

function mapLegacyYellowAction(value: string): DisciplineAction {
  if (value === 'suspensao_uma') return 'suspensao_eventos';
  if (value === 'suspensao_x') return 'suspensao_eventos';
  if (value === 'bloqueio_analise') return 'bloqueio_analise';
  return 'advertencia';
}

function mapLegacyRedAction(value: string): DisciplineAction {
  if (value === 'minutos_fora') return 'minutos_fora';
  if (value === 'fora_evento') return 'fora_evento';
  if (value === 'suspenso_x') return 'suspensao_eventos';
  return 'sai_partida';
}

function consequenceText(
  action: DisciplineAction,
  minutesOut: number,
  suspensionEvents: number,
  suspensionUntil?: string
): string {
  if (action === 'advertencia') return 'Advertência registrada';
  if (action === 'minutos_fora') return `${minutesOut} minuto(s) fora`;
  if (action === 'sai_partida') return 'Fora da partida atual';
  if (action === 'fora_evento') return 'Fora do restante do evento';
  if (action === 'suspensao_eventos') return `Suspenso por ${suspensionEvents} evento(s)`;
  if (action === 'suspensao_ate_data') return `Suspenso até ${suspensionUntil ?? 'data definida pelo Master'}`;
  if (action === 'bloqueio_analise') return 'Bloqueado para análise do Master';
  return 'Expulso da pelada';
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(() => loadData());

  useEffect(() => {
    saveData(data);
  }, [data]);

  const updatePelada = (patch: Partial<Pelada>) =>
    setData((d) => ({ ...d, pelada: { ...d.pelada, ...patch } }));

  const addMember = (member: Omit<Member, 'id' | 'peladaId' | 'joinedAt'>) =>
    setData((d) => ({
      ...d,
      members: [
        ...d.members,
        {
          ...member,
          id: genId('m'),
          peladaId: d.pelada.id,
          joinedAt: today(),
        },
      ],
    }));

  const updateMember = (id: string, patch: Partial<Member>) =>
    setData((d) => ({
      ...d,
      members: d.members.map((m) => (m.id === id ? { ...m, ...patch } : m)),
    }));

  const removeMember = (id: string) =>
    setData((d) => ({
      ...d,
      members: d.members.filter((m) => m.id !== id),
      payments: d.payments.filter((p) => p.memberId !== id),
      attendance: d.attendance.filter((a) => a.memberId !== id),
      queue: d.queue.filter((q) => q.memberId !== id),
      discipline: d.discipline.filter((r) => r.memberId !== id),
    }));

  const markPaymentPaid = (id: string) =>
    setData((d) => {
      const payment = d.payments.find((p) => p.id === id);
      if (!payment) return d;

      const paidDate = today();

      const payments = d.payments.map((p) =>
        p.id === id ? { ...p, status: 'pago' as const, paidDate } : p
      );

      let members = d.members;

      if (payment.type === 'mensalidade') {
        members = d.members.map((m) =>
          m.id === payment.memberId
            ? { ...m, paymentStatus: 'pago' as const, monthlyFeePaid: true }
            : m
        );
      }

      if (payment.type === 'multa') {
        members = members.map((m) =>
          m.id === payment.memberId && m.status === 'bloqueado'
            ? {
                ...m,
                status: 'ativo' as const,
                disciplineNote: 'Multa disciplinar paga',
              }
            : m
        );
      }

      const discipline = d.discipline.map((record) =>
        record.finePaymentId === id
          ? { ...record, finePaidDate: paidDate }
          : record
      );

      return { ...d, payments, members, discipline };
    });

  const addPayment = (payment: Omit<Payment, 'id'>) =>
    setData((d) => ({
      ...d,
      payments: [...d.payments, { ...payment, id: genId('pay') }],
    }));

  const addEvent = (event: Omit<AppEvent, 'id' | 'createdAt'>) =>
    setData((d) => ({
      ...d,
      events: [
        ...d.events,
        {
          ...event,
          id: genId('evt'),
          createdAt: today(),
        },
      ],
    }));

  const updateEvent = (id: string, patch: Partial<AppEvent>) =>
    setData((d) => ({
      ...d,
      events: d.events.map((e) => (e.id === id ? { ...e, ...patch } : e)),
    }));

  const addMatch = (match: Match) =>
    setData((d) => ({ ...d, matches: [...d.matches, match] }));

  const updateMatch = (id: string, patch: Partial<Match>) =>
    setData((d) => ({
      ...d,
      matches: d.matches.map((m) => (m.id === id ? { ...m, ...patch } : m)),
    }));

  const setQueue = (
    eventId: string,
    entries: { memberId: string; memberName: string; joinedAt: string }[]
  ) =>
    setData((d) => ({
      ...d,
      queue: entries.map((entry, index) => ({
        id: genId('q'),
        eventId,
        memberId: entry.memberId,
        memberName: entry.memberName,
        position: index + 1,
        joinedAt: entry.joinedAt,
      })),
    }));

  const addDiscipline = (record: Omit<DisciplineRecord, 'id'>) =>
    setData((d) => ({
      ...d,
      discipline: [...d.discipline, { ...record, id: genId('d') }],
    }));

  const registerDiscipline = (input: RegisterDisciplineInput) =>
    setData((d) => {
      const member = d.members.find((m) => m.id === input.memberId);
      if (!member) return d;

      const settings = d.rules.disciplineSettings;
      const date = today();
      const recordId = genId('disc');

      const monthStart = `${date.slice(0, 7)}-01`;
      const yellowCount = d.discipline.filter(
        (record) =>
          record.memberId === member.id &&
          record.card === 'amarelo' &&
          record.date >= monthStart
      ).length + 1;

      let action: DisciplineAction;
      let minutesOut = 0;
      let suspensionEvents = 0;
      let suspensionUntil: string | undefined;
      let fineAmount = 0;

      if (input.card === 'amarelo') {
        // Amarelo apenas adverte. A punição só vem por acúmulo.
        action = 'advertencia';

        if (settings.yellowMonthLimit > 0 && yellowCount >= settings.yellowMonthLimit) {
          action =
            settings.yellowAccumulatedAction ??
            mapLegacyYellowAction(settings.yellowLimitConsequence);

          suspensionEvents =
            action === 'suspensao_eventos'
              ? Math.max(1, settings.yellowSuspensionCount)
              : 0;

          if (settings.yellowFineEnabled) {
            fineAmount = Math.max(0, settings.yellowFineAmount ?? 0);
          }
        }
      } else {
        action =
          settings.redAction ??
          mapLegacyRedAction(settings.redConsequence);

        minutesOut =
          action === 'minutos_fora'
            ? Math.max(1, settings.redMinutesOut)
            : 0;

        suspensionEvents =
          action === 'suspensao_eventos'
            ? Math.max(1, settings.redSuspensionCount)
            : 0;

        suspensionUntil =
          action === 'suspensao_ate_data'
            ? settings.redSuspensionUntil
            : undefined;

        if (settings.redFineEnabled) {
          fineAmount = Math.max(0, settings.redFineAmount ?? 0);
        }
      }

      const returnPolicy: ReturnPolicy =
        settings.returnPolicy ??
        (fineAmount > 0 ? 'pagamento_multa' : 'automatico');

      const fineBlocksReturn =
  settings.fineBlocksReturn ??
  (
    returnPolicy === 'pagamento_multa' ||
    returnPolicy === 'aprovacao_e_multa'
  );

      const finePaymentId =
        fineAmount > 0 ? genId('pay') : undefined;

      const consequence = consequenceText(
        action,
        minutesOut,
        suspensionEvents,
        suspensionUntil
      );

      const record: DisciplineRecord = {
        id: recordId,
        memberId: member.id,
        memberName: member.name,
        card: input.card,
        reason: input.reason || 'Não informado',
        matchId: input.matchId,
        eventId: input.eventId,
        date,
        consequence: fineAmount > 0 ? `${consequence} + multa de R$ ${fineAmount.toFixed(2)}` : consequence,
        active: action !== 'advertencia',
        action,
        minutesOut: minutesOut || undefined,
        suspensionEvents: suspensionEvents || undefined,
        suspensionUntil,
        fineAmount: fineAmount || undefined,
        finePaymentId,
        finePaidDate: null,
        returnPolicy,
        ruleSnapshot: JSON.stringify({
          yellowMonthLimit: settings.yellowMonthLimit,
          yellowAccumulatedAction: settings.yellowAccumulatedAction,
          redAction: settings.redAction,
          redConsequence: settings.redConsequence,
          returnPolicy,
          fineAmount,
        }),
      };

      const members = d.members.map((m) => {
        if (m.id !== member.id) return m;

        const behaviorPenalty =
          input.card === 'amarelo'
            ? d.rules.behaviorRankingSettings.yellowPenalty
            : d.rules.behaviorRankingSettings.redPenalty;

        const base = {
          ...m,
          yellowCards: input.card === 'amarelo' ? m.yellowCards + 1 : m.yellowCards,
          redCards: input.card === 'vermelho' ? m.redCards + 1 : m.redCards,
          behaviorScore: m.behaviorScore - behaviorPenalty,
        };

        if (action === 'suspensao_eventos') {
          return {
            ...base,
            status: 'suspenso' as const,
            suspensionsLeft: Math.max(base.suspensionsLeft, suspensionEvents),
            disciplineNote: consequence,
          };
        }

        if (action === 'suspensao_ate_data') {
          return {
            ...base,
            status: 'suspenso' as const,
            suspendedUntil: suspensionUntil,
            disciplineNote: consequence,
          };
        }

        if (action === 'bloqueio_analise') {
          return {
            ...base,
            status: 'bloqueado' as const,
            disciplineNote: consequence,
          };
        }

        if (action === 'expulsao_pelada') {
          return {
            ...base,
            status: 'bloqueado' as const,
            expelledAt: date,
            disciplineNote: 'Expulso definitivamente da pelada',
          };
        }

        if (fineAmount > 0 && fineBlocksReturn) {
          return {
            ...base,
            status: 'bloqueado' as const,
            disciplineNote: `Aguardando pagamento de multa: R$ ${fineAmount.toFixed(2)}`,
          };
        }

        return base;
      });

      const payments =
        fineAmount > 0 && finePaymentId
          ? [
              ...d.payments,
              {
                id: finePaymentId,
                peladaId: d.pelada.id,
                memberId: member.id,
                memberName: member.name,
                type: 'multa' as const,
                amount: fineAmount,
                dueDate: dateAfterDays(settings.fineDueDays ?? 3),
                paidDate: null,
                status: 'pendente' as const,
                disciplineRecordId: recordId,
              },
            ]
          : d.payments;

      return {
        ...d,
        members,
        payments,
        discipline: [...d.discipline, record],
      };
    });

  const updateRules = (patch: Partial<RuleSettings>) =>
    setData((d) => ({
      ...d,
      rules: { ...d.rules, ...patch },
    }));

  const addRuleChange = (change: Omit<RuleChange, 'id'>) =>
    setData((d) => ({
      ...d,
      ruleChanges: [{ ...change, id: genId('rc') }, ...d.ruleChanges],
    }));

  const reset = () => setData(resetData());

  return (
    <DataContext.Provider
      value={{
        data,
        updatePelada,
        addMember,
        updateMember,
        removeMember,
        markPaymentPaid,
        addPayment,
        addEvent,
        updateEvent,
        addMatch,
        updateMatch,
        setQueue,
        addDiscipline,
        registerDiscipline,
        updateRules,
        addRuleChange,
        reset,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData(): DataContextValue {
  const ctx = useContext(DataContext);

  if (!ctx) {
    throw new Error('useData must be used within DataProvider');
  }

  return ctx;
}

export function teamFromIds(
  id: string,
  name: string,
  color: Team['color'],
  memberIds: string[],
  gkIds: string[]
): Team {
  return {
    id,
    name,
    color,
    memberIds,
    goalkeeperIds: gkIds,
    score: 0,
    winsStreak: 0,
  };
}

export { seedData };