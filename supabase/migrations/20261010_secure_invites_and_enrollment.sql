-- JogoLindo: convites seguros e inscricao publica atomica.
-- Proposta para revisao. Nao aplicar antes de confirmar as premissas descritas
-- no relatorio que acompanha esta migracao.
--
-- Dependencia financeira: pagamentos ainda nao possui uma regra autoritativa
-- confirmada para adimplencia/competencia. A tabela participante_adimplencia
-- fica vazia; somente um backend confiavel (futura integracao Asaas/n8n) deve
-- inserir/atualizar evidencia de pagamento confirmado. Nunca popular por status
-- informado pelo cliente ou apenas por participantes.status_financeiro.
--
-- A migracao nao altera dados existentes em peladas, participantes, pagamentos
-- ou convites. Os convites de teste expirados e o participante ficticio ficam
-- preservados. Nenhum participante e marcado como pago/liberado.
-- status_liberacao='aguardando' e mantido como estado cadastral conhecido, mas
-- esta migracao NAO presume que esse valor bloqueie acesso ao jogo. A regra
-- central de autorizacao para jogar depende de pagamento confirmado e sera
-- implementada separadamente.
--
-- Inscricoes publicas nao associam participantes.user_id. O vinculo futuro
-- deve ser uma operacao autenticada separada, baseada em email confirmado na
-- conta Supabase, correspondencia exata com um unico cadastro ainda sem user_id
-- e atualizacao condicional de user_id IS NULL. Nao usar CPF como prova nem
-- alterar nome, CPF, categoria, pagamento ou permissao nesse vinculo. Nao exige
-- SMS; a conta deve ter email confirmado.
--
-- Dependencia de deploy: o React atual chama inscrever_diarista sem token.
-- Esta funcao sera bloqueada; o frontend precisara chamar
-- inscrever_por_convite(p_token, ...) em uma etapa separada.
--
-- ACL de participantes: clientes nao terao escrita direta. authenticated
-- preserva SELECT, sempre sujeito a RLS; anon consulta apenas RPCs publicas
-- sanitizadas. As RPCs autorizadas abaixo sao SECURITY DEFINER e precisam
-- pertencer a um owner com acesso a tabela (e que nao esteja sujeito a FORCE
-- ROW LEVEL SECURITY sem policies compativeis).

BEGIN;

ALTER TABLE public.convites
  ADD COLUMN IF NOT EXISTS consumido_em timestamptz,
  ADD COLUMN IF NOT EXISTS usado_em timestamptz,
  ADD COLUMN IF NOT EXISTS usado_por_participante_id uuid;

ALTER TABLE public.participantes
  ADD COLUMN IF NOT EXISTS convite_id uuid;

DO $migration$
DECLARE
  v_owner_id_type oid;
  v_usado_em_type oid;
  v_usado_por_type oid;
BEGIN
  SELECT a.atttypid
  INTO v_owner_id_type
  FROM pg_catalog.pg_attribute AS a
  WHERE a.attrelid = 'public.peladas'::regclass
    AND a.attname = 'owner_id'
    AND a.attnum > 0
    AND NOT a.attisdropped;

  SELECT a.atttypid
  INTO v_usado_em_type
  FROM pg_catalog.pg_attribute AS a
  WHERE a.attrelid = 'public.convites'::regclass
    AND a.attname = 'usado_em'
    AND a.attnum > 0
    AND NOT a.attisdropped;

  SELECT a.atttypid
  INTO v_usado_por_type
  FROM pg_catalog.pg_attribute AS a
  WHERE a.attrelid = 'public.convites'::regclass
    AND a.attname = 'usado_por_participante_id'
    AND a.attnum > 0
    AND NOT a.attisdropped;

  IF v_owner_id_type IS DISTINCT FROM 'uuid'::regtype THEN
    RAISE EXCEPTION 'TIPO_INESPERADO: public.peladas.owner_id deve ser uuid';
  END IF;

  IF v_usado_em_type IS DISTINCT FROM 'timestamp with time zone'::regtype THEN
    RAISE EXCEPTION 'TIPO_INESPERADO: public.convites.usado_em deve ser timestamptz';
  END IF;

  IF v_usado_por_type IS DISTINCT FROM 'uuid'::regtype THEN
    RAISE EXCEPTION 'TIPO_INESPERADO: public.convites.usado_por_participante_id deve ser uuid';
  END IF;
