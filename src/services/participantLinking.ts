import { supabase } from '@/lib/supabase';

const PENDING_PARTICIPANT_KEY = 'jogolindo_pending_participant_link';

export function rememberParticipantForAccountLink(participantId: string): void {
  window.localStorage.setItem(PENDING_PARTICIPANT_KEY, participantId);
}

export async function linkPendingParticipantToCurrentUser(): Promise<boolean> {
  const participantId = window.localStorage.getItem(PENDING_PARTICIPANT_KEY);
  if (!participantId) return false;

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;

  const user = userData.user;
  if (!user) throw new Error('Entre na sua conta para concluir o vínculo.');
  if (!user.email_confirmed_at) {
    throw new Error('Confirme o e-mail da sua conta antes de vinculá-la ao cadastro.');
  }

  const { error } = await supabase.rpc('vincular_participante_autenticado', {
    p_participante_id: participantId,
  });

  if (error) {
    const message = error.message.toUpperCase();
    if (message.includes('EMAIL_NAO_VERIFICADO')) {
      throw new Error('Confirme o e-mail da sua conta antes de vinculá-la ao cadastro.');
    }
    if (message.includes('VINCULO_NAO_AUTORIZADO')) {
      throw new Error('Não foi possível vincular este cadastro à conta atual. Confira se entrou com o e-mail usado na inscrição.');
    }
    throw new Error('Não foi possível concluir o vínculo da conta agora. Tente novamente.');
  }

  window.localStorage.removeItem(PENDING_PARTICIPANT_KEY);
  return true;
}
