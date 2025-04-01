// one display photo
// clicking more leads into a flatlist of the photos themselves

import React, { useState, useCallback, useEffect } from 'react';
import { Dimensions, FlatList, StatusBar, View, Text, Button, TouchableOpacity, Linking } from 'react-native';
import { getSupabaseClient } from '../utils/supabase.ts';
import { Image } from 'react-native';
import PlacePhotoFlatList from './PlacePhotoFlatList.tsx';
import { Photo } from '../data/pins.tsx';

export type PlacePhotoProps = {
    photos: Photo[],
    setDisplayAllPhotos: React.Dispatch<React.SetStateAction<boolean>>;
}

export type PhotoData = {
    photoUri: string,
    widthPx:number,
    heightPx:number,
}

export default function PlacePhoto(props: PlacePhotoProps) {
  const { width, height } = Dimensions.get('window');
  const isMobile = width < 768;
  const maxRetry = 3;

  const supabase = getSupabaseClient();
  const defaultPreviewPhotoData = { 
    photoUri: "", //"https://lh3.googleusercontent.com/place-photos/ADOriq0ljiLBtfFAK1dElBxuMVaegVmpTQy9Ru6LV-Vos44lz5_odtCMKwSBSlo2AsNeuPaUe8QcoFbvwYdJD9o9Ikq2v5RRJJ-XzrtsMnbIJsDv6aQmo70Qefd7LBsHxa4Q08tgAIGojA=s4800-w400-h400",
    widthPx:4032,
    heightPx:3024,
  };

  const [previewPhoto, setPreviewPhoto] = useState<PhotoData>(defaultPreviewPhotoData);

  useEffect(() => {
    if (props.photos && props.photos.length > 0)
    {
        getPhotoData(0, 0);
    }
    else
    {
        setPreviewPhoto(defaultPreviewPhotoData);
    }
  }, [props]);


  const getPhotoData = async (index: number, counter: number) => {
    const previewPhoto = props.photos[index];

    if (counter < maxRetry)
    {
        const { data, error } = await supabase.functions.invoke(`google-place-photos?photoResource=${previewPhoto.name}`, {
            method: 'GET',
        })

        console.log(`data: `+ data);
        console.log(`error: `+ error);

        setPreviewPhoto({
            photoUri: data.photoUri,
            widthPx: props.photos[index].widthPx,
            heightPx: props.photos[index].heightPx
        });

        // if (error)
        // {
        //     if (error.code == 429)
        //     {
        //         if (index+1 < props.photos.length)
        //         {
        //             await getPhotoData(index+1, counter+1);
        //         }
        //         else
        //         {
        //             setPreviewPhoto(defaultPreviewPhotoData);
        //             console.log(error);
        //             return;
        //         }
        //     }
        // }
        // else
        // {
        //     setPreviewPhoto({
        //         photoUri: data.photoUri,
        //         widthPx: props.photos[index].widthPx,
        //         heightPx: props.photos[index].heightPx
        //     });
        // }
    }
  };

  return (
    <View>
      <View 
        style={{
          opacity: 0.8,
          backgroundColor: 'white',
          borderRadius: '10px',
          marginTop: 5,
          width: width*0.25,
          marginLeft: 5
        }}>
            <TouchableOpacity 
            onPress={() => props.setDisplayAllPhotos(true)}
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
                        marginLeft: 55
                    }}
                    source={{
                        uri: previewPhoto.photoUri,
                    }}
                />
            </TouchableOpacity>
      </View>
    </View>
  );
}