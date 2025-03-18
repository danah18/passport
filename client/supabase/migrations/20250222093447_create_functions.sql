

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

CREATE OR REPLACE FUNCTION insert_capsule (_profile_id uuid, name text, description text) RETURNS uuid AS $$
DECLARE
    new_id uuid;
BEGIN
    INSERT INTO capsules (profile_id, name, description)
    VALUES (_profile_id, name, description)
    RETURNING id INTO new_id;

    RETURN new_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION add_pin (
  google_place_id text,
  location gis.geography (Point, 4326),
  pin_name text,
  category text,
  metadata JSONB
) RETURNS uuid AS $$
DECLARE
    new_id uuid;
BEGIN
    INSERT INTO pins (google_place_id, location, pin_name, category, metadata)
    VALUES (google_place_id, location, pin_name, category, metadata)
    RETURNING id INTO new_id;

    RETURN new_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_capsule_pins_with_owner_notes (_capsule_id uuid) RETURNS TABLE (pin_id uuid, pin_name text, note text) LANGUAGE sql AS $$
  SELECT
    p.id        AS pin_id,
    p.pin_name  AS pin_name,
    up.note     AS note
  FROM capsule_pins cp
  JOIN pins p
    ON cp.pin_id = p.id
  JOIN capsules c
    ON cp.capsule_id = c.id
  LEFT JOIN user_pins up
    ON up.pin_id = p.id
   AND up.profile_id = c.profile_id
  WHERE cp.capsule_id = _capsule_id
  ORDER BY cp.position, cp.added_at
$$;

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