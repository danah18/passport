import { StyleSheet, Image, Platform, View, Button, TextInput, ScrollView, Text } from "react-native";
import { Collapsible } from "@/components/Collapsible";
import { ExternalLink } from "@/components/ExternalLink";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useEffect, useState, createContext, useContext } from "react";
import { getSupabaseClient } from "../../utils/supabase.ts";
import { SupabaseClient } from "@supabase/supabase-js";
import { GooglePlace, GooglePlaceResponse } from "../../data/pins.tsx";
import TextBlockList from "../../components/TextBlockList.tsx";
import { motion } from "framer-motion";
import { useThemeColor } from "../../hooks/useThemeColor.ts";
import SplitScreen from "../../components/SplitScreen.tsx";
import MapScreen from "./map.tsx";
import React from "react";

// Create a context to store the capsule data
const CapsuleContext = createContext(null);

export const useCapsule = () => useContext(CapsuleContext);

export default function Portal() {
  const [inputValue, setInputValue] = useState("");
  const [cityInputValue, setCityInputValue] = useState("");
  const [supabase, setSupabase] = useState<SupabaseClient>();
  const backgroundColor = useThemeColor({}, "background");
  const [splitScreen, setSplitScreen] = useState(false);
  const [capsule, setCapsule] = useState(null);

  useEffect(() => {
    // TODO: add error handling for if supabase is null as code throughout this
    // file assumes non-null
    setSupabase(getSupabaseClient());

    // Fetch existing capsule data
    const fetchCapsule = async () => {
      const supabase = getSupabaseClient();
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.log("Error fetching user:", userError);
        return;
      }
      const profileId = userData?.user?.user_metadata?.profile_id;

      const { data, error } = await supabase.from("capsules").select("*").eq("profile_id", profileId);

      if (error) {
        console.log("Error fetching capsule:", error.message);
        return;
      }

      if (data.length > 0) {
        console.log(data[0]);
        setCapsule(data[0]);
        setSplitScreen(true);
      }
    };

    fetchCapsule();
  }, []);

  const addNewPins = async (textQuery: string) => {
    const queries: string[] = textQuery.split(/[\n,]+/);

    queries.forEach(async (query) => {
      await addNewPin(query + ` ${cityInputValue}`);
    });
  };

  const addNewPin = async (textQuery: string) => {
    try {
      console.log(textQuery);
      const supabase = getSupabaseClient(); // Figure out how to not do this on every call to this method

      const { data, error } = await supabase.functions.invoke("google-place-text-query", {
        body: { textQuery: textQuery },
      });

      if (error) {
        throw error;
      }

      const googlePlaceResponse = data as GooglePlaceResponse;

      // Need to account for multiple responses returned, for now we just assume first element is the result
      if (googlePlaceResponse.places == null || googlePlaceResponse.places.length == 0) {
        console.log(Error(`No results returned for textQuery: ${textQuery}`));
        return;
      }

      const googlePlace = googlePlaceResponse.places[0];

      const google_place_id = googlePlace.id;
      const location = `SRID=4326;POINT(${googlePlace.location.longitude} ${googlePlace.location.latitude})`;
      const pin_name = googlePlace.displayName.text;
      const metadata = {
        formattedAddress: googlePlace.formattedAddress,
        rating: googlePlace.rating,
        userRatingCount: googlePlace.userRatingCount,
        googleMapsUri: googlePlace.googleMapsUri,
        displayName: googlePlace.displayName.text,
        photos: googlePlace.photos,
      };

      await supabase.from("pins").insert([
        {
          google_place_id: google_place_id,
          location: location,
          pin_name: pin_name,
          metadata: metadata,
        },
      ]);
    } catch (error: any) {
      console.log("Error", error.message);
    }
  };

  const textBlockListWithMotion = (
    <View className="min-h-screen flex flex-col">
      <View className="container max-w-4xl mx-auto px-4 py-8 flex-grow">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
          <TextBlockList setSplitState={setSplitScreen} />
        </motion.div>
      </View>
    </View>
  );

  return (
    <CapsuleContext.Provider value={capsule}>
      <ScrollView style={{ flex: 1, backgroundColor: backgroundColor }}>
        {splitScreen ? (
          <SplitScreen
            LeftComponent={textBlockListWithMotion}
            RightComponent={<MapScreen />}
            setSplitState={setSplitScreen}
          />
        ) : (
          textBlockListWithMotion
        )}
      </ScrollView>
    </CapsuleContext.Provider>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
  container: {
    gap: 30,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    paddingHorizontal: 10,
    color: "white",
  },
});
