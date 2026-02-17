/*
  # Initial Schema Setup for Joga Bonito

  1. New Tables
    - `users`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `name` (text)
      - `role` (text)
      - `phone` (text, optional)
      - `gender` (text, optional)
      - `birth_date` (date, optional)
      - `country` (text, optional)
      - `city` (text, optional)
      - `position` (text, optional)
      - `profile_picture` (text, optional)
      - `created_at` (timestamptz)
    
    - `video_lessons`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `video_url` (text)
      - `thumbnail_url` (text)
      - `module` (text)
      - `topic` (text)
      - `duration` (integer)
      - `created_at` (timestamptz)
    
    - `user_videos`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `title` (text)
      - `description` (text)
      - `video_url` (text)
      - `thumbnail_url` (text)
      - `created_at` (timestamptz)
    
    - `video_ratings`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references users)
      - `video_id` (uuid, references user_videos)
      - `rating` (integer)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  role text NOT NULL CHECK (role IN ('player', 'businessman')),
  phone text,
  gender text,
  birth_date date,
  country text,
  city text,
  position text CHECK (position IN ('goalkeeper', 'defender', 'midfielder', 'forward')),
  profile_picture text,
  created_at timestamptz DEFAULT now()
);

-- Create video_lessons table
CREATE TABLE IF NOT EXISTS video_lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  video_url text NOT NULL,
  thumbnail_url text NOT NULL,
  module text NOT NULL CHECK (module IN ('technique', 'tactics', 'health', 'citizenship')),
  topic text NOT NULL,
  duration integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create user_videos table
CREATE TABLE IF NOT EXISTS user_videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  video_url text NOT NULL,
  thumbnail_url text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create video_ratings table
CREATE TABLE IF NOT EXISTS video_ratings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users ON DELETE CASCADE NOT NULL,
  video_id uuid REFERENCES user_videos ON DELETE CASCADE NOT NULL,
  rating integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, video_id)
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE video_ratings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read all users"
  ON users
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Anyone can read video lessons"
  ON video_lessons
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can read all user videos"
  ON user_videos
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create own videos"
  ON user_videos
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own videos"
  ON user_videos
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own videos"
  ON user_videos
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can read all ratings"
  ON video_ratings
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can rate videos"
  ON video_ratings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ratings"
  ON video_ratings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);