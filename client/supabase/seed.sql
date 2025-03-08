  insert into public.restaurants
  (name, location)
values
  ('Supa Burger', gis.st_point(-73.946823, 40.807416)),
  ('Supa Pizza', gis.st_point(-73.94581, 40.807475)),
  ('Supa Taco', gis.st_point(-73.945826, 40.80629));

  insert into public.pins
  (google_place_id, location, pin_name, metadata)
values
  ('ChIJUUP02eUM3IARv03jidyvySQ', gis.st_point(-117.305, 33.07166670000000), 'Just Peachy Market', '{
    "formattedAddress": "1354 N Coast Hwy 101, Encinitas, CA 92024, USA",
    "rating": 4.7,
    "userRatingCount": 201,
    "googleMapsUri": "https://maps.google.com/?cid=2650843217425288639",
    "displayName": "Just Peachy Market",
    "photos": []
  }'::jsonb);
