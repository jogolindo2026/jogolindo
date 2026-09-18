import { FormEvent, useState } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';

import { supabase } from '../lib/supabase';

type AuthMode = 'login' | 'cadastro';

interface AuthPageProps {
  mode: AuthMode;
  onBack: () => void;
  onSuccess: () => void;
}

export function AuthPage({
  mode,
  onBack,
  onSuccess,
}: AuthPageProps) {
  const cadastro = mode === 'cadastro';

  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErro('');
    setLoading(true);

    try {
      if (cadastro) {
        if (!nome.trim()) {
          throw new Error('Informe seu nome.');
        }

        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password: senha,
          options: {
            data: {
              nome: nome.trim(),
              telefone: telefone.trim(),
            },
          },
        });

        if (error) {
          throw error;
        }

        if (!data.session) {
          setErro(
            'Cadastro realizado. Confira seu e-mail para confirmar sua conta.'
          );
          return;
        }

        onSuccess();
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: senha,
      });

      if (error) {
        throw error;
      }

      onSuccess();
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : 'Não foi possível concluir a operação.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-emerald-950 px-4 py-10">
      <div className="mx-auto max-w-md">
        <button
          type="button"
          onClick={onBack}
          className="mb-6 inline-flex items-center gap-2 font-bold text-emerald-100 transition hover:text-yellow-300"
        >
          <ArrowLeft size={18} />
          Voltar
        </button>

        <div className="rounded-3xl bg-white p-7 shadow-2xl sm:p-9">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-emerald-700">
            JogoLindo Peladas
          </p>

          <h1 className="mt-2 text-3xl font-black text-slate-900">
            {cadastro ? 'Crie sua conta' : 'Entre na sua conta'}
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            {cadastro
              ? 'Cadastre-se como organizador para criar e administrar sua pelada.'
              : 'Entre com o e-mail e a senha da sua conta JogoLindo.'}
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-7 space-y-5"
          >
            {cadastro && (
              <>
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Nome
                  </label>

                  <input
                    type="text"
                    value={nome}
                    onChange={(event) => setNome(event.target.value)}
                    required
                    autoComplete="name"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
                    placeholder="Seu nome"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Telefone
                  </label>

                  <input
                    type="tel"
                    value={telefone}
                    onChange={(event) => setTelefone(event.target.value)}
                    autoComplete="tel"
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
                    placeholder="(21) 99999-9999"
                  />
                </div>
              </>
            )}

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                E-mail
              </label>

              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                autoComplete="email"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
                placeholder="voce@email.com"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Senha
              </label>

              <input
                type="password"
                value={senha}
                onChange={(event) => setSenha(event.target.value)}
                required
                minLength={6}
                autoComplete={cadastro ? 'new-password' : 'current-password'}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
                placeholder="Mínimo de 6 caracteres"
              />
            </div>

            {erro && (
              <div className="rounded-xl bg-yellow-50 px-4 py-3 text-sm font-bold text-yellow-800">
                {erro}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-yellow-400 px-5 py-4 font-black text-emerald-950 transition hover:bg-yellow-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading && (
                <Loader2
                  size={19}
                  className="animate-spin"
                />
              )}

              {cadastro ? 'Criar minha conta' : 'Entrar'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}