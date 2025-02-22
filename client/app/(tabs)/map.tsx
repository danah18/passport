import { APIProvider, Map, MapCameraChangedEvent } from '@vis.gl/react-google-maps';

export default function MapScreen() {

  const mapsKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_KEY || "";

  return (
    <APIProvider apiKey={mapsKey} onLoad={() => console.log('Maps API has loaded.')}>
      <Map
        defaultZoom={13}
        defaultCenter={{ lat: -33.860664, lng: 151.208138 }}
        onCameraChanged={(ev: MapCameraChangedEvent) =>
          console.log('camera changed:', ev.detail.center, 'zoom:', ev.detail.zoom)
        }
      >
      </Map>
    </APIProvider>
  );
}