// one display photo
// clicking more leads into a flatlist of the photos themselves

import React, { useState, useCallback, useEffect } from 'react';
import { Dimensions, FlatList, StatusBar, View, Text, Button, TouchableOpacity, Linking, Image, StyleSheet } from 'react-native';
import { getSupabaseClient } from '../utils/supabase.ts';
import { PhotoData, PlacePhotoProps } from './PlacePhoto.tsx';
import { SafeAreaView } from 'react-native-safe-area-context';

const PAGE_SIZE = 10; // Number of items per page

const PhotoItem = ({ previewPhoto }: { previewPhoto: PhotoData }) => (
    <View style={styles.item}>
        <Image
        style={{
            width: 250, //previewPhoto.widthPx*.2,
            height: 100, //previewPhoto.heightPx*.2,
        }}
        source={{
            uri: previewPhoto.photoUri,
        }}
        />
    </View>
    
);
const mockData: Record<string, PhotoData> = {
    "places/ChIJj61dQgK6j4AR4GeTYWZsKWw/photos/AUy1YQ1dP0lRFtO4lOxJgBvShm7e1zR6jZz37uQkp2UaZQTcQyjxVxbxqSqeDQicc22_Hm8Rgxz1nm8iXb33voRglgQqcugDXHAVUHdJMXHtUmJRYNziNmb5CFbcsBapYj-uGMUzYLfPSYBlnaxAHW4sjBfbdkTFdwGEtQm_yeVWJgiTbIVbc9jjR8upcQtz65rjVwCBRi3edwFT2uMwCWO2ZDMWvkSQGim9j7FnOtxrTq6Q8FdbDoRmwxW7b7oN7hPdbjtivgEnGqSQ3pVtYi75mrzhN6dzC5SQTgQG7J-GQ6y4N5g7zhL--AUnfQS6aG9NUNavWFXDs7LhVd8PY4xFziDKIPl48o6Pmiqr4-_hsOC2R2aBIVNqMO918Pu3xFw5IrqNxhRdmi7QNOEOwBDo8NMOHKRz5F4F": {
        photoUri: "https://lh3.googleusercontent.com/place-photos/ADOriq0ljiLBtfFAK1dElBxuMVaegVmpTQy9Ru6LV-Vos44lz5_odtCMKwSBSlo2AsNeuPaUe8QcoFbvwYdJD9o9Ikq2v5RRJJ-XzrtsMnbIJsDv6aQmo70Qefd7LBsHxa4Q08tgAIGojA=s4800-w400-h400",
        widthPx: 4032,
        heightPx: 3024,
    },
    "places/ChIJj61dQgK6j4AR4GeTYWZsKWw/photos/AUy1YQ31KoiWZGB9jkDrCoBj975FAG7JBN5uaOObwuNieNJQekstCdhuZJYp-goVigy9sXwlRo600F3hRialqrWUvxRrzPNJxnEieWUYCF5zkdN_TprTZ39QTBtX7aLIuR5efKiP4BWvvgoRDpDKN918IFuFWMd2M8biodLIj3941CitHeQkM2_GorVXZwp8MAyJ8u0v8UpWfGQqvOQin8vqby9Gl7CHt5xSmj5YY-FGEiS2ug1gdSmD4qW6vljUh3hsjzmfbev7R1L3xwjvhjADYctGPJ6eoNbbCFWeRKsxVap48gybuMWuS3NQef1XrqmLF1FaeVGE1-uL2ztcwma-Jnbw3yiNvN5nkfHWi7Knky-FFucK4gbps0iZIXpCuBGBbenjphjj3UveRzD1_dak9o7fe4-9syLnuGNf": {
        photoUri:"https://upload.wikimedia.org/wikipedia/commons/7/7f/02_Pecs%2C_Hungary_-_Great_Synagogue.jpg",
        widthPx:800,
        heightPx:600,
    },
    "places/ChIJj61dQgK6j4AR4GeTYWZsKWw/photos/AUy1YQ31SviLuX0-RoDUtahRfaaaOG5TsEcOzSuNFGYV9j86WQXvlewbyhEiKaCAbLfGwumqUvqQWKzkieA53Sv8GgX8J5wKv9wCPnsaCJpNLlX6A23dpNnWVJ6Pjiyug8Pywsyr9OZ3vjvgNd2cXhMu97-9Xrw9f2Kf3hBxNXE296SqxXH8Rrevilhsi0stBf6HD7gTc2wcz1I111OOfGO11r-1Cl3GXQrhOvQcDBIus_NxlzsiZjJG_-2jw7GCoETenJSHFrlBO2KdtBCgI77WInaqxTeHH8gPNsUs1qdWd3PKTkBROTW5Kx1Y2oe07XeHc40k3wtlJfJ1ACIirGV8W_tqI7wo_zVjynWhddtr90i4fREuh2UVb7lm2p0k3qqQyxqN_0dBtNHnQhztgCOrlu9J0VNBp7l7": {
        photoUri:"https://upload.wikimedia.org/wikipedia/commons/4/44/Jurisics_ter_in_Koszeg_%282%29.jpg",
        widthPx:1731,
        heightPx:1154,
    },
    "4": {
        photoUri:"https://upload.wikimedia.org/wikipedia/commons/c/ce/01_Sienne_vue_de_San_Clemente.jpg",
        widthPx:800,
        heightPx:600,
    },
    "5": {
        photoUri:"https://upload.wikimedia.org/wikipedia/commons/1/1d/140625_Rifugio_Vajolet.jpg",
        widthPx:800,
        heightPx:600,
    }, 
    "6": {
        photoUri:"https://upload.wikimedia.org/wikipedia/commons/3/3f/140626_Grasleitenh%C3%BCtte_von_oben.jpg",
        widthPx:800,
        heightPx:600,
    },
    "7": {
        photoUri:"https://upload.wikimedia.org/wikipedia/commons/f/f1/140626_Grasleitenpassh%C3%BCtte.jpg",
        widthPx:800,
        heightPx:600,
    },
    "8": {
        photoUri:"https://upload.wikimedia.org/wikipedia/commons/4/47/St_John_the_Baptist_church_in_Felsoszentivan_%284%29.jpg",
        widthPx:800,
        heightPx:600,
    }, 
    "9": {
        photoUri:"https://upload.wikimedia.org/wikipedia/commons/b/b7/140625_Gartlh%C3%BCtte_mit_Vajolett%C3%BCrmen.jpg",
        widthPx:800,
        heightPx:600,
    },
};

