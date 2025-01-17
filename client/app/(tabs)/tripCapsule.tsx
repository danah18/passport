import { View, TextInput, Button, Text, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';

export default function TripCapsule() {
    const { placeName } = useLocalSearchParams();

    // TODO: add back button and header with place title

    const [text, setText] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleSave = () => {
        setIsEditing(false);
        // Add logic to save the text if needed
    };

    return (
        <View>
        <TouchableOpacity
            onPress={() => router.push({
                pathname: '/(tabs)'
            })
        }>
            <Text style={{fontSize: 30}}>👈</Text>
        </TouchableOpacity>
        <Text style={{fontSize: 30, color:"#FFFFFF"}}>{`${placeName} trip capsule`}</Text>
        <TextInput
            value={text}
            onChangeText={setText}
            editable={isEditing}
            placeholder="Enter text here"
            style={{ borderColor: 'gray', borderWidth: 1, marginBottom: 10, padding: 5 }}
        />
        <Button
            title={isEditing ? "Save" : "Edit"}
            onPress={isEditing ? handleSave : handleEdit}
        />
        </View>
    )
}

