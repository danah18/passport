import { View, TextInput, StyleSheet, Button, Text, TouchableOpacity, Dimensions } from 'react-native';
import React, { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';

const { width, height } = Dimensions.get('window');
const isMobile = width < 768;
const placeholderText = "Add important notes to your capsule summary here, like " + 
    "'Don't forget to apply for visa online at least 3 weeks before & make sure to do the sunset sail!'";

export default function TripCapsule() {
    const { placeName } = useLocalSearchParams();
    const [isEditing, setIsEditing] = useState(false);
    const [capsuleSummary, setCapsuleSummary] = useState('');

    const handleSave = () => {
        setIsEditing(false);

        // Add logic to save the text to the DB with a post
    };

    return (
        <View>
        <div style={{ display: 'flex', margin: 10}}>
            <TouchableOpacity
                style={{marginRight: 10}}
                onPress={() => router.push({
                    pathname: '/(tabs)'
                })
            }>
                <Text style={{fontSize: 30}}>👈</Text>
            </TouchableOpacity>
            <Text style={{fontSize: 30, color:"#FFFFFF"}}>{`${placeName} trip capsule`}</Text>
        </div>

        {/* swap to a dark mode // light mode style for font marginRight:10*/}
        
        <TextInput
            value={capsuleSummary}
            onChangeText={setCapsuleSummary}
            editable={isEditing}
            placeholder={placeholderText}
            placeholderTextColor="#AAAAAA"
            multiline={true}
            onFocus={() => setIsEditing(true)} // Set editing to true on focus
            onBlur={() => setIsEditing(false)} // Set editing to false on blur
            style={isMobile ? styles.editableTextContainerMobile : styles.editableTextContainerDesktop}
        />

        {isEditing ? (
            <>
                <div style={styles.saveButtonContainer}>
                    <TouchableOpacity
                        style={{marginRight: 10}}
                        onPress={handleSave}
                    >
                        <Text style={{fontSize: 25}}>   
                            ✔️
                        </Text>
                    </TouchableOpacity>
                </div>
            </>) : (
                <div style={styles.pencilButton}>
                 <TouchableOpacity
                     style={{marginRight: 10}}
                     onPress={() => setIsEditing(!isEditing)}
                 >
                     <Text style={{fontSize: 20}}>✏️</Text>
                 </TouchableOpacity>
                </div>
            )}
        </View>
    )
}

const inheritedStyles = StyleSheet.create({
    editableTextContainer: {
        display: 'flex', 
        alignItems: 'center',
        alignSelf: 'center',
        color:'#FFFFFF', 
        marginLeft: 10, 
        marginRight: 10, 
        marginTop: 15,
        borderRadius: 20,
        borderColor: 'gray', 
        borderWidth: 1,
        marginBottom: 10, 
        padding: 10, 
        width: '80%'
    }});

const styles = StyleSheet.create({
    editableTextContainerMobile: {
        ...StyleSheet.flatten(inheritedStyles.editableTextContainer),
        height: 100
    },
    editableTextContainerDesktop: {
        ...StyleSheet.flatten(inheritedStyles.editableTextContainer),
        height: 40
    },
    pencilButton: {
        display: 'flex', 
        justifyContent:'center', 
    },
    saveButtonContainer: {
        display: 'flex',
        alignItems: 'center',
        alignSelf: 'center'
    }
})