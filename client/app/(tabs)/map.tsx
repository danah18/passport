import React, { useState, useCallback, useRef } from 'react';
import {
  APIProvider,
  Map,
  Marker,
  MapCameraChangedEvent,
  MapEvent,
  MapCameraProps,
} from '@vis.gl/react-google-maps';
import { getSupabaseClient } from '../../utils/supabase'; // adjust the import path as needed
import { Dimensions } from 'react-native';
import PlaceTab from '@/components/PlaceTab';
import { GooglePlace } from '../../data/pins.tsx';

export interface Pin {
  google_place_id: string;
  pin_name: string;
  category: string;
  metadata: GooglePlace;
  lat: number;
  long: number;
}

interface Bounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

const INITIAL_CAMERA = {
  center: { lat: 33.069095, lng: -117.303448 },
  zoom: 12,
};

export default function MapScreen() {
  const mapsKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_KEY || '';
  const [pins, setPins] = useState<Pin[]>([]);
  const [showPanel, setShowPanel] = useState(false);
  const [selectedPin, setSelectedPin] = useState<Pin>();
  const [cameraProps, setCameraProps] =
    useState<MapCameraProps>(INITIAL_CAMERA);
  const latestBoundsRef = useRef<Bounds | null>(null);

  // Function to fetch pins in view using the bounding box
  const fetchPinsInView = useCallback(
    async (
      min_lat: number,
      min_long: number,
      max_lat: number,
      max_long: number
    ) => {
      const supabase = getSupabaseClient();
      // Using the user ID, query capsule_shares table and get capsule_pins list as the group to render
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
    },
    []
  );

  // Update mapBounds when the camera changes
  const handleCameraChange = useCallback((ev: MapCameraChangedEvent) => {
    setCameraProps(ev.detail);
    latestBoundsRef.current = ev.detail.bounds;
  }, []);

  // When the map goes idle, use the latest stored bounds to fetch pins
  const handleMapIdle = () => {
    const mapBounds = latestBoundsRef.current;
    console.log('Map idle:', mapBounds);
    if (mapBounds) {
      fetchPinsInView(
        mapBounds.south,
        mapBounds.west,
        mapBounds.north,
        mapBounds.east
      );
    }
  };

  return (
    <APIProvider
      apiKey={mapsKey}
      onLoad={() => console.log('Maps API has loaded.')}
    >
      <Map
        {...cameraProps}
        onCameraChanged={handleCameraChange}
        onIdle={handleMapIdle}
        onClick={() => setShowPanel(false)}
      >
        {pins.map((pin) => (
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

      {/* Play around with styling to not overlay on certain Maps components */}
      {showPanel && <PlaceTab pin={selectedPin} />}
    </APIProvider>
  );
}
