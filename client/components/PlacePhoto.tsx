// one display photo
// clicking more leads into a flatlist of the photos themselves

import React, { useState, useCallback, useEffect } from 'react';
import { Dimensions, FlatList, StatusBar, View, Text, Button, TouchableOpacity, Linking } from 'react-native';
import { getSupabaseClient } from '../utils/supabase.ts';

type PlacePhotoProps = {
    placeId: string,
}

type PhotoData = {
}

const mockPhotoData: PhotoData = {}

export default function PlacePhoto(props: PlacePhotoProps) {
  const { width, height } = Dimensions.get('window');
  const [photoData, setPhotoData] = useState<PhotoData>(mockPhotoData);
  const [displayMorePhotos, setDisplayMorePhotos] = useState(false);

  const isMobile = width < 768;

  const supabase = getSupabaseClient();

  useEffect(() => {
    getPhotoData();
  }, []);

  const getPhotoData = async () => {
    const { data, error } = await supabase.functions.invoke(`google-places?placeId=${props.placeId}`, {
      headers: {
        'Authorization': `Bearer ${process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || ''}`,
        'Access-Control-Allow-Origin': '*',
      },
      method: 'GET',
    })
  };

  return (
    <View>
      <View 
        style={{
          opacity: 0.8,
          backgroundColor: 'white',
          borderRadius: '10px',
          marginTop: 5,
        }}>
        <TouchableOpacity 
          onPress={() => Linking.openURL(placeData.googleMapsUri)}
          style={{
            backgroundColor: '#2196F3', // Button color
            padding: 10, // Padding for the button
            borderRadius: 5, // Rounded corners
            alignItems: 'center', // Center the text
            width: '80%',
            marginTop: 5,
            marginLeft: 5,
            marginBottom: 10,
          }}>
          <Text style={{ color: 'white' }}>
            VIEW IN GOOGLE MAPS
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}