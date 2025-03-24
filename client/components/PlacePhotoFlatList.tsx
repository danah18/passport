// one display photo
// clicking more leads into a flatlist of the photos themselves

import React, { useEffect, useState } from "react";
import { Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getSupabaseClient } from "../utils/supabase.ts";
import { PhotoData, PlacePhotoProps } from "./PlacePhoto.tsx";

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
  const { width, height } = Dimensions.get("window");
  const [photosToDisplay, setPhotosToDisplay] = useState<PhotoData[]>([]);

  useEffect(() => {
    const supabase = getSupabaseClient();

    const fetchAllPhotos = async () => {
      const fetchPromises = props.photos.map(async (photoReference) => {
        const { data, error } = await supabase.functions.invoke(
          `google-place-photos?photoResource=${photoReference.name}`,
          { method: "GET" }
        );
        // Handle errors as needed
        return data;
      });
      const newPhotos = await Promise.all(fetchPromises);
      setPhotosToDisplay(newPhotos);
    };

    // Only refetch if props.photos changes
    fetchAllPhotos();
  }, [props.photos]);

  useEffect(() => {
    console.log(photosToDisplay);
  }, [photosToDisplay]);

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        onPress={() => props.setDisplayAllPhotos(false)}
        style={{
          marginBottom: 5,
        }}
      >
        <Text style={{ fontWeight: "bold" }}>{`<`}</Text>
      </TouchableOpacity>
      <FlatList
        data={photosToDisplay}
        keyExtractor={(item, index) => index}
        renderItem={({ item }) => {
          // console.log("Rendering photo item:", item); // Log the item being rendered
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3, // For Android shadow,
    width: ITEM_WIDTH,
  },
  text: {
    fontSize: 16,
  },
});