END;
$migration$;

ALTER TABLE public.participantes ENABLE ROW LEVEL SECURITY;

REVOKE ALL PRIVILEGES ON TABLE public.participantes
  FROM PUBLIC, anon, authenticated;

GRANT SELECT ON TABLE public.participantes TO authenticated;

DO $migration$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_catalog.pg_constraint AS c
    WHERE c.conrelid = 'public.participantes'::regclass
      AND c.conname = 'participantes_convite_id_fkey'
  ) THEN
    ALTER TABLE public.participantes
      ADD CONSTRAINT participantes_convite_id_fkey
      FOREIGN KEY (convite_id)
      REFERENCES public.convites(id);
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_catalog.pg_constraint AS c
    WHERE c.conrelid = 'public.convites'::regclass
      AND c.conname = 'convites_usado_por_participante_id_fkey'
  ) THEN
    ALTER TABLE public.convites
      ADD CONSTRAINT convites_usado_por_participante_id_fkey
      FOREIGN KEY (usado_por_participante_id)
      REFERENCES public.participantes(id);
  END IF;
END;
$migration$;

CREATE UNIQUE INDEX IF NOT EXISTS participantes_convite_id_uidx
  ON public.participantes (convite_id)
  WHERE convite_id IS NOT NULL;

-- Evidencia de adimplencia mantida exclusivamente pelo backend confiavel.
-- A validade deve ser derivada de pagamento confirmado e sua competencia,
-- conforme regra financeira a ser implementada com Asaas/n8n.
CREATE TABLE IF NOT EXISTS public.participante_adimplencia (
  participante_id uuid PRIMARY KEY
    REFERENCES public.participantes(id) ON DELETE CASCADE,
  valido_ate date NOT NULL,
  origem text NOT NULL,
  referencia_pagamento text NOT NULL,
  confirmado_em timestamptz NOT NULL,
  atualizado_em timestamptz NOT NULL DEFAULT pg_catalog.now()
);

ALTER TABLE public.participante_adimplencia ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.participante_adimplencia
  FROM PUBLIC, anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE
  ON TABLE public.participante_adimplencia
  TO service_role;

COMMENT ON TABLE public.participante_adimplencia IS
  'Evidencia server-side de mensalidade confirmada; nao preencher a partir do cliente nem apenas de status_financeiro.';

COMMENT ON COLUMN public.participante_adimplencia.valido_ate IS
  'Ultimo dia de competencia coberto por pagamento confirmado.';

COMMENT ON COLUMN public.participante_adimplencia.referencia_pagamento IS
  'Referencia do pagamento confirmatorio no provedor ou no ledger financeiro.';

-- Canonicaliza somente quando o formulario identifica Brasil. Aceita o numero
-- nacional e o formato com DDI 55, sem modificar numeros de outros paises.
CREATE OR REPLACE FUNCTION public._jogolindo_telefone_br(
  p_telefone text
)
RETURNS text
LANGUAGE plpgsql
IMMUTABLE
STRICT
SET search_path TO ''
AS $function$
DECLARE
  v_digitos text;
BEGIN
  v_digitos := pg_catalog.regexp_replace(p_telefone, '[^0-9]', '', 'g');

  IF pg_catalog.left(v_digitos, 2) = '55'
     AND pg_catalog.length(v_digitos) IN (12, 13) THEN
    RETURN v_digitos;
  END IF;

  IF pg_catalog.length(v_digitos) IN (10, 11) THEN
    RETURN '55' || v_digitos;
  END IF;

  RETURN v_digitos;
END;
$function$;

REVOKE ALL ON FUNCTION public._jogolindo_telefone_br(text)
  FROM PUBLIC, anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION public._jogolindo_mensalista_adimplente(
  p_pelada_id uuid,
  p_user_id uuid
)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO ''
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.participantes AS part
    JOIN public.participante_adimplencia AS ad
      ON ad.participante_id = part.id
    WHERE part.pelada_id = p_pelada_id
      AND part.user_id = p_user_id
      AND part.categoria = 'MENSALISTA'
      AND part.status_esportivo = 'APTO'
      AND ad.valido_ate >= CURRENT_DATE
  );
