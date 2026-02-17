/*
  # Reset Database Schema

  This migration drops all existing tables and recreates the complete database schema
  for the Jogo Lindo Football School application.
*/

-- Drop all existing tables
DROP TABLE IF EXISTS comment_likes CASCADE;
DROP TABLE IF EXISTS player_ratings CASCADE;
DROP TABLE IF EXISTS post_likes CASCADE;
DROP TABLE IF EXISTS post_comments CASCADE;
DROP TABLE IF EXISTS posts CASCADE;
DROP TABLE IF EXISTS video_ratings CASCADE;
DROP TABLE IF EXISTS user_videos CASCADE;
DROP TABLE IF EXISTS video_lessons CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create users table
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  role text NOT NULL CHECK (role = ANY (ARRAY['player'::text, 'businessman'::text])),
  phone text,
  gender text,
  birth_date date,
  country text,
  city text,
  position text CHECK (position = ANY (ARRAY['goalkeeper'::text, 'defender'::text, 'midfielder'::text, 'forward'::text])),
  profile_picture text,
  company text,
  is_profile_public boolean DEFAULT true,
  height integer,
  weight integer,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Public profiles visible to all"
  ON users FOR SELECT
  TO authenticated
  USING (is_profile_public = true OR auth.uid() = id);

-- Create video_lessons table
CREATE TABLE video_lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  video_url text NOT NULL,
  thumbnail_url text NOT NULL,
  module text NOT NULL CHECK (module = ANY (ARRAY['technique'::text, 'tactics'::text, 'health'::text, 'citizenship'::text])),
  topic text NOT NULL,
  duration integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE video_lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "All authenticated users can view lessons"
  ON video_lessons FOR SELECT
  TO authenticated
  USING (true);

-- Create user_videos table
CREATE TABLE user_videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  video_url text NOT NULL,
  thumbnail_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE user_videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own videos"
  ON user_videos FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can create videos"
  ON user_videos FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own videos"
  ON user_videos FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own videos"
  ON user_videos FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Create video_ratings table
CREATE TABLE video_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  video_id uuid NOT NULL REFERENCES user_videos(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE video_ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view ratings"
  ON video_ratings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can rate videos"
  ON video_ratings FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Create posts table
CREATE TABLE posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  video_url text NOT NULL,
  thumbnail_url text,
  duration integer NOT NULL CHECK (duration > 0 AND duration <= 60),
  game_date date DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "All authenticated users can view posts"
  ON posts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create posts"
  ON posts FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own posts"
  ON posts FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own posts"
  ON posts FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Create post_likes table
CREATE TABLE post_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view likes"
  ON post_likes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can like posts"
  ON post_likes FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Create post_comments table
CREATE TABLE post_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE post_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "All authenticated users can view comments"
  ON post_comments FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create comments"
  ON post_comments FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own comments"
  ON post_comments FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own comments"
  ON post_comments FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Create comment_likes table
CREATE TABLE comment_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  comment_id uuid NOT NULL REFERENCES post_comments(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE comment_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view comment likes"
  ON comment_likes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can like comments"
  ON comment_likes FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Create player_ratings table
CREATE TABLE player_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rater_user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  rated_user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  passing integer DEFAULT 0 CHECK (passing >= 0 AND passing <= 5),
  shooting integer DEFAULT 0 CHECK (shooting >= 0 AND shooting <= 5),
  dribbling integer DEFAULT 0 CHECK (dribbling >= 0 AND dribbling <= 5),
  speed integer DEFAULT 0 CHECK (speed >= 0 AND speed <= 5),
  strength integer DEFAULT 0 CHECK (strength >= 0 AND strength <= 5),
  jumping integer DEFAULT 0 CHECK (jumping >= 0 AND jumping <= 5),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE player_ratings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view ratings"
  ON player_ratings FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can rate players"
  ON player_ratings FOR INSERT
  TO authenticated
  WITH CHECK (rater_user_id = auth.uid());

-- Create indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_user_videos_user_id ON user_videos(user_id);
CREATE INDEX idx_video_ratings_user_id ON video_ratings(user_id);
CREATE INDEX idx_video_ratings_video_id ON video_ratings(video_id);
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_game_date ON posts(game_date);
CREATE INDEX idx_post_likes_post_id ON post_likes(post_id);
CREATE INDEX idx_post_likes_user_id ON post_likes(user_id);
CREATE INDEX idx_post_comments_post_id ON post_comments(post_id);
CREATE INDEX idx_post_comments_user_id ON post_comments(user_id);
CREATE INDEX idx_comment_likes_comment_id ON comment_likes(comment_id);
CREATE INDEX idx_player_ratings_post_id ON player_ratings(post_id);
CREATE INDEX idx_player_ratings_rater ON player_ratings(rater_user_id);
CREATE INDEX idx_player_ratings_rated ON player_ratings(rated_user_id);
