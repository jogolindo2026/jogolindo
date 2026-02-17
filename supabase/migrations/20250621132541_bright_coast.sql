/*
  # Fix profile data persistence issues

  1. Database Schema Updates
    - Ensure all user profile fields are properly defined
    - Add missing columns if needed
    - Update column types for better data handling

  2. Field Mapping
    - birth_date for birthDate
    - profile_picture for profilePicture
    - Ensure all fields are properly mapped
*/

-- Add missing columns if they don't exist
DO $$
BEGIN
  -- Check and add birth_date column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'birth_date'
  ) THEN
    ALTER TABLE users ADD COLUMN birth_date date;
  END IF;

  -- Check and add profile_picture column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'profile_picture'
  ) THEN
    ALTER TABLE users ADD COLUMN profile_picture text;
  END IF;

  -- Check and add phone column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'phone'
  ) THEN
    ALTER TABLE users ADD COLUMN phone text;
  END IF;

  -- Check and add gender column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'gender'
  ) THEN
    ALTER TABLE users ADD COLUMN gender text;
  END IF;

  -- Check and add country column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'country'
  ) THEN
    ALTER TABLE users ADD COLUMN country text;
  END IF;

  -- Check and add city column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'city'
  ) THEN
    ALTER TABLE users ADD COLUMN city text;
  END IF;

  -- Check and add position column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'position'
  ) THEN
    ALTER TABLE users ADD COLUMN position text CHECK (position IN ('goalkeeper', 'defender', 'midfielder', 'forward'));
  END IF;
END $$;