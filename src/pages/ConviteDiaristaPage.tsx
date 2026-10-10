import { FormEvent, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

type ConviteDiaristaPageProps = {
  token: string;
  onLinkAccount: (participantId: string, mode: 'login' | 'cadastro') => void;
};

type PeladaPublica = {
  id: string;
  nome: string;
  local: string;
  campo: string | null;
  dias_semana: string[] | null;
  hora_inicio: string | null;
  hora_fim: string | null;
  valor_diarista: number | string;
  taxa_colete: number | string;
  mensalidade?: number | string | null;
  dia_vencimento?: number | null;
};

type ConvitePublico = {
  convite_id: string;
  tipo: 'DIARISTA' | 'MENSALISTA';
  pelada_id: string;
  pelada_nome: string;
  local: string;
  campo: string | null;
  dias_semana: string[] | null;
  hora_inicio: string | null;
  hora_fim: string | null;
  valor_diarista: number | string;
  taxa_colete: number | string;
  status: string;
  expira_em: string | null;
  convidado_por: string | null;
};

const PAISES = [
  {
    codigo: 'BR',
    bandeira: '🇧🇷',
    nome: 'Brasil',
    ddi: '55',
  },
  {
    codigo: 'PT',
    bandeira: '🇵🇹',
    nome: 'Portugal',
    ddi: '351',
  },
  {
    codigo: 'US',
    bandeira: '🇺🇸',
    nome: 'Estados Unidos',
    ddi: '1',
  },
  {
    codigo: 'AR',
    bandeira: '🇦🇷',
    nome: 'Argentina',
    ddi: '54',
  },
  {
    codigo: 'UY',
    bandeira: '🇺🇾',
    nome: 'Uruguai',
    ddi: '598',
  },
  {
    codigo: 'PY',
    bandeira: '🇵🇾',
    nome: 'Paraguai',
    ddi: '595',
  },
];

function formatarHora(hora: string | null) {
  if (!hora) return '';
  return hora.slice(0, 5);
}

function formatarMoeda(valor: number) {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

function somenteNumeros(valor: string) {
  return valor.replace(/\D/g, '');
}

function cpfValido(cpfInformado: string) {
  const cpf = somenteNumeros(cpfInformado);

  if (cpf.length !== 11) return false;

  if (/^(\d)\1{10}$/.test(cpf)) {
    return false;
  }

  let soma = 0;

  for (let i = 0; i < 9; i++) {
    soma += Number(cpf[i]) * (10 - i);
  }

  let digito = (soma * 10) % 11;

  if (digito === 10) {
    digito = 0;
  }

  if (digito !== Number(cpf[9])) {
    return false;
  }

  soma = 0;

  for (let i = 0; i < 10; i++) {
    soma += Number(cpf[i]) * (11 - i);
  }

  digito = (soma * 10) % 11;

  if (digito === 10) {
    digito = 0;
  }

  return digito === Number(cpf[10]);
}

export function ConviteDiaristaPage({
  token,
  onLinkAccount,
}: ConviteDiaristaPageProps) {
  const [pelada, setPelada] =
    useState<PeladaPublica | null>(null);

  const [convite, setConvite] =
    useState<ConvitePublico | null>(null);

  const [carregando, setCarregando] =
    useState(true);

  const [erro, setErro] =
    useState('');

  const [nome, setNome] =
    useState('');

  const [apelido, setApelido] =
    useState('');

  const [cpf, setCpf] =
    useState('');

  const [email, setEmail] =
    useState('');

  const [pais, setPais] =
    useState('BR');

  const [telefone, setTelefone] =
    useState('');

  const [
    usaColetePelada,
    setUsaColetePelada,
  ] = useState(false);

  const [enviando, setEnviando] =
    useState(false);

  const [
    erroFormulario,
    setErroFormulario,
  ] = useState('');

  const [sucesso, setSucesso] =
    useState('');

  const [participanteCriadoId, setParticipanteCriadoId] =
    useState('');

  useEffect(() => {
    async function carregarConvite() {
      setCarregando(true);
      setErro('');

      /*
        NOVO FLUXO:
        convite individual por token.
      */
      if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(token)) {
        const {
          data,
          error,
        } = await supabase.rpc(
          'obter_convite',
          {
            p_token: token,
          }
        );

        if (error) {
          console.error(
            'Erro ao carregar convite:',
            error
          );

          setErro(
            'Não foi possível carregar este convite.'
          );

          setCarregando(false);
          return;
        }

        if (!data || data.length === 0) {
          setErro(
            'Este convite não existe, expirou ou não está mais disponível.'
          );

          setCarregando(false);
          return;
        }

        const conviteRecebido =
          data[0] as ConvitePublico;

        if (!['DIARISTA', 'MENSALISTA'].includes(conviteRecebido.tipo)) {
          setErro(
            'Este convite possui um tipo inválido.'
          );

          setCarregando(false);
          return;
        }

        setConvite(conviteRecebido);

        setPelada({
          id: conviteRecebido.pelada_id,
          nome: conviteRecebido.pelada_nome,
          local: conviteRecebido.local,
          campo: conviteRecebido.campo,
          dias_semana:
            conviteRecebido.dias_semana,
          hora_inicio:
            conviteRecebido.hora_inicio,
          hora_fim:
            conviteRecebido.hora_fim,
          valor_diarista:
            conviteRecebido.valor_diarista,
          taxa_colete:
            conviteRecebido.taxa_colete,
        });

        setCarregando(false);
        return;
      }

      setErro(
        'Convite inválido.'
      );

      setCarregando(false);
    }

    carregarConvite();
  }, [token]);

  async function enviarFormulario(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setErroFormulario('');
    setSucesso('');

    if (!token || !convite || !pelada) {
      setErroFormulario(
        'Este cadastro exige um convite válido.'
      );
      return;
    }

    const nomeLimpo =
      nome.trim();

    const apelidoLimpo =
      apelido.trim();

    const cpfLimpo =
      somenteNumeros(cpf);

    const emailLimpo =
      email.trim().toLowerCase();

    const paisSelecionado =
      PAISES.find(
        (item) =>
          item.codigo === pais
      ) ?? PAISES[0];

    let telefoneLimpo =
      somenteNumeros(telefone);

    /*
      Se o navegador já preencher
      o telefone com DDI,
      não duplicamos o código.
    */
    if (
      !telefoneLimpo.startsWith(
        paisSelecionado.ddi
      )
    ) {
      telefoneLimpo =
        `${paisSelecionado.ddi}${telefoneLimpo}`;
    }

    if (nomeLimpo.length < 3) {
      setErroFormulario(
        'Informe seu nome completo.'
      );
      return;
    }

    if (apelidoLimpo.length < 2) {
      setErroFormulario(
        'Informe seu apelido.'
      );
      return;
    }

    if (!cpfValido(cpfLimpo)) {
      setErroFormulario(
        'Informe um CPF válido.'
      );
      return;
    }

    if (
      !emailLimpo ||
      !emailLimpo.includes('@')
    ) {
      setErroFormulario(
        'Informe um e-mail válido.'
      );
      return;
    }

    if (
      telefoneLimpo.length < 8 ||
      telefoneLimpo.length > 15
    ) {
      setErroFormulario(
        'Informe um WhatsApp válido.'
      );
      return;
    }

    setEnviando(true);

    try {
      const { data, error } = await supabase.rpc(
        'inscrever_por_convite',
        {
          p_token: token,
          p_nome: nomeLimpo,
          p_apelido: apelidoLimpo,
          p_cpf: cpfLimpo,
          p_email: emailLimpo,
          p_telefone: telefoneLimpo,
          p_pais: pais,
        }
      );

      if (error) {
        const message = error.message.toUpperCase();
        if (message.includes('CONVITE_INVALIDO')) {
          throw new Error('Este convite expirou, já foi utilizado ou não é válido.');
        }
        if (message.includes('TELEFONE_NAO_CORRESPONDE')) {
          throw new Error('Use o mesmo WhatsApp que recebeu o convite.');
        }
        if (message.includes('CPF_JA_CADASTRADO')) {
          throw new Error('Já existe um cadastro com esses dados. Entre em contato com a organização para vincular sua conta com segurança.');
        }
        throw new Error('Não foi possível concluir a inscrição. Confira os dados e tente novamente.');
      }

      const resultado = Array.isArray(data) ? data[0] : data;
      if (!resultado?.participante_id) {
        throw new Error('A inscrição não retornou um cadastro válido.');
      }

      setParticipanteCriadoId(resultado.participante_id);
      setSucesso(
        `Inscrição recebida para ${resultado.apelido || resultado.nome}. O pagamento está pendente; este cadastro ainda não confirma pagamento nem libera a participação em jogo.`
      );
    } catch (error) {
      console.error('Erro ao inscrever por convite:', error);
      setErroFormulario(
        error instanceof Error
          ? error.message
          : 'Não foi possível concluir a inscrição. Tente novamente.'
      );
    } finally {
      setEnviando(false);
    }
  }

  if (carregando) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <p className="text-gray-500">
          Carregando convite...
        </p>
      </div>
    );
  }

  if (erro || !pelada) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-lg rounded-2xl bg-white p-6 text-center shadow-sm">
          <h1 className="text-xl font-bold text-gray-900">
            Convite indisponível
          </h1>

          <p className="mt-2 text-gray-500">
            {erro}
          </p>
        </div>
      </div>
    );
  }

  const valorBase = Number(pelada.valor_diarista ?? 0);

  const valorColete =
    usaColetePelada
      ? Number(
          pelada.taxa_colete ?? 0
        )
      : 0;

  const valorTotal =
    valorBase + valorColete;

  const dias =
    Array.isArray(
      pelada.dias_semana
    )
      ? pelada.dias_semana.join(', ')
      : '';

  const horaInicio =
    formatarHora(
      pelada.hora_inicio
    );

  const horaFim =
    formatarHora(
      pelada.hora_fim
    );

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-lg rounded-2xl bg-white p-6 shadow-sm">

        {/* Cabeçalho */}
        <div className="mb-6 text-center">
          <p className="text-sm font-medium text-green-700">
            {convite?.tipo === 'MENSALISTA'
              ? 'Convite para mensalista'
              : 'Convite para diarista'}
          </p>

          <h1 className="mt-2 text-3xl font-bold text-gray-900">
            {pelada.nome}
          </h1>

          {convite?.convidado_por && (
            <p className="mt-2 text-sm text-gray-500">
              Convite de{' '}
              <strong className="text-gray-700">
                {convite.convidado_por}
              </strong>
            </p>
          )}

          <p className="mt-3 text-gray-600">
            {pelada.local}

            {pelada.campo
              ? ` • ${pelada.campo}`
              : ''}
          </p>

          {(
            dias ||
            horaInicio ||
            horaFim
          ) && (
            <p className="text-gray-600">
              {dias}

              {dias &&
              (horaInicio || horaFim)
                ? ' • '
                : ''}

              {horaInicio}

              {horaInicio && horaFim
                ? ' às '
                : ''}

              {horaFim}
            </p>
          )}
        </div>

        <form
          onSubmit={
            enviarFormulario
          }
        >
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Nome completo"
              value={nome}
              onChange={(e) =>
                setNome(
                  e.target.value
                )
              }
              autoComplete="name"
              className="w-full rounded-xl border border-gray-300 px-4 py-3"
            />

            <input
              type="text"
              placeholder="Apelido"
              value={apelido}
              onChange={(e) =>
                setApelido(
                  e.target.value
                )
              }
              className="w-full rounded-xl border border-gray-300 px-4 py-3"
            />

            <input
              type="text"
              placeholder="CPF"
              value={cpf}
              onChange={(e) =>
                setCpf(
                  e.target.value
                )
              }
              inputMode="numeric"
              className="w-full rounded-xl border border-gray-300 px-4 py-3"
            />

            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
              autoComplete="email"
              className="w-full rounded-xl border border-gray-300 px-4 py-3"
            />

            {/* WhatsApp */}
            <div className="flex overflow-hidden rounded-xl border border-gray-300 bg-white focus-within:border-green-600">
              <select
                value={pais}
                onChange={(e) =>
                  setPais(
                    e.target.value
                  )
                }
                aria-label="País do WhatsApp"
                className="border-r border-gray-300 bg-gray-50 px-3 py-3 text-sm outline-none"
              >
                {PAISES.map(
                  (item) => (
                    <option
                      key={
                        item.codigo
                      }
                      value={
                        item.codigo
                      }
                    >
                      {
                        item.bandeira
                      }{' '}
                      +{item.ddi}
                    </option>
                  )
                )}
              </select>

              <input
                type="tel"
                placeholder="WhatsApp"
                value={telefone}
                onChange={(e) =>
                  setTelefone(
                    e.target.value
                  )
                }
                autoComplete="tel-national"
                inputMode="tel"
                className="min-w-0 flex-1 px-4 py-3 outline-none"
              />
            </div>
          </div>

          {/* Colete */}
          {convite?.tipo === 'DIARISTA' && (
          <div className="mt-6 rounded-xl bg-gray-50 p-4">
            <p className="font-semibold text-gray-900">
              Colete
            </p>

            <label className="mt-3 flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={
                  usaColetePelada
                }
                onChange={(e) =>
                  setUsaColetePelada(
                    e.target.checked
                  )
                }
                className="mt-1"
              />

              <span className="text-sm text-gray-600">
                Preciso usar o
                colete da pelada

                <strong className="ml-1 text-gray-900">
                  (+
                  {' '}
                  {formatarMoeda(
                    Number(
                      pelada.taxa_colete ??
                        0
                    )
                  )}
                  )
                </strong>
              </span>
            </label>
          </div>
          )}

          {/* Total */}
          <div className="mt-6 border-t pt-5">
            {convite?.tipo === 'DIARISTA' ? (
              <div className="flex items-center justify-between">
                <span className="text-gray-600">
                  Valor da participação
                </span>

                <strong className="text-2xl text-gray-900">
                  {formatarMoeda(valorTotal)}
                </strong>
              </div>
            ) : (
              <p className="text-sm text-gray-600">
                Seu convite aprova a entrada como mensalista. O pagamento continua pendente e será tratado pela organização; este cadastro não libera participação em jogo.
              </p>
            )}
          </div>

          {erroFormulario && (
            <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">
              {erroFormulario}
            </div>
          )}

          {sucesso && (
            <div className="mt-4 rounded-xl bg-green-50 p-3 text-sm font-medium text-green-700">
              {sucesso}
            </div>
          )}

          {participanteCriadoId && (
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => onLinkAccount(participanteCriadoId, 'cadastro')}
                className="w-full rounded-xl border border-green-700 px-4 py-3 font-semibold text-green-800 hover:bg-green-50"
              >
                Criar conta e vincular
              </button>
              <button
                type="button"
                onClick={() => onLinkAccount(participanteCriadoId, 'login')}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 font-semibold text-gray-700 hover:bg-gray-50"
              >
                Entrar e vincular
              </button>
            </div>
          )}

          <button
            type="submit"
            disabled={enviando || Boolean(participanteCriadoId)}
            className="mt-6 w-full rounded-xl bg-green-700 px-4 py-3 font-semibold text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {enviando
              ? 'Enviando inscrição...'
              : convite?.tipo === 'MENSALISTA'
                ? 'Enviar inscrição de mensalista'
                : 'Enviar inscrição de diarista'}
          </button>
        </form>
      </div>
    </div>
  );
}