import React from "react";
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { MarkerIconMap } from './map/MarkerIconMap.tsx';

type FilterBarProps = {
    // pin: Pin;
    // capsule: Capsule;
};

export default function FilterBar(props: FilterBarProps) {
    const { width, height } = Dimensions.get("window");
    const isMobile = width < 768;

    const styles = StyleSheet.create({
        container: {
            paddingHorizontal: 8,
            paddingVertical: 12,
            flexDirection: 'row',
            gap: 12,
            backgroundColor: '#fafafa',
            flexShrink: 0
        },
        button: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: 'white',
            borderRadius: 999,
            paddingHorizontal: 16,
            paddingVertical: 8,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 3,
            elevation: 3,
        },
        label: {
            fontWeight: '600',
            color: '#000',
        },
    });

    function getMarker(label: string): string {
        if (label.includes('By Friend'))
        {
            return "👥";
        }
        if (label.includes("Shopping"))
        {
            // TODO: we should have this category include stores for pins returned not just big malls
            return MarkerIconMap["shopping_mall"];
        }
        else if (label.includes("Sightseeing"))
        {
            return MarkerIconMap["tourist_attraction"];
        }

        const lowerChar = label[0].toLowerCase();
        label = lowerChar + label.slice(1, label.length);

        // Majority of our labels are plural while our categories are not (e.g. 
        // Restaurants vs. restaurant). This conditional handles that
        if (label[label.length - 1] == 's')
        {
            label = label.slice(0, label.length-1);
        }

        return MarkerIconMap[label];    
    }

    const categories = [
        { label: 'By Friend'},
        { label: 'Restaurants'},
        { label: 'Hotels' },
        { label: 'Cafes' },
        { label: 'Museums' },
        { label: 'Bars' },
        { label: 'Sightseeing' },
        { label: 'Shopping'},
        { label: 'Parks' },
        { label: 'Landmarks' },
        { label: 'Things to do' },
        { label: 'Transit' },
    ];

    function onCategoryPress(category: string) {
        console.log(`${category} pressed!`)
    }

    return (
        <ScrollView horizontal contentContainerStyle={styles.container}>
            {categories.map(({ label }, index) => (
                <TouchableOpacity key={index} style={styles.button} onPress={() => onCategoryPress(label)}>
                    <Text style={{ marginRight: 6 }}>{getMarker(label)}</Text>
                    <Text style={styles.label}>{label}</Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
        
}
