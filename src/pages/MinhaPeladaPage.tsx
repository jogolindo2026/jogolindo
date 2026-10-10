import { useState } from 'react';
import {
  Copy,
  Share2,
  Mail,
  MapPin,
  Clock,
  Users,
  DollarSign,
  Save,
  Calendar,
  UserPlus,
} from 'lucide-react';

import { useData } from '@/context/DataContext';
import { useToast } from '@/components/ui/Toast';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Form';
import { ConvidarJogadorModal } from '@/components/convites/ConvidarJogadorModal';

const days = [
  'Domingo',
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
];

// Temporário.
// Depois virá da pelada real carregada do Supabase.
const PELADA_RICARDO_ID =
  '49729f04-fcce-4838-8332-00c41bf5169b';

export function MinhaPeladaPage() {
  const { data, updatePelada } = useData();
  const { showToast } = useToast();

  const [form, setForm] = useState(data.pelada);
  const [extraInput, setExtraInput] = useState('');

  const [modalConviteAberto, setModalConviteAberto] =
    useState(false);

  const save = () => {
    updatePelada(form);
    showToast(
      'success',
      'Dados da pelada atualizados!'
    );
  };

  const copyLink = () => {
    navigator.clipboard
      .writeText(form.inviteLink)
      .then(() =>
        showToast(
          'success',
          'Link copiado!'
        )
      );
  };

  const shareWhatsApp = () => {
    const msg =
      `Olá! Você foi convidado para a ${form.name} ` +
      `na JogoLindo. Acesse: ${form.inviteLink}`;

    window.open(
      `https://wa.me/?text=${encodeURIComponent(
        msg
      )}`,
      '_blank'
    );
  };

  const shareEmail = () => {
    const subject =
      `Convite: ${form.name}`;

    const body =
      `Você foi convidado para participar da ${form.name}!\n\n` +
      `Local: ${form.place}\n` +
      `Dias: ${form.days.join(', ')}\n` +
      `Horário: ${form.startTime} às ${form.endTime}\n` +
      `Mensalidade: R$ ${form.monthlyFee.toFixed(2)}\n\n` +
      `Acesse: ${form.inviteLink}`;

    window.location.href =
      `mailto:?subject=${encodeURIComponent(
        subject
      )}` +
      `&body=${encodeURIComponent(body)}`;
  };

  const toggleDay = (day: string) => {
    setForm((f) => ({
      ...f,
      days: f.days.includes(day)
        ? f.days.filter(
            (d) => d !== day
          )
        : [...f.days, day],
    }));
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            Minha Pelada
          </h1>

          <Button onClick={save}>
            <Save size={18} />
            Salvar
          </Button>
        </div>

        {/* Informações gerais */}
        <Card className="p-5 space-y-4">
          <h2 className="font-bold text-gray-900">
            Informações Gerais
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Nome da pelada"
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
            />

            <Input
              label="Local"
              value={form.place}
              onChange={(e) =>
                setForm({
                  ...form,
                  place: e.target.value,
                })
              }
            />

            <Input
              label="Link do mapa"
              value={form.mapLink ?? ''}
              onChange={(e) =>
                setForm({
                  ...form,
                  mapLink: e.target.value,
                })
              }
            />

            <Input
              label="Link público de convite"
              value={form.inviteLink}
              onChange={(e) =>
                setForm({
                  ...form,
                  inviteLink: e.target.value,
                })
              }
            />
          </div>
        </Card>

        {/* Agenda */}
        <Card className="p-5 space-y-4">
          <h2 className="font-bold text-gray-900 flex items-center gap-2">
            <Calendar
              size={20}
              className="text-blue-500"
            />
            Agenda Regular
          </h2>

          <div className="flex flex-wrap gap-2">
            {days.map((day) => (
              <button
                key={day}
                onClick={() =>
                  toggleDay(day)
                }
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  form.days.includes(day)
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {day}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Input
              label="Início"
              type="time"
              value={form.startTime}
              onChange={(e) =>
                setForm({
                  ...form,
                  startTime:
                    e.target.value,
                })
              }
            />

            <Input
              label="Fim"
              type="time"
              value={form.endTime}
              onChange={(e) =>
                setForm({
                  ...form,
                  endTime:
                    e.target.value,
                })
              }
            />

            <Input
              label="Vencimento (dia)"
              type="number"
              value={form.dueDate}
              onChange={(e) =>
                setForm({
                  ...form,
                  dueDate: Number(
                    e.target.value
                  ),
                })
              }
            />

            <Input
              label="Máx. participantes"
              type="number"
              value={form.maxParticipants}
              onChange={(e) =>
                setForm({
                  ...form,
                  maxParticipants:
                    Number(
                      e.target.value
                    ),
                })
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Horários extras
            </label>

            <div className="flex gap-2">
              <Input
                placeholder="Ex: Sábado 16h"
                value={extraInput}
                onChange={(e) =>
                  setExtraInput(
                    e.target.value
                  )
                }
              />

              <Button
                variant="outline"
                onClick={() => {
                  if (!extraInput) {
                    return;
                  }

                  setForm({
                    ...form,
                    extraSchedules: [
                      ...(form.extraSchedules ??
                        []),
                      extraInput,
                    ],
                  });

                  setExtraInput('');
                }}
              >
                Adicionar
              </Button>
            </div>

            {form.extraSchedules &&
              form.extraSchedules.length >
                0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {form.extraSchedules.map(
                    (s, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-lg text-sm"
                      >
                        {s}

                        <button
                          onClick={() =>
                            setForm({
                              ...form,
                              extraSchedules:
                                form.extraSchedules!.filter(
                                  (
                                    _,
                                    j
                                  ) =>
                                    j !==
                                    i
                                ),
                            })
                          }
                          className="text-blue-400 hover:text-blue-600"
                        >
                          ×
                        </button>
                      </span>
                    )
                  )}
                </div>
              )}
          </div>
        </Card>

        {/* Formato */}
        <Card className="p-5 space-y-4">
          <h2 className="font-bold text-gray-900 flex items-center gap-2">
            <Users
              size={20}
              className="text-green-600"
            />
            Formato do Jogo
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <Select
              label="Jogadores por time"
              value={String(
                form.playersPerTeam
              )}
              onChange={(e) =>
                setForm({
                  ...form,
                  playersPerTeam:
                    Number(
                      e.target.value
                    ),
                })
              }
              options={[
                5,
                6,
                7,
                8,
                9,
                10,
              ].map((n) => ({
                value: String(n),
                label: `${n} jogadores`,
              }))}
            />

            <Select
              label="Goleiro"
              value={
                form.hasGoalkeeper
                  ? 'sim'
                  : 'nao'
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  hasGoalkeeper:
                    e.target.value ===
                    'sim',
                })
              }
              options={[
                {
                  value: 'sim',
                  label: 'Com goleiro',
                },
                {
                  value: 'nao',
                  label: 'Sem goleiro',
                },
              ]}
            />

            <Input
              label="Máx. reservas/time"
              type="number"
              value={form.maxReserves}
              onChange={(e) =>
                setForm({
                  ...form,
                  maxReserves:
                    Number(
                      e.target.value
                    ),
                })
              }
            />
          </div>
        </Card>

        {/* Valores */}
        <Card className="p-5 space-y-4">
          <h2 className="font-bold text-gray-900 flex items-center gap-2">
            <DollarSign
              size={20}
              className="text-green-600"
            />
            Valores
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Mensalidade (R$)"
              type="number"
              value={form.monthlyFee}
              onChange={(e) =>
                setForm({
                  ...form,
                  monthlyFee:
                    Number(
                      e.target.value
                    ),
                })
              }
            />

            <Input
              label="Taxa de convidado (R$)"
              type="number"
              value={form.guestFee}
              onChange={(e) =>
                setForm({
                  ...form,
                  guestFee:
                    Number(
                      e.target.value
                    ),
                })
              }
            />

            <Input
              label="Valor do goleiro (R$)"
              type="number"
              value={form.goalkeeperFee}
              onChange={(e) =>
                setForm({
                  ...form,
                  goalkeeperFee:
                    Number(
                      e.target.value
                    ),
                })
              }
            />
          </div>
        </Card>

        {/* Novo sistema de convites */}
        <Card className="p-5 space-y-4">
          <div>
            <h2 className="font-bold text-gray-900">
              Convidar jogador
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Gere um convite individual
              para diarista ou mensalista.
            </p>
          </div>

          <Button
            variant="success"
            fullWidth
            onClick={() =>
              setModalConviteAberto(true)
            }
          >
            <UserPlus size={18} />
            Convidar jogador pelo WhatsApp
          </Button>
        </Card>

        {/* Convite antigo - temporário */}
        <Card className="p-5 space-y-4">
          <h2 className="font-bold text-gray-900">
            Convite atual
          </h2>

          <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-2">
            <span className="text-sm text-gray-600 truncate flex-1">
              {form.inviteLink}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              fullWidth
              onClick={copyLink}
            >
              <Copy size={18} />
              Copiar link
            </Button>

            <Button
              variant="success"
              fullWidth
              onClick={shareWhatsApp}
            >
              <Share2 size={18} />
              Enviar por WhatsApp
            </Button>

            <Button
              variant="outline"
              fullWidth
              onClick={shareEmail}
            >
              <Mail size={18} />
              Enviar por e-mail
            </Button>
          </div>
        </Card>

        {/* Regras */}
        <Card className="p-5">
          <h2 className="font-bold text-gray-900 mb-3">
            Regras atuais
          </h2>

          <div className="space-y-2 text-sm text-gray-600">
            <p className="flex items-center gap-2">
              <Users
                size={16}
                className="text-gray-400"
              />

              {
                data.rules.matchFormat
                  .playersPerTeam
              }{' '}
              contra{' '}
              {
                data.rules.matchFormat
                  .playersPerTeam
              }

              {data.rules.matchFormat
                .hasGoalkeeper
                ? ' com goleiros'
                : ''}
            </p>

            <p className="flex items-center gap-2">
              <Clock
                size={16}
                className="text-gray-400"
              />

              {
                data.rules.matchDuration
                  .periods
              }{' '}
              tempo(s) de{' '}
              {
                data.rules.matchDuration
                  .periodMinutes
              }{' '}
              min
            </p>

            <p className="flex items-center gap-2">
              <MapPin
                size={16}
                className="text-gray-400"
              />

              {data.rules.rotationSettings
                .winnerStays ===
              'permanece_ate_limite'
                ? `Vencedor fica até ${data.rules.rotationSettings.winnerLimit} vitórias`
                : data.rules
                    .rotationSettings
                    .winnerStays}
            </p>

            <p className="flex items-center gap-2">
              <DollarSign
                size={16}
                className="text-gray-400"
              />

              {data.rules.financialRules
                .inadimplentCanPlay ===
              'nao'
                ? 'Inadimplente não joga'
                : 'Inadimplente pode regularizar'}
            </p>
          </div>

          <Button
            variant="ghost"
            fullWidth
            className="mt-4"
            onClick={() =>
              (window.location.hash =
                '/regras')
            }
          >
            Editar regras
          </Button>
        </Card>
      </div>

      <ConvidarJogadorModal
        open={modalConviteAberto}
        onClose={() =>
          setModalConviteAberto(false)
        }
        peladaId={PELADA_RICARDO_ID}
        peladaNome="Pelada Ricardo"
        local="Aterro do Flamengo"
        campo="Campo 5"
        diasTexto="Sábado"
        horarioTexto="09:00 às 11:00"
        valorDiarista={15}
        mensalidade={30}
        diaVencimento={10}
        podeConvidarMensalista={true}
      />
    </>
  );
}