export default function PlacePhotoFlatList(props: PlacePhotoProps) {
  const { width, height } = Dimensions.get('window');
  const supabase = getSupabaseClient();

  const [photosToDisplay, setPhotosToDisplay] = useState<PhotoData[]>([]);
  const [loading, setLoading] = useState(false); // Loader state
  const [hasMore, setHasMore] = useState(true); // Tracks if more data is available
  const [page, setPage] = useState(1); // Tracks current page
  const [index, setIndex] = useState(0); // Tracks index of last retrieved photo
  
  // Initial fetch
  useEffect(() => {
    fetchData(); // Initial fetch
    console.log("fetchData After: " + photosToDisplay);
  }, []);


  useEffect(() => {
    console.log("use Effect call: " + photosToDisplay);
  }, [photosToDisplay]);

  const getPhotoData = async (photoResourceName: string): Promise<PhotoData> => {
    const { data, error } = await supabase.functions.invoke(`google-place-photos?photoResource=${photoResourceName}`, {
      headers: {
        'Authorization': `Bearer ${process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || ''}`,
        'Access-Control-Allow-Origin': '*',
      },
      method: 'GET',
    })

    return data;
  };

  const getPhotoDataMock = async (photoResourceName: string): Promise<PhotoData> => {
    return mockData[photoResourceName];
  };
  
  // Fetch data function
  const fetchData = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
        let newData: PhotoData[] = [];
        let counter = index;
        let maxIndex = index+PAGE_SIZE;

        while (counter < maxIndex && counter < props.photos.length)
        {
            const photo = await getPhotoDataMock(props.photos[counter].name)
            newData.push(photo);
            counter++;
        }

        setIndex(counter);
        setPhotosToDisplay(newData);
        setPage((prevPage) => prevPage + 1);

        // Check if there is more data
        if (newData.length < PAGE_SIZE) {
            setHasMore(false);
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    } finally {
        setLoading(false);
    }
  };

// This is really choppy - for now doing a non-lazy load with the scroll view looks better
// We will need to update this to do lazy loading after the fact
//   // Trigger pagination when reaching the end of the list
//   const handleLoadMore = () => {
//     if (!loading && hasMore) {
//       fetchData();
//     }
//   };

  return (
    <SafeAreaView style={styles.container}>
        <TouchableOpacity
            onPress={()=>props.setDisplayAllPhotos(false)}>
            <Text>{`<`}</Text>
        </TouchableOpacity>
      <FlatList
            data={photosToDisplay}
            keyExtractor={(item) => item.photoUri}
            renderItem={({item}) => {
                console.log("Rendering photo item:", item); // Log the item being rendered
                return <PhotoItem previewPhoto={item} />;
            }}
            // onEndReached={handleLoadMore}
            // onEndReachedThreshold={0.5} // Adjust this threshold to trigger loading earlier/later
        />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1, // Ensures the View takes up full height
      padding: 10,
      backgroundColor: '#f8f8f8',
    },
    item: {
      padding: 20,
      marginVertical: 8,
      backgroundColor: '#fff',
      borderRadius: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3, // For Android shadow,
      width: 150,
      height:150
    },
    text: {
      fontSize: 16,
    },
  });