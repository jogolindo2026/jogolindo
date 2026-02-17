/*
  # Sistema de Avaliação de Jogadores

  1. Nova Tabela
    - `player_ratings`
      - `id` (uuid, primary key)
      - `rater_user_id` (uuid, quem está avaliando)
      - `rated_user_id` (uuid, quem está sendo avaliado)
      - `post_id` (uuid, post relacionado)
      - `passing` (integer, 1-5)
      - `shooting` (integer, 1-5)
      - `dribbling` (integer, 1-5)
      - `speed` (integer, 1-5)
      - `strength` (integer, 1-5)
      - `jumping` (integer, 1-5)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Segurança
    - Enable RLS na tabela `player_ratings`
    - Políticas para CRUD operations
    - Constraint para evitar auto-avaliação
    - Constraint para uma avaliação por usuário por post

  3. Índices
    - Índice para consultas por jogador avaliado
    - Índice para consultas por post
*/

-- Criar tabela de avaliações de jogadores
CREATE TABLE IF NOT EXISTS player_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rater_user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rated_user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  
  -- Habilidades técnicas (1-5)
  passing integer NOT NULL DEFAULT 0 CHECK (passing >= 0 AND passing <= 5),
  shooting integer NOT NULL DEFAULT 0 CHECK (shooting >= 0 AND shooting <= 5),
  dribbling integer NOT NULL DEFAULT 0 CHECK (dribbling >= 0 AND dribbling <= 5),
  speed integer NOT NULL DEFAULT 0 CHECK (speed >= 0 AND speed <= 5),
  strength integer NOT NULL DEFAULT 0 CHECK (strength >= 0 AND strength <= 5),
  jumping integer NOT NULL DEFAULT 0 CHECK (jumping >= 0 AND jumping <= 5),
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  
  -- Constraint para evitar auto-avaliação
  CONSTRAINT no_self_rating CHECK (rater_user_id != rated_user_id),
  
  -- Constraint para uma avaliação por usuário por post
  CONSTRAINT unique_rating_per_user_per_post UNIQUE (rater_user_id, rated_user_id, post_id)
);

-- Habilitar RLS
ALTER TABLE player_ratings ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Usuários podem criar avaliações"
  ON player_ratings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = rater_user_id);

CREATE POLICY "Usuários podem ver todas as avaliações"
  ON player_ratings
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuários podem atualizar próprias avaliações"
  ON player_ratings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = rater_user_id)
  WITH CHECK (auth.uid() = rater_user_id);

CREATE POLICY "Usuários podem deletar próprias avaliações"
  ON player_ratings
  FOR DELETE
  TO authenticated
  USING (auth.uid() = rater_user_id);

-- Índices para performance
CREATE INDEX IF NOT EXISTS player_ratings_rated_user_id_idx ON player_ratings(rated_user_id);
CREATE INDEX IF NOT EXISTS player_ratings_post_id_idx ON player_ratings(post_id);
CREATE INDEX IF NOT EXISTS player_ratings_rater_user_id_idx ON player_ratings(rater_user_id);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_player_ratings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_player_ratings_updated_at
  BEFORE UPDATE ON player_ratings
  FOR EACH ROW
  EXECUTE FUNCTION update_player_ratings_updated_at();