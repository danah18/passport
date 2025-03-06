import React, { useState, useCallback, useEffect } from 'react';
import { Dimensions, FlatList, StatusBar, View, Text, Button, TouchableOpacity, Linking } from 'react-native';
import { getSupabaseClient } from '../utils/supabase.ts';
import { StarRatingDisplay } from 'react-native-star-rating-widget'; 
// https://github.com/bviebahn/react-native-star-rating-widget/tree/028b43da27ea70a792b208a2d518f7c14d66338d

type PlaceInfoProps = {
    placeId: string,
}

type DisplayName = {
  text: string,
  languageCode: string,
}

type PlaceData = {
  formattedAddress: string,
  rating: number,
  userRatingCount: number,
  googleMapsUri: string,
  displayName: DisplayName,

}

const mockPlaceData: PlaceData = {
  formattedAddress:"1600 Amphitheatre Pkwy, Mountain View, CA 94043, USA",
  rating:4.2,
  userRatingCount:9627,
  googleMapsUri:"https://maps.google.com/?cid=7793879817120868320",
  displayName:{ text:"Googleplex",languageCode:"en"},
}

export default function PlaceInfo(props: PlaceInfoProps) {
  const { width, height } = Dimensions.get('window');
  const [placeData, setPlaceData] = useState<PlaceData>(mockPlaceData);
  const isMobile = width < 768;

  const supabase = getSupabaseClient();

  useEffect(() => {
    getPlaceData();
  }, []);

  const getPlaceData = async () => {
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
        <Text
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            marginLeft: 5,
            marginTop: 10,
            marginBottom: 5
          }}>{placeData.displayName.text}</Text>

        <Text 
          style={{
            marginLeft: 5,
            marginBottom: 5
          }}>
            {`${placeData.rating}`} 
            <StarRatingDisplay
              rating={placeData.rating}
              starSize={20}
              style={{}}
            /> 
            {`(${placeData.userRatingCount})`}
          </Text>
        <Text
          style={{
            marginLeft: 5,
            marginBottom: 5,
          }}>{placeData.formattedAddress}</Text>

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



  