$function$;

REVOKE ALL ON FUNCTION public._jogolindo_mensalista_adimplente(uuid, uuid)
  FROM PUBLIC, anon, authenticated, service_role;

-- OWNER direto da pelada e administradores explicitamente classificados como
-- OWNER/ADMIN. Outros papeis em pelada_admins nao concedem administracao.
-- CREATE OR REPLACE preserva o owner e os grants ja existentes da funcao.
CREATE OR REPLACE FUNCTION public.usuario_administra_pelada(
  p_pelada_id uuid
)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO ''
AS $function$
  SELECT auth.uid() IS NOT NULL
    AND (
      EXISTS (
        SELECT 1
        FROM public.peladas AS pel
        WHERE pel.id = p_pelada_id
          AND pel.owner_id = auth.uid()
      )
      OR EXISTS (
        SELECT 1
        FROM public.pelada_admins AS pa
        WHERE pa.pelada_id = p_pelada_id
          AND pa.user_id = auth.uid()
          AND pa.papel IN ('OWNER', 'ADMIN')
      )
    );
$function$;

-- Preserva assinatura/retorno atuais. OWNER, ADMIN e mensalistas cuja
-- adimplencia foi confirmada por backend podem gerar os dois tipos.
CREATE OR REPLACE FUNCTION public.gerar_convite(
  p_pelada_id uuid,
  p_tipo text,
  p_telefone_destino text
)
RETURNS TABLE(
  convite_id uuid,
  token uuid,
  tipo text,
  telefone_destino text,
  expira_em timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  v_user_id uuid;
  v_tipo text;
  v_telefone text;
  v_participante_id uuid;
  v_admin_papel text;
  v_owner_id boolean;
  v_convite_id uuid;
  v_token uuid;
  v_expira_em timestamptz;
BEGIN
  v_user_id := auth.uid();

  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'NAO_AUTENTICADO';
  END IF;

  v_tipo := pg_catalog.upper(pg_catalog.btrim(coalesce(p_tipo, '')));
  v_telefone := pg_catalog.regexp_replace(
    coalesce(p_telefone_destino, ''),
    '[^0-9]',
    '',
    'g'
  );

  IF v_tipo NOT IN ('DIARISTA', 'MENSALISTA') THEN
    RAISE EXCEPTION 'TIPO_CONVITE_INVALIDO';
  END IF;

  IF pg_catalog.length(v_telefone) < 8 OR pg_catalog.length(v_telefone) > 15 THEN
    RAISE EXCEPTION 'TELEFONE_DESTINO_INVALIDO';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM public.peladas AS pel
    WHERE pel.id = p_pelada_id
      AND pel.ativa = true
  ) THEN
    RAISE EXCEPTION 'PELADA_INDISPONIVEL';
  END IF;

  SELECT EXISTS (
    SELECT 1
    FROM public.peladas AS pel
    WHERE pel.id = p_pelada_id
      AND pel.owner_id = v_user_id
  )
  INTO v_owner_id;

  SELECT pa.papel
  INTO v_admin_papel
  FROM public.pelada_admins AS pa
  WHERE pa.pelada_id = p_pelada_id
    AND pa.user_id = v_user_id
    AND pa.papel IN ('OWNER', 'ADMIN')
  ORDER BY CASE pa.papel WHEN 'OWNER' THEN 0 ELSE 1 END
  LIMIT 1;

  IF NOT coalesce(v_owner_id, false)
     AND v_admin_papel IS NULL
     AND NOT public._jogolindo_mensalista_adimplente(p_pelada_id, v_user_id) THEN
    RAISE EXCEPTION 'SEM_PERMISSAO_PARA_CONVIDAR';
  END IF;

  SELECT part.id
  INTO v_participante_id
  FROM public.participantes AS part
  WHERE part.pelada_id = p_pelada_id
    AND part.user_id = v_user_id
  ORDER BY part.created_at
  LIMIT 1;

  v_expira_em := pg_catalog.now() +
    CASE v_tipo
      WHEN 'DIARISTA' THEN interval '7 days'
      ELSE interval '30 days'
    END;

  INSERT INTO public.convites (
    pelada_id,
    tipo,
    convidado_por_participante_id,
    convidado_por_usuario_id,
    telefone_destino,
    status,
    expira_em
  )
  VALUES (
    p_pelada_id,
    v_tipo,
    v_participante_id,
    v_user_id,
    v_telefone,
    'ATIVO',
    v_expira_em
  )
  RETURNING id, convites.token
  INTO v_convite_id, v_token;

  RETURN QUERY
  SELECT v_convite_id, v_token, v_tipo, v_telefone, v_expira_em;
