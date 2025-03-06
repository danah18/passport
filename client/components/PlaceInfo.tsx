import React, { useState, useCallback, useEffect } from 'react';
import { Dimensions, FlatList, StatusBar, View, Text, Button, TouchableOpacity, Linking } from 'react-native';
import { getSupabaseClient } from '../utils/supabase.ts';
import { StarRatingDisplay } from 'react-native-star-rating-widget'; 
import PlacePhoto from './PlacePhoto.tsx';
// https://github.com/bviebahn/react-native-star-rating-widget/tree/028b43da27ea70a792b208a2d518f7c14d66338d

type PlaceInfoProps = {
    placeId: string,
}

type DisplayName = {
  text: string,
  languageCode: string,
}

export type Photo = {
  name: string,
  widthPx: number,
  heightPx: number,
}

type PlaceData = {
  formattedAddress: string,
  rating: number,
  userRatingCount: number,
  googleMapsUri: string,
  displayName: DisplayName,
  photos: Photo[],
}

const mockPhotoArray: Photo[] = [
  {
    name:"places/ChIJj61dQgK6j4AR4GeTYWZsKWw/photos/AUy1YQ1dP0lRFtO4lOxJgBvShm7e1zR6jZz37uQkp2UaZQTcQyjxVxbxqSqeDQicc22_Hm8Rgxz1nm8iXb33voRglgQqcugDXHAVUHdJMXHtUmJRYNziNmb5CFbcsBapYj-uGMUzYLfPSYBlnaxAHW4sjBfbdkTFdwGEtQm_yeVWJgiTbIVbc9jjR8upcQtz65rjVwCBRi3edwFT2uMwCWO2ZDMWvkSQGim9j7FnOtxrTq6Q8FdbDoRmwxW7b7oN7hPdbjtivgEnGqSQ3pVtYi75mrzhN6dzC5SQTgQG7J-GQ6y4N5g7zhL--AUnfQS6aG9NUNavWFXDs7LhVd8PY4xFziDKIPl48o6Pmiqr4-_hsOC2R2aBIVNqMO918Pu3xFw5IrqNxhRdmi7QNOEOwBDo8NMOHKRz5F4F",
    widthPx:4032,
    heightPx:3024,
  },
  {
    name:"places/ChIJj61dQgK6j4AR4GeTYWZsKWw/photos/AUy1YQ31KoiWZGB9jkDrCoBj975FAG7JBN5uaOObwuNieNJQekstCdhuZJYp-goVigy9sXwlRo600F3hRialqrWUvxRrzPNJxnEieWUYCF5zkdN_TprTZ39QTBtX7aLIuR5efKiP4BWvvgoRDpDKN918IFuFWMd2M8biodLIj3941CitHeQkM2_GorVXZwp8MAyJ8u0v8UpWfGQqvOQin8vqby9Gl7CHt5xSmj5YY-FGEiS2ug1gdSmD4qW6vljUh3hsjzmfbev7R1L3xwjvhjADYctGPJ6eoNbbCFWeRKsxVap48gybuMWuS3NQef1XrqmLF1FaeVGE1-uL2ztcwma-Jnbw3yiNvN5nkfHWi7Knky-FFucK4gbps0iZIXpCuBGBbenjphjj3UveRzD1_dak9o7fe4-9syLnuGNf",
    widthPx:800,
    heightPx:600,
  },
  {
    name:"places/ChIJj61dQgK6j4AR4GeTYWZsKWw/photos/AUy1YQ31SviLuX0-RoDUtahRfaaaOG5TsEcOzSuNFGYV9j86WQXvlewbyhEiKaCAbLfGwumqUvqQWKzkieA53Sv8GgX8J5wKv9wCPnsaCJpNLlX6A23dpNnWVJ6Pjiyug8Pywsyr9OZ3vjvgNd2cXhMu97-9Xrw9f2Kf3hBxNXE296SqxXH8Rrevilhsi0stBf6HD7gTc2wcz1I111OOfGO11r-1Cl3GXQrhOvQcDBIus_NxlzsiZjJG_-2jw7GCoETenJSHFrlBO2KdtBCgI77WInaqxTeHH8gPNsUs1qdWd3PKTkBROTW5Kx1Y2oe07XeHc40k3wtlJfJ1ACIirGV8W_tqI7wo_zVjynWhddtr90i4fREuh2UVb7lm2p0k3qqQyxqN_0dBtNHnQhztgCOrlu9J0VNBp7l7",
    widthPx:1731,
    heightPx:1154,
  },
  {
    name:"4",
    widthPx:800,
    heightPx:600,
  },
  {
    name:"5",
    widthPx:800,
    heightPx:600,
  },
  {
    name:"6",
    widthPx:800,
    heightPx:600,
  },
  {
    name:"7",
    widthPx:800,
    heightPx:600,
  },
  {
    name:"8",
    widthPx:800,
    heightPx:600,
  },
  {
    name:"9",
    widthPx:800,
    heightPx:600,
  },
];

const mockPlaceData: PlaceData = {
  formattedAddress:"1600 Amphitheatre Pkwy, Mountain View, CA 94043, USA",
  rating:4.2,
  userRatingCount:9627,
  googleMapsUri:"https://maps.google.com/?cid=7793879817120868320",
  displayName:{ text:"Googleplex",languageCode:"en"},
  photos: mockPhotoArray,
};

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
      <PlacePhoto photos={placeData.photos}/>
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
            borderColor: '#2196F3'
          }}>
          <Text style={{ color: 'white' }}>
            VIEW IN GOOGLE MAPS
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}



  