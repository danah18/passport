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

  const addNewPin = async (jsonBlob: string) => {
    try {
      // Need to account for indexing of the array
      const jsonObject = JSON.parse(jsonBlob) as GooglePlaceResponse;

      console.log(jsonObject);

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

      // const { data, error } = await supabase!
      //   .from('pins') 
      //   .insert([{ 
      //     google_place_id: google_place_id,
      //     location: location,
      //     pin_name: pin_name,
      //     metadata: metadata 
      //   }]);

      // if (error) 
      // { 
      //   console.log('Error', error.message);
      // }  
      // else
      // {
      //   console.log('Success', 'User added successfully');
      // }
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
