/*
  # User Preferences Schema

  1. New Tables
    - `user_preferences`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `name` (text)
      - `preferred_platform` (text)
      - `topics` (jsonb)
      - `format` (text)
      - `frequency` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `user_preferences` table
    - Add policies for authenticated users to manage their preferences
*/

CREATE TABLE IF NOT EXISTS user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  preferred_platform text NOT NULL DEFAULT 'email',
  topics jsonb NOT NULL DEFAULT '{"general": true, "research": false, "business": false, "ethics": false}'::jsonb,
  format text NOT NULL DEFAULT 'detailed',
  frequency text NOT NULL DEFAULT 'daily',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to read their own preferences
CREATE POLICY "Users can read own preferences"
  ON user_preferences
  FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'email' = email);

-- Policy to allow users to update their own preferences
CREATE POLICY "Users can update own preferences"
  ON user_preferences
  FOR UPDATE
  TO authenticated
  USING (auth.jwt() ->> 'email' = email);

-- Policy to allow users to insert their own preferences
CREATE POLICY "Users can insert own preferences"
  ON user_preferences
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.jwt() ->> 'email' = email);