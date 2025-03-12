import React, { useState, useCallback, useEffect } from 'react';
import {
  APIProvider,
  Map,
  Marker,
  MapCameraChangedEvent,
  Pin,
} from '@vis.gl/react-google-maps';
import throttle from 'lodash.throttle';
import { getSupabaseClient } from '../../utils/supabase'; // adjust the import path as needed
import { Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import PlaceTab from '@/components/PlaceTab';
import { fetchData } from '@/services/googlePlaces';
import { GooglePlace } from '../../data/pins.tsx';

interface Restaurant {
  id: number;
  name: string;
  lat: number;
  long: number;
}

export interface Pin {
  google_place_id: string;
  pin_name: string;
  category: string;
  metadata: GooglePlace;
  lat: number;
  long: number;
}

export default function MapScreen() {
  const mapsKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_KEY || '';
  const [pins, setPins] = useState<Pin[]>([]);
  const [loading, setLoading] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const [selectedPin, setSelectedPin] = useState<Pin>();

  const { width, height } = Dimensions.get('window');
  const isMobile = width < 768;

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
    const { data, error } = await supabase.rpc('pins_in_view', {
      min_lat,
      min_long,
      max_lat,
      max_long,
    });
    if (error) {
      console.error('Error fetching pins:', error);
    } else if (data) {
      setPins(data as Pin[]);
    }
    setLoading(false);
  },
  []
);

  // Throttle the fetching of pins to at most once per second
  const throttledFetch = useCallback(
  throttle((bounds: { north: number; south: number; east: number; west: number }) => {
    fetchPinsInView(bounds.south, bounds.west, bounds.north, bounds.east);
  }, 1000),
  [fetchPinsInView]
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
  // TODO: update this to auto-populate based on selected capsule location
  // const defaultCenter = { lat: 40.8075, lng: -73.946 };
  const defaultCenter = { lat: 33.069095, lng: -117.303448 };

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
          pins.map((pin) => (
            <Marker
              onClick={() => {
                setShowPanel(true);
                setSelectedPin(pin);
              }}
              key={pin.google_place_id}
              position={{ lat: pin.lat, lng: pin.long }}
              title={pin.pin_name}
            />
          ))}
      </Map>

      {showPanel && 
          // Play around with styling to not overlay on certain Maps components
          <PlaceTab pin={selectedPin}/> 
        }
    </APIProvider>
  );
}
