-- Table to store unique pins. Each pin is represented only once.
CREATE TABLE IF NOT EXISTS pins (
    -- Unique identifier for the pin, generated automatically
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    -- Optional Google Place ID to uniquely identify the pin via Google services
    google_place_id text UNIQUE,
    -- Geographic location stored as a PostGIS geography point (using SRID 4326 by default)
    location gis.geography(POINT) NOT NULL,
    -- Name of the pin
    pin_name TEXT NOT NULL,
    -- e.g., "restaurant", "hotel", "cafe"
    category TEXT,
    -- Additional data from Google or custom metadata
    metadata JSONB
);

-- Table to store capsules created by users.
-- Each capsule is an ordered collection of pins (stored in the capsule_pins table).
CREATE TABLE IF NOT EXISTS capsules (
    -- Unique identifier for the capsule, generated automatically
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    -- Foreign key reference to the user who created the capsule (using Supabase auth.users)
    user_id uuid NOT NULL REFERENCES auth.users (id),
    -- Name of the capsule (e.g., "Summer Road Capsule")
    name text NOT NULL,
    -- Optional description for additional details
    description text,
    -- Timestamp when the capsule was created
    created_at timestamptz DEFAULT now()
);

-- Join table that associates capsules with pins.
-- This table orders the pins in each capsule and allows a pin to be used in multiple capsules.
CREATE TABLE IF NOT EXISTS capsule_pins (
    -- Unique identifier for each entry in the join table
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
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
    -- Foreign key reference to the user (using Supabase auth.users)
    user_id uuid NOT NULL REFERENCES auth.users (id),
    -- Foreign key reference to the pin
    pin_id uuid NOT NULL REFERENCES pins (id),
    -- A note about the pin provided by the user
    note text,
    -- Long term, we want to query user_pins to display the list of notes
    -- that have been shared with a user. For the beta, as 99% of notes shared
    -- will come from people who don't have accounts, we allow users to add
    -- a list of note objects ({note, author name}. This allows us to temporarily
    -- solve notes population without needing to create multiple mock accounts. 
    -- If we have the phone number of the author who shared, we can make an account
    -- on their behalf and populate the user_pin for that note that way.
    notes JSONB,
    -- Optional rating given by the user (e.g., on a scale from 1 to 5)
    rating int,
    -- Boolean flag indicating if the user has favorited this pin
    favorited boolean DEFAULT false,
    -- Timestamp when the record was last updated
    updated_at timestamptz DEFAULT now(),
    -- Composite primary key ensures a user can only have one record per pin
    PRIMARY KEY (user_id, pin_id)
);

-- Create a dedicated separate schema
create schema if not exists "gis";

-- enable the "postgis" extension
create extension if not exists postgis
with
	schema "gis";

create index pins_geo_index on public.pins using GIST (location);

create or replace function pins_in_view (
	min_lat float,
	min_long float,
	max_lat float,
	max_long float
) returns table (
	google_place_id public.pins.google_place_id % TYPE,
	pin_name public.pins.pin_name % TYPE,
    metadata public.pins.metadata % TYPE,
    category public.pins.category % TYPE,
	lat float,
	long float
)
set
	search_path to '' language sql as $$
	select google_place_id, pin_name, metadata, category, gis.st_y(location::gis.geometry) as lat, gis.st_x(location::gis.geometry) as long
	from public.pins
	where location operator(gis.&&) gis.ST_SetSRID(gis.ST_MakeBox2D(gis.ST_Point(min_long, min_lat), gis.ST_Point(max_long, max_lat)), 4326)
$$;

grant usage on schema gis to anon,
authenticated;