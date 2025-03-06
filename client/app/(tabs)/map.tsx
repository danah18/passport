import React, { useState, useCallback } from 'react';
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

  // Throttle the fetching of restaurants to at most once per second
  const throttledFetch = useCallback(
    throttle((bounds: { north: number; south: number; east: number; west: number }) => {
      fetchRestaurantsInView(bounds.south, bounds.west, bounds.north, bounds.east);
    }, 1000),
    [fetchRestaurantsInView]
  );

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
                console.log('Show Panel:', showPanel)
              }}
              key={restaurant.id}
              position={{ lat: restaurant.lat, lng: restaurant.long }}
              title={restaurant.name}
            />
          ))}
      </Map>

      {showPanel && 
          // Play around with styling to not overlay on certain Maps components
          <PlaceTab placeId="IhoSGAoUChIJ0U6OoscfqokR6P225pApu2UQDQ"/>
            
          }
    </APIProvider>
  );
}
