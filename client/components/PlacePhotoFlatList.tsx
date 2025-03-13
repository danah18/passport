// one display photo
// clicking more leads into a flatlist of the photos themselves

import React, { useState, useCallback, useEffect } from 'react';
import { Dimensions, FlatList, StatusBar, View, Text, Button, TouchableOpacity, Linking, Image, StyleSheet } from 'react-native';
import { getSupabaseClient } from '../utils/supabase.ts';
import { PhotoData, PlacePhotoProps } from './PlacePhoto.tsx';
import { SafeAreaView } from 'react-native-safe-area-context';

const ITEM_WIDTH = 350;
const ITEM_HEIGHT = 200;

const PhotoItem = ({ previewPhoto }: { previewPhoto: PhotoData }) => (
    <View style={styles.item}>
        <Image
        style={{
            width: ITEM_WIDTH, //previewPhoto.widthPx*.2,
            height: ITEM_HEIGHT, //previewPhoto.heightPx*.2,
        }}
        source={{
            uri: previewPhoto.photoUri,
        }}
        />
    </View>
    
);

export default function PlacePhotoFlatList(props: PlacePhotoProps) {
  const { width, height } = Dimensions.get('window');
  const [photosToDisplay, setPhotosToDisplay] = useState<PhotoData[]>([]);
  const supabase = getSupabaseClient();

  // Initial fetch
  useEffect(() => {
    props.photos.forEach(async (photoReference) => {
        const photo = await getPhotoData(photoReference.name);
        setPhotosToDisplay(prevPhotos => [...prevPhotos, photo]); 
    });
  }, []);

  useEffect(() => {
    console.log(photosToDisplay);
  }, [photosToDisplay]);

  const getPhotoData = async (photoResourceName: string): Promise<PhotoData> => {
    try
    {
        const { data, error } = await supabase.functions.invoke(`google-place-photos?photoResource=${photoResourceName}`, {
            method: 'GET',
        })
        
        return data;
    }
    catch (error)
    {
        throw error;
    }
  };
  
  return (
    <SafeAreaView style={styles.container}>
        <TouchableOpacity
            onPress={()=>props.setDisplayAllPhotos(false)}
            style={{
                marginBottom: 5
            }}>
            <Text style={{fontWeight: 'bold'}}>{`<`}</Text>
        </TouchableOpacity>
      <FlatList
            data={photosToDisplay}
            keyExtractor={(item) => item.photoUri}
            renderItem={({item}) => {
                console.log("Rendering photo item:", item); // Log the item being rendered
                return <PhotoItem previewPhoto={item} />;
            }}
            numColumns={1}
        />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1, // Ensures the View takes up full height
      padding: 10,
    },
    item: {
      marginHorizontal: 10,
      marginVertical: 5,
      borderRadius: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3, // For Android shadow,
      width: ITEM_WIDTH
    },
    text: {
      fontSize: 16,
    },
});