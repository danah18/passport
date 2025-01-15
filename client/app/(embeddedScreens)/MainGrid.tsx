import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useNavigation } from "expo-router";
import { Button, StyleSheet } from "react-native";

export default function AllCapsulesScreen({ navigation }: { navigation: any }) { 
    
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
          <ThemedText type="title">[Your Name's] Capsules</ThemedText>
      </ThemedView>
      
      {placeholderPlacesList.map((placeName, index) => (
          <Button 
            key={index} 
            title={placeName} 
            onPress={() => navigation.navigate('TripCapsuleScreen')}
          />
      ))}
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
});