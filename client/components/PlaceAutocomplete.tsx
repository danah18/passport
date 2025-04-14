import { useMapsLibrary } from '@vis.gl/react-google-maps';
import React, { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { cn } from '../utils/libUtils.tsx';

interface Props {
  onPlaceSelect: (place: google.maps.places.PlaceResult | null) => void;
}

// This is an example of the classic "Place Autocomplete" widget.
// https://github.com/visgl/react-google-maps/blob/main/examples/autocomplete/src/autocomplete-classic.tsx
// Additional docs:
// https://developers.google.com/maps/documentation/javascript/examples/rgm-autocomplete#try-sample
// https://visgl.github.io/react-google-maps/examples/autocomplete
export const PlaceAutocomplete = ({onPlaceSelect}: Props) => {
  const [placeAutocomplete, setPlaceAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const places = useMapsLibrary('places');

  useEffect(() => {
    if (!places || !inputRef.current) return;

    const options = {
      fields: ['name', 'formatted_address', 'geometry']
    };

    setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options));
  }, [places]);

  useEffect(() => {
    if (!placeAutocomplete) return;

    placeAutocomplete.addListener('place_changed', () => {
      onPlaceSelect(placeAutocomplete.getPlace());
    });
  }, [onPlaceSelect, placeAutocomplete]);

  return (
    <View className="autocomplete-container">
      <input 
        ref={inputRef}
        style={{ 
          border: '1px solid #ccc',
            height: 40,
            borderColor: 'gray',
            borderWidth: 1,
            borderRadius: 10,
            marginTop: 5,
        }}
        placeholder=' Enter destination city or country'
        className={cn(
          "flex h-10 w-full rounded-md border border-input px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "text-xs tracking-wide h-6 py-0 px-1"
        )}
      />
    </View>
  );
};