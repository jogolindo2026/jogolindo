/*
  # Fix users table RLS policies

  1. Security Changes
    - Enable RLS on users table
    - Add policies for:
      - Authenticated users can read all users
      - Users can update their own profile
      - New users can insert their own profile
      - Users can delete their own profile
*/

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "Users can read all users" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;

-- Create comprehensive policies
CREATE POLICY "Users can read all users"
ON users FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Users can update own profile"
ON users FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
ON users FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete own profile"
ON users FOR DELETE
TO authenticated
USING (auth.uid() = id);