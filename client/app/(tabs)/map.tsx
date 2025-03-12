import React, { useState, useCallback, useEffect } from 'react';
import {
  APIProvider,
  Map,
  Marker,
  MapCameraChangedEvent,
} from '@vis.gl/react-google-maps';
import throttle from 'lodash.throttle';
import { getSupabaseClient } from '../../utils/supabase'; // adjust the import path as needed
import { Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import PlaceTab from '@/components/PlaceTab';
import { fetchData } from '@/services/googlePlaces';

interface Restaurant {
  id: number;
  name: string;
  lat: number;
  long: number;
}

export default function MapScreen() {
  const mapsKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_KEY || '';
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPanel, setShowPanel] = useState(false);

  const { width, height } = Dimensions.get('window');
  const isMobile = width < 768;

  // Function to fetch restaurants in view using the bounding box
  const fetchRestaurantsInView = useCallback(
    async (
      min_lat: number,
      min_long: number,
      max_lat: number,
      max_long: number
    ) => {
      const supabase = getSupabaseClient();
      setLoading(true);
      const { data, error } = await supabase.rpc('restaurants_in_view', {
        min_lat,
        min_long,
        max_lat,
        max_long,
      });
      if (error) {
        console.error('Error fetching restaurants:', error);
      } else if (data) {
        setRestaurants(data as Restaurant[]);
      }
      setLoading(false);
    },
    []
  );

   // Function to fetch pins in view using the bounding box
   const fetchPinsInView = useCallback(
    async (
      min_lat: number,
      min_long: number,
      max_lat: number,
      max_long: number
    ) => {
      const supabase = getSupabaseClient();
      setLoading(true);

      // TODO: make equivalent supabase function
      const { data, error } = await supabase.rpc('restaurants_in_view', {
        min_lat,
        min_long,
        max_lat,
        max_long,
      });
      if (error) {
        console.error('Error fetching restaurants:', error);
      } else if (data) {
        setRestaurants(data as Restaurant[]);
      }
      setLoading(false);
    },
    []
  );

  // Throttle the fetching of restaurants to at most once per second
  const throttledFetch = useCallback(
    throttle((bounds: { north: number; south: number; east: number; west: number }) => {
      fetchRestaurantsInView(bounds.south, bounds.west, bounds.north, bounds.east);
    }, 1000),
    [fetchRestaurantsInView]
  );

  useEffect(() => {
    const supabase = getSupabaseClient();

    const addNewPin = async () => {
        try {
          const latitude = 33.0694771;
          const longitude = -117.3041763;
          const google_place_id = "ChIJE7hVdOUM3IARwNSTLLmH0Js";
          const location = `SRID=4326;POINT(${longitude} ${latitude})`;
          const pin_name = "French Corner Leucadia";
          const metadata = {
            formattedAddress: "1200 N Coast Hwy 101, Encinitas, CA 92024, USA",
            rating: 4.5,
            userRatingCount: 414,
            googleMapsUri: "https://maps.google.com/?cid=11227623100421231808",
            displayName: "French Corner Leucadia",
            photos: [],
          }; // JSONB

          const { data, error } = await supabase
            .from('pins') 
            .insert([{ 
              google_place_id: google_place_id,
              location: location,
              pin_name: pin_name,
              metadata: metadata 
            }]);

          if (error) 
          { 
            console.log('Error', error.message);
          }  
          else
          {
            console.log('Success', 'User added successfully');
          }
        } catch (error: any) {
          console.log('Error', error.message);
        }
      } 
  }, []);

  // Callback to be triggered when the map's camera changes.
  const handleCameraChanged = (ev: MapCameraChangedEvent) => {
    console.log('Camera changed:', ev.detail);
    const bounds = ev.detail.bounds;
    if (bounds) {
      throttledFetch(bounds);
    }
  };

  // Define a default center for the map
  const defaultCenter = { lat: 40.8075, lng: -73.946 };

  return (
    <APIProvider
      apiKey={mapsKey}
      onLoad={() => console.log('Maps API has loaded.')}
    >
      <Map
        defaultZoom={16}
        defaultCenter={defaultCenter}
        onCameraChanged={handleCameraChanged}
        onClick={() => setShowPanel(false)}
      >
        {!loading &&
          restaurants.map((restaurant) => (
            <Marker
              onClick={() => {
                setShowPanel(true)
              }}
              key={restaurant.id}
              position={{ lat: restaurant.lat, lng: restaurant.long }}
              title={restaurant.name}
            />
          ))}
      </Map>

      {showPanel && 
          // Play around with styling to not overlay on certain Maps components
          <PlaceTab placeId="ChIJj61dQgK6j4AR4GeTYWZsKWw"/>
            
          }
    </APIProvider>
  );
}
