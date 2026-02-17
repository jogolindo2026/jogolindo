/*
  # Criar tabelas para rede social

  1. Novas Tabelas
    - `posts`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `title` (text)
      - `description` (text, optional)
      - `video_url` (text)
      - `thumbnail_url` (text, optional)
      - `duration` (integer) - duração em segundos
      - `game_date` (date) - data do jogo/jogada
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `post_likes`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `post_id` (uuid, references posts)
      - `rating` (integer) - 1 a 5 bolas
      - `created_at` (timestamptz)
      - Unique constraint (user_id, post_id)
    
    - `post_comments`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `post_id` (uuid, references posts)
      - `content` (text)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `comment_likes`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `comment_id` (uuid, references post_comments)
      - `created_at` (timestamptz)
      - Unique constraint (user_id, comment_id)

  2. Segurança
    - Habilitar RLS em todas as tabelas
    - Políticas para CRUD baseadas em autenticação
    - Usuários podem ver todos os posts públicos
    - Usuários podem gerenciar apenas seu próprio conteúdo
*/

-- Criar tabela de posts
CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  video_url text NOT NULL,
  thumbnail_url text,
  duration integer NOT NULL CHECK (duration > 0 AND duration <= 60), -- máximo 60 segundos
  game_date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Criar tabela de curtidas dos posts
CREATE TABLE IF NOT EXISTS post_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users ON DELETE CASCADE NOT NULL,
  post_id uuid REFERENCES posts ON DELETE CASCADE NOT NULL,
  rating integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, post_id)
);

-- Criar tabela de comentários
CREATE TABLE IF NOT EXISTS post_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users ON DELETE CASCADE NOT NULL,
  post_id uuid REFERENCES posts ON DELETE CASCADE NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Criar tabela de curtidas dos comentários
CREATE TABLE IF NOT EXISTS comment_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users ON DELETE CASCADE NOT NULL,
  comment_id uuid REFERENCES post_comments ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, comment_id)
);

-- Habilitar RLS
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;

-- Políticas para posts
CREATE POLICY "Todos podem ver posts"
  ON posts
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuários podem criar posts"
  ON posts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar próprios posts"
  ON posts
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar próprios posts"
  ON posts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Políticas para curtidas de posts
CREATE POLICY "Todos podem ver curtidas de posts"
  ON post_likes
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuários podem curtir posts"
  ON post_likes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar próprias curtidas"
  ON post_likes
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem remover próprias curtidas"
  ON post_likes
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Políticas para comentários
CREATE POLICY "Todos podem ver comentários"
  ON post_comments
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuários podem comentar"
  ON post_comments
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar próprios comentários"
  ON post_comments
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar próprios comentários"
  ON post_comments
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Políticas para curtidas de comentários
CREATE POLICY "Todos podem ver curtidas de comentários"
  ON comment_likes
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Usuários podem curtir comentários"
  ON comment_likes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem remover curtidas de comentários"
  ON comment_likes
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS posts_user_id_idx ON posts(user_id);
CREATE INDEX IF NOT EXISTS posts_created_at_idx ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS post_likes_post_id_idx ON post_likes(post_id);
CREATE INDEX IF NOT EXISTS post_comments_post_id_idx ON post_comments(post_id);
CREATE INDEX IF NOT EXISTS comment_likes_comment_id_idx ON comment_likes(comment_id);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_post_comments_updated_at BEFORE UPDATE ON post_comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();