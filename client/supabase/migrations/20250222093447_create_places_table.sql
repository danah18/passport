-- Table to store unique places. Each place is represented only once.
CREATE TABLE IF NOT EXISTS places (
    -- Unique identifier for the place, generated automatically
    id uuid PRIMARY KEY DEFAULT gen_random_uuid (),
    -- Optional Google Place ID to uniquely identify the place via Google services
    google_place_id text UNIQUE,
    -- Geographic location stored as a PostGIS geography point (using SRID 4326 by default)
    location gis.geography (POINT) NOT NULL
);

-- Table to store trips created by users.
-- Each trip is an ordered collection of places (stored in the trip_places table).
CREATE TABLE IF NOT EXISTS trips (
    -- Unique identifier for the trip, generated automatically
    id uuid PRIMARY KEY DEFAULT gen_random_uuid (),
    -- Foreign key reference to the user who created the trip (using Supabase auth.users)
    user_id uuid NOT NULL REFERENCES auth.users (id),
    -- Name of the trip (e.g., "Summer Road Trip")
    name text NOT NULL,
    -- Optional description for additional trip details
    description text,
    -- Timestamp when the trip was created
    created_at timestamptz DEFAULT now()
);

-- Join table that associates trips with places.
-- This table orders the places in each trip and allows a place to be used in multiple trips.
CREATE TABLE IF NOT EXISTS trip_places (
    -- Unique identifier for each entry in the join table
    id uuid PRIMARY KEY DEFAULT gen_random_uuid (),
    -- Foreign key reference to the trip; if the trip is deleted, related entries are automatically removed
    trip_id uuid NOT NULL REFERENCES trips (id) ON DELETE CASCADE,
    -- Foreign key reference to the place; if the place is deleted, related entries are automatically removed
    place_id uuid NOT NULL REFERENCES places (id) ON DELETE CASCADE,
    -- Specifies the order of the place within the trip (e.g., 1st, 2nd, 3rd, etc.)
    position int NOT NULL,
    -- Timestamp when this place was added to the trip
    added_at timestamptz DEFAULT now()
);

-- Table to store user-specific details about places.
-- This includes notes, ratings, and whether the user has favorited the place.
-- A user can have one record per place regardless of how many trips the place is part of.
CREATE TABLE IF NOT EXISTS user_places (
    -- Foreign key reference to the user (using Supabase auth.users)
    user_id uuid NOT NULL REFERENCES auth.users (id),
    -- Foreign key reference to the place
    place_id uuid NOT NULL REFERENCES places (id),
    -- A note about the place provided by the user
    note text,
    -- Optional rating given by the user (e.g., on a scale from 1 to 5)
    rating int,
    -- Boolean flag indicating if the user has favorited this place
    favorited boolean DEFAULT false,
    -- Timestamp when the record was last updated
    updated_at timestamptz DEFAULT now(),
    -- Composite primary key ensures a user can only have one record per place
    PRIMARY KEY (user_id, place_id)
);
