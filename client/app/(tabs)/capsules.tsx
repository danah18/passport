import { AirplaneAnimation } from "@/components/AirplaneAnimation";
import ParallaxScrollViewNoHeader from "@/components/ParallaxScrollViewNoHeader";
import { ThemedView } from "@/components/ThemedView";
import { router, useNavigation } from "expo-router";
import { Button, Text, StyleSheet, Dimensions, TouchableOpacity, FlatList } from "react-native";

const { width, height } = Dimensions.get('window');
const isMobile = width < 768;

export default function Capsules() { 
    const numColumns = 2;

    // This will be replaced with a /GET that returns the places list
    // I think it's fine if there's a mix of country-level with city/island level but tbd
    const placeholderPlacesList = ["bali", "lombok", "nusa penida", "spain", "tangier"];

    return (
      <ParallaxScrollViewNoHeader>
      <ThemedView style={styles.titleContainer}>
          <Text style={styles.headerText}>name's capsules</Text>
     </ThemedView>

     <ThemedView style={styles.titleContainer}>
          <AirplaneAnimation/>
     </ThemedView>

      {isMobile ? ( placeholderPlacesList.map((placeName, index) => (
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
        ))) : (
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
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
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