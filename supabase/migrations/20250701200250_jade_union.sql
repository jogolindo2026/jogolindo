/*
  # Add businessman specific fields to users table

  1. New Columns
    - `company` (text) - Company or club that the businessman represents
    - `is_profile_public` (boolean) - Whether businessman profile is visible to others
    - `height` (integer) - Player height in cm (for athletes)
    - `weight` (integer) - Player weight in kg (for athletes)

  2. Changes
    - Add company field for businessmen
    - Add profile visibility toggle for businessmen
    - Add physical attributes for athletes
    - Set appropriate defaults

  3. Security
    - Maintain existing RLS policies
    - No changes to authentication flow
*/

-- Add company field for businessmen
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'company'
  ) THEN
    ALTER TABLE users ADD COLUMN company text;
  END IF;
END $$;

-- Add profile visibility toggle for businessmen
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'is_profile_public'
  ) THEN
    ALTER TABLE users ADD COLUMN is_profile_public boolean DEFAULT true;
  END IF;
END $$;

-- Add height field for athletes
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'height'
  ) THEN
    ALTER TABLE users ADD COLUMN height integer;
  END IF;
END $$;

-- Add weight field for athletes
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'weight'
  ) THEN
    ALTER TABLE users ADD COLUMN weight integer;
  END IF;
END $$;

-- Add comment to document the table structure
COMMENT ON TABLE users IS 'User profiles for both athletes and businessmen with role-specific fields';
COMMENT ON COLUMN users.company IS 'Company or club that businessman represents (businessmen only)';
COMMENT ON COLUMN users.is_profile_public IS 'Whether businessman profile is visible to others (businessmen only)';
COMMENT ON COLUMN users.height IS 'Height in centimeters (athletes only)';
COMMENT ON COLUMN users.weight IS 'Weight in kilograms (athletes only)';
COMMENT ON COLUMN users.position IS 'Playing position (athletes only)';
COMMENT ON COLUMN users.birth_date IS 'Date of birth (primarily for athletes)';
COMMENT ON COLUMN users.gender IS 'Gender (primarily for athletes)';