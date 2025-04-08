import React from "react";
import { Dimensions, Linking, Text, TouchableOpacity, View } from "react-native";
import { StarRatingDisplay } from "react-native-star-rating-widget";
import { Pin } from "../app/(tabs)/map.tsx";
import PlacePhoto from "./PlacePhoto.tsx";
// https://github.com/bviebahn/react-native-star-rating-widget/tree/028b43da27ea70a792b208a2d518f7c14d66338d

type PlaceInfoProps = {
  pin: Pin;
  setDisplayAllPhotos: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function PlaceInfo(props: PlaceInfoProps) {
  const { width, height } = Dimensions.get("window");
  const isMobile = width < 768;

  const placeData = props.pin.metadata;
  console.log(props.pin);

  const openGoogleMapsDirections = () => {
    const encodedAddress = encodeURIComponent(placeData.formattedAddress);
    const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination_place_id=${props.pin.google_place_id}&destination=${encodedAddress}`;
    Linking.openURL(directionsUrl);
  };

  return (
    <View>
      <PlacePhoto photos={placeData.photos} setDisplayAllPhotos={props.setDisplayAllPhotos} />
      <View
        style={{
          opacity: 0.8,
          backgroundColor: "white",
          borderRadius: "10px",
          marginTop: 5,
          marginBottom: 2,
          width: width * 0.25,
          marginLeft: 5,
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: "bold",
            marginLeft: 5,
            marginTop: 10,
            marginBottom: 5,
          }}
        >
          {placeData.displayName}
        </Text>
        {placeData.rating && (
          <Text
            style={{
              marginLeft: 5,
              marginBottom: 5,
            }}
          >
            {`${placeData.rating}`}
            <StarRatingDisplay rating={placeData.rating} starSize={20} style={{}} />
            {`(${placeData.userRatingCount})`}
          </Text>
        )}
        <Text
          style={{
            marginLeft: 5,
            marginBottom: 5,
          }}
        >
          {placeData.formattedAddress}
        </Text>
        <TouchableOpacity
          onPress={() => Linking.openURL(placeData.googleMapsUri)}
          style={{
            backgroundColor: "#2196F3", // Button color
            padding: 10, // Padding for the button
            borderRadius: 5, // Rounded corners
            alignItems: "center", // Center the text
            width: "80%",
            marginTop: 5,
            marginLeft: 5,
            marginBottom: 10,
            borderColor: "#2196F3",
          }}
        >
          <Text style={{ color: "white" }}>VIEW IN GOOGLE MAPS</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={openGoogleMapsDirections}
          style={{
            backgroundColor: "#4CAF50", // Button color
            padding: 10, // Padding for the button
            borderRadius: 5, // Rounded corners
            alignItems: "center", // Center the text
            width: "80%",
            marginTop: 5,
            marginLeft: 5,
            marginBottom: 10,
            borderColor: "#4CAF50",
          }}
        >
          <Text style={{ color: "white" }}>GET DIRECTIONS</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
