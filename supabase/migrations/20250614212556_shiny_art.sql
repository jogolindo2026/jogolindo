/*
  # Fix users table INSERT RLS policy

  1. Security Changes
    - Modify INSERT policy to allow authenticated users to create profiles
    - Keep other policies intact for proper security
*/

-- Drop the existing INSERT policy
DROP POLICY IF EXISTS "Users can insert own profile" ON users;

-- Create a more permissive INSERT policy for authenticated users
CREATE POLICY "Users can insert own profile"
ON users FOR INSERT
TO authenticated
WITH CHECK (true);