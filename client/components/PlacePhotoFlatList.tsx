// one display photo
// clicking more leads into a flatlist of the photos themselves

import React, { useState, useCallback, useEffect } from 'react';
import { Dimensions, FlatList, StatusBar, View, Text, Button, TouchableOpacity, Linking, Image } from 'react-native';
import { getSupabaseClient } from '../utils/supabase.ts';
import { PhotoData, PlacePhotoProps } from './PlacePhoto.tsx';

const PAGE_SIZE = 3; // Number of items per page

const PhotoItem = ({ previewPhoto }: { previewPhoto: PhotoData }) => (
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
);
const mockData: Record<string, PhotoData> = {
    "places/ChIJj61dQgK6j4AR4GeTYWZsKWw/photos/AUy1YQ1dP0lRFtO4lOxJgBvShm7e1zR6jZz37uQkp2UaZQTcQyjxVxbxqSqeDQicc22_Hm8Rgxz1nm8iXb33voRglgQqcugDXHAVUHdJMXHtUmJRYNziNmb5CFbcsBapYj-uGMUzYLfPSYBlnaxAHW4sjBfbdkTFdwGEtQm_yeVWJgiTbIVbc9jjR8upcQtz65rjVwCBRi3edwFT2uMwCWO2ZDMWvkSQGim9j7FnOtxrTq6Q8FdbDoRmwxW7b7oN7hPdbjtivgEnGqSQ3pVtYi75mrzhN6dzC5SQTgQG7J-GQ6y4N5g7zhL--AUnfQS6aG9NUNavWFXDs7LhVd8PY4xFziDKIPl48o6Pmiqr4-_hsOC2R2aBIVNqMO918Pu3xFw5IrqNxhRdmi7QNOEOwBDo8NMOHKRz5F4F": {
        photoUri: "https://lh3.googleusercontent.com/place-photos/ADOriq0ljiLBtfFAK1dElBxuMVaegVmpTQy9Ru6LV-Vos44lz5_odtCMKwSBSlo2AsNeuPaUe8QcoFbvwYdJD9o9Ikq2v5RRJJ-XzrtsMnbIJsDv6aQmo70Qefd7LBsHxa4Q08tgAIGojA=s4800-w400-h400",
        widthPx: 4032,
        heightPx: 3024,
    },
    "places/ChIJj61dQgK6j4AR4GeTYWZsKWw/photos/AUy1YQ31KoiWZGB9jkDrCoBj975FAG7JBN5uaOObwuNieNJQekstCdhuZJYp-goVigy9sXwlRo600F3hRialqrWUvxRrzPNJxnEieWUYCF5zkdN_TprTZ39QTBtX7aLIuR5efKiP4BWvvgoRDpDKN918IFuFWMd2M8biodLIj3941CitHeQkM2_GorVXZwp8MAyJ8u0v8UpWfGQqvOQin8vqby9Gl7CHt5xSmj5YY-FGEiS2ug1gdSmD4qW6vljUh3hsjzmfbev7R1L3xwjvhjADYctGPJ6eoNbbCFWeRKsxVap48gybuMWuS3NQef1XrqmLF1FaeVGE1-uL2ztcwma-Jnbw3yiNvN5nkfHWi7Knky-FFucK4gbps0iZIXpCuBGBbenjphjj3UveRzD1_dak9o7fe4-9syLnuGNf": {
        photoUri:"https://en.wikipedia.org/wiki/Southern_Cross_(aircraft)#/media/File:StateLibQld_1_139254_Landing_the_aircraft,_Southern_Cross_in_Brisbane,_Queensland,_ca._1928.jpg",
        widthPx:800,
        heightPx:600,
    },
    "places/ChIJj61dQgK6j4AR4GeTYWZsKWw/photos/AUy1YQ31SviLuX0-RoDUtahRfaaaOG5TsEcOzSuNFGYV9j86WQXvlewbyhEiKaCAbLfGwumqUvqQWKzkieA53Sv8GgX8J5wKv9wCPnsaCJpNLlX6A23dpNnWVJ6Pjiyug8Pywsyr9OZ3vjvgNd2cXhMu97-9Xrw9f2Kf3hBxNXE296SqxXH8Rrevilhsi0stBf6HD7gTc2wcz1I111OOfGO11r-1Cl3GXQrhOvQcDBIus_NxlzsiZjJG_-2jw7GCoETenJSHFrlBO2KdtBCgI77WInaqxTeHH8gPNsUs1qdWd3PKTkBROTW5Kx1Y2oe07XeHc40k3wtlJfJ1ACIirGV8W_tqI7wo_zVjynWhddtr90i4fREuh2UVb7lm2p0k3qqQyxqN_0dBtNHnQhztgCOrlu9J0VNBp7l7": {
        photoUri:"https://en.wikipedia.org/wiki/Southern_Cross_(aircraft)#/media/File:People_gathered_around_the_southern_cross_%22VH-USU%22_(AM_87560-1).jpg",
        widthPx:1731,
        heightPx:1154,
    },
    "4": {
        photoUri:"https://en.wikipedia.org/wiki/Southern_Cross_(aircraft)#/media/File:Warner_Lyons_slnsw_P1-1041.jpg",
        widthPx:800,
        heightPx:600,
    },
    "5": {
        photoUri:"https://en.wikipedia.org/wiki/Southern_Cross_(aircraft)#/media/File:Southern_cross.jpg",
        widthPx:800,
        heightPx:600,
    }, 
    "6": {
        photoUri:"https://en.wikipedia.org/wiki/Southern_Cross_(aircraft)#/media/File:Southern_Cross_cockpit.jpg",
        widthPx:800,
        heightPx:600,
    },
    "7": {
        photoUri:"https://en.wikipedia.org/wiki/Southern_Cross_(aircraft)#/media/File:Scinside1.jpg",
        widthPx:800,
        heightPx:600,
    },
    "8": {
        photoUri:"https://en.wikipedia.org/wiki/Southern_Cross_(aircraft)#/media/File:Scoutside2.jpg",
        widthPx:800,
        heightPx:600,
    }, 
    "9": {
        photoUri:"https://en.wikipedia.org/wiki/Southern_Cross_(aircraft)#/media/File:Southern_Cross_in_Brisbane_(circa_1957).jpg",
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

    console.log("fetchData before: " + photosToDisplay);

    fetchData(); // Initial fetch


    console.log("fetchData After: " + photosToDisplay);
  }, []);

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

        while (counter < maxIndex)
        {
            const photo = await getPhotoDataMock(props.photos[counter].name)
            newData.push(photo);

            console.log(counter);
            console.log(props.photos[counter].name);
            console.log(photo.photoUri);

            counter++;
        }

        setIndex(counter);
        setPhotosToDisplay((prevData) => [...prevData, ...newData]);
        setPage((prevPage) => prevPage + 1);

        console.log(photosToDisplay);

        // Check if there is more data
        if (newData.length < PAGE_SIZE) {
            setHasMore(false);
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    } finally {
        setLoading(false);
    }

    console.log("hasMore: " + hasMore);
    console.log("loading: " + loading);
  };

  // Trigger pagination when reaching the end of the list
  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchData();
    }
  };

  return (
    <View>
      <View 
        style={{
          backgroundColor: 'white',
          borderRadius: '10px',
          marginTop: 5,
        }}>
            <FlatList
                data={photosToDisplay}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({item}) => <PhotoItem previewPhoto={item} />}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5} // Adjust this threshold to trigger loading earlier/later
                numColumns={1}
            />
      </View>
    </View>
  );
}