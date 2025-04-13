import PlaceTab from "@/components/PlaceTab";
import { APIProvider, Map, MapCameraChangedEvent, MapCameraProps } from "@vis.gl/react-google-maps";
import throttle from "lodash/throttle";
import React, { useCallback, useEffect, useRef, useState } from "react";
import CustomMarker from "../../components/map/CustomMarker";
import { GooglePlace } from "../../data/pins.tsx";
import { Capsule } from "../../data/portalSubmissionHandler";
import { getSupabaseClient } from "../../utils/supabase"; // adjust the import path as needed
import { useCapsule } from "./portal";

export interface Pin {
  google_place_id: string;
  pin_name: string;
  categories: string[];
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

interface MapScreenProps {
  refreshKey: number;
}

export default function MapScreen({ refreshKey }: MapScreenProps) {
  if (refreshKey === undefined)
  {
    refreshKey = 0;
    console.log("in map screen, refresh key is: ", refreshKey);
  }


  const mapsKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_KEY || "";
  const [pins, setPins] = useState<Pin[]>([]);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showPanel, setShowPanel] = useState(false);
  const [selectedPin, setSelectedPin] = useState<Pin>();
  const [cameraProps, setCameraProps] = useState<MapCameraProps>(INITIAL_CAMERA);
  const latestBoundsRef = useRef<Bounds | null>(null);
  const capsule: Capsule | null = useCapsule();

  // Function to fetch pins in view using the bounding box
  const fetchPinsInView = useCallback(
    async (min_lat: number, min_long: number, max_lat: number, max_long: number) => {
      const supabase = getSupabaseClient();

      const categories = [
        "museum",
        "tourist_attraction",
        "point_of_interest",
        "establishment"
      ];

      if (capsule) {
        const { data, error } = await supabase.rpc("capsule_pins_in_view", {
          _capsule_id: capsule.id,
          min_lat,
          min_long,
          max_lat,
          max_long,
          filter_categories: categories,
        });
        if (error) {
          console.error("Error fetching pins:", error);
        } else if (data) {
          setPins(data as Pin[]);
        }
      } else {
        const { data, error } = await supabase.rpc("pins_in_view", {
          min_lat,
          min_long,
          max_lat,
          max_long,
        });
        if (error) {
          console.error("Error fetching pins:", error);
        } else if (data) {
          setPins(data as Pin[]);
        }
      }
    },
    [capsule]
  );

  // Update mapBounds when the camera changes
  const handleCameraChange = useCallback((ev: MapCameraChangedEvent) => {
    setCameraProps(ev.detail);
    latestBoundsRef.current = ev.detail.bounds;
  }, []);

  // When the map goes idle, use the latest stored bounds to fetch pins
  const throttledHandleMapIdle = useCallback(
    throttle(() => {
      const mapBounds = latestBoundsRef.current;
      console.log("Map idle:", mapBounds);
      if (mapBounds) {
        fetchPinsInView(mapBounds.south, mapBounds.west, mapBounds.north, mapBounds.east);
      }
    }, 500), // Wait for 0.5 seconds before fetching pins, resizing page triggers too many
    [fetchPinsInView]
  );

  // Function to navigate to a specific pin
  const navigateToPin = (pin: Pin) => {
    setCameraProps({
      center: { lat: pin.lat, lng: pin.long },
      zoom: 15, // Adjust the zoom level as needed
    });
  };

  useEffect(() => {
    // Bit awkward, good enough for now
    const mapBounds = latestBoundsRef.current;
    if (mapBounds) {
      const timeoutId = setTimeout(() => {
        console.log("Map refresh");
        fetchPinsInView(mapBounds.south, mapBounds.west, mapBounds.north, mapBounds.east);
      }, 1000); // Wait for 1 second before fetching pins

      return () => clearTimeout(timeoutId);
    }
  }, [refreshKey, fetchPinsInView]);

  useEffect(() => {
    // Center the map on the capsule if it exists
    if (capsule) {
      console.log("Seeting capsule camera props");
      setCameraProps({
        center: { lat: capsule.lat, lng: capsule.long },
        zoom: 12,
      });

      // Another timeout for capsule pins race condition on creation
      const timeoutId = setTimeout(() => {
        throttledHandleMapIdle();
      }, 2000);

      return () => clearTimeout(timeoutId);
    }
  }, [capsule, throttledHandleMapIdle]);

  return (
    <APIProvider apiKey={mapsKey} onLoad={() => console.log("Maps API has loaded.")}>
      <Map
        {...cameraProps}
        mapId="eb63bf065864f46b"
        onCameraChanged={handleCameraChange}
        onIdle={throttledHandleMapIdle}
        onClick={() => {
          setShowPanel(false);
          setSelectedPin(null);
          setSelectedId(null);
        }}
      >
        {pins.map((pin) => (
          <CustomMarker
            key={pin.google_place_id}
            pin={pin}
            onClick={() => {
              setShowPanel(true);
              setSelectedPin(pin);
              setSelectedId(pin.google_place_id);
            }}
            hoveredMarkerId={hoverId}
            setHoveredMarkerId={setHoverId}
            selectedMarkerId={selectedId}
          />
        ))}
      </Map>

      {/* Play around with styling to not overlay on certain Maps components */}
      {showPanel && <PlaceTab pin={selectedPin} capsule={capsule} />}
    </APIProvider>
  );
}
