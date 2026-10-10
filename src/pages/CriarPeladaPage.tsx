import { useState } from 'react';
import {
  ArrowLeft,
  Calendar,
  Clock,
  DollarSign,
  MapPin,
  Save,
  ShieldCheck,
  Users,
} from 'lucide-react';

import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Form';
import { useToast } from '@/components/ui/Toast';

interface CriarPeladaPageProps {
  onVoltar?: () => void;
  onCriada?: (peladaId: string) => void;
}

const DIAS = [
  'Domingo',
  'Segunda-feira',
  'Terça-feira',
  'Quarta-feira',
  'Quinta-feira',
  'Sexta-feira',
  'Sábado',
];

export function CriarPeladaPage({
  onVoltar,
  onCriada,
}: CriarPeladaPageProps) {
  const { showToast } = useToast();

  const [salvando, setSalvando] =
    useState(false);

  const [erro, setErro] =
    useState('');

  const [nome, setNome] =
    useState('');

  const [local, setLocal] =
    useState('');

  const [campo, setCampo] =
    useState('');

  const [mapLink, setMapLink] =
    useState('');

  const [dias, setDias] =
    useState<string[]>([]);

  const [horaInicio, setHoraInicio] =
    useState('');

  const [horaFim, setHoraFim] =
    useState('');

  const [
    limiteParticipantes,
    setLimiteParticipantes,
  ] = useState('');

  const [
    jogadoresPorTime,
    setJogadoresPorTime,
  ] = useState('6');

  const [temGoleiro, setTemGoleiro] =
    useState(true);

  const [mensalidade, setMensalidade] =
    useState('');

  const [valorDiarista, setValorDiarista] =
    useState('');

  const [taxaColete, setTaxaColete] =
    useState('');

  const [diaVencimento, setDiaVencimento] =
    useState('10');

  const alternarDia = (dia: string) => {
    setDias((atuais) =>
      atuais.includes(dia)
        ? atuais.filter(
            (item) => item !== dia
          )
        : [...atuais, dia]
    );
  };

  const criarPelada = async () => {
    if (salvando) return;

    setErro('');

    if (!nome.trim()) {
      setErro(
        'Informe o nome da pelada.'
      );
      return;
    }

    if (dias.length === 0) {
      setErro(
        'Escolha pelo menos um dia da semana.'
      );
      return;
    }

    if (!horaInicio || !horaFim) {
      setErro(
        'Informe o horário de início e fim.'
      );
      return;
    }

    const mensalidadeNumero =
      Number(mensalidade || 0);

    const diariaNumero =
      Number(valorDiarista || 0);

    const coleteNumero =
      Number(taxaColete || 0);

    const vencimentoNumero =
      Number(diaVencimento);

    if (
      Number.isNaN(mensalidadeNumero) ||
      mensalidadeNumero < 0
    ) {
      setErro(
        'Informe uma mensalidade válida.'
      );
      return;
    }

    if (
      Number.isNaN(diariaNumero) ||
      diariaNumero < 0
    ) {
      setErro(
        'Informe um valor de diarista válido.'
      );
      return;
    }

    if (
      Number.isNaN(coleteNumero) ||
      coleteNumero < 0
    ) {
      setErro(
        'Informe uma taxa de colete válida.'
      );
      return;
    }

    if (
      vencimentoNumero < 1 ||
      vencimentoNumero > 28
    ) {
      setErro(
        'O vencimento deve ser entre os dias 1 e 28.'
      );
      return;
    }

    setSalvando(true);

    try {
      const {
        data,
        error,
      } = await supabase.rpc(
        'criar_pelada',
        {
          p_nome: nome.trim(),

          p_local:
            local.trim() || null,

          p_campo:
            campo.trim() || null,

          p_map_link:
            mapLink.trim() || null,

          p_dias_semana: dias,

          p_hora_inicio:
            horaInicio || null,

          p_hora_fim:
            horaFim || null,

          p_limite_participantes:
            limiteParticipantes
              ? Number(
                  limiteParticipantes
                )
              : null,

          p_jogadores_por_time:
            Number(jogadoresPorTime),

          p_tem_goleiro:
            temGoleiro,

          p_mensalidade:
            mensalidadeNumero,

          p_valor_diarista:
            diariaNumero,

          p_taxa_colete:
            coleteNumero,

          p_dia_vencimento:
            vencimentoNumero,
        }
      );

      if (error) {
        console.error(
          'Erro ao criar pelada:',
          error
        );

        if (
          error.message?.includes(
            'NAO_AUTENTICADO'
          )
        ) {
          setErro(
            'Sua sessão expirou. Entre novamente.'
          );
          return;
        }

        setErro(
          'Não foi possível criar a pelada.'
        );
        return;
      }

      const resultado =
        Array.isArray(data)
          ? data[0]
          : data;

      if (!resultado?.pelada_id) {
        setErro(
          'A pelada foi processada, mas o sistema não recebeu o identificador.'
        );
        return;
      }

      showToast(
        'success',
        `${resultado.nome} criada com sucesso!`
      );

      onCriada?.(
        resultado.pelada_id
      );
    } catch (error) {
      console.error(
        'Erro inesperado:',
        error
      );

      setErro(
        'Ocorreu um erro inesperado ao criar a pelada.'
      );
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center gap-3">
        {onVoltar && (
          <button
            type="button"
            onClick={onVoltar}
            disabled={salvando}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900"
          >
            <ArrowLeft size={20} />
          </button>
        )}

        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Criar nova pelada
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Configure as informações
            principais. Você será o OWNER
            desta pelada.
          </p>
        </div>
      </div>

      {/* Identificação */}
      <Card className="space-y-4 p-5">
        <h2 className="flex items-center gap-2 font-bold text-gray-900">
          <MapPin
            size={20}
            className="text-green-600"
          />
          Identificação
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Nome da pelada"
            value={nome}
            onChange={(e) =>
              setNome(e.target.value)
            }
            placeholder="Ex: Pelada de Sábado"
          />

          <Input
            label="Local"
            value={local}
            onChange={(e) =>
              setLocal(e.target.value)
            }
            placeholder="Ex: Aterro do Flamengo"
          />

          <Input
            label="Campo / quadra"
            value={campo}
            onChange={(e) =>
              setCampo(e.target.value)
            }
            placeholder="Ex: Campo 5"
          />

          <Input
            label="Link do mapa"
            value={mapLink}
            onChange={(e) =>
              setMapLink(e.target.value)
            }
            placeholder="Google Maps"
          />
        </div>
      </Card>

      {/* Agenda */}
      <Card className="space-y-4 p-5">
        <h2 className="flex items-center gap-2 font-bold text-gray-900">
          <Calendar
            size={20}
            className="text-blue-500"
          />
          Agenda
        </h2>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Dias da semana
          </label>

          <div className="flex flex-wrap gap-2">
            {DIAS.map((dia) => (
              <button
                key={dia}
                type="button"
                onClick={() =>
                  alternarDia(dia)
                }
                disabled={salvando}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                  dias.includes(dia)
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {dia}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Horário de início"
            type="time"
            value={horaInicio}
            onChange={(e) =>
              setHoraInicio(
                e.target.value
              )
            }
          />

          <Input
            label="Horário de término"
            type="time"
            value={horaFim}
            onChange={(e) =>
              setHoraFim(
                e.target.value
              )
            }
          />
        </div>
      </Card>

      {/* Jogo */}
      <Card className="space-y-4 p-5">
        <h2 className="flex items-center gap-2 font-bold text-gray-900">
          <Users
            size={20}
            className="text-green-600"
          />
          Formato do jogo
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Select
            label="Jogadores por time"
            value={jogadoresPorTime}
            onChange={(e) =>
              setJogadoresPorTime(
                e.target.value
              )
            }
            options={[
              5,
              6,
              7,
              8,
              9,
              10,
              11,
            ].map((numero) => ({
              value: String(numero),
              label: `${numero} jogadores`,
            }))}
          />

          <Select
            label="Goleiro"
            value={
              temGoleiro
                ? 'sim'
                : 'nao'
            }
            onChange={(e) =>
              setTemGoleiro(
                e.target.value ===
                  'sim'
              )
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
            label="Limite de participantes"
            type="number"
            min="1"
            value={limiteParticipantes}
            onChange={(e) =>
              setLimiteParticipantes(
                e.target.value
              )
            }
            placeholder="Ex: 40"
          />
        </div>
      </Card>

      {/* Financeiro */}
      <Card className="space-y-4 p-5">
        <h2 className="flex items-center gap-2 font-bold text-gray-900">
          <DollarSign
            size={20}
            className="text-green-600"
          />
          Valores
        </h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Mensalidade (R$)"
            type="number"
            min="0"
            step="0.01"
            value={mensalidade}
            onChange={(e) =>
              setMensalidade(
                e.target.value
              )
            }
            placeholder="0,00"
          />

          <Input
            label="Diarista (R$)"
            type="number"
            min="0"
            step="0.01"
            value={valorDiarista}
            onChange={(e) =>
              setValorDiarista(
                e.target.value
              )
            }
            placeholder="0,00"
          />

          <Input
            label="Taxa de colete (R$)"
            type="number"
            min="0"
            step="0.01"
            value={taxaColete}
            onChange={(e) =>
              setTaxaColete(
                e.target.value
              )
            }
            placeholder="0,00"
          />

          <Input
            label="Dia do vencimento"
            type="number"
            min="1"
            max="28"
            value={diaVencimento}
            onChange={(e) =>
              setDiaVencimento(
                e.target.value
              )
            }
          />
        </div>

        <div className="rounded-xl bg-blue-50 p-4">
          <div className="flex items-start gap-3">
            <ShieldCheck
              size={20}
              className="mt-0.5 shrink-0 text-blue-600"
            />

            <div>
              <p className="text-sm font-semibold text-blue-900">
                Recebimentos serão configurados depois
              </p>

              <p className="mt-1 text-sm text-blue-700">
                A pelada será criada primeiro.
                Depois o OWNER poderá configurar
                a conta Asaas que receberá os
                pagamentos.
              </p>
            </div>
          </div>
        </div>
      </Card>

      {erro && (
        <div className="rounded-xl bg-red-50 p-4 text-sm text-red-700">
          {erro}
        </div>
      )}

      <div className="flex justify-end">
        <Button
          variant="success"
          size="lg"
          onClick={criarPelada}
          disabled={salvando}
        >
          <Save size={18} />

          {salvando
            ? 'Criando...'
            : 'Criar pelada'}
        </Button>
      </div>
    </div>
  );
}