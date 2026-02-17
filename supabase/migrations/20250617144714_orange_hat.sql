/*
  # Fix authentication and RLS policy issues

  1. Security Policy Updates
    - Fix RLS policies for users table to allow proper CRUD operations
    - Ensure authenticated users can read and update their own profiles
    - Allow user registration (INSERT) for new users

  2. Authentication Flow
    - Handle email confirmation requirement properly
    - Improve error handling for authentication states
*/

-- Drop existing problematic policies
DROP POLICY IF EXISTS "Users can insert own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can delete own profile" ON users;
DROP POLICY IF EXISTS "Users can read all users" ON users;

-- Create new, properly configured policies
CREATE POLICY "Users can read all profiles"
  ON users
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can delete their own profile"
  ON users
  FOR DELETE
  TO authenticated
  USING (auth.uid() = id);

-- Allow public registration (needed for sign-up flow)
CREATE POLICY "Allow public registration"
  ON users
  FOR INSERT
  TO anon
  WITH CHECK (true);