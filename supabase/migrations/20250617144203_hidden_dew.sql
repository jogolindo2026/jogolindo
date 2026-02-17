/*
  # Fix users table INSERT RLS policy

  1. Security Changes
    - Modify INSERT policy to allow authenticated users to create only their own profiles
    - Ensure the user ID matches the authenticated user's ID
    - Keep other policies intact for proper security
*/

-- Drop the existing INSERT policy
DROP POLICY IF EXISTS "Users can insert own profile" ON users;

-- Create a secure INSERT policy that checks user ID matches auth.uid()
CREATE POLICY "Users can insert own profile"
ON users FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);