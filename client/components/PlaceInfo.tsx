import React, { useState, useCallback, useEffect } from 'react';
import { Dimensions, FlatList, StatusBar, View, Text, Button, TouchableOpacity, Linking, ScrollView } from 'react-native';
import { getSupabaseClient } from '../utils/supabase.ts';
import { StarRatingDisplay } from 'react-native-star-rating-widget'; 
import PlacePhoto from './PlacePhoto.tsx';
import PlacePhotoFlatList from './PlacePhotoFlatList.tsx';
import { Pin } from '../app/(tabs)/map.tsx';
import { GooglePlace, Photo } from '../data/pins.tsx';
// https://github.com/bviebahn/react-native-star-rating-widget/tree/028b43da27ea70a792b208a2d518f7c14d66338d

type PlaceInfoProps = {
    pin: Pin,
    setDisplayAllPhotos: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function PlaceInfo(props: PlaceInfoProps) {
  const { width, height } = Dimensions.get('window');
  const isMobile = width < 768;

  const placeData = props.pin.metadata;

  return (
    <ScrollView>
      <ScrollView 
        style={{
          opacity: 0.8,
          backgroundColor: 'white',
          borderRadius: '10px',
          marginTop: 5,
          marginBottom: 2,
          width: isMobile? width*.99 :width*0.25,
          marginLeft: 5,
        }}>
        <Text
          style={{
            fontSize: 20,
            fontWeight: 'bold',
            marginLeft: 5,
            marginTop: 10,
            marginBottom: 5
          }}>{placeData.displayName}</Text>

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
            borderColor: '#2196F3'
          }}>
          <Text style={{ color: 'white' }}>
            VIEW IN GOOGLE MAPS
          </Text>
        </TouchableOpacity>
      </ScrollView>
     {/* <PlacePhoto photos={placeData.photos} setDisplayAllPhotos={props.setDisplayAllPhotos}/> */}
    </ScrollView>
  );
}



  