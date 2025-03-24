import { BlurView } from "expo-blur";
import React, { useEffect, useState } from "react";
import { Dimensions, FlatList, StyleSheet, Text, View } from "react-native";
import { Pin } from "../app/(tabs)/map.tsx";
import { getSupabaseClient } from "../utils/supabase.ts";
import PlaceInfo from "./PlaceInfo.tsx";
import PlacePhotoFlatList from "./PlacePhotoFlatList.tsx";

type PlaceTabProps = {
  pin: Pin;
  capsule: Capsule;
};

export default function PlaceTab(props: PlaceTabProps) {
  const { width, height } = Dimensions.get("window");
  const isMobile = width < 768;

  const styles = StyleSheet.create({
    container: {
      flex: 1, // Ensures the View takes up full height
      padding: 10,
    },
    item: {
      opacity: 0.8,
      backgroundColor: "white",
      borderRadius: "10px",
      marginLeft: 5,
      marginVertical: 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 3, // For Android shadow,
      width: width * 0.25,
    },
    text: {
      fontSize: 14,
      marginLeft: 5,
      padding: 10,
      width: width * 0.25,
    },
    recommenderText: {
      fontSize: 14,
      fontStyle: "italic",
      marginLeft: 5,
      padding: 10,
    },
  });

  const [displayAllPhotos, setDisplayAllPhotos] = useState(false);
  const [recommenders, setRecommenders] = useState([]);

  useEffect(() => {
    if (!props.capsule || !props.pin) {
      return;
    }
    const fetchRecommenders = async () => {
      const supabase = getSupabaseClient();
      console.log("Fetching recommenders for pin ", props.pin.id, props.capsule.id);
      const { data, error } = await supabase.rpc("get_pin_recommenders", {
        _capsule_id: props.capsule.id,
        _pin_id: props.pin.id,
      });

      if (error) {
        console.error(error);
      } else {
        console.log("Recommenders:", data);
        setRecommenders(data);
      }
    };

    fetchRecommenders();
  }, [props.capsule, props.pin]); // Only run when capsule or pin changes

  type ItemProps = {
    note: string;
    name: string;
  };

  const Item = ({ note, name }: ItemProps) => (
    <View style={styles.item}>
      {/* <Text style={styles.text}>{note}</Text> */}
      <Text style={styles.recommenderText}>{name}</Text>
    </View>
  );

  return (
    // Play around with styling to not overlay on certain Maps components
    <BlurView
      intensity={20}
      style={{
        position: "absolute",
        right: 0,
        top: 0,
        width: width * 0.25,
        height: height,
        display: "flex",
        flexDirection: "row",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        borderRadius: "8px",
      }}
    >
      {displayAllPhotos ? (
        <PlacePhotoFlatList photos={props.pin.metadata.photos} setDisplayAllPhotos={setDisplayAllPhotos} />
      ) : (
        <View>
          <PlaceInfo pin={props.pin} setDisplayAllPhotos={setDisplayAllPhotos} />
          <FlatList
            data={recommenders}
            renderItem={({ item }) => <Item note={item.note} name={item.first_name} />}
            keyExtractor={(item, index) => index}
          />
        </View>
      )}
    </BlurView>
  );
}
