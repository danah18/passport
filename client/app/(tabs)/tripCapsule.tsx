import { View, TextInput, Button, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';

export default function TripCapsule({ route }: { route: { params: { placeName: string } } }) {
    // const { placeName } = route.params;
    // ^^^ this works on web but not on mobile web

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

