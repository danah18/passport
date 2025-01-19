import { View, TextInput, StyleSheet, Button, Text, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';

export default function TripCapsule() {
    const { placeName } = useLocalSearchParams();
    const [isEditing, setIsEditing] = useState(false);
    const [capsuleSummary, setCapsuleSummary] = useState('');

    const handleSave = () => {
        setIsEditing(false);

        // Add logic to save the text to the DB with a post
    };

    const capsuleSummaryIsEmpty = () => {
        return capsuleSummary == '';
    }

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
        {isEditing ? (
            <>
                <div style={{display: 'flex', fontSize: 20, justifyContent:'end'}}>
                    <TouchableOpacity
                        style={{marginRight: 10}}
                        onPress={handleSave}
                    >
                        <Text style={{
                            fontSize: 25,
                            paddingVertical: 12,
                            marginVertical: 5}}
                        >   
                            ✔️
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={() => setIsEditing(!isEditing)}
                    >
                        <Text style={{color:"#FFFFFF"}}>cancel</Text>    
                    </TouchableOpacity>
                </div>

                <TextInput
                    value={capsuleSummary}
                    onChangeText={setCapsuleSummary}
                    editable={isEditing}
                    placeholder="Add important notes to your capsule summary here, like 'Don't forget to apply for visa online at least 3 weeks before & make sure to do the sunset sail!'"
                    placeholderTextColor="#AAAAAA"
                    style={styles.editableTextContainer}
                />
            </>) : (
            <div style={{capsuleSummaryIsEmpty} ? styles.pencilButtonNoCapsuleSummary : styles.pencilButton}>
                <TouchableOpacity
                    style={{marginRight: 10}}
                    onPress={() => setIsEditing(!isEditing)}
                >
                    <Text style={{fontSize: 20}}>✏️</Text>
                </TouchableOpacity>
            </div>)}

        </View>
    )
}

const styles = StyleSheet.create({
    cancelButton: {
        marginRight: 10,
        backgroundColor: "#68bef7",
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginVertical: 5,
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: 20,
    },
    pencilButtonNoCapsuleSummary: {
        display: 'flex', 
        justifyContent:'center', 
        marginTop: 15
    },
    pencilButton: {
        display: 'flex', 
        justifyContent:'flex-end', 
        marginTop: 15
    },
    editableTextContainer: {
        display: 'flex', 
        alignItems: 'center',
        alignSelf: 'center',
        color:'#FFFFFF', 
        marginLeft: 10, 
        marginRight: 10, 
        borderRadius: 20,
        borderColor: 'gray', 
        borderWidth: 1, 
        marginBottom: 10, 
        padding: 10, 
        width: '80%'
    }
})