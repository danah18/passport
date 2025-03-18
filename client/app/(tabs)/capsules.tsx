import { AirplaneAnimation } from "@/components/AirplaneAnimation";
import ParallaxScrollViewNoHeader from "@/components/ParallaxScrollViewNoHeader";
import { ThemedView } from "@/components/ThemedView";
import { router, useNavigation } from "expo-router";
import { User } from '@supabase/supabase-js';
import { Button, Text, StyleSheet, Dimensions, TouchableOpacity, FlatList, View } from "react-native";
import { getSupabaseClient } from "../../utils/supabase.ts";
import { useCallback, useEffect, useState } from "react";
import TextBlockComponent from "../../components/TextBlockComponent.tsx";
import TextBlockList from "../../components/TextBlockList.tsx";

const { width, height } = Dimensions.get('window');
const isMobile = width < 768;

export default function Capsules() { 
    const [user, setUser] = useState<User | null>(null);
    const numColumns = 2;

    // This will be replaced with a /GET that returns the user's capsule list + capsules_shared list
    // Mix of country-level with city/island level should be fine but no continents
    const placeholderPlacesList = [];//["bali", "lombok", "nusa penida", "spain", "tangier"];

    useEffect(() => {
        const supabase = getSupabaseClient();

        const fetchUser = async () => {
            const { data, error } = await supabase.auth.getUser();
            if (error) {
              console.log('Error fetching user:', error);
              return;   
            }
            setUser(data?.user || null);
        };
      
        fetchUser();
    }, []);
   

    return (
      <ParallaxScrollViewNoHeader>
      <ThemedView style={styles.titleContainer}>
          <Text style={styles.headerText}>Welcome, {user?.user_metadata.first_name}!</Text>
     </ThemedView>

     <ThemedView style={styles.titleContainer}>
          <AirplaneAnimation/>
     </ThemedView>

      {isMobile ? (     
        <>
            <TouchableOpacity
                style={styles.startButtonContainer}
                onPress={() => router.replace('./portal')}
            >
                <Text style={styles.buttonText}>Start</Text>
            </TouchableOpacity>
            {placeholderPlacesList.map((placeName, index) => (
                <TouchableOpacity 
                    style={styles.mobileContainer}
                    key={index} 
                    onPress={() => router.push({
                    pathname: '/tripCapsule',
                    params: { placeName: placeName },
                    })}
                >
                    <Text style={styles.buttonText}>{placeName}</Text>
                </TouchableOpacity>
            ))}
        </>
        ) : (
            <View styles={styles.container}>
                <TouchableOpacity
                    style={styles.startButtonContainer}
                    onPress={() => router.replace('./portal')}
                >
                    <Text style={styles.buttonText}>Start</Text>
                </TouchableOpacity>

                <FlatList
                    data={placeholderPlacesList}
                    renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.desktopContainerGridItem}
                        onPress={() => router.push({
                          pathname: '/tripCapsule',
                          params: { placeName: item },
                        })
                    }>
                        <Text style={styles.buttonText}>{item}</Text>
                    </TouchableOpacity>
                )}
                keyExtractor={(item, index) => index.toString()}
                numColumns={numColumns}
                columnWrapperStyle={styles.row}
                />
            </View>
        )}
      </ParallaxScrollViewNoHeader>
    );
}

const styles = StyleSheet.create({
    headerImage: {
        color: '#808080',
        bottom: -90,
        left: -35,
        position: 'absolute',
    },
    titleContainer: {
        alignItems: 'center',
        alignSelf: 'center',
        flexDirection: 'row',
        gap: 8,
    },
    headerText: {
        //fontFamily: 'StudioPlace', 
        //fontSize: 35, 
        paddingTop: 30,
        fontSize: 25, 
        color: "#FFFFFF",
    },
    mobileContainer: {
        backgroundColor: "#68bef7",
        paddingVertical: 12,
        paddingHorizontal: 20,
        marginVertical: 5,
        width:'80%',
        alignItems: 'center',
        alignSelf: 'center', // Center the button horizontally
        borderRadius: 5, // Optional: Add rounded corners
    },
    startButtonContainer: {
        backgroundColor: "#68bef7",
        flexDirection: 'row',
        paddingVertical: 10,
        paddingHorizontal: 20,
        width: 200,
        margin: 10,
        justifyContent: 'center',
        alignSelf: 'center',
        borderRadius: 5, 
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    desktopContainerGridItem: {
        backgroundColor: "#68bef7",
        flex: 1,
        paddingVertical: 10,
        paddingHorizontal: 20,
        margin: 10,
        height: 100, // Adjust height as needed
        justifyContent: 'center',
        alignItems: 'center',
        minWidth: 0, // Ensure items shrink to fit
        borderRadius: 5, // Optional: Add rounded corners
    },
    row: {
        justifyContent: 'space-between',
    },
});