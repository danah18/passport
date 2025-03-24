-------------------------------------------------------------------------------
-- Profiles setup
-------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid (),
  auth_user_id uuid UNIQUE REFERENCES auth.users (id) ON DELETE CASCADE,
  first_name text,
  last_name text,
  bio text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz,
  is_public boolean DEFAULT false,
  is_ephemeral boolean GENERATED ALWAYS AS (auth_user_id IS NULL) STORED
);

CREATE OR REPLACE FUNCTION public.handle_new_user () RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  new_profile_id uuid;
  new_metadata jsonb;
BEGIN
  -- Create a new profile and capture its id
  INSERT INTO public.profiles (auth_user_id, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name'
  )
  RETURNING id INTO new_profile_id;

  -- Merge the new profile id into the user's metadata.
  -- This preserves any existing metadata.
  new_metadata := COALESCE(NEW.raw_user_meta_data, '{}'::jsonb)
                  || jsonb_build_object('profile_id', new_profile_id);

  -- Update the auth.users row with the new metadata.
  UPDATE auth.users
  SET raw_user_meta_data = new_metadata
  WHERE id = NEW.id;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users FOR EACH ROW
EXECUTE PROCEDURE public.handle_new_user ();

-------------------------------------------------------------------------------
-- Pins setup
-------------------------------------------------------------------------------
-- Create a dedicated separate schema
create schema if not exists "gis";

-- enable the "postgis" extension
create extension postgis
with
  schema "gis";

-- Table to store unique pins. Each pin is represented only once.
CREATE TABLE IF NOT EXISTS pins (
  -- Unique identifier for the pin, generated automatically
  id uuid PRIMARY KEY DEFAULT gen_random_uuid (),
  -- Optional Google Place ID to uniquely identify the pin via Google services
  google_place_id text UNIQUE,
  -- Geographic location stored as a PostGIS geography point (using SRID 4326 by default)
  location gis.geography (POINT) NOT NULL,
  -- Name of the pin
  pin_name TEXT NOT NULL,
  -- e.g., "restaurant", "hotel", "cafe"
  category TEXT,
  -- Additional data from Google or custom metadata
  metadata JSONB,
  -- Latitude and longitude generated from the location
  lat DOUBLE PRECISION GENERATED ALWAYS AS (gis.ST_Y (location::gis.geometry)) STORED,
  long DOUBLE PRECISION GENERATED ALWAYS AS (gis.ST_X (location::gis.geometry)) STORED
);

-- Table to store capsules created by users.
-- Each capsule is an ordered collection of pins (stored in the capsule_pins table).
CREATE TABLE IF NOT EXISTS capsules (
  -- Unique identifier for the capsule, generated automatically
  id uuid PRIMARY KEY DEFAULT gen_random_uuid (),
  -- Foreign key reference to a profile (which may or may not be linked to an auth.user).
  profile_id uuid NOT NULL REFERENCES profiles (id),
  -- Name of the capsule from Google Place Autofill
  name text NOT NULL,
  -- Optional description for additional details
  description text,
  -- Timestamp when the capsule was created
  created_at timestamptz DEFAULT now(),
  -- Geographic location stored as a PostGIS geography point (using SRID 4326 by default)
  location gis.geography (POINT) NOT NULL,
  -- Latitude and longitude generated from the location
  lat DOUBLE PRECISION GENERATED ALWAYS AS (gis.ST_Y (location::gis.geometry)) STORED,
  long DOUBLE PRECISION GENERATED ALWAYS AS (gis.ST_X (location::gis.geometry)) STORED
);

-- Join table that associates capsules with pins.
-- This table orders the pins in each capsule and allows a pin to be used in multiple capsules.
CREATE TABLE IF NOT EXISTS capsule_pins (
  -- Unique identifier for each entry in the join table
  id uuid PRIMARY KEY DEFAULT gen_random_uuid (),
  -- Foreign key reference to the capsule; if the capsule is deleted, related entries are automatically removed
  capsule_id uuid NOT NULL REFERENCES capsules (id) ON DELETE CASCADE,
  -- Foreign key reference to the pin; if the pin is deleted, related entries are automatically removed
  pin_id uuid NOT NULL REFERENCES pins (id) ON DELETE CASCADE,
  -- Specifies the order of the pin within the capsule (e.g., 1st, 2nd, 3rd, etc.)
  position int NOT NULL,
  -- Timestamp when this pin was added to the capsule
  added_at timestamptz DEFAULT now()
);

-- Table to store user-specific details about pins.
-- This includes notes, ratings, and whether the user has favorited the pin.
-- A user can have one record per pin regardless of how many capsules the pin is part of.
CREATE TABLE IF NOT EXISTS user_pins (
  -- Foreign key reference to a profile (which may or may not be linked to an auth.user).
  profile_id uuid NOT NULL REFERENCES profiles (id),
  -- Foreign key reference to the pin
  pin_id uuid NOT NULL REFERENCES pins (id),
  -- A note about the pin provided by the user
  note text,
  -- Optional rating given by the user (e.g., on a scale from 1 to 5)
  rating int,
  -- Boolean flag indicating if the user has favorited this pin
  favorited boolean DEFAULT false,
  -- Timestamp when the record was last updated
  updated_at timestamptz DEFAULT now(),
  -- Composite primary key ensures a user can only have one record per pin
  PRIMARY KEY (profile_id, pin_id)
);

CREATE TABLE IF NOT EXISTS capsule_shares (
  capsule_id uuid NOT NULL REFERENCES capsules (id) ON DELETE CASCADE,
  profile_id uuid NOT NULL REFERENCES profiles (id),
  can_edit boolean DEFAULT false,
  -- The composite PK ensures each (capsule_id, profile_id) pair is unique
  PRIMARY KEY (capsule_id, profile_id)
);