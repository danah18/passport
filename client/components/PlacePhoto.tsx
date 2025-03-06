// one display photo
// clicking more leads into a flatlist of the photos themselves

import React, { useState, useCallback, useEffect } from 'react';
import { Dimensions, FlatList, StatusBar, View, Text, Button, TouchableOpacity, Linking } from 'react-native';
import { getSupabaseClient } from '../utils/supabase.ts';
import { Photo } from './PlaceInfo.tsx';
import { Image } from 'react-native';
import PlacePhotoFlatList from './PlacePhotoFlatList.tsx';

export type PlacePhotoProps = {
    photos: Photo[],
}

export type PhotoData = {
    photoUri: string,
    widthPx:number,
    heightPx:number,
}

export default function PlacePhoto(props: PlacePhotoProps) {
  const { width, height } = Dimensions.get('window');
  const isMobile = width < 768;

  const [displayMorePhotos, setDisplayMorePhotos] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState<PhotoData>(
    { 
        photoUri: "https://lh3.googleusercontent.com/place-photos/ADOriq0ljiLBtfFAK1dElBxuMVaegVmpTQy9Ru6LV-Vos44lz5_odtCMKwSBSlo2AsNeuPaUe8QcoFbvwYdJD9o9Ikq2v5RRJJ-XzrtsMnbIJsDv6aQmo70Qefd7LBsHxa4Q08tgAIGojA=s4800-w400-h400",
        widthPx:4032,
        heightPx:3024,
    });

  const supabase = getSupabaseClient();

  // Enable when CORS issue is resolved:
  //
//   useEffect(() => {
//     getPhotoData();
//   }, []);

  const getPhotoData = async () => {
    if (props.photos && props.photos.length >= 1)
    {
        const previewPhoto = props.photos[0];

        const { data, error } = await supabase.functions.invoke(`google-place-photos?photoResource=${previewPhoto.name}`, {
            headers: {
            'Authorization': `Bearer ${process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || ''}`,
            'Access-Control-Allow-Origin': '*',
            },
            method: 'GET',
        })
        
        setPreviewPhoto({
            photoUri: data.photoUri,
            widthPx: props.photos[0].widthPx,
            heightPx: props.photos[0].heightPx
        });
    } 
  };

  // Rate limiting does occur with the image resource
  return (
    <View>
      <View 
        style={{
          opacity: 0.8,
          backgroundColor: 'white',
          borderRadius: '10px',
          marginTop: 5,
        }}>
        {displayMorePhotos ?  
            <PlacePhotoFlatList photos={props.photos}/> 
        :
            <TouchableOpacity 
            onPress={() => setDisplayMorePhotos(true)}
            style={{
                padding: 10, // Padding for the button
                borderRadius: 5, // Rounded corners
                alignItems: 'center', // Center the text
                width: '80%',
                marginTop: 5,
                marginLeft: 5,
                marginBottom: 10,
            }}>
                <Image
                    style={{
                        width: previewPhoto.widthPx * .08,
                        height: previewPhoto.heightPx * .08,
                        marginLeft: 50,
                    }}
                    source={{
                        uri: previewPhoto.photoUri,
                    }}
                />
            </TouchableOpacity>
        }
      </View>
    </View>
  );
}