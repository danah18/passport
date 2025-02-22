-- Create the public.profiles table which stores user profile information.
-- Each profile's id is the same as the corresponding auth.users id.
CREATE TABLE IF NOT EXISTS profiles (
    -- Primary key referencing the user's id in auth.users. If a user is deleted,
    -- their profile will be automatically removed.
    id uuid PRIMARY KEY REFERENCES auth.users (id) ON DELETE CASCADE,
    -- The display name of the user. Must be unique.
    display_name text UNIQUE,
    -- A short biography for the user.
    bio text,
    -- The timestamp when the profile was created.
    created_at timestamptz DEFAULT now() NOT NULL,
    -- The timestamp when the profile was last updated.
    updated_at timestamptz
);