END;
$function$;

-- Consulta publica somente convites validos e ainda nao consumidos.
-- Assinatura e formato de retorno preservados.
CREATE OR REPLACE FUNCTION public.obter_convite(p_token uuid)
RETURNS TABLE(
  convite_id uuid,
  tipo text,
  pelada_id uuid,
  pelada_nome text,
  local text,
  campo text,
  dias_semana text[],
  hora_inicio time,
  hora_fim time,
  valor_diarista numeric,
  taxa_colete numeric,
  status text,
  expira_em timestamptz,
  convidado_por text
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path TO ''
AS $function$
  SELECT
    c.id,
    c.tipo,
    pel.id,
    pel.nome,
    pel.local,
    pel.campo,
    pel.dias_semana,
    pel.hora_inicio,
    pel.hora_fim,
    pel.valor_diarista,
    pel.taxa_colete,
    c.status,
    c.expira_em,
    coalesce(
      nullif(part.apelido, ''),
      nullif(part.nome, ''),
      nullif(prof.nome, ''),
      'Organizacao'
    )::text
  FROM public.convites AS c
  JOIN public.peladas AS pel ON pel.id = c.pelada_id
  LEFT JOIN public.participantes AS part
    ON part.id = c.convidado_por_participante_id
  LEFT JOIN public.profiles AS prof
    ON prof.id = c.convidado_por_usuario_id
  WHERE c.token = p_token
    AND c.status = 'ATIVO'
    AND c.consumido_em IS NULL
    AND pel.ativa = true
    AND c.expira_em > pg_catalog.now()
  LIMIT 1;
$function$;

-- Inscricao publica para ambos os tipos. O token e a autorizacao; CPF nao e
-- identidade autenticada e nunca e usado para atualizar uma linha existente.
-- A linha do convite e bloqueada ate commit, impedindo consumo concorrente.
CREATE OR REPLACE FUNCTION public.inscrever_por_convite(
  p_token uuid,
  p_nome text,
  p_apelido text,
  p_cpf text,
  p_email text,
  p_telefone text,
  p_pais text
)
RETURNS TABLE(
  participante_id uuid,
  nome text,
  apelido text,
  tipo text,
  status_financeiro text,
  criado boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  v_convite public.convites%ROWTYPE;
  v_participante public.participantes%ROWTYPE;
  v_cpf text;
  v_nome text;
  v_apelido text;
  v_email text;
  v_telefone text;
  v_telefone_destino text;
  v_pais text;
  v_consumido_em timestamptz;
  v_categoria public.participantes.categoria%TYPE;
  v_status_mensalista public.participantes.status_mensalista%TYPE;
BEGIN
  SELECT c.*
  INTO v_convite
  FROM public.convites AS c
  WHERE c.token = p_token
    AND c.status = 'ATIVO'
    AND c.consumido_em IS NULL
    AND c.expira_em > pg_catalog.now()
  FOR UPDATE;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'CONVITE_INVALIDO_EXPIRADO_OU_UTILIZADO';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM public.peladas AS pel
    WHERE pel.id = v_convite.pelada_id
      AND pel.ativa = true
  ) THEN
    RAISE EXCEPTION 'PELADA_INDISPONIVEL';
  END IF;

  v_nome := pg_catalog.btrim(coalesce(p_nome, ''));
  v_apelido := pg_catalog.btrim(coalesce(p_apelido, ''));
  v_cpf := pg_catalog.regexp_replace(coalesce(p_cpf, ''), '[^0-9]', '', 'g');
  v_email := pg_catalog.lower(pg_catalog.btrim(coalesce(p_email, '')));
  v_telefone := pg_catalog.regexp_replace(coalesce(p_telefone, ''), '[^0-9]', '', 'g');
  v_telefone_destino := pg_catalog.regexp_replace(
    coalesce(v_convite.telefone_destino, ''),
    '[^0-9]',
    '',
    'g'
  );
  v_pais := pg_catalog.upper(pg_catalog.btrim(coalesce(p_pais, '')));

  IF pg_catalog.char_length(v_nome) < 3 THEN
    RAISE EXCEPTION 'NOME_INVALIDO';
  END IF;

  IF pg_catalog.char_length(v_apelido) < 2 THEN
    RAISE EXCEPTION 'APELIDO_INVALIDO';
  END IF;

  IF pg_catalog.char_length(v_cpf) <> 11 THEN
    RAISE EXCEPTION 'CPF_INVALIDO';
  END IF;

  IF v_email = '' OR position('@' IN v_email) = 0 THEN
    RAISE EXCEPTION 'EMAIL_INVALIDO';
  END IF;

  IF pg_catalog.char_length(v_telefone) < 8 OR pg_catalog.char_length(v_telefone) > 15 THEN
    RAISE EXCEPTION 'TELEFONE_INVALIDO';
  END IF;

  IF pg_catalog.char_length(v_pais) <> 2 THEN
    RAISE EXCEPTION 'PAIS_INVALIDO';
  END IF;

  IF v_pais = 'BR' THEN
    v_telefone := public._jogolindo_telefone_br(v_telefone);
    IF v_telefone <> public._jogolindo_telefone_br(v_telefone_destino) THEN
      RAISE EXCEPTION 'TELEFONE_NAO_CORRESPONDE_AO_CONVITE';
    END IF;
  ELSIF v_telefone <> v_telefone_destino THEN
    RAISE EXCEPTION 'TELEFONE_NAO_CORRESPONDE_AO_CONVITE';
  END IF;

  IF v_convite.tipo NOT IN ('DIARISTA', 'MENSALISTA') THEN
    RAISE EXCEPTION 'TIPO_CONVITE_INVALIDO';
  END IF;

  -- Serializa tentativas com o mesmo CPF normalizado, inclusive quando
  -- registros legados armazenam pontuacao diferente.
  PERFORM pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(v_convite.pelada_id::text || ':' || v_cpf, 0)
  );

  IF EXISTS (
    SELECT 1
    FROM public.participantes AS part
    WHERE part.pelada_id = v_convite.pelada_id
      AND pg_catalog.regexp_replace(coalesce(part.cpf, ''), '[^0-9]', '', 'g') = v_cpf
  ) THEN
    RAISE EXCEPTION 'CPF_JA_CADASTRADO_REQUER_VINCULO_AUTENTICADO';
  END IF;

  v_categoria := v_convite.tipo;
  v_status_mensalista := CASE
    WHEN v_convite.tipo = 'MENSALISTA' THEN 'aprovado'
    ELSE 'nao_solicitado'
  END;

  INSERT INTO public.participantes (
    pelada_id,
    convite_id,
    cpf,
    nome,
    apelido,
    telefone,
    pais,
    email,
    categoria,
    status_financeiro,
    status_esportivo,
    status_liberacao,
    status_mensalista
  )
  VALUES (
    v_convite.pelada_id,
    v_convite.id,
    v_cpf,
    v_nome,
    v_apelido,
    v_telefone,
    v_pais,
    v_email,
    v_categoria,
    'PENDENTE',
    'APTO',
    'aguardando',
    v_status_mensalista
  )
  RETURNING * INTO v_participante;

  v_consumido_em := pg_catalog.clock_timestamp();

  UPDATE public.convites AS c
  SET
    status = 'USADO',
    consumido_em = v_consumido_em,
    usado_em = v_consumido_em,
    usado_por_participante_id = v_participante.id
  WHERE c.id = v_convite.id
    AND c.consumido_em IS NULL
    AND c.status = 'ATIVO';

  IF NOT FOUND THEN
    RAISE EXCEPTION 'CONVITE_JA_CONSUMIDO';
  END IF;

  RETURN QUERY
  SELECT
    v_participante.id,
    v_participante.nome,
    v_participante.apelido::text,
    v_convite.tipo,
    v_participante.status_financeiro::text,
    true;
