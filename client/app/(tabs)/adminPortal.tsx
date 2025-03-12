import { StyleSheet, Image, Platform, View, Button, TextInput } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useEffect, useState } from 'react';
import { getSupabaseClient } from '../../utils/supabase.ts';
import { SupabaseClient } from '@supabase/supabase-js';
import { GooglePlace, GooglePlaceResponse } from '../../data/pins.tsx';

export default function AdminPortal() {
  const [inputValue, setInputValue] = useState("");
  const [supabase, setSupabase] = useState<SupabaseClient>();

  useEffect(() => {
    // TODO: add error handling for if supabase is null as code throughout this
    // file assumes non-null
    setSupabase(getSupabaseClient());
  }, []);

  const addNewPin = async (textQuery: string) => {
    try {
      // // TODO: uncomment when CORS error is fixed
      // const supabase = getSupabaseClient(); // Figure out how to not do this on every 
      // const { data, error } = await supabase.functions.invoke('google-place-text-query', {
      //   body: { textQuery: textQuery },
      // });

      // if (error) 
      // {
      //   throw error;
      // } 

      const googlePlaceResponse = JSON.parse(textQuery) as GooglePlaceResponse;

      // Need to account for multiple responses returned, for now we just assume first element is the result
      if (googlePlaceResponse.places == null || googlePlaceResponse.places.length == 0)
      {
        console.log(Error(`No results returned for textQuery: ${textQuery}`));
        return;
      }

      const googlePlace = googlePlaceResponse.places[0];

      const google_place_id = googlePlace.id;
      const location = `SRID=4326;POINT(${googlePlace.location.longitude} ${googlePlace.location.latitude})`;
      const pin_name = googlePlace.displayName.text;
      const metadata = {
        formattedAddress: googlePlace.formattedAddress,
        rating: googlePlace.rating,
        userRatingCount: googlePlace.userRatingCount,
        googleMapsUri: googlePlace.googleMapsUri,
        displayName: googlePlace.displayName,
        photos: [],
      }; // JSONB

      const { data, error } = await supabase!
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
        console.log('Success', 'Pin added successfully with metadata: ' + metadata);
      }
    } catch (error: any) {
      console.log('Error', error.message);
    }
  } 

  return (
    <View style={styles.container}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Admin Portal</ThemedText>
      </ThemedView>
      <ThemedText>This tool allows you to add new pins to your local supabase DB instance.</ThemedText>
      <Collapsible title="1) Get Google Place JSON info">
        <ThemedText>
          Due to existing CORS issues, we use the Google Place API explorer to get JSON blobs rather than calling our own edge function.
          Hit 'Try It', update text query, then hit 'Execute'.
        </ThemedText>
        
        <ExternalLink href="https://developers.google.com/maps/documentation/places/web-service/text-search">
          <ThemedText type="link">Open Google Place API explorer</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title="2) Copy & Paste JSON object into DB">
        <TextInput 
          style={styles.input} 
          placeholder="Paste JSON blob here" 
          value={inputValue} 
          onChangeText={setInputValue} // Update state on text change
        />
        <Button 
          title="Submit" 
          onPress={() => {
            addNewPin(inputValue); // Example action
          }} 
        />
      </Collapsible>
      <Collapsible title="3) See new info in your local DB instance">
        <ExternalLink href="http://127.0.0.1:54323/project/default/editor/19423?schema=public">
          <ThemedText type="link">Check out the pins table in the public schema to see changes. Make sure you've run `supabase start`.</ThemedText>
        </ExternalLink>
      </Collapsible>    
    </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  container: {
    gap: 30,
    marginTop: 10,
    marginLeft: 10
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    color:'white'
  },
});
