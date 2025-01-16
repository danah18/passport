import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useNavigation } from "expo-router";
import { Button, Text, StyleSheet, Dimensions, TouchableOpacity, FlatList } from "react-native";

const { width, height } = Dimensions.get('window');
const isMobile = width < 768;

export default function AllCapsulesScreen({ navigation }: { navigation: any }) { 
    const numColumns = 2;

    // This will be replaced with a /GET that returns the places list
    // I think it's fine if there's a mix of country-level with city/island level but tbd
    const placeholderPlacesList = ["bali", "lombok", "nusa penida", "spain", "tangier"];

    return (
         // Replace header with an animated component - could be nice to have gradient background like Partiful
      <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
          <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
          />
      }>
      <ThemedView style={styles.titleContainer}>
          <Text style={{ fontFamily: 'StudioPlace', fontSize: 35, color: "#FFFFFF" }}>[Your Name's] Capsules</Text>
      </ThemedView>

      {isMobile ? ( placeholderPlacesList.map((placeName, index) => (
            <TouchableOpacity 
                style={styles.mobileContainer}
                key={index} 
                onPress={() => navigation.navigate('TripCapsuleScreen')}
            >
                <Text style={styles.buttonText}>{placeName}</Text>
            </TouchableOpacity>
        ))) : (
            <FlatList
                data={placeholderPlacesList}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.desktopContainerGridItem}
                        onPress={() => navigation.navigate('TripCapsuleScreen')}
                        >
                            <Text style={styles.buttonText}>{item}</Text>
                    </TouchableOpacity>
                )}
                keyExtractor={(item, index) => index.toString()}
                numColumns={numColumns}
                columnWrapperStyle={styles.row}
            />
        )}
      </ParallaxScrollView>
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
        flexDirection: 'row',
        gap: 8,
    },
    headerText: {
        fontFamily: 'StudioPlace', 
        fontSize: 35, 
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