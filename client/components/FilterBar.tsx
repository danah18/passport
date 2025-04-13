import React from "react";
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { MarkerIconMap } from './map/MarkerIconMap.tsx';

type FilterBarProps = {
    selectedCategory: string;
    setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
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
        buttonSelected: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: 'white',
            borderRadius: 999,
            paddingHorizontal: 16,
            paddingVertical: 8,
            shadowColor: '#4285F4',
            shadowOffset: { width: 0, height: 1 },
            shadowRadius: 5,
            elevation: 3,
        },
        label: {
            fontWeight: '600',
            color: '#000',
        },
        labelSelected: {
            fontWeight: '600',
            color: '#1f6ff2',
        },
    });

    function categoryFromLabel(label: string): string {
        let categoryFromLabel = "";

        if (label.trim().includes("By Friend")) {
           return "by_friend";
        }
        if (label.includes("Shopping")) {
            return "shopping_mall";
        }
        else if (label.includes("Sightseeing")) {
            return "tourist_attraction";
        }
        else
        {
            const lowerChar = label[0].toLowerCase();
            label = lowerChar + label.slice(1, label.length);

            // Majority of our labels are plural while our categories are not (e.g. 
            // Restaurants vs. restaurant). This conditional handles that
            if (label[label.length - 1] == 's') {
                label = label.slice(0, label.length - 1);
            }
            categoryFromLabel = label;
        }

        return categoryFromLabel;
    }

    function isSelected(label: string): boolean {
        return props.selectedCategory === label;
    }

    function getMarker(label: string): string {
        const category = categoryFromLabel(label);

        console.log("label:", label);
        console.log(`category:`, category);

        return MarkerIconMap[category];    
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

    // The setSelectedCategory prop is undefined if you navigate to the map screen directly
    // Need to fix callback picking
    function onCategoryPress(category: string) {
      props.setSelectedCategory(category);
      console.log(props.setSelectedCategory);
      console.log(`${category} pressed!`)
    }

    return (
        <ScrollView horizontal contentContainerStyle={styles.container}>
            {categories.map(({ label }, index) => (
                <TouchableOpacity key={index} style={isSelected(label) ? styles.buttonSelected : styles.button} onPress={() => onCategoryPress(label)}>
                    <Text style={{ marginRight: 6 }}>{getMarker(label)}</Text>
                    <Text style={isSelected(label) ? styles.labelSelected : styles.label}>{label}</Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
        
}