END;
$function$;

-- Vínculo posterior autorizado pelo email confirmado da conta Supabase.
-- O CPF não é usado como credencial nem como critério de atualização.
CREATE OR REPLACE FUNCTION public.vincular_participante_autenticado(
  p_participante_id uuid
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
DECLARE
  v_user_id uuid := auth.uid();
  v_email text;
  v_participante_id uuid;
BEGIN
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'NAO_AUTENTICADO';
  END IF;

  SELECT pg_catalog.lower(pg_catalog.btrim(u.email))
  INTO v_email
  FROM auth.users AS u
  WHERE u.id = v_user_id
    AND u.email_confirmed_at IS NOT NULL;

  IF v_email IS NULL THEN
    RAISE EXCEPTION 'EMAIL_NAO_VERIFICADO';
  END IF;

  UPDATE public.participantes AS part
  SET user_id = v_user_id
  WHERE part.id = p_participante_id
    AND part.user_id IS NULL
    AND pg_catalog.lower(pg_catalog.btrim(part.email)) = v_email
    AND 1 = (
      SELECT pg_catalog.count(*)
      FROM public.participantes AS candidate
      WHERE pg_catalog.lower(pg_catalog.btrim(candidate.email)) = v_email
    )
  RETURNING part.id INTO v_participante_id;

  IF v_participante_id IS NOT NULL THEN
    RETURN v_participante_id;
  END IF;

  -- Chamadas repetidas pelo mesmo usuário após vínculo bem-sucedido são idempotentes.
  SELECT part.id
  INTO v_participante_id
  FROM public.participantes AS part
  WHERE part.id = p_participante_id
    AND part.user_id = v_user_id
    AND pg_catalog.lower(pg_catalog.btrim(part.email)) = v_email;

  IF v_participante_id IS NULL THEN
    RAISE EXCEPTION 'VINCULO_NAO_AUTORIZADO';
  END IF;

  RETURN v_participante_id;
END;
$function$;

-- Neutraliza tambem o corpo antigo: um grant acidental futuro nao deve
-- reabrir inscricao sem token nem atualizacao por CPF.
CREATE OR REPLACE FUNCTION public.inscrever_diarista(
  p_pelada_id uuid,
  p_nome text,
  p_apelido text,
  p_cpf text,
  p_email text,
  p_telefone text,
  p_pais text
)
RETURNS TABLE(
  participante_id uuid,
  nome text,
  apelido text,
  cpf text,
  criado boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  RAISE EXCEPTION 'INSCRICAO_EXIGE_CONVITE_TOKEN';
END;
$function$;

REVOKE ALL ON FUNCTION public.gerar_convite(uuid, text, text)
  FROM PUBLIC, anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.gerar_convite(uuid, text, text)
  TO authenticated;

REVOKE ALL ON FUNCTION public.obter_convite(uuid)
  FROM PUBLIC, anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.obter_convite(uuid)
  TO anon, authenticated;

REVOKE ALL ON FUNCTION public.inscrever_por_convite(uuid, text, text, text, text, text, text)
  FROM PUBLIC, anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.inscrever_por_convite(uuid, text, text, text, text, text, text)
  TO anon, authenticated;

REVOKE ALL ON FUNCTION public.vincular_participante_autenticado(uuid)
  FROM PUBLIC, anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.vincular_participante_autenticado(uuid)
  TO authenticated;

REVOKE ALL ON FUNCTION public.inscrever_diarista(uuid, text, text, text, text, text, text)
  FROM PUBLIC, anon, authenticated, service_role;

-- Fecha a rota RPC legada por ID, independentemente de sobrecargas existentes.
DO $migration$
DECLARE
  v_function regprocedure;
BEGIN
  FOR v_function IN
    SELECT p.oid::regprocedure
    FROM pg_catalog.pg_proc AS p
    JOIN pg_catalog.pg_namespace AS n ON n.oid = p.pronamespace
    WHERE n.nspname = 'public'
      AND p.proname = 'obter_convite_diarista'
      AND p.prokind = 'f'
  LOOP
    EXECUTE pg_catalog.format(
      'REVOKE ALL PRIVILEGES ON FUNCTION %s FROM PUBLIC, anon, authenticated, service_role',
      v_function
    );
  END LOOP;
END;
$migration$;

COMMIT;