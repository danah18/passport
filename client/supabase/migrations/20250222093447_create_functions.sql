-- Create a dedicated separate schema
create schema if not exists "gis";

-- enable the "postgis" extension
create extension if not exists postgis
with
  schema "gis";

create index pins_geo_index on public.pins using GIST (location);

grant usage on schema gis to anon,
authenticated;

-- Returns all global pins in view
create or replace function pins_in_view (
  min_lat float,
  min_long float,
  max_lat float,
  max_long float
) returns table (
  id uuid,
  google_place_id text,
  location gis.geography,
  pin_name text,
  categories jsonb,
  metadata jsonb,
  lat double precision,
  long double precision
)
set
  search_path to '' language sql as $$
  select
      id,
      google_place_id,
      location,
      pin_name,
      categories,
      metadata,
      lat,
      long
	from public.pins
	where location operator(gis.&&) gis.ST_SetSRID(gis.ST_MakeBox2D(gis.ST_Point(min_long, min_lat), gis.ST_Point(max_long, max_lat)), 4326)
$$;

-- Returns all capsule pins in view
create or replace function capsule_pins_in_view (
  _capsule_id uuid,
  min_lat float,
  min_long float,
  max_lat float,
  max_long float,
  filter_categories JSONB
) returns table (
  id uuid,
  google_place_id text,
  location gis.geography,
  pin_name text,
  categories jsonb,
  metadata jsonb,
  lat double precision,
  long double precision
)
set
  search_path to '' language sql as $$
    select distinct on (p.id)
      p.id,
      p.google_place_id,
      p.location,
      p.pin_name,
      p.categories,
      p.metadata,
      p.lat,
      p.long
    from public.pins p
    join public.user_pins up on p.id = up.pin_id
    join public.capsule_pins cp on up.id = cp.user_pin_id
    where cp.capsule_id = _capsule_id
      and p.location operator(gis.&&) gis.ST_SetSRID(gis.ST_MakeBox2D(gis.ST_Point(min_long, min_lat), gis.ST_Point(max_long, max_lat)), 4326)
$$;

CREATE OR REPLACE FUNCTION add_pin (
  google_place_id text,
  location gis.geography (Point, 4326),
  pin_name text,
  categories JSONB,
  metadata JSONB
) RETURNS uuid AS $$
DECLARE
    new_id uuid;
BEGIN
    INSERT INTO pins (google_place_id, location, pin_name, categories, metadata)
    VALUES (google_place_id, location, pin_name, categories, metadata)
    RETURNING id INTO new_id;

    RETURN new_id;
END;
$$ LANGUAGE plpgsql;

-- Checks you own or was shared with you
CREATE OR REPLACE FUNCTION get_user_capsules (_profile_id uuid) RETURNS TABLE (
  id uuid,
  profile_id uuid,
  name text,
  description text,
  created_at timestamptz
) AS $$
BEGIN
  RETURN QUERY
    SELECT c.id, c.profile_id, c.name, c.description, c.created_at
    FROM capsules c
    WHERE c.profile_id = _profile_id
       OR EXISTS (
         SELECT 1
         FROM capsule_shares cs
         WHERE cs.capsule_id = c.id
           AND cs.profile_id = _profile_id
       );
END;
$$ LANGUAGE plpgsql;

-- Get recommender notes for a pin in a capsule
CREATE OR REPLACE FUNCTION get_pin_recommenders (_capsule_id uuid, _pin_id uuid) RETURNS TABLE (first_name text, last_name text, note text) LANGUAGE plpgsql AS $$
BEGIN
  RETURN QUERY
    SELECT p.first_name,
           p.last_name,
           up.note
    FROM capsule_pins cp
    JOIN user_pins up
      ON up.id = cp.user_pin_id
    JOIN profiles p
      ON p.id = up.profile_id
    WHERE cp.capsule_id = _capsule_id
      AND up.pin_id     = _pin_id
    ORDER BY cp.added_at;
END;
$$;