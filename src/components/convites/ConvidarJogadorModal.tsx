import { useEffect, useState } from 'react';
import {
  X,
  UserPlus,
  Send,
  CalendarDays,
  Wallet,
} from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { supabase } from '@/lib/supabase';

type TipoConvite = 'DIARISTA' | 'MENSALISTA';

interface ConvidarJogadorModalProps {
  open: boolean;
  onClose: () => void;

  peladaId: string;
  peladaNome: string;

  local?: string;
  campo?: string;
  diasTexto?: string;
  horarioTexto?: string;

  valorDiarista?: number;
  mensalidade?: number;
  diaVencimento?: number;

  /*
    A página decide se o usuário pode visualizar
    a opção de convite para mensalista.

    O banco continua sendo a proteção definitiva.
  */
  podeConvidarMensalista?: boolean;
}

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

function somenteNumeros(valor: string) {
  return valor.replace(/\D/g, '');
}

function formatarMoeda(valor?: number) {
  if (valor === undefined || valor === null) {
    return null;
  }

  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

export function ConvidarJogadorModal({
  open,
  onClose,
  peladaId,
  peladaNome,
  local,
  campo,
  diasTexto,
  horarioTexto,
  valorDiarista,
  mensalidade,
  diaVencimento,
  podeConvidarMensalista = false,
}: ConvidarJogadorModalProps) {
  const { showToast } = useToast();

  const [tipo, setTipo] =
    useState<TipoConvite>('DIARISTA');

  const [pais, setPais] =
    useState('BR');

  const [telefone, setTelefone] =
    useState('');

  const [erro, setErro] =
    useState('');

  const [gerando, setGerando] =
    useState(false);

  useEffect(() => {
    if (!open) return;

    setTipo('DIARISTA');
    setPais('BR');
    setTelefone('');
    setErro('');
    setGerando(false);
  }, [open]);

  if (!open) {
    return null;
  }

  const fechar = () => {
    if (gerando) return;

    onClose();
  };

  const gerarTelefoneInternacional = () => {
    const paisSelecionado =
      PAISES.find(
        (item) => item.codigo === pais
      ) ?? PAISES[0];

    const valorDigitado =
      telefone.trim();

    let numero =
      somenteNumeros(valorDigitado);

    if (!numero) {
      return '';
    }

    /*
      Se a pessoa digitou explicitamente +55,
      +351 etc., entendemos que informou
      o número internacional completo.
    */
    if (valorDigitado.startsWith('+')) {
      return numero;
    }

    /*
      Também evita duplicar o DDI caso a pessoa
      tenha colocado 55 mesmo sem o sinal +.
    */
    if (
      numero.startsWith(
        paisSelecionado.ddi
      )
    ) {
      return numero;
    }

    return (
      paisSelecionado.ddi +
      numero
    );
  };

  const montarMensagem = (
    token: string
  ) => {
    const link =
      `${window.location.origin}` +
      `${window.location.pathname}` +
      `#/convite/${token}`;

    const linhas: string[] = [];

    if (tipo === 'DIARISTA') {
      linhas.push(
        `⚽ Você foi convidado para jogar na ${peladaNome}!`
      );
    } else {
      linhas.push(
        `⭐ Você recebeu um convite para ser mensalista da ${peladaNome}!`
      );
    }

    linhas.push('');

    if (local) {
      const localCompleto =
        campo
          ? `${local} • ${campo}`
          : local;

      linhas.push(
        `📍 ${localCompleto}`
      );
    }

    if (diasTexto) {
      linhas.push(
        `🗓️ ${diasTexto}`
      );
    }

    if (horarioTexto) {
      linhas.push(
        `⏰ ${horarioTexto}`
      );
    }

    if (tipo === 'DIARISTA') {
      const valor =
        formatarMoeda(valorDiarista);

      if (valor) {
        linhas.push(
          `💰 Diária: ${valor}`
        );
      }
    }

    if (tipo === 'MENSALISTA') {
      const valor =
        formatarMoeda(mensalidade);

      if (valor) {
        linhas.push(
          `💰 Mensalidade: ${valor}`
        );
      }

      if (diaVencimento) {
        linhas.push(
          `📅 Vencimento: dia ${diaVencimento}`
        );
      }
    }

    linhas.push('');
    linhas.push(
      'Faça sua inscrição pelo JogoLindo:'
    );
    linhas.push(link);

    return linhas.join('\n');
  };

  const gerarConvite = async () => {
    if (gerando) return;

    setErro('');

    if (
      tipo === 'MENSALISTA' &&
      !podeConvidarMensalista
    ) {
      setErro(
        'Você não possui autorização para convidar mensalistas.'
      );
      return;
    }

    const telefoneDestino =
      gerarTelefoneInternacional();

    if (!telefoneDestino) {
      setErro(
        'Informe o WhatsApp do convidado.'
      );
      return;
    }

    if (
      telefoneDestino.length < 8 ||
      telefoneDestino.length > 15
    ) {
      setErro(
        'Informe um WhatsApp válido.'
      );
      return;
    }

    setGerando(true);

    try {
      const {
        data: convite,
        error,
      } = await supabase.rpc(
        'gerar_convite',
        {
          p_pelada_id: peladaId,
          p_tipo: tipo,
          p_telefone_destino:
            telefoneDestino,
        }
      );

      if (error) {
        console.error(
          'Erro ao gerar convite:',
          error
        );

        /*
          O servidor continua sendo a
          autoridade sobre permissões.
        */
        if (
          error.message?.includes(
            'SEM_PERMISSAO'
          )
        ) {
          setErro(
            tipo === 'MENSALISTA'
              ? 'Você não possui autorização para convidar mensalistas.'
              : 'Você não possui autorização para gerar este convite.'
          );

          return;
        }

        setErro(
          'Não foi possível gerar o convite.'
        );

        return;
      }

      if (
        !convite ||
        convite.length === 0 ||
        !convite[0].token
      ) {
        setErro(
          'O convite não foi gerado corretamente.'
        );

        return;
      }

      const token =
        convite[0].token;

      /*
        Preferimos o telefone devolvido
        pelo servidor, já normalizado.
      */
      const telefoneConfirmado =
        convite[0].telefone_destino ||
        telefoneDestino;

      const mensagem =
        montarMensagem(token);

      showToast(
        'success',
        tipo === 'DIARISTA'
          ? 'Convite de diarista criado!'
          : 'Convite de mensalista criado!'
      );

      onClose();

      window.open(
        `https://wa.me/${telefoneConfirmado}?text=${encodeURIComponent(
          mensagem
        )}`,
        '_blank'
      );
    } catch (error) {
      console.error(
        'Erro inesperado ao gerar convite:',
        error
      );

      setErro(
        'Ocorreu um erro ao gerar o convite.'
      );
    } finally {
      setGerando(false);
    }
  };

  const valorDiaristaFormatado =
    formatarMoeda(valorDiarista);

  const mensalidadeFormatada =
    formatarMoeda(mensalidade);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onMouseDown={(e) => {
        if (
          e.target === e.currentTarget
        ) {
          fechar();
        }
      }}
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        {/* Cabeçalho */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <UserPlus
                size={22}
                className="text-green-700"
              />

              <h2 className="text-xl font-bold text-gray-900">
                Convidar jogador
              </h2>
            </div>

            <p className="mt-2 text-sm text-gray-500">
              Gere um convite individual
              para {peladaNome}.
            </p>
          </div>

          <button
            type="button"
            onClick={fechar}
            disabled={gerando}
            className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
            aria-label="Fechar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tipo */}
        <div className="mt-6">
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Tipo de convite
          </label>

          <div
            className={`grid gap-2 ${
              podeConvidarMensalista
                ? 'grid-cols-2'
                : 'grid-cols-1'
            }`}
          >
            <button
              type="button"
              onClick={() =>
                setTipo('DIARISTA')
              }
              disabled={gerando}
              className={`rounded-xl border px-4 py-3 text-left transition ${
                tipo === 'DIARISTA'
                  ? 'border-green-600 bg-green-50 text-green-800'
                  : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <span className="block font-semibold">
                ⚽ Diarista
              </span>

              <span className="mt-1 block text-xs opacity-75">
                Participação avulsa
              </span>
            </button>

            {podeConvidarMensalista && (
              <button
                type="button"
                onClick={() =>
                  setTipo('MENSALISTA')
                }
                disabled={gerando}
                className={`rounded-xl border px-4 py-3 text-left transition ${
                  tipo === 'MENSALISTA'
                    ? 'border-green-600 bg-green-50 text-green-800'
                    : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <span className="block font-semibold">
                  ⭐ Mensalista
                </span>

                <span className="mt-1 block text-xs opacity-75">
                  Entrada autorizada
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Resumo */}
        <div className="mt-4 rounded-xl bg-gray-50 p-4">
          {tipo === 'DIARISTA' ? (
            <>
              <p className="font-semibold text-gray-900">
                Convite para diarista
              </p>

              <p className="mt-1 text-sm text-gray-600">
                O convidado fará o cadastro
                para uma participação avulsa.
              </p>

              {valorDiaristaFormatado && (
                <div className="mt-3 flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Wallet size={16} />

                  Diária:{' '}
                  {valorDiaristaFormatado}
                </div>
              )}
            </>
          ) : (
            <>
              <p className="font-semibold text-gray-900">
                Convite para mensalista
              </p>

              <p className="mt-1 text-sm text-gray-600">
                Este convite autoriza o
                início do processo de entrada
                como mensalista.
              </p>

              {mensalidadeFormatada && (
                <div className="mt-3 flex items-center gap-2 text-sm font-medium text-gray-700">
                  <Wallet size={16} />

                  Mensalidade:{' '}
                  {mensalidadeFormatada}
                </div>
              )}

              {diaVencimento && (
                <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                  <CalendarDays size={16} />

                  Vencimento: dia{' '}
                  {diaVencimento}
                </div>
              )}
            </>
          )}
        </div>

        {/* WhatsApp */}
        <div className="mt-5">
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            WhatsApp do convidado
          </label>

          <div className="flex overflow-hidden rounded-xl border border-gray-300 bg-white focus-within:border-green-600 focus-within:ring-1 focus-within:ring-green-600">
            <select
              value={pais}
              onChange={(e) =>
                setPais(e.target.value)
              }
              disabled={gerando}
              aria-label="País do WhatsApp"
              className="border-r border-gray-300 bg-gray-50 px-3 py-3 text-sm outline-none"
            >
              {PAISES.map((item) => (
                <option
                  key={item.codigo}
                  value={item.codigo}
                >
                  {item.bandeira} +{item.ddi}
                </option>
              ))}
            </select>

            <input
              type="tel"
              value={telefone}
              onChange={(e) =>
                setTelefone(
                  e.target.value
                )
              }
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  gerarConvite();
                }
              }}
              placeholder="21 99999-9999"
              autoFocus
              autoComplete="tel-national"
              inputMode="tel"
              disabled={gerando}
              className="min-w-0 flex-1 px-4 py-3 outline-none disabled:bg-gray-50"
            />
          </div>

          <p className="mt-2 text-xs text-gray-500">
            O convite será individual e
            vinculado a este WhatsApp.
          </p>
        </div>

        {/* Erro */}
        {erro && (
          <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">
            {erro}
          </div>
        )}

        {/* Ações */}
        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            variant="outline"
            onClick={fechar}
            disabled={gerando}
          >
            Cancelar
          </Button>

          <Button
            variant="success"
            onClick={gerarConvite}
            disabled={gerando}
          >
            <Send size={18} />

            {gerando
              ? 'Gerando...'
              : 'Enviar convite'}
          </Button>
        </div>
      </div>
    </div>
  );
}